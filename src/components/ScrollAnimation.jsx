import React, { useEffect, useRef } from 'react';

const ScrollAnimation = ({ children, className = '', animation = 'fade-in', delay = 0 }) => {
  const elementRef = useRef(null);

  useEffect(() => {
    const currentElement = elementRef.current;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add('visible');
            }, delay);
          }
        });
      },
      {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
      }
    );

    if (currentElement) {
      observer.observe(currentElement);
    }

    return () => {
      if (currentElement) {
        observer.unobserve(currentElement);
      }
    };
  }, [delay]);

  const getAnimationClass = () => {
    switch (animation) {
      case 'slide-left':
        return 'scroll-fade-in animate-slide-in-left';
      case 'slide-right':
        return 'scroll-fade-in animate-slide-in-right';
      case 'scale':
        return 'scroll-fade-in animate-scale-in';
      case 'bounce':
        return 'animate-bounce';
      case 'pulse':
        return 'animate-pulse';
      case 'fade-in':
      default:
        return 'scroll-fade-in';
    }
  };

  return (
    <div ref={elementRef} className={`${getAnimationClass()} ${className}`}>
      {children}
    </div>
  );
};

export default ScrollAnimation; 