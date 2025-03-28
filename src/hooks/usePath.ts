import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';

const usePath = () => {
  const { pathname } = useLocation();
  return useMemo(() => pathname.slice(1).split('/'), [pathname]);
};

export default usePath;
