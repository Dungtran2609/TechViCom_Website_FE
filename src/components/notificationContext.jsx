import React, { createContext, useContext, useState, useCallback } from 'react';
import Toast from './Toast';

// Tạo context
const NotificationContext = createContext(null);

// Hook để sử dụng context
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
};

// Provider bao quanh toàn bộ app
export const NotificationProvider = ({ children }) => {
  const [notification, setNotification] = useState(null);

  // Dùng useCallback để tránh tạo hàm mới không cần thiết
  const addNotification = useCallback(({ type = 'info', message = '', title = '' }) => {
    setNotification({ type, message, title });

    // Tự động đóng sau 2.5s
    setTimeout(() => setNotification(null), 2500);
  }, []);

  return (
    <NotificationContext.Provider value={{ addNotification }}>
      {children}
      {notification && (
        <Toast
          type={notification.type}
          message={notification.message}
          title={notification.title}
          onClose={() => setNotification(null)}
        />
      )}
    </NotificationContext.Provider>
  );
};

export { NotificationContext };
