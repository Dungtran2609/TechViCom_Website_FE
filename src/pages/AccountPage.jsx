import React, { useState, useEffect, useRef } from "react";
import { getUser, updateUser } from "../api";
import { FaUser, FaMapMarkerAlt, FaHistory, FaLock, FaCamera, FaSpinner, FaEye, FaEyeSlash, FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';

// ----- CÁC HÀM LOGIC CỦA BẠN ĐƯỢC GIỮ NGUYÊN -----
const getCurrentUserId = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.id;
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
  
  // State được chuyển vào các component con để quản lý riêng
  const [profileForm, setProfileForm] = useState(null);
  const [passwordForm, setPasswordForm] = useState({ old: "", new: "", confirm: "" });
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  useEffect(() => {
    if (!USER_ID) {
      setError("Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.");
      setLoading(false);
      return;
    }
    setLoading(true);
    getUser(USER_ID)
      .then(u => {
        setUser(u);
        setProfileForm({ ...u });
        setLoading(false);
      })
      .catch(() => {
        setError("Không thể tải thông tin người dùng. Vui lòng thử lại sau.");
        setLoading(false);
      });
  }, [USER_ID]);
  
  const handleProfileSave = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const updated = await updateUser(USER_ID, { ...profileForm });
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      window.dispatchEvent(new Event('userChanged'));
      return true; // Báo hiệu thành công để component con xử lý
    } catch {
      return false; // Báo hiệu thất bại
    } finally {
      setSaving(false);
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setPasswordMessage({ type: '', text: '' });
    if (!passwordForm.old || !passwordForm.new || !passwordForm.confirm) {
        setPasswordMessage({ type: 'error', text: 'Vui lòng nhập đầy đủ thông tin.' }); return;
    }
    if (passwordForm.old !== user.password) {
        setPasswordMessage({ type: 'error', text: 'Mật khẩu cũ không chính xác!' }); return;
    }
    if (passwordForm.new !== passwordForm.confirm) {
        setPasswordMessage({ type: 'error', text: 'Mật khẩu mới không khớp!' }); return;
    }
    if (passwordForm.new === user.password) {
        setPasswordMessage({ type: 'error', text: 'Mật khẩu mới không được trùng với mật khẩu cũ.' }); return;
    }
    setSaving(true);
    try {
      await updateUser(USER_ID, { password: passwordForm.new });
      // Cập nhật lại state user local sau khi đổi pass thành công
      setUser(prev => ({...prev, password: passwordForm.new}));
      setPasswordMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
      setPasswordForm({ old: "", new: "", confirm: "" });
    } catch (err) {
      setPasswordMessage({ type: 'error', text: 'Đã xảy ra lỗi. Vui lòng thử lại.' });
    } finally {
      setSaving(false);
    }
  };

  const handleAddressUpdate = async (newAddresses) => {
    setSaving(true);
    try {
      const updated = await updateUser(USER_ID, { addresses: newAddresses });
      setUser(updated);
    } finally {
      setSaving(false);
    }
  };
  
  const handleAvatarSave = async () => {
    setSaving(true);
    try {
      const updated = await updateUser(USER_ID, { avatar: pendingAvatar });
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      window.dispatchEvent(new Event('userChanged'));
      setShowAvatarPopup(false);
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="flex h-screen items-center justify-center text-lg font-semibold">Đang tải dữ liệu...</div>;
  if (error) return <div className="flex h-screen items-center justify-center text-lg font-semibold text-red-500">{error}</div>;
  if (!user) return null;

  return (
    <div className="min-h-screen bg-slate-100 pb-12 pt-28">
      <div className="mx-auto flex max-w-7xl flex-col gap-8 px-4 lg:flex-row">
        <AccountSidebar user={user} activeTab={activeTab} setActiveTab={setActiveTab} fileInputRef={fileInputRef}/>
        <main className="flex-1">
          <div className="rounded-2xl bg-white p-6 shadow-lg sm:p-8">
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
            <div className="sticky top-28 rounded-2xl bg-white p-6 text-center shadow-lg">
                <div className="group relative mx-auto mb-4 h-32 w-32 cursor-pointer" onClick={() => fileInputRef.current.click()}>
                    <img src={user.avatar || '/images/avatar-default.png'} alt="avatar" className="h-full w-full rounded-full border-4 border-white object-cover shadow-md transition-transform duration-300 group-hover:scale-105" />
                    <div className="absolute inset-0 flex items-center justify-center rounded-full bg-black bg-opacity-50 text-white opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                        <FaCamera size={32} />
                    </div>
                </div>
                <h2 className="truncate text-2xl font-bold text-slate-800">{user.name}</h2>
                <p className="mb-6 truncate text-sm text-slate-500">{user.email}</p>
                <nav className="w-full border-t border-slate-200 pt-6">
                    <ul className="space-y-2">
                        {navLinks.map(link => (
                            <li key={link.id}>
                                <button
                                    onClick={() => setActiveTab(link.id)}
                                    className={`flex w-full items-center gap-4 rounded-lg px-4 py-3.5 text-left font-semibold transition-all duration-200 ${
                                        activeTab === link.id
                                        ? 'bg-orange-500 text-white shadow-sm'
                                        : 'text-slate-600 hover:bg-slate-100 hover:text-orange-600'
                                    }`}
                                >
                                    <span className="text-xl">{link.icon}</span>
                                    <span>{link.label}</span>
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
                <form onSubmit={onSave} className="space-y-5">
                    <input name="name" value={form.name || ''} onChange={(e) => setForm({...form, name: e.target.value})} placeholder="Tên người dùng" className={formInputClasses} />
                    <input name="email" value={form.email || ''} onChange={(e) => setForm({...form, email: e.target.value})} placeholder="Email" className={formInputClasses} type="email" />
                    <input name="phone" value={form.phone || ''} onChange={(e) => setForm({...form, phone: e.target.value})} placeholder="Số điện thoại" className={formInputClasses} />
                    <input name="birthday" value={form.birthday || ''} onChange={(e) => setForm({...form, birthday: e.target.value})} placeholder="Ngày sinh (DD/MM/YYYY)" className={formInputClasses} />
                    <select name="gender" value={form.gender || ''} onChange={(e) => setForm({...form, gender: e.target.value})} className={formInputClasses}>
                        <option value="">Chọn giới tính</option>
                        <option value="Nam">Nam</option>
                        <option value="Nữ">Nữ</option>
                        <option value="Khác">Khác</option>
                    </select>
                    <div className="flex justify-center gap-4 pt-4">
                        <button type="submit" className="flex min-w-[150px] items-center justify-center rounded-lg bg-orange-500 px-8 py-3 font-bold text-white shadow-md transition-all hover:bg-orange-600 disabled:opacity-60" disabled={saving}>
                            {saving ? <FaSpinner className="animate-spin" /> : 'Lưu thay đổi'}
                        </button>
                        <button type="button" onClick={() => { setEditMode(false); setForm(user); }} className="rounded-lg bg-slate-200 px-8 py-3 font-bold text-slate-700 transition-all hover:bg-slate-300">Hủy</button>
                    </div>
                </form>
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
    const handleAdd = (addr) => onUpdate([...addresses, addr]);
    const handleDelete = (idx) => onUpdate(addresses.filter((_, i) => i !== idx));
    const handleSetDefault = (idx) => onUpdate(addresses.map((a, i) => ({ ...a, isDefault: i === idx })));
    return (
        <div>
            <h2 className={cardTitleClasses}>Địa Chỉ Của Bạn</h2>
            <div className="mb-8 space-y-4">
                {addresses.length > 0 ? addresses.map((addr, idx) => (
                    <div key={idx} className="flex flex-col items-start gap-4 rounded-xl border border-slate-200 p-5 transition-shadow hover:shadow-md sm:flex-row sm:items-center sm:justify-between">
                        <p className="flex-1 text-slate-700">
                            {addr.address}
                            {addr.isDefault && <span className="ml-3 rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-700">Mặc định</span>}
                        </p>
                        <div className="flex flex-shrink-0 gap-2">
                            <button onClick={() => handleSetDefault(idx)} className="rounded-md bg-slate-100 px-4 py-2 text-xs font-semibold text-slate-600 transition-all hover:bg-slate-200 disabled:cursor-not-allowed disabled:bg-transparent disabled:text-slate-400" disabled={addr.isDefault || saving}>Đặt mặc định</button>
                            <button onClick={() => handleDelete(idx)} className="rounded-md border border-red-500 bg-white px-4 py-2 text-xs font-semibold text-red-500 transition-all hover:bg-red-50" disabled={saving}>Xóa</button>
                        </div>
                    </div>
                )) : <p className="text-center text-slate-500">Bạn chưa có địa chỉ nào được lưu.</p>}
            </div>
            <AddAddressForm onAdd={handleAdd} saving={saving} />
        </div>
    );
};
const AddAddressForm = ({ onAdd, saving }) => {
    const [address, setAddress] = useState("");
    const handleSubmit = (e) => { e.preventDefault(); if (!address.trim()) return; onAdd({ address, isDefault: false }); setAddress(""); };
    return (
      <form onSubmit={handleSubmit} className="mt-8 border-t border-slate-200 pt-8">
        <h3 className="mb-3 text-lg font-semibold text-slate-700">Thêm địa chỉ mới</h3>
        <div className="flex flex-col gap-4 sm:flex-row">
            <input value={address} onChange={(e) => setAddress(e.target.value)} placeholder="Nhập địa chỉ đầy đủ của bạn..." className={`${formInputClasses} flex-1`} />
            <button type="submit" className="flex items-center justify-center rounded-lg bg-orange-500 px-6 py-3 font-semibold text-white shadow-sm transition-all hover:bg-orange-600 disabled:opacity-60" disabled={saving}>
                {saving ? <FaSpinner className="animate-spin" /> : 'Thêm'}
            </button>
        </div>
      </form>
    );
};

// --- Orders Tab ---
const OrdersTab = ({ orders }) => (
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
                            <div className={`rounded-full px-3 py-1 text-sm font-bold ${order.status === 'Đã giao' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}`}>
                                {order.status}
                            </div>
                        </div>
                        <div className="mb-4 space-y-3">
                            {order.products.map((p, idx) => (
                                <div key={idx} className="flex justify-between text-sm">
                                    <p className="text-slate-600">{p.name} <span className="text-slate-400">x{p.quantity}</span></p>
                                    <p className="font-medium text-slate-800">{p.price.toLocaleString()}₫</p>
                                </div>
                            ))}
                        </div>
                        <div className="border-t border-slate-200 pt-4 text-right">
                            <p className="text-lg font-bold text-slate-800">Tổng cộng: <span className="text-2xl text-orange-600">{order.total.toLocaleString()}₫</span></p>
                        </div>
                    </div>
                ))
            ) : (
                <p className="py-12 text-center text-slate-500">Bạn chưa có đơn hàng nào.</p>
            )}
        </div>
    </div>
);

// --- Password Tab ---
const PasswordTab = ({ passwordForm, setPasswordForm, handlePasswordSubmit, passwordMessage, saving }) => {
    const handleInputChange = (e) => setPasswordForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
    return (
        <div>
            <h2 className={cardTitleClasses}>Đổi Mật Khẩu</h2>
            <form onSubmit={handlePasswordSubmit} className="mx-auto max-w-lg space-y-5">
                <PasswordInput name="old" value={passwordForm.old} onChange={handleInputChange} placeholder="Mật khẩu hiện tại" />
                <PasswordInput name="new" value={passwordForm.new} onChange={handleInputChange} placeholder="Mật khẩu mới" />
                <PasswordStrengthMeter password={passwordForm.new} />
                <PasswordInput name="confirm" value={passwordForm.confirm} onChange={handleInputChange} placeholder="Xác nhận mật khẩu mới" />

                {passwordMessage.text && <FormMessage type={passwordMessage.type} message={passwordMessage.text} />}

                <div className="pt-4 text-center">
                    <button type="submit" className="flex min-w-[180px] items-center justify-center rounded-lg bg-orange-500 px-8 py-3 font-bold text-white shadow-md transition-all hover:bg-orange-600 disabled:opacity-60" disabled={saving}>
                        {saving ? <FaSpinner className="animate-spin" /> : 'Lưu mật khẩu mới'}
                    </button>
                </div>
            </form>
        </div>
    );
};

// --- CÁC COMPONENT HELPER MỚI CHO PHẦN MẬT KHẨU ---
const PasswordInput = ({ name, value, onChange, placeholder }) => {
    const [show, setShow] = useState(false);
    return (
        <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-slate-400"> <FaLock /> </span>
            <input type={show ? "text" : "password"} name={name} value={value} onChange={onChange} placeholder={placeholder} className={`${formInputClasses} pl-12`} />
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