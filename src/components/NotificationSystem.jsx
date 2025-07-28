import React, { useState, useEffect, createContext, useContext } from 'react';
import { FaBell, FaTimes, FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimesCircle } from 'react-icons/fa';

// Notification Context
const NotificationContext = createContext();

export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

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

  // Convenience methods
  const success = (message, title = 'Thành công') => {
    return addNotification({ type: 'success', title, message, showAsToast: true });
  };

  const error = (message, title = 'Lỗi') => {
    return addNotification({ type: 'error', title, message, showAsToast: true });
  };

  const warning = (message, title = 'Cảnh báo') => {
    return addNotification({ type: 'warning', title, message, showAsToast: true });
  };

  const info = (message, title = 'Thông tin') => {
    return addNotification({ type: 'info', title, message, showAsToast: true });
  };

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    success,
    error,
    warning,
    info,
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

// Notification Bell Component
const NotificationBell = () => {
  const { notifications, isOpen, setIsOpen } = useNotifications();
  const unreadCount = notifications.length; // Hiển thị tất cả notifications



  return (
    <div className="fixed top-20 right-4 z-50" style={{ zIndex: 9999 }}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105 border border-gray-200"
        title="Thông báo"
        style={{ backgroundColor: 'white', color: 'black' }}
      >
        <FaBell className="text-gray-600 text-xl" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};

// Notification Panel Component
const NotificationPanel = () => {
  const { notifications, isOpen, setIsOpen, removeNotification, clearAll } = useNotifications();

  if (!isOpen) return null;

  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-green-500" />;
      case 'error':
        return <FaTimesCircle className="text-red-500" />;
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-500" />;
      default:
        return <FaInfoCircle className="text-blue-500" />;
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'success':
        return 'border-l-green-500';
      case 'error':
        return 'border-l-red-500';
      case 'warning':
        return 'border-l-yellow-500';
      default:
        return 'border-l-blue-500';
    }
  };

  return (
    <div className="fixed top-32 right-4 z-50 w-80 max-w-[90vw] bg-white rounded-lg shadow-2xl border border-gray-200">
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800">Thông báo</h3>
        <div className="flex items-center gap-2">
          {notifications.length > 0 && (
            <button
              onClick={clearAll}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Xóa tất cả
            </button>
          )}
          <button
            onClick={() => setIsOpen(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            <FaTimes />
          </button>
        </div>
      </div>
      
      <div className="max-h-96 overflow-y-auto">
        {notifications.length === 0 ? (
          <div className="p-8 text-center text-gray-500">
            <FaBell className="text-4xl mx-auto mb-2 opacity-50" />
            <p>Không có thông báo nào</p>
          </div>
        ) : (
          <div className="p-2">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`mb-2 p-3 bg-gray-50 rounded-lg border-l-4 ${getBorderColor(notification.type)} hover:bg-gray-100 transition-colors`}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="text-sm font-semibold text-gray-800">
                          {notification.title}
                        </h4>
                        <p className="text-sm text-gray-600 mt-1">
                          {notification.message}
                        </p>
                        {notification.timestamp && (
                          <p className="text-xs text-gray-400 mt-1">
                            {notification.timestamp}
                          </p>
                        )}
                      </div>
                      <button
                        onClick={() => removeNotification(notification.id)}
                        className="flex-shrink-0 text-gray-400 hover:text-gray-600 ml-2"
                      >
                        <FaTimes className="text-xs" />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

// Toast Notification Component
export const ToastNotification = ({ notification, onRemove }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return <FaCheckCircle className="text-green-500" />;
      case 'error':
        return <FaTimesCircle className="text-red-500" />;
      case 'warning':
        return <FaExclamationTriangle className="text-yellow-500" />;
      default:
        return <FaInfoCircle className="text-blue-500" />;
    }
  };

  const getBgColor = (type) => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  return (
    <div className={`fixed top-20 right-4 z-50 w-80 max-w-[90vw] p-4 rounded-lg border shadow-lg ${getBgColor(notification.type)} animate-slide-in`} style={{ zIndex: 10001 }}>
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          {getIcon(notification.type)}
        </div>
        <div className="flex-1 min-w-0">
          <h4 className="text-sm font-semibold text-gray-800">
            {notification.title}
          </h4>
          <p className="text-sm text-gray-600 mt-1">
            {notification.message}
          </p>
        </div>
        <button
          onClick={() => onRemove(notification.id)}
          className="flex-shrink-0 text-gray-400 hover:text-gray-600"
        >
          <FaTimes className="text-xs" />
        </button>
      </div>
    </div>
  );
};

// Toast Container
export const ToastContainer = () => {
  const { notifications, removeNotification } = useNotifications();

  return (
    <div className="fixed top-20 right-4 z-50 space-y-2" style={{ zIndex: 10000 }}>
      {notifications
        .filter(n => n.showAsToast)
        .map((notification) => (
          <ToastNotification
            key={notification.id}
            notification={notification}
            onRemove={removeNotification}
          />
        ))}
    </div>
  );
};

 