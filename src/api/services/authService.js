import api from '../axiosInstance';
import { setAuthToken } from '../config';

// Gửi yêu cầu đăng ký (đảm bảo gửi cả password_confirmation)
export const register = ({ name, email, password, password_confirmation }) => {
  const data = {
    name,
    email,
    password,
    password_confirmation, // Laravel yêu cầu trường này cho rule "confirmed"
  };

  return api.post('/v1/register', data);
};

// Gửi yêu cầu đăng nhập → và lưu token
export const login = async (data) => {
  const res = await api.post('/v1/login', data);
  const token = res.data.access_token;

  // Lưu token vào localStorage và cấu hình header Authorization
  setAuthToken(token);

  return res.data;
};

// Lấy thông tin người dùng hiện tại
export const getMe = () => api.get('/v1/me');

// Đăng xuất
export const logout = () => api.post('/v1/logout');
