const orders = [
  {
    orderId: "DH001",
    date: "01/05/2024",
    total: 3500000,
    status: "Đã giao",
    products: [
      { name: "iPhone 15 Pro", quantity: 1, price: 3000000 },
      { name: "Ốp lưng iPhone", quantity: 2, price: 250000 }
    ]
  },
  {
    orderId: "DH002",
    date: "15/04/2024",
    total: 1200000,
    status: "Đang xử lý",
    products: [
      { name: "Tai nghe Bluetooth", quantity: 1, price: 1200000 }
    ]
  }
];

export default orders;
