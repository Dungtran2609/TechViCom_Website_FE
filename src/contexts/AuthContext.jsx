// File: src/contexts/AuthContext.jsx (Bản hoàn chỉnh cuối cùng)

import { createContext, useContext, useState, useEffect } from 'react';
// Đảm bảo đường dẫn này đúng
import { userAPI } from '../api/modules/userAPI'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // Khởi tạo là null, useEffect sẽ xử lý việc tải từ localStorage và server
  const [loading, setLoading] = useState(true); // Bắt đầu ở trạng thái đang tải

  const login = async (email, password) => {
    // 1. userAPI.login trả về { message, access_token, user }
    const response = await userAPI.login(email, password);
    
    // 2. Kiểm tra response và lấy ra user, token
    if (response && response.user && response.access_token) {
      const userData = response.user;
      const token = response.access_token;
      
      // 3. Lưu vào localStorage và cập nhật state
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('auth_token', token);
      setUser(userData);
      
      // 4. Trả về user để LoginPage có thể dùng
      return userData;
    }
    
    // Nếu login thất bại, trả về null
    return null;
  };

  const logout = async () => {
    try {
      // Gọi API logout, ApiClient sẽ tự gửi token
      await userAPI.logout();
    } catch (error) {
      console.error("Lỗi khi logout trên server, nhưng vẫn sẽ dọn dẹp phía client:", error);
    } finally {
      // Luôn luôn dọn dẹp localStorage và state sau khi gọi logout
      localStorage.removeItem('user');
      localStorage.removeItem('auth_token');
      setUser(null);
    }
  };

  // useEffect này sẽ chạy một lần duy nhất khi ứng dụng tải
  useEffect(() => {
    const verifyUser = async () => {
      const token = localStorage.getItem('auth_token');
      
      // Nếu không có token, không cần làm gì cả, kết thúc trạng thái loading
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        // Có token, thử lấy thông tin user
        const response = await userAPI.getMe(); // getMe trả về { user: ... }
        
        if (response && response.user) {
          // Token hợp lệ, cập nhật state và localStorage
          setUser(response.user);
          localStorage.setItem('user', JSON.stringify(response.user));
        } else {
          // API trả về kết quả không mong muốn, coi như token không hợp lệ
          await logout();
        }
      } catch (error) {
        // API báo lỗi (thường do token hết hạn), thực hiện logout
        console.error("Xác thực token thất bại, đang đăng xuất:", error);
        await logout();
      } finally {
        // Dù thành công hay thất bại, cũng phải kết thúc trạng thái loading
        setLoading(false);
      }
    };

    verifyUser();
  }, []); // Mảng rỗng đảm bảo nó chỉ chạy một lần

  const providerValue = { user, login, logout, loading };

  return (
    <AuthContext.Provider value={providerValue}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
