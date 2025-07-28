import apiClient from '../client.js';

// Order Service
export const orderService = {
  // Lấy danh sách đơn hàng của user
  getOrders: async (userId, params = {}) => {
    return apiClient.get('/orders', { userId, ...params });
  },

  // Lấy đơn hàng theo ID
  getOrderById: async (id) => {
    return apiClient.get(`/orders/${id}`);
  },

  // Tạo đơn hàng mới
  createOrder: async (orderData) => {
    return apiClient.post('/orders', orderData);
  },

  // Cập nhật đơn hàng
  updateOrder: async (id, orderData) => {
    return apiClient.patch(`/orders/${id}`, orderData);
  },

  // Xóa đơn hàng
  deleteOrder: async (id) => {
    return apiClient.delete(`/orders/${id}`);
  },

  // Lấy đơn hàng theo trạng thái
  getOrdersByStatus: async (userId, status) => {
    return apiClient.get('/orders', { userId, status });
  },

  // Cập nhật trạng thái đơn hàng
  updateOrderStatus: async (id, status) => {
    return apiClient.patch(`/orders/${id}`, { status });
  },

  // Lấy lịch sử đơn hàng
  getOrderHistory: async (userId, limit = 20) => {
    return apiClient.get('/orders', { 
      userId,
      _sort: 'createdAt',
      _order: 'desc',
      _limit: limit 
    });
  }
}; 