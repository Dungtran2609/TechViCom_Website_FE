import React, { useState, useEffect, useRef } from "react";
import { userAPI } from "../../api";
import { FaUser, FaMapMarkerAlt, FaHistory, FaLock, FaCamera, FaSpinner, FaEye, FaEyeSlash, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import { useNotificationActions } from "../../components/notificationHooks";
import { getProvinces, getDistrictsByProvince, getWardsByDistrict } from "../../data/addressData";

// ----- CÁC HÀM LOGIC CỦA BẠN ĐƯỢC GIỮ NGUYÊN -----
const getCurrentUserId = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.id;
};

// Hàm tính tuổi từ ngày sinh
const calculateAge = (birthday) => {
  if (!birthday) return 0;
  const today = new Date();
  const birthDate = new Date(birthday);
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDiff = today.getMonth() - birthDate.getMonth();
  
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
    age--;
  }
  
  return age;
};

// ====================================================================
// COMPONENT CHÍNH - TRANG TÀI KHOẢN
// ====================================================================
const AccountPage = () => {
  const USER_ID = getCurrentUserId();
  const [user, setUser] = useState(null);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [showAvatarPopup, setShowAvatarPopup] = useState(false);
  const [pendingAvatar, setPendingAvatar] = useState(null);
  const fileInputRef = useRef();
  const { success, error: showError } = useNotificationActions();
  
  // State được chuyển vào các component con để quản lý riêng
  const [profileForm, setProfileForm] = useState(null);
  const [passwordForm, setPasswordForm] = useState({ old: "", new: "", confirm: "" });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    // Reset state khi USER_ID thay đổi
    setUser(null);
    setProfileForm(null);
    setPasswordForm({ old: "", new: "", confirm: "" });
    setPasswordMessage({ type: '', text: '' });
    setError(null);
    
    if (!USER_ID) {
      setError("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
      setLoading(false);
      return;
    }
    setLoading(true);
    const fetchUser = async () => {
      try {
        const u = await userAPI.getUser(USER_ID);
        setUser(u);
        setProfileForm({ ...u });
      } catch {
        setError("Không thể tải thông tin người dùng. Vui lòng thử lại sau.");
        // showError KHÔNG được truyền vào dependency array, chỉ gọi khi cần
        showError("Không thể tải thông tin người dùng. Vui lòng thử lại sau.", "Lỗi tải dữ liệu");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [USER_ID]); // Chỉ truyền USER_ID
  
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Chuẩn bị dữ liệu để gửi lên server
      const updateData = {
        name: profileForm.name,
        email: profileForm.email,
        phone: profileForm.phone,
        birthday: profileForm.birthday,
        gender: profileForm.gender
      };
      
      const updated = await userAPI.updateUser(USER_ID, updateData);
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      window.dispatchEvent(new Event('userChanged'));
      
      // Hiển thị thông báo cập nhật thành công
      success(`Hồ sơ của ${profileForm.name} đã được cập nhật thành công!`, 'Cập nhật hồ sơ thành công');
      
      return true; // Báo hiệu thành công để component con xử lý
    } catch (error) {
      console.error('Error updating profile:', error);
      showError("Không thể cập nhật hồ sơ. Vui lòng thử lại sau.", "Cập nhật thất bại");
      return false; // Báo hiệu thất bại
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' });
    
    // Validation
    if (!passwordForm.old || !passwordForm.new || !passwordForm.confirm) {
        setPasswordMessage({ type: 'error', text: 'Vui lòng nhập đầy đủ thông tin.' }); 
        return;
    }
    if (passwordForm.old !== user.password) {
        setPasswordMessage({ type: 'error', text: 'Mật khẩu cũ không chính xác!' }); 
        return;
    }
    if (passwordForm.new !== passwordForm.confirm) {
        setPasswordMessage({ type: 'error', text: 'Mật khẩu mới không khớp!' }); 
        return;
    }
    if (passwordForm.new === user.password) {
        setPasswordMessage({ type: 'error', text: 'Mật khẩu mới không được trùng với mật khẩu cũ.' }); 
        return;
    }
    
    setSaving(true);
    try {
      await userAPI.updateUser(USER_ID, { password: passwordForm.new });
      
      // Cập nhật lại state user local sau khi đổi pass thành công
      setUser(prev => ({...prev, password: passwordForm.new}));
      localStorage.setItem('user', JSON.stringify({...user, password: passwordForm.new}));
      
      setPasswordMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
      
      // Hiển thị thông báo đổi mật khẩu thành công
      success('Mật khẩu đã được thay đổi thành công!', 'Đổi mật khẩu thành công');
      
      setPasswordForm({ old: "", new: "", confirm: "" });
    } catch (error) {
      console.error('Error updating password:', error);
      setPasswordMessage({ type: 'error', text: 'Đã xảy ra lỗi. Vui lòng thử lại.' });
      showError("Không thể thay đổi mật khẩu. Vui lòng thử lại sau.", "Đổi mật khẩu thất bại");
    } finally {
      setSaving(false);
    }
  };

  const handleAddressUpdate = async (newAddresses) => {
    setSaving(true);
    try {
      const updated = await userAPI.updateUser(USER_ID, { addresses: newAddresses });
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      
      // Hiển thị thông báo cập nhật địa chỉ thành công
      success('Danh sách địa chỉ đã được cập nhật thành công!', 'Cập nhật địa chỉ thành công');
    } catch (error) {
      console.error('Error updating addresses:', error);
      showError("Không thể cập nhật địa chỉ. Vui lòng thử lại sau.", "Cập nhật địa chỉ thất bại");
    } finally {
      setSaving(false);
    }
  };
  
  const handleAvatarSave = async () => {
    setSaving(true);
    try {
              const updated = await userAPI.updateUser(USER_ID, { avatar: pendingAvatar });
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      window.dispatchEvent(new Event('userChanged'));
      setShowAvatarPopup(false);
      
      // Hiển thị thông báo cập nhật avatar thành công
      success('Ảnh đại diện đã được cập nhật thành công!', 'Cập nhật avatar thành công');
    } catch {
      showError("Không thể cập nhật ảnh đại diện. Vui lòng thử lại sau.", "Cập nhật avatar thất bại");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-28 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-[#ff6c2f] border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-lg font-semibold text-slate-700">Đang tải dữ liệu...</p>
        <p className="text-sm text-slate-500 mt-2">Vui lòng chờ trong giây lát</p>
      </div>
    </div>
  );
  
  if (error) return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-28 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-4">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
          <span className="text-2xl">⚠️</span>
        </div>
        <p className="text-lg font-semibold text-red-600 mb-2">Có lỗi xảy ra</p>
        <p className="text-slate-600">{error}</p>
        <button 
          onClick={() => window.location.reload()} 
          className="mt-4 px-6 py-2 bg-[#ff6c2f] text-white rounded-lg hover:bg-[#ff8c42] transition-colors"
        >
          Thử lại
        </button>
      </div>
    </div>
  );
  
  if (!user) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pb-12 pt-28">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 lg:flex-row lg:gap-8">
        <AccountSidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} fileInputRef={fileInputRef}/>
        <main className="flex-1">
          <div className="rounded-2xl bg-white p-4 shadow-lg sm:p-6 lg:p-8 border border-slate-200/50">
            {activeTab === 'profile' && <ProfileTab user={user} form={profileForm} setForm={setProfileForm} handleSave={handleProfileSave} saving={saving} />}
            {activeTab === 'address' && <AddressTab addresses={user.addresses || []} onUpdate={handleAddressUpdate} saving={saving} />}
            {activeTab === 'orders' && <OrdersTab orders={user.orders} />}
            {activeTab === 'password' && <PasswordTab passwordForm={passwordForm} setPasswordForm={setPasswordForm} handlePasswordSubmit={handlePasswordSubmit} passwordMessage={passwordMessage} saving={saving} />}
          </div>
        </main>
      </div>
      <AvatarPopup isOpen={showAvatarPopup} onClose={() => setShowAvatarPopup(false)} pendingAvatar={pendingAvatar} onSave={handleAvatarSave} saving={saving}/>
      <input type="file" accept="image/*" ref={fileInputRef} className="hidden" onChange={(e) => {
          const file = e.target.files[0];
          if (file) {
              const reader = new FileReader();
              reader.onload = ev => { setPendingAvatar(ev.target.result); setShowAvatarPopup(true); };
              reader.readAsDataURL(file);
          }
      }} />
    </div>
  );
};


