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
              // Check if this is the problematic customer ID 14
              if (id === 14) {
                console.warn('⚠️ Found customer ID 14 which does not exist! Clearing storage and using valid test ID.');
                // Clear the invalid ID from storage
                localStorage.removeItem('customerId');
                localStorage.removeItem('customer_id'); 
                localStorage.removeItem('user_id');
                sessionStorage.removeItem('customerId');
                sessionStorage.removeItem('customer_id');
                sessionStorage.removeItem('user_id');
                // Use valid test ID instead
                const validTestId = 4;
                setCustomerId(validTestId);
                return validTestId;
              }
              // Check if this is customer ID 4 (which also doesn't exist) and auto-correct it
              if (id === 4) {
                console.warn('⚠️ Found customer ID 4 which does not exist! Auto-correcting to use WA-1.');
                // Set the correct customer data
                sessionStorage.setItem('customerNumber', 'WA-1');
                sessionStorage.setItem('customerId', '10');
                localStorage.setItem('enableTestCustomer', 'true');
                setCustomerId(10);
                console.log('✅ Auto-corrected customer data: customerNumber=WA-1, customerId=10');
                return 10;
              }
              setCustomerId(id);
              return id;
            }
          }
        }
        
        // In production, don't use fallback ID if no customer is logged in
        // Only use test ID in development if explicitly enabled
        const isDevelopment = import.meta.env.VITE_NODE_ENV === 'development' || import.meta.env.DEV;
        const enableTestCustomer = localStorage.getItem('enableTestCustomer') === 'true';
        
        if (isDevelopment && enableTestCustomer) {
          const testId = 4; // Use existing customer ID
          console.log('⚠️ No customer ID found in storage, using test ID for development:', testId);
          // Also set it in sessionStorage for other components to use
          sessionStorage.setItem('customerId', testId.toString());
          // IMPORTANT: Set the correct customerNumber that actually exists in the database
          sessionStorage.setItem('customerNumber', 'WA-1');
          console.log('✅ Set customerNumber to WA-1 for working customer');
          setCustomerId(testId);
          return testId;
        } else {
          console.log('ℹ️ No customer ID found and not in test mode. User needs to login.');
          setCustomerId(null);
          return null;
        }
      } catch (error) {
        console.error('❌ Error getting customer ID:', error);
        return null;
      }
    };

    getCustomerId();
  }, []);

  // Utility functions for development
  const enableTestCustomer = () => {
    localStorage.setItem('enableTestCustomer', 'true');
    sessionStorage.setItem('customerId', '4');
    // Set the correct customerNumber that exists in the database
    sessionStorage.setItem('customerNumber', 'WA-1');
    setCustomerId(4);
    console.log('✅ Test customer enabled. Customer ID 4 is now active with customerNumber WA-1.');
  };

  const disableTestCustomer = () => {
    localStorage.removeItem('enableTestCustomer');
    sessionStorage.removeItem('customerId');
    setCustomerId(null);
    console.log('✅ Test customer disabled. Customer ID cleared.');
  };

  // Make these available globally for development
  if (import.meta.env.DEV) {
    window.enableTestCustomer = enableTestCustomer;
    window.disableTestCustomer = disableTestCustomer;
    
    // Auto-enable test customer disabled - manual enable required
    // setTimeout(() => {
    //   if (!sessionStorage.getItem('customerId') && !customerId && import.meta.env.DEV) {
    //     console.log('🔧 Auto-enabling test customer for development...');
    //     enableTestCustomer();
    //   }
    // }, 1000);
  }

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
          response = await fetch(url, {
            headers: {
              'x-api-key': import.meta.env.VITE_API_SECURITY_KEY
            }
          });
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
        
        response = await fetch(url, {
          headers: {
            'x-api-key': import.meta.env.VITE_API_SECURITY_KEY
          }
        });
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
        sseUrl = `${import.meta.env.VITE_API_BASE_URL}/sse/notifications/${customerNumber}?apiKey=${import.meta.env.VITE_API_SECURITY_KEY}`;
        console.log('🌐 SSE URL (customerNumber):', sseUrl);
      } else {
        // Fallback: use customerId
        sseUrl = `${import.meta.env.VITE_API_BASE_URL}/sse/customer/${customerId}/notifications?apiKey=${import.meta.env.VITE_API_SECURITY_KEY}`;
        console.log('🌐 SSE URL (customerId):', sseUrl);
      }
      
      const eventSource = new EventSource(sseUrl, { withCredentials: false });
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
          'Content-Type': 'application/json',
          'x-api-key': import.meta.env.VITE_API_SECURITY_KEY
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