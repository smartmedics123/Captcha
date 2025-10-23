import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
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
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [isConnected, setIsConnected] = useState(false);
  const [customerId, setCustomerId] = useState(null);
  
  // Refs for stable references
  const eventSourceRef = useRef(null);
  const reconnectTimeoutRef = useRef(null);
  const reconnectAttemptsRef = useRef(0);
  const isConnectingRef = useRef(false);
  
  const maxReconnectAttempts = 5;
  const baseReconnectDelay = 2000; // 2 seconds

  // Get customer ID from localStorage/session
  useEffect(() => {
    const getCustomerId = () => {
      try {
        const customerEmail = localStorage.getItem('customerEmail') || sessionStorage.getItem('customerEmail');
        if (customerEmail) {
          const storedCustomerId = localStorage.getItem('customerId') || sessionStorage.getItem('customerId');
          return storedCustomerId || '14'; // fallback to default for testing
        }
        return '14'; // fallback customer ID
      } catch (error) {
        console.error('Error getting customer ID:', error);
        return '14';
      }
    };

    const id = getCustomerId();
    setCustomerId(id);
  }, []);

  // Load read notification IDs from localStorage
  const getReadNotificationIds = useCallback(() => {
    try {
      const saved = localStorage.getItem('readNotificationIds');
      return saved ? JSON.parse(saved) : [];
    } catch (error) {
      console.error('Error loading read notification IDs:', error);
      return [];
    }
  }, []);

  // Save read notification IDs to localStorage
  const saveReadNotificationIds = useCallback((ids) => {
    try {
      localStorage.setItem('readNotificationIds', JSON.stringify(ids));
    } catch (error) {
      console.error('Error saving read notification IDs:', error);
    }
  }, []);

  // Connect to SSE
  const connectSSE = useCallback(() => {
    if (!customerId || isConnectingRef.current || 
        (eventSourceRef.current && eventSourceRef.current.readyState === EventSource.OPEN)) {
      return;
    }

    isConnectingRef.current = true;
    console.log(`🔌 Connecting to SSE for customer: ${customerId}`);

    try {
  const sseUrl = `${import.meta.env.VITE_API_BASE_URL}/notifications/stream/${customerId}`;
  const eventSource = new EventSource(sseUrl, { withCredentials: false, headers: { 'x-api-key': import.meta.env.VITE_API_SECURITY_KEY } });
  eventSourceRef.current = eventSource;

      eventSource.onopen = () => {
        console.log('📡 SSE Connection opened successfully');
        setIsConnected(true);
        isConnectingRef.current = false;
        reconnectAttemptsRef.current = 0;
        
        // Clear any pending reconnection
        if (reconnectTimeoutRef.current) {
          clearTimeout(reconnectTimeoutRef.current);
          reconnectTimeoutRef.current = null;
        }

        toast.success('🔔 Real-time notifications connected!', {
          position: 'bottom-right',
          autoClose: 2000,
        });
      };

      eventSource.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          console.log('📥 SSE Message received:', data);

          switch (data.type) {
            case 'connected':
              console.log('✅ SSE Connected successfully');
              break;
              
            case 'notification':
              handleNewNotification(data.data);
              break;
              
            case 'heartbeat':
              // Keep connection alive
              break;
              
            default:
              console.log('📦 Unknown SSE message type:', data.type);
          }
        } catch (error) {
          console.error('❌ Error parsing SSE message:', error);
        }
      };

      eventSource.onerror = (error) => {
        console.error('❌ SSE Error:', error);
        handleSSEError();
      };

    } catch (error) {
      console.error('❌ Error creating SSE connection:', error);
      isConnectingRef.current = false;
      handleSSEError();
    }
  }, [customerId]);

  // Handle new notification
  const handleNewNotification = useCallback((notification) => {
    console.log('🔔 New notification received:', notification);
    
    // Check if notification is already read
    const readIds = getReadNotificationIds();
    const isRead = readIds.includes(notification.id);
    
    const notificationWithReadStatus = { 
      ...notification, 
      is_read: isRead,
      notification_read: isRead 
    };
    
    // Add to notifications list
    setNotifications(prev => {
      // Check if notification already exists
      const exists = prev.some(n => n.id === notification.id);
      if (exists) return prev;
      return [notificationWithReadStatus, ...prev];
    });
    
    // Update unread count if not read
    if (!isRead) {
      setUnreadCount(prev => prev + 1);
      
      // Show toast notification
      toast.info(notification.title || notification.description || 'New notification!', {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    }
  }, [getReadNotificationIds]);

  // Handle SSE errors and reconnection
  const handleSSEError = useCallback(() => {
    setIsConnected(false);
    isConnectingRef.current = false;
    
    // Clean up current connection
    if (eventSourceRef.current) {
      eventSourceRef.current.close();
      eventSourceRef.current = null;
    }

    // Attempt reconnection with exponential backoff
    if (reconnectAttemptsRef.current < maxReconnectAttempts) {
      const delay = baseReconnectDelay * Math.pow(2, reconnectAttemptsRef.current);
      const maxDelay = 30000; // 30 seconds max
      const actualDelay = Math.min(delay, maxDelay);
      
      reconnectAttemptsRef.current++;
      console.log(`🔄 Reconnecting in ${actualDelay/1000}s (attempt ${reconnectAttemptsRef.current}/${maxReconnectAttempts})`);
      
      reconnectTimeoutRef.current = setTimeout(() => {
        connectSSE();
      }, actualDelay);
    } else {
      console.error('❌ Max reconnection attempts reached');
      toast.error('Connection lost. Please refresh the page.', {
        position: 'bottom-right',
        autoClose: false,
      });
    }
  }, [connectSSE]);

  // Disconnect SSE
  const disconnectSSE = useCallback(() => {
    console.log('🔌 Disconnecting SSE');
    
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

  // Manual refresh notifications
  const checkForNewNotifications = useCallback(async () => {
    try {
      const response = await fetch(`http://localhost:8000/api/notifications/${customerId}/unread-count`);
      if (response.ok) {
        const data = await response.json();
        if (data.status === 'success') {
          setUnreadCount(data.data.unreadCount);
        }
      }
    } catch (error) {
      console.error('Error checking for new notifications:', error);
    }
  }, [customerId]);

  // Mark notifications as read
  const markNotificationsAsRead = useCallback(() => {
    // Mark all current notifications as read in localStorage
    const currentReadIds = getReadNotificationIds();
    const newReadIds = [...new Set([...currentReadIds, ...notifications.map(n => n.id)])];
    saveReadNotificationIds(newReadIds);
    
    // Update local state
    setNotifications(prev => prev.map(n => ({ ...n, is_read: true, notification_read: true })));
    setUnreadCount(0);
    
    console.log('✅ All notifications marked as read');
  }, [notifications, getReadNotificationIds, saveReadNotificationIds]);

  // Update unread count
  const updateUnreadCount = useCallback((count) => {
    setUnreadCount(count);
  }, []);

  // Initialize SSE connection when customer ID is available
  useEffect(() => {
    if (customerId) {
      connectSSE();
    }

    return () => {
      disconnectSSE();
    };
  }, [customerId, connectSSE, disconnectSSE]);

  // Load initial unread count
  useEffect(() => {
    if (customerId) {
      checkForNewNotifications();
    }
  }, [customerId, checkForNewNotifications]);

  const value = {
    unreadCount,
    notifications,
    isConnected,
    checkForNewNotifications,
    markNotificationsAsRead,
    updateUnreadCount,
    connectSSE,
    disconnectSSE
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};
