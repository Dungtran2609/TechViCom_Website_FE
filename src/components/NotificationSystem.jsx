import React, { useState, useEffect, useCallback } from 'react';
import { ToastContainer } from './ToastNotification';
import { NotificationBell, NotificationPanel } from './NotificationComponents';
import { NotificationContext } from './notificationContext';

export const NotificationProvider = ({ children }) => {
  // Khởi tạo notifications từ localStorage
  const [notifications, setNotifications] = useState(() => {
    try {
      const saved = localStorage.getItem('notifications');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isOpen, setIsOpen] = useState(false);

  // Đồng bộ localStorage mỗi khi notifications thay đổi
  useEffect(() => {
    try {
      localStorage.setItem('notifications', JSON.stringify(notifications));
    } catch (error) {
      console.error('Failed to save notifications:', error);
    }
  }, [notifications]);

  // Thêm notification mới
  const addNotification = useCallback((notification) => {
    const id = Date.now() + Math.random();
    const newNotification = {
      id,
      type: 'info',
      title: '',
      message: '',
      duration: 5000,
      timestamp: new Date().toLocaleString('vi-VN'),
      showAsToast: true,       // Mặc định hiện toast luôn
      ...notification,
    };

    setNotifications((prev) => {
      // Giới hạn tối đa 50 notifications, mới nhất đứng đầu
      const updated = [newNotification, ...prev].slice(0, 50);
      return updated;
    });

    // Tự động ẩn toast sau duration (nếu showAsToast = true)
    if (newNotification.duration > 0 && newNotification.showAsToast) {
      setTimeout(() => {
        setNotifications((prev) =>
          prev.map((n) =>
            n.id === id ? { ...n, showAsToast: false } : n
          )
        );
      }, newNotification.duration);
    }

    return id;
  }, []);

  // Xóa notification theo id
  const removeNotification = useCallback((id) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  }, []);

  // Xóa tất cả notifications
  const clearAll = useCallback(() => {
    setNotifications([]);
  }, []);

  const value = {
    notifications,
    addNotification,
    removeNotification,
    clearAll,
    isOpen,
    setIsOpen,
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
