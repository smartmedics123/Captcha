import React from 'react';
import { useNotifications } from '../context/NotificationContext_optimized';

const DebugNotificationInfo = () => {
  try {
    const { unreadCount, isConnected, customerId } = useNotifications();
    
    return (
      <div style={{ 
        position: 'fixed', 
        top: '160px', 
        right: '10px', 
        zIndex: 1000,
        backgroundColor: 'rgba(0,0,0,0.8)', 
        color: 'white', 
        padding: '10px', 
        borderRadius: '4px',
        fontSize: '12px',
        fontFamily: 'monospace'
      }}>
        <div><strong>Debug Info:</strong></div>
        <div>Customer ID: {customerId || 'none'}</div>
        <div>Unread Count: {unreadCount || 0}</div>
        <div>SSE Connected: {isConnected ? '✅ Yes' : '❌ No'}</div>
        <div>Session Storage: {sessionStorage.getItem('customerId') || 'none'}</div>
      </div>
    );
  } catch (error) {
    return (
      <div style={{ 
        position: 'fixed', 
        top: '160px', 
        right: '10px', 
        zIndex: 1000,
        backgroundColor: 'rgba(255,0,0,0.8)', 
        color: 'white', 
        padding: '10px', 
        borderRadius: '4px',
        fontSize: '12px'
      }}>
        Debug Error: {error.message}
      </div>
    );
  }
};

export default DebugNotificationInfo;
