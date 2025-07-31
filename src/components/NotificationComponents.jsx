import React from 'react';
import { FaBell, FaTimes, FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimesCircle } from 'react-icons/fa';
import { useNotifications } from './notificationContext';

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

export const NotificationBell = () => {
  const { notifications, setIsOpen } = useNotifications();
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 text-gray-600 hover:text-gray-800 transition-colors"
        aria-label="Thông báo"
      >
        <FaBell className="text-xl" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 99 ? '99+' : unreadCount}
          </span>
        )}
      </button>
    </div>
  );
};

export const NotificationPanel = () => {
  const { notifications, isOpen, setIsOpen, removeNotification, clearAll } = useNotifications();

  if (!isOpen) return null;

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