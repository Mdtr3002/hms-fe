import debounce from 'lodash/debounce';
import { useEffect, useMemo, useRef } from 'react';

type Callback = (...args: any[]) => any;

const useDebounce = (callback: Callback, time: number = 600) => {
  const ref = useRef<Callback>();

  useEffect(() => {
    ref.current = callback;
  }, [callback]);

  const debouncedCallback = useMemo(() => {
    const func = (...args: any[]) => {
      ref.current?.(...args);
    };

    return debounce(func, time);
  }, [time]);

  return debouncedCallback;
};

export default useDebounce;
