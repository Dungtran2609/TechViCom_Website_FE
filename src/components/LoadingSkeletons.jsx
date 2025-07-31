import React from 'react';

// Skeleton cho Product Card
export const ProductCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200"></div>
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      <div className="h-6 bg-gray-200 rounded w-1/3"></div>
      <div className="flex gap-2">
        <div className="h-8 bg-gray-200 rounded flex-1"></div>
        <div className="h-8 bg-gray-200 rounded w-12"></div>
      </div>
    </div>
  </div>
);

// Skeleton cho Product Grid
export const ProductGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <ProductCardSkeleton key={index} />
    ))}
  </div>
);

// Skeleton cho Product Detail
export const ProductDetailSkeleton = () => (
  <div className="bg-white rounded-xl shadow-md p-6 animate-pulse">
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      {/* Image Gallery */}
      <div className="space-y-4">
        <div className="h-96 bg-gray-200 rounded-lg"></div>
        <div className="grid grid-cols-4 gap-2">
          {Array.from({ length: 4 }).map((_, index) => (
            <div key={index} className="h-20 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
      
      {/* Product Info */}
      <div className="space-y-4">
        <div className="h-8 bg-gray-200 rounded w-3/4"></div>
        <div className="h-6 bg-gray-200 rounded w-1/3"></div>
        <div className="space-y-2">
          {Array.from({ length: 3 }).map((_, index) => (
            <div key={index} className="h-4 bg-gray-200 rounded"></div>
          ))}
        </div>
        <div className="h-12 bg-gray-200 rounded"></div>
        <div className="flex gap-4">
          <div className="h-10 bg-gray-200 rounded flex-1"></div>
          <div className="h-10 bg-gray-200 rounded w-20"></div>
        </div>
      </div>
    </div>
  </div>
);

// Skeleton cho News Card
export const NewsCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-md overflow-hidden animate-pulse">
    <div className="h-48 bg-gray-200"></div>
    <div className="p-4 space-y-3">
      <div className="h-4 bg-gray-200 rounded w-1/4"></div>
      <div className="h-5 bg-gray-200 rounded w-3/4"></div>
      <div className="space-y-2">
        {Array.from({ length: 2 }).map((_, index) => (
          <div key={index} className="h-3 bg-gray-200 rounded"></div>
        ))}
      </div>
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
    </div>
  </div>
);

// Skeleton cho News Grid
export const NewsGridSkeleton = ({ count = 6 }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {Array.from({ length: count }).map((_, index) => (
      <NewsCardSkeleton key={index} />
    ))}
  </div>
);

// Skeleton cho Category Card
export const CategoryCardSkeleton = () => (
  <div className="bg-white rounded-xl shadow-md p-6 text-center animate-pulse">
    <div className="w-16 h-16 bg-gray-200 rounded-full mx-auto mb-4"></div>
    <div className="h-4 bg-gray-200 rounded w-3/4 mx-auto"></div>
  </div>
);

// Skeleton cho Category Grid
export const CategoryGridSkeleton = ({ count = 8 }) => (
  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
    {Array.from({ length: count }).map((_, index) => (
      <CategoryCardSkeleton key={index} />
    ))}
  </div>
);

// Skeleton cho Cart Item
export const CartItemSkeleton = () => (
  <div className="flex items-center gap-4 p-4 bg-white rounded-lg animate-pulse">
    <div className="w-20 h-20 bg-gray-200 rounded"></div>
    <div className="flex-1 space-y-2">
      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
      <div className="h-6 bg-gray-200 rounded w-1/4"></div>
    </div>
    <div className="flex items-center gap-2">
      <div className="w-8 h-8 bg-gray-200 rounded"></div>
      <div className="w-12 h-8 bg-gray-200 rounded"></div>
      <div className="w-8 h-8 bg-gray-200 rounded"></div>
    </div>
  </div>
);

// Skeleton cho Checkout Form
export const CheckoutFormSkeleton = () => (
  <div className="space-y-6 animate-pulse">
    {Array.from({ length: 3 }).map((_, index) => (
      <div key={index} className="bg-white rounded-xl shadow-md p-6">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-4"></div>
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, subIndex) => (
            <div key={subIndex} className="space-y-2">
              <div className="h-4 bg-gray-200 rounded w-1/4"></div>
              <div className="h-10 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    ))}
  </div>
);

// Skeleton cho Header
export const HeaderSkeleton = () => (
  <div className="bg-white shadow-md animate-pulse">
    <div className="max-w-7xl mx-auto px-4 py-4">
      <div className="flex items-center justify-between">
        <div className="h-8 bg-gray-200 rounded w-32"></div>
        <div className="hidden md:flex items-center gap-6">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-4 bg-gray-200 rounded w-16"></div>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <div className="w-8 h-8 bg-gray-200 rounded"></div>
          <div className="w-8 h-8 bg-gray-200 rounded"></div>
          <div className="w-8 h-8 bg-gray-200 rounded"></div>
        </div>
      </div>
    </div>
  </div>
);

// Skeleton cho Footer
export const FooterSkeleton = () => (
  <div className="bg-gray-800 text-white animate-pulse">
    <div className="max-w-7xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
        {Array.from({ length: 4 }).map((_, index) => (
          <div key={index} className="space-y-4">
            <div className="h-6 bg-gray-700 rounded w-1/2"></div>
            <div className="space-y-2">
              {Array.from({ length: 4 }).map((_, subIndex) => (
                <div key={subIndex} className="h-4 bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  </div>
);

// Skeleton cho Page Loading
export const PageLoadingSkeleton = () => (
  <div className="min-h-screen bg-gray-50 animate-pulse">
    <HeaderSkeleton />
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="space-y-8">
        <div className="h-8 bg-gray-200 rounded w-1/3"></div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, index) => (
            <ProductCardSkeleton key={index} />
          ))}
        </div>
      </div>
    </div>
    <FooterSkeleton />
  </div>
); 