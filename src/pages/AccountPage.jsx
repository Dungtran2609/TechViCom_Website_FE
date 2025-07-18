import React, { useState, useEffect, useRef } from "react";
import { getUser, updateUser, getOrders } from "../api";

const getCurrentUserId = () => {
  const user = JSON.parse(localStorage.getItem('user'));
  return user?.id;
};

const AccountPage = () => {
  const USER_ID = getCurrentUserId();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [form, setForm] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState({ old: "", new: "", confirm: "" });
  const [addresses, setAddresses] = useState([]);
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [avatarHover, setAvatarHover] = useState(false);
  const [avatarFile, setAvatarFile] = useState(null);
  const [showAvatarPopup, setShowAvatarPopup] = useState(false);
  const [pendingAvatar, setPendingAvatar] = useState(null);
  const fileInputRef = useRef();

  useEffect(() => {
    if (!USER_ID) {
      setError("Không tìm thấy thông tin người dùng đăng nhập!");
      setLoading(false);
      return;
    }
    setLoading(true);
    getUser(USER_ID)
      .then(u => {
        setUser(u);
        setForm({ ...u });
        setAddresses(u.addresses || []);
        setLoading(false);
      })
      .catch(() => {
        setError("Không lấy được thông tin người dùng");
        setLoading(false);
      });
  }, [USER_ID]);

  // Thay đổi thông tin cá nhân
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateUser(USER_ID, { ...form, addresses });
      setUser(updated);
      setEditMode(false);
      setSaving(false);
    } catch {
      setError("Cập nhật thất bại");
      setSaving(false);
    }
  };

  // Đổi mật khẩu (demo, không lưu vào db)
  const handlePasswordChange = (e) => {
    setPassword({ ...password, [e.target.name]: e.target.value });
  };
  const handlePasswordSubmit = (e) => {
    e.preventDefault();
    if (password.new !== password.confirm) {
      alert("Mật khẩu mới không khớp!");
      return;
    }
    alert("Đổi mật khẩu thành công!");
    setPassword({ old: "", new: "", confirm: "" });
  };

  // Địa chỉ
  const handleAddAddress = async (addr) => {
    const newAddresses = [...addresses, addr];
    setSaving(true);
    try {
      const updated = await updateUser(USER_ID, { addresses: newAddresses });
      setAddresses(updated.addresses);
      setUser(updated);
      setSaving(false);
    } catch {
      setError("Cập nhật địa chỉ thất bại");
      setSaving(false);
    }
  };
  const handleDeleteAddress = async (idx) => {
    const newAddresses = addresses.filter((_, i) => i !== idx);
    setSaving(true);
    try {
      const updated = await updateUser(USER_ID, { addresses: newAddresses });
      setAddresses(updated.addresses);
      setUser(updated);
      setSaving(false);
    } catch {
      setError("Cập nhật địa chỉ thất bại");
      setSaving(false);
    }
  };
  const handleSetDefault = async (idx) => {
    const newAddresses = addresses.map((a, i) => ({ ...a, isDefault: i === idx }));
    setSaving(true);
    try {
      const updated = await updateUser(USER_ID, { addresses: newAddresses });
      setAddresses(updated.addresses);
      setUser(updated);
      setSaving(false);
    } catch {
      setError("Cập nhật địa chỉ thất bại");
      setSaving(false);
    }
  };

  if (loading) return <div style={{ textAlign: 'center', marginTop: 80 }}>Đang tải dữ liệu...</div>;
  if (error) return <div style={{ color: 'red', textAlign: 'center', marginTop: 80 }}>{error}</div>;
  if (!user) return null;

  return (
    <div className="account-page" style={{ maxWidth: 1000, margin: "60px auto 40px auto", background: "#fff", borderRadius: 8, padding: 32, display: 'flex', gap: 32, minHeight: 500, boxShadow: '0 8px 40px rgba(0,0,0,0.10)' }}>
      {/* Cột trái: Avatar + menu chức năng */}
      <div style={{ width: 260, borderRight: '1px solid #eee', paddingRight: 32, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 24 }}>
        <div
          style={{ position: 'relative', width: 100, height: 100, marginBottom: 8 }}
          onMouseEnter={() => setAvatarHover(true)}
          onMouseLeave={() => setAvatarHover(false)}
        >
          <img src={user.avatar} alt="avatar" style={{ width: 100, height: 100, borderRadius: "50%", objectFit: "cover", border: '3px solid #ff9800', boxShadow: '0 2px 12px rgba(255,152,0,0.10)' }} />
          {avatarHover && (
            <button
              style={{
                position: 'absolute', left: 0, top: 0, width: 100, height: 100, background: 'rgba(0,0,0,0.45)', color: '#fff', border: 'none', borderRadius: '50%', cursor: 'pointer', fontWeight: 600, fontSize: 16, display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2
              }}
              onClick={() => fileInputRef.current.click()}
              type="button"
            >Chỉnh sửa</button>
          )}
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: 'none' }}
            onChange={e => {
              const file = e.target.files[0];
              if (file) {
                const reader = new FileReader();
                reader.onload = ev => {
                  setPendingAvatar(ev.target.result);
                  setShowAvatarPopup(true);
                };
                reader.readAsDataURL(file);
              }
            }}
          />
        </div>
        {showAvatarPopup && (
          <div style={{
            position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.35)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center'
          }}>
            <div style={{ background: '#fff', borderRadius: 16, padding: 32, boxShadow: '0 8px 40px rgba(0,0,0,0.18)', minWidth: 320, textAlign: 'center', position: 'relative' }}>
              <h3 style={{ marginBottom: 18, fontSize: 20, fontWeight: 700 }}>Cập nhật ảnh đại diện</h3>
              <img src={pendingAvatar} alt="avatar-preview" style={{ width: 120, height: 120, borderRadius: '50%', border: '2px solid #ff9800', marginBottom: 18, objectFit: 'cover' }} />
              <div style={{ display: 'flex', gap: 16, justifyContent: 'center', marginTop: 18 }}>
                <button
                  style={{ padding: '10px 32px', background: '#ff9800', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px rgba(255,152,0,0.10)' }}
                  onClick={async () => {
                    setShowAvatarPopup(false);
                    setSaving(true);
                    try {
                      const updated = await updateUser(USER_ID, { ...user, avatar: pendingAvatar });
                      setUser(updated);
                      setForm(f => ({ ...f, avatar: pendingAvatar }));
                      localStorage.setItem('user', JSON.stringify({ ...user, avatar: pendingAvatar }));
                      setSaving(false);
                    } catch {
                      setError('Cập nhật avatar thất bại');
                      setSaving(false);
                    }
                  }}
                >Lưu ảnh đại diện</button>
                <button
                  style={{ padding: '10px 32px', background: '#eee', color: '#222', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 16, cursor: 'pointer', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
                  onClick={() => setShowAvatarPopup(false)}
                >Hủy</button>
              </div>
            </div>
          </div>
        )}
        <div style={{ fontWeight: 600, fontSize: 18, marginBottom: 4 }}>{user.name}</div>
        <div style={{ color: '#888', fontSize: 14, marginBottom: 16 }}>{user.email}</div>
        <div style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: 12 }}>
          <button onClick={() => setActiveTab('profile')} style={tabBtnStyle(activeTab === 'profile')}>Thông tin cá nhân</button>
          <button onClick={() => setActiveTab('address')} style={tabBtnStyle(activeTab === 'address')}>Địa chỉ</button>
          <button onClick={() => setActiveTab('orders')} style={tabBtnStyle(activeTab === 'orders')}>Lịch sử mua hàng</button>
          <button onClick={() => setActiveTab('password')} style={tabBtnStyle(activeTab === 'password')}>Đổi mật khẩu</button>
        </div>
      </div>
      {/* Cột phải: Nội dung động */}
      <div style={{ flex: 1, minHeight: 400 }}>
        {activeTab === 'profile' && (
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <h3 style={{ textAlign: 'center', marginBottom: 28, fontSize: 22, fontWeight: 700, color: '#222' }}>Thông tin cá nhân</h3>
            <div style={{
              background: '#fff',
              border: '1.5px solid #f3f3f3',
              borderRadius: 16,
              boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
              padding: '32px 16px 24px 16px',
              marginBottom: 18
            }}>
              <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 12px' }}>
                <tbody>
                  <tr>
                    <td style={{ fontWeight: 700, color: '#222', textAlign: 'right', width: 140, paddingRight: 18 }}>Tên người dùng</td>
                    <td style={{ color: '#374151', fontSize: 16 }}>{user.name}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700, color: '#222', textAlign: 'right', width: 140, paddingRight: 18 }}>Email</td>
                    <td style={{ color: '#374151', fontSize: 16 }}>{user.email}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700, color: '#222', textAlign: 'right', width: 140, paddingRight: 18 }}>Số điện thoại</td>
                    <td style={{ color: '#374151', fontSize: 16 }}>{user.phone}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700, color: '#222', textAlign: 'right', width: 140, paddingRight: 18 }}>Ngày sinh</td>
                    <td style={{ color: '#374151', fontSize: 16 }}>{user.birthday}</td>
                  </tr>
                  <tr>
                    <td style={{ fontWeight: 700, color: '#222', textAlign: 'right', width: 140, paddingRight: 18 }}>Giới tính</td>
                    <td style={{ color: '#374151', fontSize: 16 }}>{user.gender}</td>
                  </tr>
                </tbody>
              </table>
              {!editMode && (
                <div style={{ textAlign: 'center', marginTop: 28 }}>
                  <button onClick={() => setEditMode(true)} style={{
                    padding: '10px 32px',
                    background: '#ff9800',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 16,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(255,152,0,0.10)',
                    transition: 'background 0.2s'
                  }}>Chỉnh sửa</button>
                </div>
              )}
            </div>
            {editMode && (
              <div style={{
                background: '#fff',
                border: '1.5px solid #f3f3f3',
                borderRadius: 16,
                boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
                padding: '32px 32px 24px 32px',
                marginBottom: 18
              }}>
                <input name="name" value={form.name} onChange={handleChange} placeholder="Tên người dùng" style={{ width: "100%", marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #eee', fontSize: 16 }} />
                <input name="email" value={form.email} onChange={handleChange} placeholder="Email" style={{ width: "100%", marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #eee', fontSize: 16 }} />
                <input name="phone" value={form.phone} onChange={handleChange} placeholder="Số điện thoại" style={{ width: "100%", marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #eee', fontSize: 16 }} />
                <input name="birthday" value={form.birthday} onChange={handleChange} placeholder="Ngày sinh" style={{ width: "100%", marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #eee', fontSize: 16 }} />
                <select name="gender" value={form.gender} onChange={handleChange} style={{ width: "100%", marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #eee', fontSize: 16 }}>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
                <input name="avatar" value={form.avatar} onChange={handleChange} placeholder="URL ảnh đại diện" style={{ width: "100%", marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #eee', fontSize: 16 }} />
                <div style={{ textAlign: 'center', marginBottom: 12 }}>
                  <img src={form.avatar} alt="avatar-preview" style={{ width: 80, height: 80, borderRadius: '50%', border: '2px solid #ff9800', marginTop: 8 }} />
                </div>
                <div style={{ textAlign: 'center', marginTop: 18 }}>
                  <button onClick={handleSave} style={{
                    padding: '10px 32px',
                    background: '#ff9800',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 16,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(255,152,0,0.10)',
                    marginRight: 10,
                    transition: 'background 0.2s'
                  }}>Lưu</button>
                  <button onClick={() => setEditMode(false)} style={{
                    padding: '10px 32px',
                    background: '#eee',
                    color: '#222',
                    border: 'none',
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 16,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                    transition: 'background 0.2s'
                  }}>Hủy</button>
                </div>
              </div>
            )}
          </div>
        )}
        {activeTab === 'address' && (
          <div style={{ maxWidth: 480, margin: '0 auto' }}>
            <h3 style={{ textAlign: 'center', marginBottom: 28, fontSize: 22, fontWeight: 700, color: '#222' }}>Địa chỉ</h3>
            <div style={{
              background: '#fff',
              border: '1.5px solid #f3f3f3',
              borderRadius: 16,
              boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
              padding: '32px 16px 24px 16px',
              marginBottom: 18
            }}>
              <ul style={{ marginBottom: 18 }}>
                {addresses.map((addr, idx) => (
                  <li key={idx} style={{ marginBottom: 16, display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
                    <span style={{ color: '#374151', fontSize: 16 }}>
                      {addr.address} {addr.isDefault && <span style={{ color: "green", fontWeight: 600, marginLeft: 8 }}>(Mặc định)</span>}
                    </span>
                    <span style={{ display: 'flex', gap: 8 }}>
                      <button onClick={() => handleSetDefault(idx)} style={{
                        padding: '6px 16px',
                        background: '#fff',
                        color: '#ff9800',
                        border: '2px solid #ff9800',
                        borderRadius: 7,
                        fontWeight: 600,
                        fontSize: 15,
                        cursor: 'pointer',
                        transition: 'background 0.2s',
                        marginRight: 2
                      }}>Đặt mặc định</button>
                      <button onClick={() => handleDeleteAddress(idx)} style={{
                        padding: '6px 16px',
                        background: '#fff',
                        color: '#e53935',
                        border: '2px solid #e53935',
                        borderRadius: 7,
                        fontWeight: 600,
                        fontSize: 15,
                        cursor: 'pointer',
                        transition: 'background 0.2s'
                      }}>Xóa</button>
                    </span>
                  </li>
                ))}
              </ul>
              <AddAddressForm onAdd={handleAddAddress} />
            </div>
          </div>
        )}
        {activeTab === 'orders' && (
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <h3 style={{ textAlign: 'center', marginBottom: 28, fontSize: 22, fontWeight: 700, color: '#222' }}>Lịch sử mua hàng</h3>
            {user.orders && user.orders.length > 0 ? (
              user.orders.map(order => (
                <div key={order.orderId} style={{ border: '1px solid #eee', borderRadius: 12, marginBottom: 18, padding: 18, background: '#fafafa' }}>
                  <div style={{ fontWeight: 600, marginBottom: 6 }}>Mã đơn: {order.orderId}</div>
                  <div>Ngày: {order.date}</div>
                  <div>Tổng tiền: <span style={{ color: '#e65100', fontWeight: 600 }}>{order.total.toLocaleString()}₫</span></div>
                  <div>Trạng thái: <span style={{ color: order.status === 'Đã giao' ? 'green' : '#ff9800', fontWeight: 600 }}>{order.status}</span></div>
                  <div style={{ marginTop: 8 }}>
                    <b>Sản phẩm:</b>
                    <ul style={{ margin: 0, paddingLeft: 18 }}>
                      {order.products.map((p, idx) => (
                        <li key={idx}>{p.name} x{p.quantity} - {p.price.toLocaleString()}₫</li>
                      ))}
                    </ul>
                  </div>
            </div>
              ))
            ) : (
              <div style={{ textAlign: 'center', color: '#888', marginTop: 32 }}>Chưa có đơn hàng nào.</div>
            )}
          </div>
        )}
        {activeTab === 'password' && (
          <div style={{ maxWidth: 480, margin: '0 auto' }}>
            <h3 style={{ textAlign: 'center', marginBottom: 28, fontSize: 22, fontWeight: 700, color: '#222' }}>Đổi mật khẩu</h3>
            <div style={{
              background: '#fff',
              border: '1.5px solid #f3f3f3',
              borderRadius: 16,
              boxShadow: '0 4px 24px rgba(0,0,0,0.06)',
              padding: '32px 16px 24px 16px',
              marginBottom: 18
            }}>
              <form onSubmit={handlePasswordSubmit}>
                <input type={showPassword ? "text" : "password"} name="old" value={password.old} onChange={handlePasswordChange} placeholder="Mật khẩu cũ" style={{ width: "100%", marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #eee', fontSize: 16 }} />
                <input type={showPassword ? "text" : "password"} name="new" value={password.new} onChange={handlePasswordChange} placeholder="Mật khẩu mới" style={{ width: "100%", marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #eee', fontSize: 16 }} />
                <input type={showPassword ? "text" : "password"} name="confirm" value={password.confirm} onChange={handlePasswordChange} placeholder="Xác nhận mật khẩu mới" style={{ width: "100%", marginBottom: 12, padding: 10, borderRadius: 8, border: '1px solid #eee', fontSize: 16 }} />
                <label style={{ display: "block", marginBottom: 12, fontSize: 15 }}>
                  <input type="checkbox" checked={showPassword} onChange={() => setShowPassword(!showPassword)} style={{ marginRight: 6 }} /> Hiện mật khẩu
                </label>
                <div style={{ textAlign: 'center', marginTop: 18 }}>
                  <button type="submit" style={{
                    padding: '10px 32px',
                    background: '#ff9800',
                    color: '#fff',
                    border: 'none',
                    borderRadius: 8,
                    fontWeight: 700,
                    fontSize: 16,
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(255,152,0,0.10)',
                    transition: 'background 0.2s'
                  }}>Đổi mật khẩu</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

// Style cho button tab
function tabBtnStyle(active) {
  return {
    width: '100%',
    padding: '12px 0',
    borderRadius: 8,
    border: active ? '2px solid #ff9800' : '2px solid #eee',
    background: active ? '#fff7ed' : '#fff',
    color: active ? '#ff9800' : '#222',
    fontWeight: 600,
    fontSize: 16,
    cursor: 'pointer',
    transition: 'all 0.2s',
    outline: 'none',
  };
}

// Form thêm địa chỉ mới
const AddAddressForm = ({ onAdd }) => {
  const [form, setForm] = useState({ address: "", isDefault: false });
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.type === "checkbox" ? e.target.checked : e.target.value });
  };
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.address.trim()) return;
    onAdd(form);
    setForm({ address: "", isDefault: false });
  };
  return (
    <form onSubmit={handleSubmit} style={{ marginTop: 18 }}>
      <div style={{ marginBottom: 10 }}>
        <label style={{ fontSize: 15, color: '#444', fontWeight: 600, display: 'block', marginBottom: 6 }}>Địa chỉ mới</label>
        <input name="address" value={form.address} onChange={handleChange} placeholder="Nhập địa chỉ mới" style={{ width: '100%', padding: 12, borderRadius: 8, border: '1.5px solid #eee', fontSize: 15, marginBottom: 8 }} />
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <input type="checkbox" name="isDefault" checked={form.isDefault} onChange={handleChange} style={{ marginRight: 4 }} />
          <label style={{ fontSize: 15, color: '#444', userSelect: 'none' }}>Đặt làm mặc định</label>
        </div>
      </div>
      <button type="submit" style={{
        width: '100%',
        padding: '12px 0',
        background: '#fff',
        color: '#2962ff',
        border: '2px solid #2962ff',
        borderRadius: 8,
        fontWeight: 700,
        fontSize: 17,
        cursor: 'pointer',
        transition: 'background 0.2s, color 0.2s',
        marginTop: 6
      }}>Thêm địa chỉ</button>
    </form>
  );
};

export default AccountPage; 