import React, { createContext, useContext, useState, useEffect, useRef, useCallback } from 'react';
import { toast } from 'react-toastify';

const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

export const NotificationProvider = ({ children }) => {
  // Core state
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  
  // Refs for stable references
  const eventSourceRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const isConnectingRef = useRef(false);
  const lastToastTimeRef = useRef(0);
  
  const maxReconnectAttempts = 5;
  const baseReconnectDelay = 2000;
  const toastCooldown = 5000; // Prevent toast spam

  // Get customer ID from localStorage/session
  useEffect(() => {
    const getCustomerId = () => {
      try {
        const sources = [
          localStorage.getItem('customerId'),
          sessionStorage.getItem('customerId'), 
          localStorage.getItem('customer_id'),
          sessionStorage.getItem('customer_id'),
          localStorage.getItem('user_id'),
          sessionStorage.getItem('user_id')
        ];
        
        console.log('🔍 Checking for customer ID in storage:', {
          localStorage_customerId: localStorage.getItem('customerId'),
          sessionStorage_customerId: sessionStorage.getItem('customerId'),
          localStorage_customer_id: localStorage.getItem('customer_id'),
          sessionStorage_customer_id: sessionStorage.getItem('customer_id'),
          localStorage_user_id: localStorage.getItem('user_id'),
          sessionStorage_user_id: sessionStorage.getItem('user_id')
        });

        for (const source of sources) {
          if (source && source !== 'null' && source !== 'undefined') {
            const id = parseInt(source);
            if (!isNaN(id) && id > 0) {
              console.log('✅ Found customer ID:', id, 'from source:', source);
              setCustomerId(id);
              return id;
            }
          }
        }
        
        // Fallback to a test ID for development
        const testId = 4; // Use existing customer ID
        console.log('⚠️ No customer ID found in storage, using test ID:', testId);
        setCustomerId(testId);
        return testId;
      } catch (error) {
        console.error('❌ Error getting customer ID:', error);
        return null;
      }
    };

    getCustomerId();
  }, []);

  // Fetch unread count from API with improved error handling
  const checkForNewNotifications = useCallback(async () => {
    if (!customerId) {
      console.warn('❌ Cannot check notifications: No customer ID');
      return;
    }
    
    try {
      // Try to get customerNumber from sessionStorage first
      const customerNumber = sessionStorage.getItem('customerNumber') || 
                            localStorage.getItem('customerNumber');
      
      let url;
      let response;
      
      // First try: Use customerNumber endpoint if available
      if (customerNumber) {
        url = `http://localhost:8000/api/notifications/${customerNumber}/unread-count`;
        console.log('🔍 Trying customerNumber endpoint:', url);
        
        try {
          response = await fetch(url);
          if (response.ok) {
            console.log('✅ CustomerNumber endpoint succeeded');
          } else {
            throw new Error(`CustomerNumber endpoint failed: ${response.status}`);
          }
        } catch (error) {
          console.warn('⚠️ CustomerNumber endpoint failed, trying customerId fallback:', error.message);
          response = null;
        }
      }
      
      // Second try: Use customer ID endpoint if customerNumber failed or not available
      if (!response || !response.ok) {
        url = `http://localhost:8000/api/notifications/customer/${customerId}/unread-count`;
        console.log('🔍 Trying customerId endpoint:', url);
        
        response = await fetch(url);
        if (!response.ok) {
          if (response.status === 404) {
            console.warn(`⚠️ Customer ${customerId} not found. This may be a test/invalid customer ID. Skipping notification check.`);
            return; // Don't show errors for non-existent customers
          }
          throw new Error(`Customer ID endpoint failed: ${response.status} ${response.statusText}`);
        }
      }
      
      console.log('📊 API Response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📥 API Response data:', data);
        
        if (data.status === 'success' && typeof data.data.unreadCount === 'number') {
          const count = data.data.unreadCount;
          console.log('✅ Setting unread count to:', count);
          setUnreadCount(count);
          
          if (count > 0) {
            toast.info(`You have ${count} unread notifications!`, {
              position: "top-right",
              autoClose: 3000,
            });
          }
        } else {
          console.warn('⚠️ Unexpected API response format:', data);
        }
      }
    } catch (error) {
      console.error('❌ Error checking for new notifications:', error);
    }
  }, [customerId]);

  // SSE Connection with improved error handling
  const connectSSE = useCallback(() => {
    if (!customerId) {
      console.error('❌ Cannot connect SSE: No customer ID');
      return;
    }
    
    if (isConnectingRef.current) {
      console.log('⏳ SSE connection already in progress');
      return;
    }
    
    if (eventSourceRef.current && eventSourceRef.current.readyState === EventSource.OPEN) {
      console.log('✅ SSE already connected');
      return;
    }

    isConnectingRef.current = true;
    console.log(`🔌 Connecting to SSE for customer: ${customerId}`);

    try {
      // Get customerNumber from sessionStorage first
      const customerNumber = sessionStorage.getItem('customerNumber') || 
                            localStorage.getItem('customerNumber');
      
      let sseUrl;
      
      // First attempt: use customerNumber if available
      if (customerNumber) {
        sseUrl = `${import.meta.env.VITE_API_BASE_URL}/sse/notifications/${customerNumber}`;
        console.log('🌐 SSE URL (customerNumber):', sseUrl);
      } else {
        // Fallback: use customerId
        sseUrl = `${import.meta.env.VITE_API_BASE_URL}/sse/customer/${customerId}/notifications`;
        console.log('🌐 SSE URL (customerId):', sseUrl);
      }
      
      const eventSource = new EventSource(sseUrl, { withCredentials: false, headers: { 'x-api-key': import.meta.env.VITE_API_SECURITY_KEY } });
      eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log('📡 SSE Connection opened successfully');
        setIsConnected(true);
        isConnectingRef.current = false;
        reconnectAttemptsRef.current = 0;
        
        // Show success toast with cooldown
        const now = Date.now();
        if (now - lastToastTimeRef.current > toastCooldown) {
          toast.success('📡 Connected to real-time notifications!', {
            position: "top-right",
            autoClose: 2000,
          });
          lastToastTimeRef.current = now;
        }
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📨 SSE Message received:', data);

          switch (data.type) {
            case 'connected':
              console.log('🎉 SSE Connected successfully');
              break;
              
            case 'notification':
              console.log('🔔 New notification received:', data.data);
              setNotifications(prev => [data.data, ...prev]);
              setUnreadCount(prev => prev + 1);
              
              // Show notification toast
              toast.info(`🔔 ${data.data.title || 'New notification'}`, {
                position: "top-right",
                autoClose: 5000,
              });
              break;
              
            case 'count_update':
              console.log('📊 Notification count update:', data.unreadCount);
              setUnreadCount(data.unreadCount);
              break;
              
            case 'heartbeat':
              console.log('💓 SSE Heartbeat received');
              break;
              
            default:
              console.log('📦 Unknown SSE message type:', data.type);
          }
        } catch (error) {
          console.error('❌ Error parsing SSE message:', error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('❌ SSE Connection error:', error);
        setIsConnected(false);
        isConnectingRef.current = false;

        if (eventSource.readyState === EventSource.CLOSED) {
          console.log('🔄 SSE Connection closed, attempting reconnect...');
          handleReconnect();
        }
      };

    } catch (error) {
      console.error('❌ Failed to establish SSE connection:', error);
      isConnectingRef.current = false;
    }
  }, [customerId]);

  // Handle reconnection logic
  const handleReconnect = useCallback(() => {
    if (reconnectAttemptsRef.current >= maxReconnectAttempts) {
      console.error('❌ Max reconnection attempts reached');
      
      toast.error('Failed to maintain real-time connection. Please refresh the page.', {
        position: "top-right",
        autoClose: 5000,
      });
      return;
    }

    const delay = baseReconnectDelay * Math.pow(2, reconnectAttemptsRef.current);
    reconnectAttemptsRef.current++;
    
    console.log(`🔄 Reconnecting in ${delay}ms (attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);
    
    reconnectTimeoutRef.current = setTimeout(() => {
      connectSSE();
    }, delay);
  }, [connectSSE]);

  // Disconnect SSE
  const disconnect = useCallback(() => {
    console.log('🔌 Disconnecting SSE...');
    
    // Clear reconnection timeout
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
    
    // Close connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }
    
    setIsConnected(false);
    isConnectingRef.current = false;
    reconnectAttemptsRef.current = 0;
  }, []);

  // Mark all notifications as read
  const markNotificationsAsRead = useCallback(async () => {
    if (!customerId) return;
    
    try {
      // Try to get customerNumber from sessionStorage first
      const customerNumber = sessionStorage.getItem('customerNumber') || 
                            localStorage.getItem('customerNumber');
      
      let url;
      if (customerNumber) {
        url = `http://localhost:8000/api/notifications/${customerNumber}/read-all`;
      } else {
        url = `http://localhost:8000/api/notifications/customer/${customerId}/read-all`;
      }
      
      // Mark as read in backend
      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('✅ Notifications marked as read:', data);
        
        // Update local state
        setUnreadCount(0);
        setNotifications(prev => prev.map(notif => ({ ...notif, is_read: true })));
        
        toast.success('All notifications marked as read!', {
          position: "top-right",
          autoClose: 2000,
        });
      } else {
        console.error('❌ Failed to mark notifications as read:', response.status);
      }
    } catch (error) {
      console.error('❌ Error marking notifications as read:', error);
    }
  }, [customerId]);

  // Start SSE connection when customer ID is available
  useEffect(() => {
    if (customerId) {
      connectSSE();
      checkForNewNotifications();
      
      // Set up periodic notification check as fallback
      const interval = setInterval(checkForNewNotifications, 30000); // Every 30 seconds
      
      return () => {
        clearInterval(interval);
        disconnect();
      };
    }
  }, [customerId, connectSSE, checkForNewNotifications, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      disconnect();
    };
  }, [disconnect]);

  const value = {
    unreadCount,
    notifications,
    isConnected,
    customerId,
    checkForNewNotifications,
    markNotificationsAsRead,
    disconnect,
    reconnect: connectSSE
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;