import React, { useState } from 'react';
import { ToastContainer } from './ToastNotification';
import { NotificationBell, NotificationPanel } from './NotificationComponents';
import { NotificationContext } from './notificationContext';

// Notification Provider
export const NotificationProvider = ({ children }) => {
  const [notifications, setNotifications] = useState(() => {
    // Load notifications from localStorage on init
    try {
      const saved = localStorage.getItem('notifications');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });
  const [isOpen, setIsOpen] = useState(false);

  // Add notification
  const addNotification = (notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'info',
      title: '',
      message: '',
      duration: 5000,
      timestamp: new Date().toLocaleString('vi-VN'),
      ...notification
    };

    setNotifications(prev => {
      // Giới hạn tối đa 50 notifications
      const updated = [newNotification, ...prev].slice(0, 50);
      // Save to localStorage
      try {
        localStorage.setItem('notifications', JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save notifications:', error);
      }
      return updated;
    });

    // Auto remove toast after duration, but keep in notification panel
    if (newNotification.duration > 0 && newNotification.showAsToast) {
      setTimeout(() => {
        // Remove from toast display but keep in notifications array
        setNotifications(prev => {
          const updated = prev.map(n => 
            n.id === id ? { ...n, showAsToast: false } : n
          );
          // Save to localStorage
          try {
            localStorage.setItem('notifications', JSON.stringify(updated));
          } catch (error) {
            console.error('Failed to save notifications:', error);
          }
          return updated;
        });
      }, newNotification.duration);
    }

    return id;
  };

  // Remove notification
  const removeNotification = (id) => {
    setNotifications(prev => {
      const updated = prev.filter(notification => notification.id !== id);
      // Save to localStorage
      try {
        localStorage.setItem('notifications', JSON.stringify(updated));
      } catch (error) {
        console.error('Failed to save notifications:', error);
      }
      return updated;
    });
  };

  // Clear all notifications
  const clearAll = () => {
    setNotifications([]);
    // Clear from localStorage
    try {
      localStorage.removeItem('notifications');
    } catch (error) {
      console.error('Failed to clear notifications:', error);
    }
  };

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    isOpen,
    setIsOpen
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
      <NotificationBell />
      <NotificationPanel />
      <ToastContainer />
    </NotificationContext.Provider>
  );
};





 