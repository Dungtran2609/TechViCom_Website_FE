import { useNotifications } from './notificationContext';

export const useNotificationActions = () => {
  const { addNotification } = useNotifications();

  const success = (message, title = 'Thành công') => {
    return addNotification({
      type: 'success',
      title,
      message,
      showAsToast: true
    });
  };

  const error = (message, title = 'Lỗi') => {
    return addNotification({
      type: 'error',
      title,
      message,
      showAsToast: true
    });
  };

  const warning = (message, title = 'Cảnh báo') => {
    return addNotification({
      type: 'warning',
      title,
      message,
      showAsToast: true
    });
  };

  const info = (message, title = 'Thông tin') => {
    return addNotification({
      type: 'info',
      title,
      message,
      showAsToast: true
    });
  };

  return { success, error, warning, info };
}; 