// ====================================================================
// CÁC COMPONENT CON CHO TỪNG PHẦN GIAO DIỆN
// ====================================================================

const AccountSidebar = ({ user, activeTab, setActiveTab, fileInputRef }) => {
    const navLinks = [
        { id: 'profile', label: 'Thông tin cá nhân', icon: <FaUser /> },
        { id: 'address', label: 'Địa chỉ', icon: <FaMapMarkerAlt /> },
        { id: 'orders', label: 'Lịch sử mua hàng', icon: <FaHistory /> },
        { id: 'password', label: 'Đổi mật khẩu', icon: <FaLock /> },
    ];
    return (
        <aside className="w-full flex-shrink-0 lg:w-80">
            <div className="sticky top-28 rounded-2xl bg-white p-4 text-center shadow-lg border border-slate-200/50 sm:p-6">
                <div className="group relative mx-auto mb-4 h-24 w-24 sm:h-32 sm:w-32 cursor-pointer" onClick={() => fileInputRef.current.click()}>
                    <img 
                        src={user.avatar || '/images/avatar-default.png'} 
                        alt="avatar" 
                        className="h-full w-full rounded-full border-4 border-white object-cover shadow-md transition-transform duration-300 group-hover:scale-105" 
                    />
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <FaCamera size={24} className="sm:w-8 sm:h-8" />
                    </div>
                </div>
                <h2 className="truncate text-xl sm:text-2xl font-bold text-slate-800 px-2">{user.name}</h2>
                <p className="mb-6 truncate text-xs sm:text-sm text-slate-500 px-2">{user.email}</p>
                <nav className="w-full border-t border-slate-200 pt-4 sm:pt-6">
                    <ul className="space-y-1 sm:space-y-2">
                        {navLinks.map(link => (
                            <li key={link.id}>
                                <button
                                    onClick={() => setActiveTab(link.id)}
                                    className={`flex w-full items-center gap-3 sm:gap-4 rounded-lg px-3 sm:px-4 py-2.5 sm:py-3.5 text-left font-semibold transition-all duration-200 text-sm sm:text-base ${
                                        activeTab === link.id
                                        ? 'bg-gradient-to-r from-[#ff6c2f] to-[#ff8c42] text-white shadow-sm'
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-[#ff6c2f]'
                                    }`}
                                >
                                    <span className="text-lg sm:text-xl">{link.icon}</span>
                                    <span className="truncate">{link.label}</span>
                                </button>
                            </li>
                        ))}
                    </ul>
                </nav>
            </div>
        </aside>
    );
};

const AvatarPopup = ({ isOpen, onClose, pendingAvatar, onSave, saving }) => {
    if (!isOpen) return null;
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm">
            <div className="w-full max-w-sm rounded-2xl bg-white p-8 text-center shadow-2xl">
                <h3 className="mb-6 text-2xl font-bold text-slate-800">Ảnh đại diện mới</h3>
                <img src={pendingAvatar} alt="avatar-preview" className="mx-auto mb-8 h-40 w-40 rounded-full border-4 border-orange-200 object-cover shadow-lg" />
                <div className="flex justify-center gap-4">
                    <button onClick={onSave} className="flex min-w-[120px] items-center justify-center rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white shadow-sm transition-all hover:bg-orange-600 disabled:opacity-60" disabled={saving}>
                        {saving ? <FaSpinner className="animate-spin" /> : 'Lưu thay đổi'}
                    </button>
                    <button onClick={onClose} className="rounded-lg bg-slate-200 px-6 py-3 font-semibold text-slate-700 transition-all hover:bg-slate-300">Hủy</button>
                </div>
            </div>
        </div>
    );
};

// ----- Các lớp CSS dùng chung ---
const cardTitleClasses = "text-3xl font-bold text-slate-800 border-b border-slate-200 pb-5 mb-8";
const formInputClasses = "w-full rounded-lg border-slate-300 px-4 py-3 text-base text-slate-800 placeholder:text-slate-400 focus:border-orange-500 focus:ring-1 focus:ring-orange-500 transition shadow-sm";

// Custom styles for better dropdown appearance
const customSelectStyles = `
  select {
    background-image: none !important;
  }
  
  select:focus {
    outline: none;
    border-color: #ff6c2f;
    box-shadow: 0 0 0 2px rgba(255, 108, 47, 0.2);
  }
  
  select option {
    padding: 8px 12px;
    font-size: 14px;
  }
  
  select option:hover {
    background-color: #fff5f2;
  }
  
  input[type="date"]::-webkit-calendar-picker-indicator {
    background: transparent;
    bottom: 0;
    color: transparent;
    cursor: pointer;
    height: auto;
    left: 0;
    position: absolute;
    right: 0;
    top: 0;
    width: auto;
  }
`;

