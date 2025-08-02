import { createContext, useContext, useState, useEffect } from 'react';
import { userAPI } from '../api/modules/userAPI'; 

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  // === KHAI BÁO STATE ===
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // === HÀM XỬ LÝ ===

  // Hàm này sẽ được gọi bên trong useEffect và sau khi login thành công
  const verifyUser = async () => {
    const token = localStorage.getItem('auth_token');
    if (!token) {
      setLoading(false);
      return;
    }
    try {
      const response = await userAPI.getMe();
      if (response && response.data) {
        const userData = response.data;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } else {
        await logout();
      }
    } catch (error) {
      console.error("Xác thực token thất bại, đang đăng xuất:", error);
      await logout();
    } finally {
      setLoading(false);
    }
  };

  // ✅ SỬA LỖI TẠI ĐÂY: Hàm login bây giờ nhận vào MỘT đối tượng `credentials`
  const login = async (credentials) => {
    try {
      // Truyền thẳng object credentials cho userAPI
      const response = await userAPI.login(credentials);
      
      if (response && response.access_token) {
        localStorage.setItem('auth_token', response.access_token);
        // Gọi lại verifyUser ngay lập tức để lấy thông tin chi tiết và cập nhật state
        await verifyUser(); 
        return response; // Trả về để component Login có thể dùng
      }
    } catch(error) {
      console.error("Lỗi đăng nhập:", error);
      throw error; // Ném lỗi ra để component Login có thể bắt và hiển thị
    }
  };

  const logout = async () => {
    try {
      const token = localStorage.getItem('auth_token');
      if (token) {
        await userAPI.logout();
      }
    } catch (error) {
      console.error("Lỗi khi logout trên server, nhưng vẫn sẽ dọn dẹp phía client:", error);
    } finally {
      localStorage.removeItem('user');
      localStorage.removeItem('auth_token');
      setUser(null);
    }
  };

  // === useEffect ĐỂ CHẠY KHI ỨNG DỤNG TẢI LẦN ĐẦU ===
  useEffect(() => {
    verifyUser();
  }, []);

  // === GIÁ TRỊ CUNG CẤP BỞI CONTEXT ===
  const providerValue = { user, login, logout, loading };

  return (
    <AuthContext.Provider value={providerValue}>
      {children}
    </AuthContext.Provider>
  );
};

// === CUSTOM HOOK ===
export const useAuth = () => useContext(AuthContext);