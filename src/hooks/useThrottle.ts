import throttle from 'lodash/throttle';
import { useEffect, useMemo, useRef } from 'react';

type Callback = () => any;

const useThrottle = (callback: Callback) => {
  const ref = useRef<Callback>();

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const throttledCallback = useMemo(() => {
    const func = () => {
      ref.current?.();
    };

    return throttle(func, 400, { leading: true, trailing: false });
  }, []);

  return throttledCallback;
};

export default useThrottle;
