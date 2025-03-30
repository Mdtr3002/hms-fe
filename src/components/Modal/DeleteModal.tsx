import React, { useEffect } from 'react';

import Icon from '../../components/Icon';

interface DeleteModalProps {
  text: string;
  onClose: () => void;
  onDelete: () => void;
  show: boolean;
  positiveOption?: string;
  negativeOption?: string;
}

const DeleteModal = ({
  text,
  onClose,
  onDelete,
  show,
  positiveOption,
  negativeOption,
}: DeleteModalProps) => {
  const closeOnEscapeKeyDown = (event: React.KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  const closeOnEscapeKeyDownWithUseEffect = (event: KeyboardEvent) => {
    if (event.key === 'Escape') {
      onClose();
    }
  };

  useEffect(() => {
    document.body.addEventListener('keydown', closeOnEscapeKeyDownWithUseEffect);
    return function cleanup() {
      document.body.removeEventListener('keydown', closeOnEscapeKeyDownWithUseEffect);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCancel = () => onClose();
  const handleDelete = () => {
    onClose();
    onDelete();
  };

  return (
    <div
      aria-hidden='true'
      className={`pointer-events-none fixed inset-0 z-[60] flex items-center justify-center bg-black bg-opacity-50 opacity-0 transition-all duration-300 ease-out ${
        show ? 'pointer-events-auto opacity-100' : ''
      }`}
      onClick={onClose}
      onKeyDown={closeOnEscapeKeyDown}
    >
      <div
        aria-hidden='true'
        className='flex h-[348px] w-[320px] flex-col items-center rounded border bg-white px-[20px] py-8 sm:w-[376px] sm:px-[58px] md:w-[412px]'
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          {/* <DeleteIcon /> */}
          <Icon.DeleteModalIcon />
        </div>
        <span className='mt-4 text-2xl font-medium text-[#DB4437]'>Are you certain?</span>
        <span className='mt-3 text-center text-base text-[#404046] md:mt-9'>{text}</span>
        <div className='mt-3 flex w-[260px] justify-between'>
          <button
            type='button'
            className='h-11 w-[92px] rounded-[4px] border border-[#E9E9E9] bg-white text-center text-base text-[#404046] hover:bg-black/[.2]'
            onClick={handleCancel}
          >
            {positiveOption || 'Cancel'}
          </button>
          <button
            type='button'
            className='h-11 w-[92px] rounded-[4px] border bg-[#DB4437] text-center text-base text-white hover:bg-[#DB4437]/[.8]'
            onClick={handleDelete}
          >
            {negativeOption || 'Delete'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DeleteModal;
