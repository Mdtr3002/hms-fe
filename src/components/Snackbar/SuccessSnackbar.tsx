import { useEffect } from 'react';

import Icon from '../../components/Icon';

interface SuccessSnackbarProp {
  showSnackbar: boolean;
  setShow: () => void;
}

const SuccessSnackbar = ({ showSnackbar, setShow }: SuccessSnackbarProp) => {
  let TIMER: NodeJS.Timeout;
  const handleTimeout = () => {
    TIMER = setTimeout(() => {
      setShow();
    }, 3000);
  };

  function handleClose() {
    clearTimeout(TIMER);
    setShow();
  }

  useEffect(() => {
    if (showSnackbar) {
      handleTimeout();
    }
    return () => {
      clearTimeout(TIMER);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showSnackbar]);

  if (!showSnackbar) return <></>;

  return (
    <div className='relative z-50 flex h-[76px] w-[300px] animate-fadeinout items-center rounded border-t bg-white p-5 shadow-md sm:w-[376px]'>
      <div className='flex h-[52px] w-[52px] items-center justify-center rounded-full bg-[#0f9d58]'>
        <Icon.CheckIcon fill='#FFFFFF' className='h-5 w-8' />
      </div>
      <div className='ml-[18px]'>
        <p className='text-base font-semibold leading-5'>Cập nhật thành công</p>
      </div>
      <button
        type='button'
        onClick={handleClose}
        className='absolute right-5 flex h-9 w-9 items-center justify-center rounded-full bg-[#E6E6E6] transition-all duration-300 ease-out hover:bg-[#CCCCCC]'
      >
        <Icon.CloseIconSnackbar />
      </button>
    </div>
  );
};

export default SuccessSnackbar;
