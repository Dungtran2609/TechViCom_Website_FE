// Hàm helper để lấy dữ liệu từ db.json
export const fetchAddressData = async () => {
  try {
    const response = await fetch('/db.json');
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching address data:', error);
    return { provinces: [], districts: {}, wards: {} };
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
  return data.districts?.[provinceId] || [];
};

// Hàm helper để lấy xã phường theo quận huyện
export const getWardsByDistrict = async (districtId) => {
  const data = await fetchAddressData();
  return data.wards?.[districtId] || [];
}; 