import { useEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();
  const navigationType = useNavigationType ? useNavigationType() : 'PUSH';

  useEffect(() => {
    if (navigationType === 'PUSH' || navigationType === 'REPLACE') {
      window.scrollTo(0, 0);
    }
    // Nếu là POP (back/forward) thì giữ nguyên vị trí cuộn mặc định
  }, [pathname, navigationType]);

  return null;
};

export default ScrollToTop; 