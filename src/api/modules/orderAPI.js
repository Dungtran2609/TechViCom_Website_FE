import apiClient from '../client.js';

// ===== ORDER API =====
export const orderAPI = {
  // Lấy đơn hàng của user
  getUserOrders: async (userId) => {
    try {
      const response = await apiClient.get('/orders', { userId });
      return response;
    } catch (error) {
      console.error('Get user orders error:', error);
      throw error;
    }
  },

  // Tạo đơn hàng mới
  createOrder: async (orderData) => {
    try {
      const response = await apiClient.post('/orders', orderData);
      return response;
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  },

  // Cập nhật trạng thái đơn hàng
  updateOrderStatus: async (orderId, status) => {
    try {
      const response = await apiClient.patch(`/orders/${orderId}`, { status });
      return response;
    } catch (error) {
      console.error('Update order status error:', error);
      throw error;
    }
  },

  // Lấy đơn hàng theo ID
  getOrderById: async (orderId) => {
    try {
      const response = await apiClient.get(`/orders/${orderId}`);
      return response;
    } catch (error) {
      console.error('Get order by ID error:', error);
      throw error;
    }
  },

  // Lấy đơn hàng theo trạng thái
  getOrdersByStatus: async (userId, status) => {
    try {
      const response = await apiClient.get('/orders', { userId, status });
      return response;
    } catch (error) {
      console.error('Get orders by status error:', error);
      throw error;
    }
  },

  // Xóa đơn hàng
  deleteOrder: async (orderId) => {
    try {
      return apiClient.delete(`/orders/${orderId}`);
    } catch (error) {
      console.error('Delete order error:', error);
      throw error;
    }
  }
}; 