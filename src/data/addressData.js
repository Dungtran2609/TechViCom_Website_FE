// Hàm helper để lấy dữ liệu từ db.json
export const fetchAddressData = async () => {
  try {
    const response = await fetch('/db.json');
    const data = await response.json();
    return data.addressData || { provinces: [] };
  } catch (error) {
    console.error('Error fetching address data:', error);
    return { provinces: [] };
  }
};


// Hàm helper để lấy tất cả tỉnh thành
export const getProvinces = async () => {
  const data = await fetchAddressData();
  return data.provinces || [];
};


// Hàm helper để lấy quận huyện theo tỉnh
export const getDistrictsByProvince = async (provinceId) => {
  const data = await fetchAddressData();
  const province = data.provinces?.find(p => p.id === provinceId);
  return province ? province.districts : [];
};


// Hàm helper để lấy xã phường theo quận huyện
export const getWardsByDistrict = async (districtId) => {
  const data = await fetchAddressData();
  for (const province of data.provinces || []) {
    const district = province.districts?.find(d => d.id === districtId);
    if (district) {
      return district.wards || [];
    }
  }
  return [];
};


// Hàm helper để lấy tên tỉnh theo ID
export const getProvinceName = async (provinceId) => {
  const data = await fetchAddressData();
  const province = data.provinces?.find(p => p.id === provinceId);
  return province ? province.name : '';
};


// Hàm helper để lấy tên quận/huyện theo ID
export const getDistrictName = async (districtId) => {
  const data = await fetchAddressData();
  for (const province of data.provinces || []) {
    const district = province.districts?.find(d => d.id === districtId);
    if (district) {
      return district.name;
    }
  }
  return '';
};


// Hàm helper để lấy tên phường/xã theo ID
export const getWardName = async (wardId) => {
  const data = await fetchAddressData();
  for (const province of data.provinces || []) {
    for (const district of province.districts || []) {
      const ward = district.wards?.find(w => w.id === wardId);
      if (ward) {
        return ward.name;
      }
    }
  }
  return '';
};












