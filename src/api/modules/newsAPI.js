
import apiClient from '../client.js';

// ===== NEWS API SERVICE =====
// File này định nghĩa tất cả các hàm gọi API liên quan đến module "Tin tức".

export const newsAPI = {
  /**
   * Lấy danh sách tất cả tin tức.
   * @param {object} params - Các tham số query (ví dụ: { page: 1, limit: 10 })
   * @returns {Promise<object>} - Dữ liệu trả về từ API, ví dụ: { data: [...] }
   */
  getNews: async (params = {}) => {
    // Tương ứng với route: GET /api/v1/news
    return apiClient.get('/news', params);
  },

  /**
   * Lấy chi tiết một bài viết theo ID.
   * Backend nên tải sẵn các quan hệ như 'author', 'category', 'comments'.
   * @param {string|number} id - ID của bài viết
   * @returns {Promise<object>} - Dữ liệu chi tiết của bài viết
   */
  getNewsById: async (id) => {
    // Tương ứng với route: GET /api/v1/news/{id}
    return apiClient.get(`/news/${id}`);
  },

  /**
   * Lấy danh sách tin tức nổi bật.
   * @returns {Promise<object>} - Danh sách các bài viết nổi bật
   */
  getFeaturedNews: async () => {
    // Tương ứng với route: GET /api/v1/news/featured
    return apiClient.get('/news/featured');
  },

  /**
   * Lấy tất cả bình luận của một bài viết.
   * @param {string|number} newsId - ID của bài viết
   * @returns {Promise<object>} - Danh sách các bình luận
   */
  getNewsComments: async (newsId) => {
    // Tương ứng với route: GET /api/v1/news/{id}/comments
    return apiClient.get(`/news/${newsId}/comments`);
  },

    // --- SỬA LẠI HÀM NÀY ĐỂ HỖ TRỢ TRẢ LỜI BÌNH LUẬN ---
  /**
   * Thêm một bình luận mới vào bài viết.
   * @param {string|number} newsId - ID của bài viết.
   * @param {object} commentData - Dữ liệu bình luận, ví dụ: { content: '...', parent_id: 123 (tùy chọn) }.
   * @returns {Promise<object>}
   */
  addNewsComment: (newsId, commentData) => {
    return apiClient.post(`/news/${newsId}/comments`, commentData);
  },

  // --- CÁC HÀM MỚI CẦN THÊM ---

  /**
   * MỚI: Thích hoặc bỏ thích một bài viết.
   * @param {string|number} newsId - ID của bài viết.
   * @returns {Promise<object>} - Trả về trạng thái mới.
   */
  toggleLikeNews: (newsId) => {
    // Backend cần có route: POST /api/v1/news/{id}/like
    return apiClient.post(`/news/${newsId}/like`);
  },

  /**
   * MỚI: Thích hoặc bỏ thích một bình luận.
   * @param {string|number} commentId - ID của bình luận.
   * @returns {Promise<object>}
   */
  toggleLikeComment: (commentId) => {
    // Backend cần có route: POST /api/v1/comments/{id}/like
    return apiClient.post(`/comments/${commentId}/like`);
  },

  /**
   * Thêm một bình luận mới vào bài viết (yêu cầu xác thực).
   * @param {string|number} newsId - ID của bài viết
   * @param {object} commentData - Dữ liệu bình luận (ví dụ: { content: '...' })
   * @returns {Promise<object>} - Dữ liệu bình luận vừa được tạo
   */
  /**
   * Tạo một bài viết mới (yêu cầu xác thực).
   * @param {FormData} newsData - Dữ liệu bài viết dưới dạng FormData để upload ảnh.
   * @returns {Promise<object>}
   */
  createNews: async (newsData) => {
    // Tương ứng với route: POST /api/v1/news
    return apiClient.post('/news', newsData);
  },

  /**
   * Cập nhật một bài viết (yêu cầu xác thực).
   * @param {string|number} id - ID của bài viết
   * @param {object} newsData - Dữ liệu cần cập nhật
   * @returns {Promise<object>}
   */
  updateNews: async (id, newsData) => {
    // Tương ứng với route: PUT /api/v1/news/{id}
    return apiClient.put(`/news/${id}`, newsData);
  },

  /**
   * Xóa một bài viết (yêu cầu xác thực).
   * @param {string|number} id - ID của bài viết
   * @returns {Promise<null>}
   */
  deleteNews: async (id) => {
    // Tương ứng với route: DELETE /api/v1/news/{id}
    return apiClient.delete(`/news/${id}`);
  },

  // ===== NEWS CATEGORIES API =====

  /**
   * Lấy danh sách tất cả các danh mục tin tức.
   * @returns {Promise<object>} - Danh sách các danh mục
   */
  getCategories: async () => {
    // Tương ứng với route: GET /api/v1/news-categories
    return apiClient.get('/news-categories');
  },

  /**
   * Lấy danh sách tin tức thuộc về một danh mục cụ thể.
   * @param {string|number} categoryId - ID của danh mục
   * @returns {Promise<object>} - Danh sách các bài viết trong danh mục
   */
  getNewsByCategory: async (categoryId) => {
    // Tương ứng với route: GET /api/v1/news-categories/{categoryId}/news
    return apiClient.get(`/news-categories/${categoryId}/news`);
  }
};