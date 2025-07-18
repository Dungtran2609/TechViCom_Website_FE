import React, { useEffect, useState } from "react";
import { getUser, updateUser } from "../api";
import { useNavigate } from "react-router-dom";

const USER_ID = 1; // Lấy từ localStorage hoặc context nếu có nhiều user

const REQUIRED_FIELDS = [
  { name: "name", label: "Họ và tên" },
  { name: "birthday", label: "Ngày sinh" },
  { name: "gender", label: "Giới tính" },
  { name: "avatar", label: "Ảnh đại diện" },
  { name: "addresses", label: "Địa chỉ" }
];

export default function UpdateProfilePage() {
  const [user, setUser] = useState(null);
  const [form, setForm] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    getUser(USER_ID)
      .then(u => {
        setUser(u);
        setForm({
          name: u.name || "",
          birthday: u.birthday || "",
          gender: u.gender || "Nam",
          avatar: u.avatar || "/src/image/avatar-default.png",
          addresses: u.addresses && u.addresses.length > 0 ? u.addresses : [{ address: "", isDefault: true }]
        });
        setLoading(false);
      })
      .catch(() => {
        setError("Không lấy được thông tin người dùng");
        setLoading(false);
      });
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };
  const handleAddressChange = (idx, value) => {
    const newAddresses = form.addresses.map((a, i) => i === idx ? { ...a, address: value } : a);
    setForm({ ...form, addresses: newAddresses });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      await updateUser(USER_ID, form);
      setSaving(false);
      navigate("/account");
    } catch {
      setError("Cập nhật thất bại");
      setSaving(false);
    }
  };

  useEffect(() => {
    if (!loading && !error && user) {
      const missing = REQUIRED_FIELDS.filter(f => {
        if (f.name === "addresses") return !user.addresses || user.addresses.length === 0 || !user.addresses[0].address;
        return !user[f.name];
      });
      if (missing.length === 0) {
        navigate("/account");
      }
    }
  }, [loading, error, user, navigate]);
  if (!user) return null;
  // Xác định trường còn thiếu
  const missingFields = REQUIRED_FIELDS.filter(f => {
    if (f.name === "addresses") return !user.addresses || user.addresses.length === 0 || !user.addresses[0].address;
    return !user[f.name];
  });

  return (
    <div style={{ maxWidth: 480, margin: "60px auto", background: "#fff", borderRadius: 12, boxShadow: '0 8px 40px rgba(0,0,0,0.10)', padding: 32 }}>
      <h2 style={{ textAlign: 'center', marginBottom: 24 }}>Cập nhật thông tin tài khoản</h2>
      <form onSubmit={handleSubmit}>
        {missingFields.map(f => {
          if (f.name === "gender") {
            return (
              <div key={f.name} style={{ marginBottom: 18 }}>
                <label style={{ fontWeight: 600 }}>Giới tính</label>
                <select name="gender" value={form.gender} onChange={handleChange} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #eee', fontSize: 16 }}>
                  <option value="Nam">Nam</option>
                  <option value="Nữ">Nữ</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
            );
          }
          if (f.name === "avatar") {
            return (
              <div key={f.name} style={{ marginBottom: 18 }}>
                <label style={{ fontWeight: 600 }}>Ảnh đại diện</label>
                <input type="file" accept="image/*" style={{ marginTop: 8 }} onChange={e => {
                  if (e.target.files && e.target.files[0]) {
                    const fileName = e.target.files[0].name;
                    setForm(f => ({ ...f, avatar: `/images/avatars/${fileName}` }));
                  }
                }} />
                <div style={{ marginTop: 8 }}>
                  <img src={form.avatar} alt="avatar" style={{ width: 80, height: 80, borderRadius: '50%', border: '2px solid #ff9800', marginTop: 8 }} />
                </div>
              </div>
            );
          }
          if (f.name === "addresses") {
            return (
              <div key={f.name} style={{ marginBottom: 18 }}>
                <label style={{ fontWeight: 600 }}>Địa chỉ</label>
                <input value={form.addresses[0].address} onChange={e => handleAddressChange(0, e.target.value)} placeholder="Nhập địa chỉ" style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #eee', fontSize: 16 }} />
              </div>
            );
          }
          return (
            <div key={f.name} style={{ marginBottom: 18 }}>
              <label style={{ fontWeight: 600 }}>{f.label}</label>
              <input name={f.name} value={form[f.name]} onChange={handleChange} placeholder={f.label} style={{ width: '100%', padding: 10, borderRadius: 8, border: '1.5px solid #eee', fontSize: 16 }} />
            </div>
          );
        })}
        <button type="submit" disabled={saving} style={{ width: '100%', padding: '12px 0', background: '#ff9800', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 700, fontSize: 17, cursor: 'pointer', marginTop: 10 }}>
          {saving ? 'Đang lưu...' : 'Lưu thông tin'}
        </button>
      </form>
    </div>
  );
} 