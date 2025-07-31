import React from 'react';
import { FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimesCircle, FaTimes } from 'react-icons/fa';
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

export const ToastNotification = ({ notification, onRemove }) => {
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