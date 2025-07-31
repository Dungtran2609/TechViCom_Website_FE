import React, { useState } from 'react';

const PolicyPage = () => {
  const [activeTab, setActiveTab] = useState('privacy');

  const policies = {
    privacy: {
      title: 'Chính sách bảo mật',
      icon: '🔒',
      description: 'Bảo vệ thông tin cá nhân của bạn là ưu tiên hàng đầu của chúng tôi',
      content: [
        {
          section: '1. Thông tin thu thập',
          text: 'Chúng tôi thu thập thông tin cá nhân của bạn khi bạn đăng ký tài khoản, đặt hàng, hoặc liên hệ với chúng tôi. Thông tin này bao gồm tên, email, số điện thoại, địa chỉ giao hàng.',
          details: ['Tên và thông tin cá nhân', 'Địa chỉ email và số điện thoại', 'Địa chỉ giao hàng', 'Lịch sử mua hàng']
        },
        {
          section: '2. Sử dụng thông tin',
          text: 'Thông tin cá nhân của bạn được sử dụng để xử lý đơn hàng, giao hàng, chăm sóc khách hàng và cải thiện dịch vụ của chúng tôi.',
          details: ['Xử lý và giao hàng đơn hàng', 'Chăm sóc khách hàng', 'Cải thiện dịch vụ', 'Gửi thông tin khuyến mãi']
        },
        {
          section: '3. Bảo vệ thông tin',
          text: 'Chúng tôi cam kết bảo vệ thông tin cá nhân của bạn bằng các biện pháp bảo mật tiên tiến và không chia sẻ thông tin với bên thứ ba mà không có sự đồng ý của bạn.',
          details: ['Mã hóa dữ liệu SSL', 'Bảo mật server cao cấp', 'Không chia sẻ với bên thứ ba', 'Tuân thủ GDPR']
        },
        {
          section: '4. Quyền của khách hàng',
          text: 'Bạn có quyền truy cập, chỉnh sửa hoặc xóa thông tin cá nhân của mình bất cứ lúc nào bằng cách liên hệ với chúng tôi.',
          details: ['Quyền truy cập thông tin', 'Quyền chỉnh sửa dữ liệu', 'Quyền xóa tài khoản', 'Quyền từ chối marketing']
        }
      ]
    },
    shipping: {
      title: 'Chính sách vận chuyển',
      icon: '🚚',
      description: 'Cam kết giao hàng nhanh chóng, an toàn đến mọi nơi trên toàn quốc',
      content: [
        {
          section: '1. Phạm vi giao hàng',
          text: 'Chúng tôi giao hàng toàn quốc với thời gian giao hàng từ 1-3 ngày làm việc tùy thuộc vào địa điểm giao hàng.',
          details: ['Giao hàng toàn quốc', '1-3 ngày làm việc', 'Giao hàng tận nơi', 'Giao hàng giờ hành chính']
        },
        {
          section: '2. Phí vận chuyển',
          text: 'Phí vận chuyển được tính dựa trên trọng lượng và khoảng cách. Miễn phí vận chuyển cho đơn hàng từ 500.000đ trở lên.',
          details: ['Tính theo trọng lượng', 'Tính theo khoảng cách', 'Miễn phí từ 500K', 'Giảm phí cho VIP']
        },
        {
          section: '3. Theo dõi đơn hàng',
          text: 'Khách hàng có thể theo dõi trạng thái đơn hàng trực tuyến hoặc liên hệ với chúng tôi để được hỗ trợ.',
          details: ['Theo dõi trực tuyến', 'SMS thông báo', 'Email cập nhật', 'Hỗ trợ 24/7']
        },
        {
          section: '4. Giao hàng an toàn',
          text: 'Chúng tôi cam kết giao hàng an toàn, đúng thời gian và đảm bảo sản phẩm không bị hư hỏng trong quá trình vận chuyển.',
          details: ['Đóng gói an toàn', 'Bảo hiểm hàng hóa', 'Kiểm tra trước giao', 'Chụp ảnh xác nhận']
        }
      ]
    },
    return: {
      title: 'Chính sách đổi trả',
      icon: '🔄',
      description: 'Quy trình đổi trả đơn giản, nhanh chóng và minh bạch',
      content: [
        {
          section: '1. Điều kiện đổi trả',
          text: 'Sản phẩm có thể được đổi trả trong vòng 30 ngày kể từ ngày mua với điều kiện còn nguyên vẹn, đầy đủ phụ kiện và hóa đơn mua hàng.',
          details: ['30 ngày kể từ ngày mua', 'Còn nguyên vẹn', 'Đầy đủ phụ kiện', 'Có hóa đơn mua hàng']
        },
        {
          section: '2. Quy trình đổi trả',
          text: 'Khách hàng liên hệ với chúng tôi để được hướng dẫn quy trình đổi trả. Chúng tôi sẽ kiểm tra và xử lý yêu cầu trong vòng 3-5 ngày làm việc.',
          details: ['Liên hệ hỗ trợ', 'Kiểm tra sản phẩm', '3-5 ngày xử lý', 'Hướng dẫn chi tiết']
        },
        {
          section: '3. Hoàn tiền',
          text: 'Trong trường hợp hoàn tiền, chúng tôi sẽ hoàn lại 100% giá trị sản phẩm trong vòng 7-14 ngày làm việc.',
          details: ['Hoàn 100% giá trị', '7-14 ngày làm việc', 'Nhiều phương thức', 'Thông báo qua email']
        },
        {
          section: '4. Sản phẩm không đổi trả',
          text: 'Một số sản phẩm như phần mềm, thẻ nạp, sản phẩm đã kích hoạt không được đổi trả theo quy định của nhà sản xuất.',
          details: ['Phần mềm đã kích hoạt', 'Thẻ nạp điện thoại', 'Sản phẩm tùy chỉnh', 'Sản phẩm khuyến mãi đặc biệt']
        }
      ]
    },
    warranty: {
      title: 'Chính sách bảo hành',
      icon: '🛡️',
      description: 'Bảo hành chính hãng với dịch vụ sửa chữa chuyên nghiệp',
      content: [
        {
          section: '1. Thời gian bảo hành',
          text: 'Sản phẩm được bảo hành chính hãng theo thời gian quy định của nhà sản xuất, thường từ 12-24 tháng tùy loại sản phẩm.',
          details: ['12-24 tháng tùy sản phẩm', 'Bảo hành chính hãng', 'Theo quy định NSX', 'Gia hạn bảo hành']
        },
        {
          section: '2. Điều kiện bảo hành',
          text: 'Sản phẩm được bảo hành khi còn trong thời hạn bảo hành, có tem bảo hành nguyên vẹn và không bị hư hỏng do lỗi người dùng.',
          details: ['Còn thời hạn bảo hành', 'Tem bảo hành nguyên vẹn', 'Không lỗi người dùng', 'Có hóa đơn mua hàng']
        },
        {
          section: '3. Quy trình bảo hành',
          text: 'Khách hàng mang sản phẩm đến trung tâm bảo hành của chúng tôi hoặc liên hệ để được hướng dẫn gửi sản phẩm đi bảo hành.',
          details: ['Mang đến trung tâm', 'Gửi qua bưu điện', 'Dịch vụ tại nhà', 'Hỗ trợ vận chuyển']
        },
        {
          section: '4. Thời gian sửa chữa',
          text: 'Thời gian sửa chữa thường từ 3-7 ngày làm việc tùy thuộc vào mức độ hư hỏng và tình trạng linh kiện.',
          details: ['3-7 ngày làm việc', 'Tùy mức độ hư hỏng', 'Có linh kiện thay thế', 'Thông báo tiến độ']
        }
      ]
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-amber-50 to-orange-100">
      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-500 via-amber-500 to-orange-600 text-white py-20">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-6xl mx-auto px-4 text-center">
          <div className="text-6xl mb-6">{policies[activeTab].icon}</div>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Chính sách & Điều khoản
          </h1>
          <p className="text-xl md:text-2xl max-w-3xl mx-auto opacity-90 leading-relaxed">
            Chúng tôi cam kết cung cấp dịch vụ tốt nhất và bảo vệ quyền lợi của khách hàng
          </p>
        </div>
      </section>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {/* Tab Navigation */}
        <div className="flex flex-wrap justify-center gap-4 mb-12">
          {Object.keys(policies).map((key) => (
            <button 
              key={key}
              className={`flex items-center px-8 py-4 rounded-2xl font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg ${
                activeTab === key 
                  ? 'bg-gradient-to-r from-orange-500 to-amber-600 text-white shadow-xl' 
                  : 'bg-white text-gray-700 border-2 border-gray-200 hover:border-orange-300 hover:shadow-xl'
              }`}
              onClick={() => setActiveTab(key)}
            >
              <span className="text-2xl mr-3">{policies[key].icon}</span>
              <span className="capitalize">
                {key === 'privacy' && 'Bảo mật'}
                {key === 'shipping' && 'Vận chuyển'}
                {key === 'return' && 'Đổi trả'}
                {key === 'warranty' && 'Bảo hành'}
              </span>
            </button>
          ))}
        </div>

        {/* Policy Content */}
        <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-orange-500 to-amber-600 text-white p-8 text-center">
            <div className="text-4xl mb-4">{policies[activeTab].icon}</div>
            <h2 className="text-3xl font-bold mb-4">{policies[activeTab].title}</h2>
            <p className="text-xl opacity-90 max-w-2xl mx-auto">
              {policies[activeTab].description}
            </p>
          </div>

          {/* Content */}
          <div className="p-8 md:p-12">
            <div className="grid gap-8">
              {policies[activeTab].content.map((item, index) => (
                <div key={index} className="border-b border-gray-100 pb-8 last:border-b-0">
                  <div className="flex items-start mb-6">
                    <div className="w-12 h-12 bg-gradient-to-r from-orange-500 to-amber-600 text-white rounded-full flex items-center justify-center text-lg font-bold mr-4 flex-shrink-0">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-2xl font-bold text-gray-900 mb-3">
                        {item.section}
                      </h3>
                      <p className="text-gray-600 leading-relaxed text-lg mb-4">
                        {item.text}
                      </p>
                      <div className="grid md:grid-cols-2 gap-3">
                        {item.details.map((detail, detailIndex) => (
                          <div key={detailIndex} className="flex items-center bg-gray-50 rounded-lg p-3">
                            <div className="w-2 h-2 bg-orange-500 rounded-full mr-3"></div>
                            <span className="text-gray-700 font-medium">{detail}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-12 bg-gradient-to-r from-orange-500 to-amber-600 rounded-3xl p-8 text-white text-center">
          <h3 className="text-3xl font-bold mb-4">Liên hệ hỗ trợ</h3>
          <p className="text-xl mb-8 opacity-90">
            Nếu bạn có thắc mắc về các chính sách trên, vui lòng liên hệ với chúng tôi
          </p>
          <div className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="bg-white bg-opacity-10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
              </div>
              <div className="font-semibold text-lg mb-2">Điện thoại</div>
              <div className="text-2xl font-bold">1900 1234</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="font-semibold text-lg mb-2">Email</div>
              <div className="text-lg">support@techvicom.vn</div>
            </div>
            <div className="bg-white bg-opacity-10 rounded-2xl p-6 backdrop-blur-sm">
              <div className="w-16 h-16 bg-white bg-opacity-20 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="font-semibold text-lg mb-2">Giờ làm việc</div>
              <div className="text-lg">8:00 - 22:00</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PolicyPage; 