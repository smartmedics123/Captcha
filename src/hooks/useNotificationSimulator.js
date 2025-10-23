import { useEffect } from 'react';
import { useNotifications } from '../context/NotificationContext';
import { toast } from 'react-toastify';

export const useNotificationSimulator = () => {
  const { updateUnreadCount, unreadCount } = useNotifications();

  // Simulate random notifications every 2-5 minutes (for demo purposes)
  useEffect(() => {
    if (process.env.NODE_ENV !== 'development') return;

    const simulateRandomNotification = () => {
      const notifications = [
        'Your order has been shipped!',
        'Payment received successfully',
        'New prescription uploaded',
        'Order delivered to your address',
        'Medicine reminder: Take your pills',
        'Your order is out for delivery'
      ];

      const randomNotification = notifications[Math.floor(Math.random() * notifications.length)];
      
      // Update count
      updateUnreadCount(unreadCount + 1);
      
      // Show toast
      toast.info(randomNotification, {
        position: "top-right",
        autoClose: 4000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
      });
    };

    // Random interval between 2-5 minutes
    const interval = setInterval(simulateRandomNotification, Math.random() * (300000 - 120000) + 120000);

    return () => clearInterval(interval);
  }, [updateUnreadCount, unreadCount]);
};

export default useNotificationSimulator;
