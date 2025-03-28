import { throttle } from 'lodash';
import { useEffect, useState } from 'react';

const useWindowDimensions = () => {
  const isSSR = typeof window === 'undefined';
  const [width, setWidth] = useState(isSSR ? 1200 : window.innerWidth);
  const [height, setHeight] = useState(isSSR ? 800 : window.innerHeight);

  useEffect(() => {
    const handleResize = () => {
      setWidth(window.innerWidth);
      setHeight(window.innerHeight);
    };

    window.addEventListener('resize', throttle(handleResize, 500, { trailing: true }));

    return () =>
      window.removeEventListener('resize', throttle(handleResize, 500, { trailing: true }));
  }, [width]);

  return { width, height };
};

export default useWindowDimensions;
