export const categories = [
  {
    id: 1,
    name: 'Điện thoại',
    icon: 'FaMobileAlt',
    path: '/dien-thoai',
    subcategories: [
      { name: 'iPhone', path: '/dien-thoai/iphone', isPopular: true },
      { name: 'Samsung', path: '/dien-thoai/samsung', isPopular: true },
      { name: 'OPPO', path: '/dien-thoai/oppo' },
      { name: 'Xiaomi', path: '/dien-thoai/xiaomi' },
      { name: 'Vivo', path: '/dien-thoai/vivo' },
      { name: 'Realme', path: '/dien-thoai/realme' },
      { name: 'Nothing', path: '/dien-thoai/nothing' },
      { name: 'Google Pixel', path: '/dien-thoai/google-pixel' }
    ],
    featuredProducts: [
      { id: 6, name: 'iPhone 15 Pro Max 256GB', price: '31.990.000đ', image: '/images/products/iphone-15-pro.jpg' },
      { id: 7, name: 'Samsung Galaxy S24 Ultra 5G', price: '29.990.000đ', image: '/images/products/samsung-s24.jpg' }
    ]
  },
  {
    id: 2,
    name: 'Laptop',
    icon: 'FaLaptop',
    path: '/laptop',
    subcategories: [
      { name: 'Gaming', path: '/laptop/gaming', isPopular: true },
      { name: 'Văn phòng', path: '/laptop/van-phong' },
      { name: 'Đồ họa', path: '/laptop/do-hoa' },
      { name: 'MacBook', path: '/laptop/macbook', isPopular: true },
      { name: 'Dell', path: '/laptop/dell' },
      { name: 'HP', path: '/laptop/hp' },
      { name: 'Lenovo', path: '/laptop/lenovo' },
      { name: 'Asus', path: '/laptop/asus' }
    ],
    featuredProducts: [
      { id: 12, name: 'MacBook Air M2', price: '24.990.000đ', image: '/images/products/macbook-air.jpg' },
      { id: 13, name: 'Dell XPS 13', price: '28.990.000đ', image: '/images/products/dell-xps.jpg' }
    ]
  },
  {
    id: 3,
    name: 'Điều hòa',
    icon: 'MdAir',
    path: '/may-lanh',
    subcategories: [
      { name: '1 HP', path: '/may-lanh/1hp' },
      { name: '1.5 HP', path: '/may-lanh/1-5hp', isPopular: true },
      { name: '2 HP', path: '/may-lanh/2hp' },
      { name: 'Inverter', path: '/may-lanh/inverter', isPopular: true },
      { name: 'Daikin', path: '/may-lanh/daikin' },
      { name: 'Panasonic', path: '/may-lanh/panasonic' },
      { name: 'LG', path: '/may-lanh/lg' },
      { name: 'Samsung', path: '/may-lanh/samsung' }
    ],
    featuredProducts: [
      { id: 14, name: 'Daikin 1.5HP Inverter', price: '12.990.000đ', image: '/images/products/daikin-ac.jpg' },
      { id: 15, name: 'Panasonic 2HP', price: '15.990.000đ', image: '/images/products/panasonic-ac.jpg' }
    ]
  },
  {
    id: 4,
    name: 'Tủ lạnh',
    icon: 'MdKitchen',
    path: '/tu-lanh',
    subcategories: [
      { name: 'Side by Side', path: '/tu-lanh/side-by-side', isPopular: true },
      { name: 'Multi Door', path: '/tu-lanh/multi-door' },
      { name: 'Ngăn đá trên', path: '/tu-lanh/ngan-da-tren' },
      { name: 'Ngăn đá dưới', path: '/tu-lanh/ngan-da-duoi', isPopular: true },
      { name: 'Samsung', path: '/tu-lanh/samsung' },
      { name: 'LG', path: '/tu-lanh/lg' },
      { name: 'Panasonic', path: '/tu-lanh/panasonic' },
      { name: 'Sharp', path: '/tu-lanh/sharp' }
    ],
    featuredProducts: [
      { id: 16, name: 'Samsung Side by Side', price: '18.990.000đ', image: '/images/products/samsung-fridge.jpg' },
      { id: 17, name: 'LG Multi Door', price: '22.990.000đ', image: '/images/products/lg-fridge.jpg' }
    ]
  },
  {
    id: 5,
    name: 'Điện gia dụng',
    icon: 'GiWashingMachine',
    path: '/dien-gia-dung',
    subcategories: [
      { name: 'Máy giặt', path: '/dien-gia-dung/may-giat', isPopular: true },
      { name: 'Máy sấy', path: '/dien-gia-dung/may-say' },
      { name: 'Bếp từ', path: '/dien-gia-dung/bep-tu' },
      { name: 'Lò vi sóng', path: '/dien-gia-dung/lo-vi-song' },
      { name: 'Máy hút bụi', path: '/dien-gia-dung/may-hut-bui', isPopular: true },
      { name: 'Máy lọc không khí', path: '/dien-gia-dung/may-loc-khong-khi' },
      { name: 'Nồi cơm điện', path: '/dien-gia-dung/noi-com-dien' },
      { name: 'Máy xay sinh tố', path: '/dien-gia-dung/may-xay-sinh-to' }
    ],
    featuredProducts: [
      { id: 18, name: 'Samsung Máy giặt 10kg', price: '8.990.000đ', image: '/images/products/samsung-washer.jpg' },
      { id: 19, name: 'Dyson V15', price: '19.990.000đ', image: '/images/products/dyson-v15.jpg' }
    ]
  },
  {
    id: 6,
    name: 'Máy tính bảng',
    icon: 'FaTabletAlt',
    path: '/may-tinh-bang',
    subcategories: [
      { name: 'iPad', path: '/may-tinh-bang/ipad', isPopular: true },
      { name: 'Samsung Tab', path: '/may-tinh-bang/samsung-tab' },
      { name: 'Xiaomi Pad', path: '/may-tinh-bang/xiaomi-pad' },
      { name: 'Lenovo Tab', path: '/may-tinh-bang/lenovo-tab' },
      { name: 'Huawei MatePad', path: '/may-tinh-bang/huawei-matepad' }
    ],
    featuredProducts: [
      { id: 20, name: 'iPad Air 5', price: '16.990.000đ', image: '/images/products/ipad-air.jpg' },
      { id: 21, name: 'Samsung Tab S9', price: '14.990.000đ', image: '/images/products/samsung-tab.jpg' }
    ]
  },
  {
    id: 7,
    name: 'Phụ kiện',
    icon: 'FaHeadphones',
    path: '/phu-kien',
    subcategories: [
      { name: 'Tai nghe', path: '/phu-kien/tai-nghe', isPopular: true },
      { name: 'Sạc dự phòng', path: '/phu-kien/sac-du-phong' },
      { name: 'Cáp sạc', path: '/phu-kien/cap-sac' },
      { name: 'Ốp lưng', path: '/phu-kien/op-lung' },
      { name: 'Bàn phím', path: '/phu-kien/ban-phim' },
      { name: 'Chuột', path: '/phu-kien/chuot' },
      { name: 'Webcam', path: '/phu-kien/webcam' },
      { name: 'Microphone', path: '/phu-kien/microphone' }
    ],
    featuredProducts: [
      { id: 22, name: 'AirPods Pro 2', price: '6.990.000đ', image: '/images/products/airpods-pro.jpg' },
      { id: 23, name: 'Sạc dự phòng 20.000mAh', price: '1.990.000đ', image: '/images/products/powerbank.jpg' }
    ]
  },
  {
    id: 8,
    name: 'SIM Techvicom',
    icon: 'IoPhonePortrait',
    path: '/sim-techvicom',
    subcategories: [
      { name: 'SIM 4G', path: '/sim-techvicom/sim-4g' },
      { name: 'SIM 5G', path: '/sim-techvicom/sim-5g', isPopular: true },
      { name: 'Gói cước', path: '/sim-techvicom/goi-cuoc' },
      { name: 'Thẻ nạp', path: '/sim-techvicom/the-nap' }
    ],
    featuredProducts: [
      { id: 24, name: 'SIM 5G 60GB/tháng', price: '199.000đ', image: '/images/products/sim-5g.jpg' },
      { id: 25, name: 'Gói cước 4G', price: '99.000đ', image: '/images/products/data-plan.jpg' }
    ]
  },
  {
    id: 9,
    name: 'Quạt điều hòa',
    icon: 'BsFan',
    path: '/quat-dieu-hoa',
    subcategories: [
      { name: 'Quạt tháp', path: '/quat-dieu-hoa/quat-thap', isPopular: true },
      { name: 'Quạt đứng', path: '/quat-dieu-hoa/quat-dung' },
      { name: 'Quạt treo tường', path: '/quat-dieu-hoa/quat-treo-tuong' },
      { name: 'Quạt hơi nước', path: '/quat-dieu-hoa/quat-hoi-nuoc' }
    ],
    featuredProducts: [
      { id: 26, name: 'Quạt tháp Fujihome', price: '899.000đ', image: '/images/products/quat-thap.jpg' },
      { id: 27, name: 'Quạt điều hòa Hoa Phát', price: '1.690.000đ', image: '/images/products/quat-dieu-hoa.jpg' }
    ]
  }
];

// Dưới đây là export bổ sung để tiện import danh mục cho router và tạo trang
export const categorySlugs = categories.map(cat => ({ slug: cat.path.replace(/^\//, ''), name: cat.name }));