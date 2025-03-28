import { FC } from 'react';

import { Icon } from '..';

const Mobile: FC<{
  name: string;
  profileImg: string;
  sharing: string;
}> = ({ name, profileImg, sharing }) => {
  return (
    <div className='flex h-full w-full flex-col items-start justify-start overflow-visible rounded-lg shadow-[0_20px_20px_0_rgba(47,50,125,0.1)]'>
      <div className='flex w-full flex-col items-center justify-center gap-y-1 rounded-t-2xl bg-[#E3F2FD] p-2'>
        <img
          src={profileImg}
          alt='profile pic'
          style={{
            aspectRatio: '1',
            height: 'auto',
            width: '80px',
            borderRadius: '9999px',
          }}
        />
        <p className='text-xl font-medium'>{name}</p>
      </div>
      <div className='flex w-full flex-col items-center justify-center gap-y-1 rounded-b-2xl bg-white p-5'>
        <div className='h-fit w-fit self-start'>
          <Icon.OpenQuote className='h-auto w-5' />
        </div>
        <p className='text-justify text-base font-semibold'>{sharing}</p>
        <div className='h-fit w-fit self-end'>
          <Icon.CloseQuote className='h-auto w-5' />
        </div>
      </div>
    </div>
  );
};

export default Mobile;
