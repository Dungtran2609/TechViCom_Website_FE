import React, { useEffect, useState, useCallback, useRef } from "react";
import { userAPI } from "../../api";
import { useNavigate } from "react-router-dom";
import { useNotificationActions } from "../../components/notificationHooks";
import { getProvinces, getDistrictsByProvince, getWardsByDistrict } from "../../data/addressData";


// Lấy user hiện tại từ localStorage
const getCurrentUser = () => {
  try {
    return JSON.parse(localStorage.getItem('user'));
  } catch {
    return null;
  }
};


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
 
  // State cho địa chỉ dropdown
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [loadingProvinces, setLoadingProvinces] = useState(true);
  const [loadingDistricts, setLoadingDistricts] = useState(false);
  const [loadingWards, setLoadingWards] = useState(false);
 
  // State cho địa chỉ form
  const [addressForm, setAddressForm] = useState({
    province: '',
    district: '',
    ward: '',
    specificAddress: ''
  });


  const navigate = useNavigate();
  const { success, error: showError } = useNotificationActions();
  const showErrorRef = useRef(showError);
  const navigateRef = useRef(navigate);


  // Cập nhật refs khi dependencies thay đổi
  useEffect(() => {
    showErrorRef.current = showError;
  }, [showError]);


  useEffect(() => {
    navigateRef.current = navigate;
  }, [navigate]);


  // Lấy user id từ localStorage
  const fetchUser = useCallback(async () => {
    // Reset state khi user thay đổi
    setUser(null);
    setForm({
      name: "",
      birthday: "",
      gender: "Nam",
      avatar: "/src/image/avatar-default.png",
      addresses: [{ address: "", isDefault: true }]
    });
    setError(null);
    setLoading(true);
   
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.id) {
      navigateRef.current('/login');
      return;
    }
    const USER_ID = currentUser.id;
    try {
      const u = await userAPI.getUser(USER_ID);
      setUser(u);
      setForm({
        name: u.name || "",
        birthday: u.birthday || "",
        gender: u.gender || "Nam",
        avatar: u.avatar || "/src/image/avatar-default.png",
        addresses: u.addresses && u.addresses.length > 0 ? u.addresses : [{ address: "", isDefault: true }]
      });
    } catch {
      setError("Không lấy được thông tin người dùng");
      // Chỉ set error state, không gọi showError trong callback
    } finally {
      setLoading(false);
    }
  }, []); // Đảm bảo dependency array cố định


  useEffect(() => {
    fetchUser();
  }, []); // Không truyền fetchUser vào dependency array


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


  // Xử lý error riêng biệt
  useEffect(() => {
    if (error) {
      showErrorRef.current("Không thể tải thông tin người dùng. Vui lòng thử lại.", "Lỗi tải dữ liệu");
    }
  }, [error]);


  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };


  const handleAddressChange = (idx, value) => {
    const newAddresses = form.addresses.map((a, i) => i === idx ? { ...a, address: value } : a);
    setForm({ ...form, addresses: newAddresses });
  };


  // Hàm xử lý thay đổi địa chỉ dropdown
  const handleAddressInputChange = (field, value) => {
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


  // Hàm tạo địa chỉ đầy đủ từ dropdown
  const buildFullAddress = () => {
    const { province, district, ward, specificAddress } = addressForm;
   
    const provinceName = provinces.find(p => p.id === province)?.name || '';
    const districtName = districts.find(d => d.id === district)?.name || '';
    const wardName = wards.find(w => w.id === ward)?.name || '';
   
    const fullAddress = `${specificAddress}, ${wardName ? wardName + ', ' : ''}${districtName}, ${provinceName}`;
    return fullAddress.replace(/^,\s*/, '').replace(/,\s*$/, '');
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
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    const currentUser = getCurrentUser();
    if (!currentUser || !currentUser.id) {
      navigate('/login');
      return;
    }
    const USER_ID = currentUser.id;
   
    try {
      // Tạo địa chỉ đầy đủ từ dropdown nếu có
      let updatedForm = { ...form };
      if (addressForm.province && addressForm.district && addressForm.specificAddress) {
        const fullAddress = buildFullAddress();
        updatedForm.addresses = [{ address: fullAddress, isDefault: true }];
      }
     
      await userAPI.updateUser(USER_ID, updatedForm);
      setSaving(false);
     
      // Cập nhật lại localStorage user
      const updatedUser = { ...currentUser, ...updatedForm };
      localStorage.setItem('user', JSON.stringify(updatedUser));
      // Xóa flag firstLogin nếu có
      localStorage.removeItem('firstLogin');
     
      // Hiển thị thông báo cập nhật thành công
      success(`Hồ sơ của ${updatedForm.name} đã được cập nhật thành công!`, 'Cập nhật hồ sơ thành công');
     
      navigate("/account");
    } catch {
      setError("Cập nhật thất bại");
      showError("Không thể cập nhật hồ sơ. Vui lòng thử lại sau.", "Cập nhật thất bại");
      setSaving(false);
    }
  };


  // Thêm hàm upload avatar
  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm(f => ({ ...f, avatar: ev.target.result }));
    };
    reader.readAsDataURL(file);
  };


  const checkAndNavigate = useCallback(() => {
    if (!loading && !error && user) {
      const missing = REQUIRED_FIELDS.filter(f => {
        if (f.name === "addresses") return !user.addresses || user.addresses.length === 0 || !user.addresses[0].address;
        return !user[f.name];
      });
      if (missing.length === 0) {
        navigateRef.current("/account");
      }
    }
  }, [loading, error, user]);


  useEffect(() => {
    checkAndNavigate();
  }, [checkAndNavigate]);
  if (!user) return null;
  // Xác định trường còn thiếu
  const missingFields = REQUIRED_FIELDS.filter(f => {
    if (f.name === "addresses") return !user.addresses || user.addresses.length === 0 || !user.addresses[0].address;
    return !user[f.name];
  });


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 pt-28 pb-12">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-lg border border-slate-200/50 p-8">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-slate-800 mb-2">Cập nhật thông tin tài khoản</h2>
            <p className="text-slate-600">Hoàn thiện thông tin cá nhân của bạn</p>
          </div>
         
          <form onSubmit={handleSubmit} className="space-y-6">
            {missingFields.map(f => {
              if (f.name === "name") {
                return (
                  <div key={f.name} className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-700 flex items-center">
                      <span className="w-2 h-2 bg-[#ff6c2f] rounded-full mr-2"></span>
                      Họ và tên <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <input
                        name={f.name}
                        value={form[f.name]}
                        onChange={handleChange}
                        placeholder="Nhập họ và tên"
                        className="w-full rounded-xl border-2 border-slate-200 px-4 py-3.5 text-base text-slate-800 placeholder:text-slate-400 focus:border-[#ff6c2f] focus:ring-2 focus:ring-[#ff6c2f]/20 transition-all shadow-sm bg-white"
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4">
                        <span className="text-slate-400">👤</span>
                      </div>
                    </div>
                  </div>
                );
              }
             
              if (f.name === "birthday") {
                return (
                  <div key={f.name} className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-700 flex items-center">
                      <span className="w-2 h-2 bg-[#ff6c2f] rounded-full mr-2"></span>
                      Ngày sinh <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <input
                        name={f.name}
                        type="date"
                        value={form[f.name] || ''}
                        onChange={handleChange}
                        className="w-full rounded-xl border-2 border-slate-200 px-4 py-3.5 text-base text-slate-800 focus:border-[#ff6c2f] focus:ring-2 focus:ring-[#ff6c2f]/20 transition-all shadow-sm bg-white"
                        max={new Date().toISOString().split('T')[0]}
                        required
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                        <span className="text-slate-400">🎂</span>
                      </div>
                    </div>
                    {form[f.name] && (
                      <p className="text-xs text-slate-500">
                        Tuổi: {calculateAge(form[f.name])} tuổi
                      </p>
                    )}
                  </div>
                );
              }
             
              if (f.name === "gender") {
                return (
                  <div key={f.name} className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-700 flex items-center">
                      <span className="w-2 h-2 bg-[#ff6c2f] rounded-full mr-2"></span>
                      Giới tính <span className="text-red-500 ml-1">*</span>
                    </label>
                    <div className="relative">
                      <select
                        name="gender"
                        value={form.gender}
                        onChange={handleChange}
                        className="w-full rounded-xl border-2 border-slate-200 px-4 py-3.5 text-base text-slate-800 focus:border-[#ff6c2f] focus:ring-2 focus:ring-[#ff6c2f]/20 transition-all shadow-sm bg-white appearance-none"
                        required
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
                );
              }
             
              if (f.name === "avatar") {
                return (
                  <div key={f.name} className="space-y-3">
                    <label className="block text-sm font-semibold text-slate-700 flex items-center">
                      <span className="w-2 h-2 bg-[#ff6c2f] rounded-full mr-2"></span>
                      Ảnh đại diện
                    </label>
                    <div className="flex items-center gap-4">
                      <img
                        src={form.avatar || '/images/avatar-default.png'}
                        alt="avatar"
                        className="w-20 h-20 rounded-full border-4 border-[#ff6c2f] object-cover shadow-md"
                      />
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        className="flex-1 text-sm text-slate-600 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-semibold file:bg-[#ff6c2f] file:text-white hover:file:bg-[#ff8c42] transition-colors"
                      />
                    </div>
                  </div>
                );
              }
             
              if (f.name === "addresses") {
                return (
                  <div key={f.name} className="space-y-6">
                    <div>
                      <label className="block text-sm font-semibold text-slate-700 flex items-center mb-4">
                        <span className="w-2 h-2 bg-[#ff6c2f] rounded-full mr-2"></span>
                        Địa chỉ <span className="text-red-500 ml-1">*</span>
                      </label>
                     
                      {/* Dropdown địa chỉ */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-slate-600">Tỉnh/Thành phố</label>
                          <div className="relative">
                            <select
                              value={addressForm.province}
                              onChange={(e) => handleAddressInputChange('province', e.target.value)}
                              className="w-full rounded-xl border-2 border-slate-200 px-4 py-3.5 text-base text-slate-800 focus:border-[#ff6c2f] focus:ring-2 focus:ring-[#ff6c2f]/20 transition-all shadow-sm bg-white appearance-none"
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
                        </div>
                       
                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-slate-600">Quận/Huyện</label>
                          <div className="relative">
                            <select
                              value={addressForm.district}
                              onChange={(e) => handleAddressInputChange('district', e.target.value)}
                              className="w-full rounded-xl border-2 border-slate-200 px-4 py-3.5 text-base text-slate-800 focus:border-[#ff6c2f] focus:ring-2 focus:ring-[#ff6c2f]/20 transition-all shadow-sm bg-white appearance-none"
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
                        </div>
                      </div>
                     
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div className="space-y-3">
                          <label className="block text-sm font-medium text-slate-600">Xã/Phường</label>
                          <div className="relative">
                            <select
                              value={addressForm.ward}
                              onChange={(e) => handleAddressInputChange('ward', e.target.value)}
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
                          <label className="block text-sm font-medium text-slate-600">Địa chỉ cụ thể</label>
                          <div className="relative">
                            <input
                              value={addressForm.specificAddress}
                              onChange={(e) => handleAddressInputChange('specificAddress', e.target.value)}
                              placeholder="Số nhà, tên đường, tên khu vực..."
                              className="w-full rounded-xl border-2 border-slate-200 px-4 py-3.5 text-base text-slate-800 placeholder:text-slate-400 focus:border-[#ff6c2f] focus:ring-2 focus:ring-[#ff6c2f]/20 transition-all shadow-sm bg-white"
                            />
                            <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none">
                              <span className="text-slate-400">🏠</span>
                            </div>
                          </div>
                        </div>
                      </div>
                     
                      {/* Hiển thị địa chỉ đầy đủ */}
                      {addressForm.province && addressForm.district && addressForm.specificAddress && (
                        <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                          <p className="text-sm font-medium text-slate-700 mb-1">Địa chỉ đầy đủ:</p>
                          <p className="text-slate-800">{buildFullAddress()}</p>
                        </div>
                      )}
                    </div>
                  </div>
                );
              }
             
              return (
                <div key={f.name} className="space-y-3">
                  <label className="block text-sm font-semibold text-slate-700 flex items-center">
                    <span className="w-2 h-2 bg-[#ff6c2f] rounded-full mr-2"></span>
                    {f.label} <span className="text-red-500 ml-1">*</span>
                  </label>
                  <div className="relative">
                    <input
                      name={f.name}
                      value={form[f.name]}
                      onChange={handleChange}
                      placeholder={f.label}
                      className="w-full rounded-xl border-2 border-slate-200 px-4 py-3.5 text-base text-slate-800 placeholder:text-slate-400 focus:border-[#ff6c2f] focus:ring-2 focus:ring-[#ff6c2f]/20 transition-all shadow-sm bg-white"
                      required
                    />
                  </div>
                </div>
              );
            })}
           
            <div className="flex justify-center pt-6 border-t border-slate-200">
              <button
                type="submit"
                disabled={saving}
                className="flex min-w-[200px] items-center justify-center rounded-xl bg-gradient-to-r from-[#ff6c2f] to-[#ff8c42] px-8 py-3.5 font-bold text-white shadow-lg transition-all hover:from-[#ff8c42] hover:to-[#ff6c2f] hover:shadow-xl disabled:opacity-60 transform hover:scale-105"
              >
                {saving ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                    Đang lưu...
                  </>
                ) : (
                  <>
                    <span className="mr-2">💾</span>
                    Lưu thông tin
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

