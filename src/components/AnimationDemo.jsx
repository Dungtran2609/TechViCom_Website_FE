import React, { useState } from 'react';
import { 
  FadeIn, 
  SlideIn, 
  ScaleIn, 
  StaggerContainer, 
  StaggerItem, 
  HoverCard, 
  LoadingSpinner, 
  Pulse, 
  Bounce, 
  Floating,
  TypingAnimation 
} from './Animations';
import { ThemeToggle, useTheme } from '../contexts/ThemeContext';
import { ProductCardSkeleton, NewsCardSkeleton } from './LoadingSkeletons';

const AnimationDemo = () => {
  const { isDark } = useTheme();
  const [showModal, setShowModal] = useState(false);

  return (
    <div className={`min-h-screen ${isDark ? 'bg-gray-900 text-white' : 'bg-gray-50'}`}>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Demo Cải thiện Giao diện</h1>
          <p className="text-lg text-gray-600 dark:text-gray-300 mb-6">
            Test các tính năng mới: Loading Skeleton, Dark Mode, Animations
          </p>
          <ThemeToggle className="mx-auto" />
        </div>

        {/* Animations Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Animations</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <FadeIn delay={0.1}>
              <HoverCard className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-2">Fade In + Hover</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Animation mượt mà khi hover
                </p>
              </HoverCard>
            </FadeIn>

            <SlideIn direction="left" delay={0.2}>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-2">Slide In</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Trượt từ trái sang
                </p>
              </div>
            </SlideIn>

            <ScaleIn delay={0.3}>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-2">Scale In</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Phóng to từ nhỏ
                </p>
              </div>
            </ScaleIn>

            <Pulse>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-2">Pulse</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Hiệu ứng nhấp nháy
                </p>
              </div>
            </Pulse>

            <Bounce>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-2">Bounce</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Hiệu ứng nảy lên xuống
                </p>
              </div>
            </Bounce>

            <Floating>
              <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                <h3 className="text-lg font-semibold mb-2">Floating</h3>
                <p className="text-gray-600 dark:text-gray-300">
                  Hiệu ứng nổi lên xuống
                </p>
              </div>
            </Floating>
          </div>
        </section>

        {/* Loading Skeletons Section */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Loading Skeletons</h2>
          
          <div className="space-y-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Product Skeleton</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {Array.from({ length: 4 }).map((_, index) => (
                  <ProductCardSkeleton key={index} />
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">News Skeleton</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {Array.from({ length: 3 }).map((_, index) => (
                  <NewsCardSkeleton key={index} />
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Stagger Animation */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Stagger Animation</h2>
          
          <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {Array.from({ length: 6 }).map((_, index) => (
              <StaggerItem key={index}>
                <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
                  <h3 className="text-lg font-semibold mb-2">Item {index + 1}</h3>
                  <p className="text-gray-600 dark:text-gray-300">
                    Hiển thị theo thứ tự
                  </p>
                </div>
              </StaggerItem>
            ))}
          </StaggerContainer>
        </section>

        {/* Loading Spinner */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Loading Spinners</h2>
          
          <div className="flex justify-center gap-8">
            <div className="text-center">
              <LoadingSpinner size="sm" className="mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-300">Small</p>
            </div>
            <div className="text-center">
              <LoadingSpinner size="md" className="mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-300">Medium</p>
            </div>
            <div className="text-center">
              <LoadingSpinner size="lg" className="mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-300">Large</p>
            </div>
            <div className="text-center">
              <LoadingSpinner size="xl" className="mb-2" />
              <p className="text-sm text-gray-600 dark:text-gray-300">Extra Large</p>
            </div>
          </div>
        </section>

        {/* Typing Animation */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Typing Animation</h2>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <TypingAnimation 
              text="Chào mừng bạn đến với TechViCom! Chúng tôi cung cấp các sản phẩm công nghệ chất lượng cao với giá tốt nhất."
              className="text-lg font-medium"
            />
          </div>
        </section>

        {/* Dark Mode Info */}
        <section className="mb-12">
          <h2 className="text-2xl font-bold mb-6">Dark Mode</h2>
          
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-lg">
            <h3 className="text-lg font-semibold mb-4">
              Chế độ hiện tại: {isDark ? 'Tối' : 'Sáng'}
            </h3>
            <p className="text-gray-600 dark:text-gray-300 mb-4">
              Sử dụng nút toggle ở trên để chuyển đổi giữa chế độ sáng và tối.
              Theme sẽ được lưu vào localStorage và tự động áp dụng khi tải lại trang.
            </p>
            <div className="flex gap-4">
              <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Màu nền</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {isDark ? 'Tối' : 'Sáng'}
                </p>
              </div>
              <div className="flex-1 bg-gray-100 dark:bg-gray-700 rounded-lg p-4">
                <h4 className="font-semibold mb-2">Màu chữ</h4>
                <p className="text-sm text-gray-600 dark:text-gray-300">
                  {isDark ? 'Trắng' : 'Đen'}
                </p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AnimationDemo; 