// --- Profile Tab ---
const ProfileTab = ({ user, form, setForm, handleSave, saving }) => {
    const [editMode, setEditMode] = useState(false);
    const onSave = async (e) => {
      const success = await handleSave(e);
      if (success) setEditMode(false);
    }
    return (
        <div>
            <h2 className={cardTitleClasses}>Thông Tin Cá Nhân</h2>
            {!editMode ? (
                <div>
                    <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
                        <InfoItem label="Tên người dùng" value={user.name} />
                        <InfoItem label="Email" value={user.email} />
                        <InfoItem label="Số điện thoại" value={user.phone} />
                        <InfoItem label="Ngày sinh" value={user.birthday || 'Chưa cập nhật'} />
                        <InfoItem label="Giới tính" value={user.gender || 'Chưa cập nhật'} />
                    </div>
                    <div className="mt-10 text-center">
                        <button onClick={() => setEditMode(true)} className="rounded-lg bg-orange-500 px-8 py-3 font-bold text-white shadow-md transition-all hover:bg-orange-600">Chỉnh sửa</button>
                    </div>
                </div>
            ) : (
                <div className="bg-white rounded-2xl border-2 border-slate-100 p-8 shadow-lg">
                    <div className="mb-6">
                        <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-3">
                            <div className="w-8 h-8 bg-gradient-to-br from-[#ff6c2f] to-[#ff8c42] rounded-full flex items-center justify-center">
                                <span className="text-white text-sm">👤</span>
                            </div>
                            Chỉnh sửa thông tin cá nhân
                        </h3>
                        <p className="text-slate-600 text-sm">Cập nhật thông tin của bạn để có trải nghiệm tốt hơn</p>
                    </div>
                    
                    <form onSubmit={onSave} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-3">
                                <label htmlFor="name" className="block text-sm font-semibold text-slate-700 flex items-center">
                                    <span className="w-2 h-2 bg-[#ff6c2f] rounded-full mr-2"></span>
                                    Tên người dùng <span className="text-red-500 ml-1">*</span>
                                </label>
                                <div className="relative">
                                    <input 
                                        id="name"
                                        name="name" 
                                        value={form.name || ''} 
                                        onChange={(e) => setForm({...form, name: e.target.value})} 
                                        placeholder="Nhập tên người dùng" 
                                        className="w-full rounded-xl border-2 border-slate-200 px-4 py-3.5 text-base text-slate-800 placeholder:text-slate-400 focus:border-[#ff6c2f] focus:ring-2 focus:ring-[#ff6c2f]/20 transition-all shadow-sm bg-white"
                                        required
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                        <span className="text-slate-400">👤</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <label htmlFor="email" className="block text-sm font-semibold text-slate-700 flex items-center">
                                    <span className="w-2 h-2 bg-[#ff6c2f] rounded-full mr-2"></span>
                                    Email <span className="text-red-500 ml-1">*</span>
                                </label>
                                <div className="relative">
                                    <input 
                                        id="email"
                                        name="email" 
                                        value={form.email || ''} 
                                        onChange={(e) => setForm({...form, email: e.target.value})} 
                                        placeholder="Nhập địa chỉ email" 
                                        className="w-full rounded-xl border-2 border-slate-200 px-4 py-3.5 text-base text-slate-800 placeholder:text-slate-400 focus:border-[#ff6c2f] focus:ring-2 focus:ring-[#ff6c2f]/20 transition-all shadow-sm bg-white" 
                                        type="email"
                                        required
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                        <span className="text-slate-400">📧</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <label htmlFor="phone" className="block text-sm font-semibold text-slate-700 flex items-center">
                                    <span className="w-2 h-2 bg-[#ff6c2f] rounded-full mr-2"></span>
                                    Số điện thoại <span className="text-red-500 ml-1">*</span>
                                </label>
                                <div className="relative">
                                    <input 
                                        id="phone"
                                        name="phone" 
                                        value={form.phone || ''} 
                                        onChange={(e) => setForm({...form, phone: e.target.value})} 
                                        placeholder="Nhập số điện thoại" 
                                        className="w-full rounded-xl border-2 border-slate-200 px-4 py-3.5 text-base text-slate-800 placeholder:text-slate-400 focus:border-[#ff6c2f] focus:ring-2 focus:ring-[#ff6c2f]/20 transition-all shadow-sm bg-white"
                                        required
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                                        <span className="text-slate-400">📱</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="space-y-3">
                                <label htmlFor="birthday" className="block text-sm font-semibold text-slate-700 flex items-center">
                                    <span className="w-2 h-2 bg-[#ff6c2f] rounded-full mr-2"></span>
                                    Ngày sinh
                                </label>
                                <div className="relative">
                                    <input 
                                        id="birthday"
                                        name="birthday" 
                                        type="date"
                                        value={form.birthday || ''} 
                                        onChange={(e) => setForm({...form, birthday: e.target.value})} 
                                        className="w-full rounded-xl border-2 border-slate-200 px-4 py-3.5 text-base text-slate-800 focus:border-[#ff6c2f] focus:ring-2 focus:ring-[#ff6c2f]/20 transition-all shadow-sm bg-white"
                                        max={new Date().toISOString().split('T')[0]}
                                    />
                                    <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                        <span className="text-slate-400">🎂</span>
                                    </div>
                                </div>
                                {form.birthday && (
                                    <p className="text-xs text-slate-500">
                                        Tuổi: {calculateAge(form.birthday)} tuổi
                                    </p>
                                )}
                            </div>
                        </div>
                        
                        <div className="space-y-3">
                            <label htmlFor="gender" className="block text-sm font-semibold text-slate-700 flex items-center">
                                <span className="w-2 h-2 bg-[#ff6c2f] rounded-full mr-2"></span>
                                Giới tính
                            </label>
                            <div className="relative">
                                <select 
                                    id="gender"
                                    name="gender" 
                                    value={form.gender || ''} 
                                    onChange={(e) => setForm({...form, gender: e.target.value})} 
                                    className="w-full rounded-xl border-2 border-slate-200 px-4 py-3.5 text-base text-slate-800 focus:border-[#ff6c2f] focus:ring-2 focus:ring-[#ff6c2f]/20 transition-all shadow-sm bg-white appearance-none"
                                >
                                    <option value="">Chọn giới tính</option>
                                    <option value="Nam">👨 Nam</option>
                                    <option value="Nữ">👩 Nữ</option>
                                    <option value="Khác">🤖 Khác</option>
                                </select>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                    <span className="text-slate-400">👥</span>
                                </div>
                                <div className="absolute inset-y-0 right-0 flex items-center pr-12 pointer-events-none">
                                    <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                    </svg>
                                </div>
                            </div>
                        </div>
                        
                        <div className="flex flex-col sm:flex-row justify-center gap-4 pt-6 border-t border-slate-200">
                            <button 
                                type="submit" 
                                className="flex min-w-[150px] items-center justify-center rounded-xl bg-gradient-to-r from-[#ff6c2f] to-[#ff8c42] px-8 py-3.5 font-bold text-white shadow-lg transition-all hover:from-[#ff8c42] hover:to-[#ff6c2f] hover:shadow-xl disabled:opacity-60 transform hover:scale-105" 
                                disabled={saving}
                            >
                                {saving ? (
                                    <>
                                        <FaSpinner className="animate-spin mr-2" />
                                        Đang lưu...
                                    </>
                                ) : (
                                    <>
                                        <span className="mr-2">💾</span>
                                        Lưu thay đổi
                                    </>
                                )}
                            </button>
                            <button 
                                type="button" 
                                onClick={() => { setEditMode(false); setForm(user); }} 
                                className="flex min-w-[150px] items-center justify-center rounded-xl border-2 border-slate-200 bg-white px-8 py-3.5 font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 transform hover:scale-105"
                            >
                                <span className="mr-2">❌</span>
                                Hủy
                        </button>
                    </div>
                </form>
                </div>
            )}
        </div>
    );
};
const InfoItem = ({ label, value }) => (
    <div className="border-b border-slate-200 pb-2">
        <p className="text-sm font-medium text-slate-500">{label}</p>
        <p className="text-lg font-semibold text-slate-700">{value}</p>
    </div>
);

