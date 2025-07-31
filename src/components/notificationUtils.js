// Notification utility functions and constants
export const NOTIFICATION_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

export const getIcon = (type) => {
  switch (type) {
    case 'success':
      return 'FaCheckCircle';
    case 'error':
      return 'FaTimesCircle';
    case 'warning':
      return 'FaExclamationTriangle';
    case 'info':
    default:
      return 'FaInfoCircle';
  }
};

export const getBorderColor = (type) => {
  switch (type) {
    case 'success':
      return 'border-green-500';
    case 'error':
      return 'border-red-500';
    case 'warning':
      return 'border-yellow-500';
    case 'info':
    default:
      return 'border-blue-500';
  }
};

export const getBgColor = (type) => {
  switch (type) {
    case 'success':
      return 'bg-green-50';
    case 'error':
      return 'bg-red-50';
    case 'warning':
      return 'bg-yellow-50';
    case 'info':
    default:
      return 'bg-blue-50';
  }
}; 