// --- Address Tab ---
const AddressTab = ({ addresses, onUpdate, saving }) => {
    const [editingIndex, setEditingIndex] = useState(null);
    
    const handleAdd = (addr) => onUpdate([...addresses, addr]);
    const handleDelete = (idx) => onUpdate(addresses.filter((_, i) => i !== idx));
    const handleSetDefault = (idx) => onUpdate(addresses.map((a, i) => ({ ...a, isDefault: i === idx })));
    const handleEdit = (idx) => setEditingIndex(idx);
    const handleUpdate = (idx, updatedAddr) => {
        const newAddresses = [...addresses];
        newAddresses[idx] = updatedAddr;
        onUpdate(newAddresses);
        setEditingIndex(null);
    };
    const handleCancelEdit = () => setEditingIndex(null);
    
    return (
        <div>
            <h2 className={cardTitleClasses}>Địa Chỉ Của Bạn</h2>
            
            <div className="mb-8 space-y-4">
                {addresses.length > 0 ? addresses.map((addr, idx) => (
                    <div key={idx} className="bg-white rounded-2xl border-2 border-slate-100 p-6 transition-all hover:shadow-lg hover:border-[#ff6c2f]/30">
                        {editingIndex === idx ? (
                            <EditAddressForm 
                                address={addr} 
                                onUpdate={(updatedAddr) => handleUpdate(idx, updatedAddr)} 
                                onCancel={handleCancelEdit}
                                saving={saving}
                            />
                        ) : (
                            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                                <div className="flex-1">
                                    <div className="flex items-start gap-3">
                                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-[#ff6c2f] to-[#ff8c42] rounded-full flex items-center justify-center">
                                            <span className="text-white text-lg">📍</span>
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-slate-800 font-medium text-lg mb-1">
                                                {addr.address}
                                            </p>
                                            {addr.isDefault && (
                                                <span className="inline-flex items-center gap-1 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">
                                                    <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
                                                    Mặc định
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                </div>
                                <div className="flex flex-shrink-0 gap-3">
                                    <button 
                                        onClick={() => handleEdit(idx)} 
                                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2.5 text-sm font-semibold text-white transition-all hover:from-blue-600 hover:to-blue-700 hover:shadow-md" 
                                        disabled={saving}
                                    >
                                        <span className="text-sm">✏️</span>
                                        Chỉnh sửa
                                    </button>
                                    <button 
                                        onClick={() => handleSetDefault(idx)} 
                                        className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#ff6c2f] to-[#ff8c42] px-4 py-2.5 text-sm font-semibold text-white transition-all hover:from-[#ff8c42] hover:to-[#ff6c2f] hover:shadow-md disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-300 disabled:text-slate-500" 
                                        disabled={addr.isDefault || saving}
                                    >
                                        <span className="text-sm">⭐</span>
                                        Đặt mặc định
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(idx)} 
                                        className="flex items-center gap-2 rounded-xl border-2 border-red-500 bg-white px-4 py-2.5 text-sm font-semibold text-red-500 transition-all hover:bg-red-50 hover:border-red-600 hover:shadow-md" 
                                        disabled={saving}
                                    >
                                        <span className="text-sm">🗑️</span>
                                        Xóa
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )) : (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">🏠</span>
                        </div>
                        <p className="text-slate-500 text-lg font-medium">Bạn chưa có địa chỉ nào được lưu.</p>
                        <p className="text-slate-400 text-sm mt-1">Thêm địa chỉ đầu tiên để bắt đầu</p>
                    </div>
                )}
            </div>
            
            <AddAddressForm onAdd={handleAdd} saving={saving} />
        </div>
    );
};
// Component chung cho form địa chỉ
const AddressForm = ({ 
    title, 
    description, 
    initialData = { province: '', district: '', ward: '', specificAddress: '' }, 
    onSubmit, 
    onCancel, 
    saving, 
    submitText = "Thêm địa chỉ",
    submitIcon = "📍"
}) => {
    const [addressForm, setAddressForm] = useState(initialData);
    const [errors, setErrors] = useState({});
    
    // State cho dữ liệu địa chỉ
    const [provinces, setProvinces] = useState([]);
    const [districts, setDistricts] = useState([]);
    const [wards, setWards] = useState([]);
    const [loadingProvinces, setLoadingProvinces] = useState(true);
    const [loadingDistricts, setLoadingDistricts] = useState(false);
    const [loadingWards, setLoadingWards] = useState(false);
    
    // Fetch provinces on component mount
    useEffect(() => {
        const loadProvinces = async () => {
            try {
                setLoadingProvinces(true);
                const provincesData = await getProvinces();
                setProvinces(provincesData);
            } catch (error) {
                console.error('Error loading provinces:', error);
            } finally {
                setLoadingProvinces(false);
            }
        };
        loadProvinces();
    }, []);
    
    // Fetch districts when province changes
    useEffect(() => {
        const loadDistricts = async () => {
            if (!addressForm.province) {
                setDistricts([]);
                return;
            }
            
            try {
                setLoadingDistricts(true);
                const districtsData = await getDistrictsByProvince(addressForm.province);
                setDistricts(districtsData);
            } catch (error) {
                console.error('Error loading districts:', error);
                setDistricts([]);
            } finally {
                setLoadingDistricts(false);
            }
        };
        loadDistricts();
    }, [addressForm.province]);
    
    // Fetch wards when district changes
    useEffect(() => {
        const loadWards = async () => {
            if (!addressForm.district) {
                setWards([]);
                return;
            }
            
            try {
                setLoadingWards(true);
                const wardsData = await getWardsByDistrict(addressForm.district);
                setWards(wardsData);
            } catch (error) {
                console.error('Error loading wards:', error);
                setWards([]);
            } finally {
                setLoadingWards(false);
            }
        };
        loadWards();
    }, [addressForm.district]);
    
    const handleInputChange = (field, value) => {
        setAddressForm(prev => {
            const newForm = { ...prev, [field]: value };
            
            // Reset dependent fields when province changes
            if (field === 'province') {
                newForm.district = '';
                newForm.ward = '';
                setDistricts([]);
                setWards([]);
            }
            
            // Reset ward when district changes
            if (field === 'district') {
                newForm.ward = '';
                setWards([]);
            }
            
            return newForm;
        });
    };
    
    const validateForm = () => {
        const newErrors = {};
        
        if (!addressForm.province) {
            newErrors.province = 'Vui lòng chọn tỉnh/thành phố';
        }
        if (!addressForm.district) {
            newErrors.district = 'Vui lòng chọn quận/huyện';
        }
        if (!addressForm.specificAddress.trim()) {
            newErrors.specificAddress = 'Vui lòng nhập địa chỉ cụ thể';
        }
        
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };
    
    const handleSubmit = (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            return;
        }
        
        const { province, district, ward, specificAddress } = addressForm;
        
        const provinceName = provinces.find(p => p.id === province)?.name || '';
        const districtName = districts.find(d => d.id === district)?.name || '';
        const wardName = wards.find(w => w.id === ward)?.name || '';
        
        const fullAddress = `${specificAddress}, ${wardName ? wardName + ', ' : ''}${districtName}, ${provinceName}`;
        
        onSubmit({ address: fullAddress, isDefault: false });
        
        // Reset form only for add new address
        if (!onCancel) {
            setAddressForm({ province: '', district: '', ward: '', specificAddress: '' });
            setErrors({});
        }
    };
    
    return (
        <div className="bg-white rounded-2xl border-2 border-slate-100 p-8 shadow-lg">
            <div className="mb-6">
                <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-3">
                    <div className="w-8 h-8 bg-gradient-to-br from-[#ff6c2f] to-[#ff8c42] rounded-full flex items-center justify-center">
                        <span className="text-white text-sm">{onCancel ? '✏️' : '➕'}</span>
                    </div>
                    {title}
                </h3>
                <p className="text-slate-600 text-sm">{description}</p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label htmlFor="province" className="block text-sm font-semibold text-slate-700 flex items-center">
                            <span className="w-2 h-2 bg-[#ff6c2f] rounded-full mr-2"></span>
                            Tỉnh/Thành phố <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="relative">
                            <select 
                                id="province"
                                value={addressForm.province} 
                                onChange={(e) => handleInputChange('province', e.target.value)} 
                                className={`w-full rounded-xl border-2 px-4 py-3.5 text-base text-slate-800 focus:ring-2 focus:ring-[#ff6c2f]/20 transition-all shadow-sm bg-white appearance-none ${
                                    errors.province 
                                        ? 'border-red-300 focus:border-red-500' 
                                        : 'border-slate-200 focus:border-[#ff6c2f]'
                                }`}
                                required
                                disabled={loadingProvinces}
                            >
                                <option value="">
                                    {loadingProvinces ? 'Đang tải...' : 'Chọn Tỉnh/Thành phố'}
                                </option>
                                {provinces.map(province => (
                                    <option key={province.id} value={province.id}>
                                        {province.name}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                <span className="text-slate-400">🏛️</span>
                            </div>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-12 pointer-events-none">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                        {errors.province && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <span>⚠️</span>
                                {errors.province}
                            </p>
                        )}
                    </div>
                    
                    <div className="space-y-3">
                        <label htmlFor="district" className="block text-sm font-semibold text-slate-700 flex items-center">
                            <span className="w-2 h-2 bg-[#ff6c2f] rounded-full mr-2"></span>
                            Quận/Huyện <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="relative">
                            <select 
                                id="district"
                                value={addressForm.district} 
                                onChange={(e) => handleInputChange('district', e.target.value)} 
                                className={`w-full rounded-xl border-2 px-4 py-3.5 text-base text-slate-800 focus:ring-2 focus:ring-[#ff6c2f]/20 transition-all shadow-sm bg-white appearance-none ${
                                    errors.district 
                                        ? 'border-red-300 focus:border-red-500' 
                                        : 'border-slate-200 focus:border-[#ff6c2f]'
                                }`}
                                required
                                disabled={!addressForm.province || loadingDistricts}
                            >
                                <option value="">
                                    {loadingDistricts ? 'Đang tải...' : 'Chọn Quận/Huyện'}
                                </option>
                                {districts.map(district => (
                                    <option key={district.id} value={district.id}>
                                        {district.name}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                <span className="text-slate-400">🏢</span>
                            </div>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-12 pointer-events-none">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                        {errors.district && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <span>⚠️</span>
                                {errors.district}
                            </p>
                        )}
                    </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-3">
                        <label htmlFor="ward" className="block text-sm font-semibold text-slate-700 flex items-center">
                            <span className="w-2 h-2 bg-[#ff6c2f] rounded-full mr-2"></span>
                            Xã/Phường
                        </label>
                        <div className="relative">
                            <select 
                                id="ward"
                                value={addressForm.ward} 
                                onChange={(e) => handleInputChange('ward', e.target.value)} 
                                className="w-full rounded-xl border-2 border-slate-200 px-4 py-3.5 text-base text-slate-800 focus:border-[#ff6c2f] focus:ring-2 focus:ring-[#ff6c2f]/20 transition-all shadow-sm bg-white appearance-none"
                                disabled={!addressForm.district || loadingWards}
                            >
                                <option value="">
                                    {loadingWards ? 'Đang tải...' : 'Chọn Xã/Phường'}
                                </option>
                                {wards.map(ward => (
                                    <option key={ward.id} value={ward.id}>
                                        {ward.name}
                                    </option>
                                ))}
                            </select>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                <span className="text-slate-400">🏘️</span>
                            </div>
                            <div className="absolute inset-y-0 right-0 flex items-center pr-12 pointer-events-none">
                                <svg className="w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                                </svg>
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-3">
                        <label htmlFor="specificAddress" className="block text-sm font-semibold text-slate-700 flex items-center">
                            <span className="w-2 h-2 bg-[#ff6c2f] rounded-full mr-2"></span>
                            Địa chỉ cụ thể <span className="text-red-500 ml-1">*</span>
                        </label>
                        <div className="relative">
                            <input 
                                id="specificAddress"
                                value={addressForm.specificAddress} 
                                onChange={(e) => handleInputChange('specificAddress', e.target.value)} 
                                placeholder="Số nhà, tên đường, tên khu vực..." 
                                className={`w-full rounded-xl border-2 px-4 py-3.5 text-base text-slate-800 placeholder:text-slate-400 focus:ring-2 focus:ring-[#ff6c2f]/20 transition-all shadow-sm bg-white ${
                                    errors.specificAddress 
                                        ? 'border-red-300 focus:border-red-500' 
                                        : 'border-slate-200 focus:border-[#ff6c2f]'
                                }`}
                                required
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                                <span className="text-slate-400">🏠</span>
                            </div>
                        </div>
                        {errors.specificAddress && (
                            <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                <span>⚠️</span>
                                {errors.specificAddress}
                            </p>
                        )}
                    </div>
                </div>
                
                <div className="flex justify-end gap-4 pt-6 border-t border-slate-200">
                    {onCancel && (
                        <button 
                            type="button" 
                            onClick={onCancel}
                            className="flex items-center justify-center rounded-xl border-2 border-slate-200 bg-white px-8 py-3.5 font-bold text-slate-700 transition-all hover:bg-slate-50 hover:border-slate-300 transform hover:scale-105"
                        >
                            <span className="mr-2">❌</span>
                            Hủy
                        </button>
                    )}
                    <button 
                        type="submit" 
                        className="flex items-center justify-center rounded-xl bg-gradient-to-r from-[#ff6c2f] to-[#ff8c42] px-8 py-3.5 font-bold text-white shadow-lg transition-all hover:from-[#ff8c42] hover:to-[#ff6c2f] hover:shadow-xl disabled:opacity-60 transform hover:scale-105" 
                        disabled={saving || !addressForm.province || !addressForm.district || !addressForm.specificAddress.trim()}
                    >
                        {saving ? (
                            <>
                                <FaSpinner className="animate-spin mr-2" />
                                Đang lưu...
                            </>
                        ) : (
                            <>
                                <span className="mr-2">{submitIcon}</span>
                                {submitText}
                            </>
                        )}
                    </button>
                </div>
            </form>
        </div>
    );
};

const AddAddressForm = ({ onAdd, saving }) => {
    return (
        <AddressForm 
            title="Thêm địa chỉ mới"
            description="Nhập địa chỉ chi tiết để chúng tôi có thể giao hàng chính xác"
            onSubmit={onAdd}
            saving={saving}
            submitText="Thêm địa chỉ"
            submitIcon="📍"
        />
    );
};

const EditAddressForm = ({ address, onUpdate, onCancel, saving }) => {
    // Parse address to extract components
    const parseAddress = (addressString) => {
        // Tách địa chỉ thành các phần
        const parts = addressString.split(',').map(part => part.trim());
        
        // Giả sử format: "Số nhà, đường, phường/xã, quận/huyện, tỉnh/thành phố"
        if (parts.length >= 3) {
            const specificAddress = parts[0];
            const ward = parts.length >= 4 ? parts[parts.length - 3] : '';
            const district = parts.length >= 3 ? parts[parts.length - 2] : '';
            const province = parts[parts.length - 1];
            
            return {
                province: province,
                district: district,
                ward: ward,
                specificAddress: specificAddress
            };
        }
        
        // Fallback: trả về địa chỉ gốc trong specificAddress
        return {
            province: '',
            district: '',
            ward: '',
            specificAddress: addressString
        };
    };
    
    return (
        <AddressForm 
            title="Chỉnh sửa địa chỉ"
            description="Cập nhật thông tin địa chỉ của bạn"
            initialData={parseAddress(address.address)}
            onSubmit={onUpdate}
            onCancel={onCancel}
            saving={saving}
            submitText="Cập nhật địa chỉ"
            submitIcon="💾"
        />
    );
};

// --- Orders Tab ---
const OrdersTab = ({ orders }) => {
    const [selectedOrder, setSelectedOrder] = useState(null);
    const [showOrderDetail, setShowOrderDetail] = useState(false);

    const handleViewDetail = (order) => {
        setSelectedOrder(order);
        setShowOrderDetail(true);
    };

    const handleCloseDetail = () => {
        setShowOrderDetail(false);
        setSelectedOrder(null);
    };

    return (
        <div>
            <h2 className={cardTitleClasses}>Lịch Sử Mua Hàng</h2>
            <div className="space-y-6">
                {orders && orders.length > 0 ? (
                    orders.map(order => (
                        <div key={order.orderId} className="rounded-xl border border-slate-200 p-5 transition-shadow hover:shadow-md">
                            <div className="mb-4 flex flex-col items-start justify-between gap-2 border-b border-slate-200 pb-4 sm:flex-row sm:items-center">
                                <div>
                                    <p className="font-bold text-slate-800">Mã đơn hàng: <span className="text-orange-600">#{order.orderId}</span></p>
                                    <p className="text-sm text-slate-500">Ngày đặt: {order.date}</p>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className={`rounded-full px-3 py-1 text-sm font-bold ${order.status === 'Đã giao' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                        {order.status}
                                    </div>
                                    <button 
                                        onClick={() => handleViewDetail(order)}
                                        className="flex items-center gap-2 rounded-lg bg-gradient-to-r from-[#ff6c2f] to-[#ff8c42] px-4 py-2 text-sm font-semibold text-white transition-all hover:from-[#ff8c42] hover:to-[#ff6c2f] hover:shadow-md"
                                    >
                                        <span>👁️</span>
                                        Xem chi tiết
                                    </button>
                                </div>
                            </div>
                            <div className="mb-4 space-y-3">
                                {order.products.slice(0, 2).map((p, idx) => (
                                    <div key={idx} className="flex justify-between text-sm">
                                        <p className="text-slate-600">{p.name} <span className="text-slate-400">x{p.quantity}</span></p>
                                        <p className="font-medium text-slate-800">{p.price.toLocaleString()}₫</p>
                                    </div>
                                ))}
                                {order.products.length > 2 && (
                                    <p className="text-sm text-slate-500 italic">... và {order.products.length - 2} sản phẩm khác</p>
                                )}
                            </div>
                            <div className="border-t border-slate-200 pt-4 text-right">
                                <p className="text-lg font-bold text-slate-800">Tổng cộng: <span className="text-2xl text-orange-600">{order.total.toLocaleString()}₫</span></p>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-gradient-to-br from-slate-100 to-slate-200 rounded-full flex items-center justify-center mx-auto mb-4">
                            <span className="text-2xl">📦</span>
                        </div>
                        <p className="text-slate-500 text-lg font-medium">Bạn chưa có đơn hàng nào.</p>
                        <p className="text-slate-400 text-sm mt-1">Hãy mua sắm để có đơn hàng đầu tiên</p>
                    </div>
                )}
            </div>

            {/* Modal chi tiết đơn hàng */}
            {showOrderDetail && selectedOrder && (
                <OrderDetailModal order={selectedOrder} onClose={handleCloseDetail} />
            )}
        </div>
    );
};

// Component Modal chi tiết đơn hàng
const OrderDetailModal = ({ order, onClose }) => {
    // Lấy thông tin user từ localStorage
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    
    // Lấy địa chỉ giao hàng từ đơn hàng cụ thể
    const getDeliveryAddress = () => {
        // Nếu đơn hàng có thông tin địa chỉ riêng
        if (order.deliveryAddress) {
            return order.deliveryAddress;
        }
        
        // Nếu đơn hàng có shippingAddress
        if (order.shippingAddress) {
            return order.shippingAddress;
        }
        
        // Nếu đơn hàng có address
        if (order.address) {
            return order.address;
        }
        
        // Fallback về địa chỉ mặc định của user
        const defaultAddress = user.addresses?.find(addr => addr.isDefault) || user.addresses?.[0];
        return defaultAddress ? defaultAddress.address : 'Chưa có địa chỉ giao hàng';
    };
    
    // Lấy thông tin người nhận từ đơn hàng
    const getRecipientInfo = () => {
        // ✅ Ưu tiên thông tin từ đơn hàng (thông tin checkout)
        if (order.recipientName) {
            return {
                name: order.recipientName,
                phone: order.recipientPhone || 'Chưa có thông tin',
                email: order.recipientEmail || 'Chưa có thông tin'
            };
        }
        
        // Fallback về thông tin user (chỉ khi đơn hàng cũ không có thông tin)
        return {
            name: user.name || 'Chưa có thông tin',
            phone: user.phone || 'Chưa có thông tin',
            email: user.email || 'Chưa có thông tin'
        };
    };
    
    const deliveryAddress = getDeliveryAddress();
    const recipientInfo = getRecipientInfo();

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60 backdrop-blur-sm p-4">
            <div className="w-full max-w-2xl max-h-[85vh] overflow-y-auto rounded-2xl bg-white shadow-2xl my-8">
                {/* Header */}
                <div className="sticky top-0 bg-white border-b border-slate-200 px-6 py-6 rounded-t-2xl z-10">
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="text-2xl font-bold text-slate-800 mb-1">Chi tiết đơn hàng</h3>
                            <p className="text-sm text-slate-500">Mã đơn hàng: #{order.orderId}</p>
                        </div>
                        <button 
                            onClick={onClose}
                            className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center hover:bg-slate-200 transition-colors"
                        >
                            <span className="text-slate-600 text-lg">✕</span>
                        </button>
                    </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                    {/* Thông tin đơn hàng */}
                    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-5">
                        <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2 text-lg">
                            <span>📋</span>
                            Thông tin đơn hàng
                        </h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <p className="text-slate-600 mb-1">Mã đơn hàng:</p>
                                <p className="font-semibold text-slate-800 text-base">#{order.orderId}</p>
                            </div>
                            <div>
                                <p className="text-slate-600 mb-1">Ngày đặt:</p>
                                <p className="font-semibold text-slate-800 text-base">{order.date}</p>
                            </div>
                            <div>
                                <p className="text-slate-600 mb-1">Trạng thái:</p>
                                <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
                                    order.status === 'Đã giao' 
                                        ? 'bg-green-100 text-green-700' 
                                        : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                    {order.status}
                                </span>
                            </div>
                            <div>
                                <p className="text-slate-600 mb-1">Tổng tiền:</p>
                                <p className="font-semibold text-orange-600 text-lg">{order.total.toLocaleString()}₫</p>
                            </div>
                        </div>
                    </div>

                    {/* Danh sách sản phẩm */}
                    <div>
                        <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2 text-lg">
                            <span>🛍️</span>
                            Sản phẩm đã mua
                        </h4>
                        <div className="space-y-4">
                            {order.products.map((product, index) => (
                                <div key={index} className="flex items-center gap-4 p-5 bg-slate-50 rounded-xl border border-slate-200">
                                    <div className="w-20 h-20 bg-gradient-to-br from-orange-100 to-orange-200 rounded-lg flex items-center justify-center flex-shrink-0 overflow-hidden">
                                        {product.image ? (
                                            <img 
                                                src={product.image} 
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                    e.target.nextSibling.style.display = 'flex';
                                                }}
                                            />
                                        ) : null}
                                        <div className="w-full h-full flex items-center justify-center text-2xl" style={{ display: product.image ? 'none' : 'flex' }}>
                                            {product.category === 'laptop' ? '💻' : 
                                             product.category === 'phone' ? '📱' : 
                                             product.category === 'tablet' ? '📱' : 
                                             product.category === 'accessory' ? '🎧' : '📦'}
                                        </div>
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <h5 className="font-semibold text-slate-800 text-base mb-1">{product.name}</h5>
                                        <p className="text-sm text-slate-500 mb-1">Số lượng: {product.quantity}</p>
                                        {product.specs && (
                                            <p className="text-xs text-slate-400">Cấu hình: {product.specs}</p>
                                        )}
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="font-semibold text-slate-800 text-base">{(product.price * product.quantity).toLocaleString()}₫</p>
                                        <p className="text-sm text-slate-500">{product.price.toLocaleString()}₫/sản phẩm</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Thông tin giao hàng */}
                    <div className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-5">
                        <h4 className="font-semibold text-slate-800 mb-4 flex items-center gap-2 text-lg">
                            <span>🚚</span>
                            Thông tin giao hàng
                        </h4>
                        <div className="space-y-3 text-sm">
                            <div>
                                <p className="text-slate-600 mb-1">Địa chỉ giao hàng:</p>
                                <p className="font-semibold text-slate-800 text-base">
                                    {deliveryAddress}
                                </p>
                            </div>
                            <div>
                                <p className="text-slate-600 mb-1">Người nhận:</p>
                                <p className="font-semibold text-slate-800 text-base">{recipientInfo.name}</p>
                            </div>
                            <div>
                                <p className="text-slate-600 mb-1">Số điện thoại:</p>
                                <p className="font-semibold text-slate-800 text-base">{recipientInfo.phone}</p>
                            </div>
                            {recipientInfo.email && recipientInfo.email !== 'Chưa có thông tin' && (
                                <div>
                                    <p className="text-slate-600 mb-1">Email:</p>
                                    <p className="font-semibold text-slate-800 text-base">{recipientInfo.email}</p>
                                </div>
                            )}
                            <div>
                                <p className="text-slate-600 mb-1">Phương thức thanh toán:</p>
                                <p className="font-semibold text-slate-800 text-base">
                                    {order.paymentMethod || 'Thanh toán khi nhận hàng (COD)'}
                                </p>
                            </div>
                            {order.note && (
                                <div>
                                    <p className="text-slate-600 mb-1">Ghi chú:</p>
                                    <p className="font-semibold text-slate-800 text-base italic">"{order.note}"</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Tổng kết */}
                    <div className="border-t border-slate-200 pt-6">
                        <div className="flex justify-between items-center">
                            <span className="text-lg font-semibold text-slate-800">Tổng cộng:</span>
                            <span className="text-2xl font-bold text-orange-600">{order.total.toLocaleString()}₫</span>
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div className="sticky bottom-0 bg-white border-t border-slate-200 px-6 py-6 rounded-b-2xl">
                    <div className="flex justify-end gap-4">
                        <button 
                            onClick={onClose}
                            className="px-8 py-3 border border-slate-300 text-slate-700 rounded-xl hover:bg-slate-50 transition-colors font-semibold"
                        >
                            Đóng
                        </button>
                        <button 
                            className="px-8 py-3 bg-gradient-to-r from-[#ff6c2f] to-[#ff8c42] text-white rounded-xl hover:from-[#ff8c42] hover:to-[#ff6c2f] transition-all font-semibold"
                        >
                            In hóa đơn
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Password Tab ---
const PasswordTab = ({ passwordForm, setPasswordForm, handlePasswordSubmit, passwordMessage, saving }) => {
    const handleInputChange = (e) => setPasswordForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    return (
        <div>
            <h2 className={cardTitleClasses}>Đổi Mật Khẩu</h2>
            <div className="bg-white rounded-2xl border-2 border-slate-100 p-8 shadow-lg mx-auto max-w-lg">
                <div className="mb-6">
                    <h3 className="text-xl font-bold text-slate-800 mb-2 flex items-center gap-3">
                        <div className="w-8 h-8 bg-gradient-to-br from-[#ff6c2f] to-[#ff8c42] rounded-full flex items-center justify-center">
                            <span className="text-white text-sm">🔒</span>
                        </div>
                        Đổi mật khẩu
                    </h3>
                    <p className="text-slate-600 text-sm">Cập nhật mật khẩu để bảo vệ tài khoản của bạn</p>
                </div>
                
                <form onSubmit={handlePasswordSubmit} className="space-y-6">
                    <div className="space-y-3">
                        <label htmlFor="oldPassword" className="block text-sm font-semibold text-slate-700 flex items-center">
                            <span className="w-2 h-2 bg-[#ff6c2f] rounded-full mr-2"></span>
                            Mật khẩu hiện tại <span className="text-red-500 ml-1">*</span>
                        </label>
                        <PasswordInput 
                            id="oldPassword"
                            name="old" 
                            value={passwordForm.old} 
                            onChange={handleInputChange} 
                            placeholder="Nhập mật khẩu hiện tại" 
                        />
                    </div>
                    
                    <div className="space-y-3">
                        <label htmlFor="newPassword" className="block text-sm font-semibold text-slate-700 flex items-center">
                            <span className="w-2 h-2 bg-[#ff6c2f] rounded-full mr-2"></span>
                            Mật khẩu mới <span className="text-red-500 ml-1">*</span>
                        </label>
                        <PasswordInput 
                            id="newPassword"
                            name="new" 
                            value={passwordForm.new} 
                            onChange={handleInputChange} 
                            placeholder="Nhập mật khẩu mới" 
                        />
                <PasswordStrengthMeter password={passwordForm.new} />
                    </div>
                    
                    <div className="space-y-3">
                        <label htmlFor="confirmPassword" className="block text-sm font-semibold text-slate-700 flex items-center">
                            <span className="w-2 h-2 bg-[#ff6c2f] rounded-full mr-2"></span>
                            Xác nhận mật khẩu mới <span className="text-red-500 ml-1">*</span>
                        </label>
                        <PasswordInput 
                            id="confirmPassword"
                            name="confirm" 
                            value={passwordForm.confirm} 
                            onChange={handleInputChange} 
                            placeholder="Nhập lại mật khẩu mới" 
                        />
                    </div>

                {passwordMessage.text && <FormMessage type={passwordMessage.type} message={passwordMessage.text} />}

                    <div className="flex justify-center pt-6 border-t border-slate-200">
                        <button 
                            type="submit" 
                            className="flex min-w-[180px] items-center justify-center rounded-xl bg-gradient-to-r from-[#ff6c2f] to-[#ff8c42] px-8 py-3.5 font-bold text-white shadow-lg transition-all hover:from-[#ff8c42] hover:to-[#ff6c2f] hover:shadow-xl disabled:opacity-60 transform hover:scale-105" 
                            disabled={saving}
                        >
                            {saving ? (
                                <>
                                    <FaSpinner className="animate-spin mr-2" />
                                    Đang lưu...
                                </>
                            ) : (
                                <>
                                    <span className="mr-2">🔒</span>
                                    Lưu mật khẩu mới
                                </>
                            )}
                    </button>
                </div>
            </form>
            </div>
        </div>
    );
};

// --- CÁC COMPONENT HELPER MỚI CHO PHẦN MẬT KHẨU ---
const PasswordInput = ({ id, name, value, onChange, placeholder }) => {
    const [show, setShow] = useState(false);
    
    // Xác định autocomplete value dựa trên name
    const getAutocompleteValue = () => {
        switch (name) {
            case 'old':
                return 'current-password';
            case 'new':
            case 'confirm':
                return 'new-password';
            default:
                return 'off';
        }
    };
    
    return (
        <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400"> <FaLock /> </span>
            <input 
                id={id}
                type={show ? "text" : "password"} 
                name={name} 
                value={value} 
                onChange={onChange} 
                placeholder={placeholder} 
                className={`${formInputClasses} pl-12`}
                autoComplete={getAutocompleteValue()}
                required
            />
            <button type="button" onClick={() => setShow(!show)} className="absolute inset-y-0 right-0 flex items-center pr-4 text-slate-400 hover:text-slate-600">
                {show ? <FaEyeSlash /> : <FaEye />}
            </button>
        </div>
    );
};

const PasswordStrengthMeter = ({ password }) => {
    const checkStrength = () => {
        let score = 0;
        if (password.length > 8) score++;
        if (password.match(/[a-z]/) && password.match(/[A-Z]/)) score++;
        if (password.match(/[0-9]/)) score++;
        if (password.match(/[^a-zA-Z0-9]/)) score++;
        return score;
    };
    const strength = checkStrength();
    const levels = [
        { label: 'Rất yếu', color: 'bg-red-500', width: '25%' },
        { label: 'Yếu', color: 'bg-orange-500', width: '50%' },
        { label: 'Trung bình', color: 'bg-yellow-500', width: '75%' },
        { label: 'Mạnh', color: 'bg-green-500', width: '100%' },
    ];
    if (!password) return null;

    return (
        <div className="space-y-2">
            <div className="h-2 w-full rounded-full bg-slate-200">
                <div className={`h-full rounded-full transition-all ${levels[strength-1]?.color || 'bg-red-500'}`} style={{ width: levels[strength-1]?.width || '10%' }}></div>
            </div>
            <p className="text-right text-xs font-semibold" style={{ color: (levels[strength-1]?.color || 'bg-red-500').replace('bg-', '').replace('-500', '') }}>
                Độ mạnh: {levels[strength-1]?.label || 'Rất yếu'}
            </p>
        </div>
    );
};

const FormMessage = ({ type, message }) => (
    <div className={`flex items-center gap-3 rounded-lg p-3 text-sm font-medium ${type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
        {type === 'success' ? <FaCheckCircle /> : <FaExclamationCircle />}
        <span>{message}</span>
    </div>
);


export default AccountPage;

