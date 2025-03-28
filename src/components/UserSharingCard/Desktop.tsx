import { FC } from 'react';

import { Icon } from '..';

const Desktop: FC<{
  name: string;
  profileImg: string;
  sharing: string;
}> = ({ name, profileImg, sharing }) => {
  return (
    <div className='flex h-full flex-col items-start justify-start rounded-2xl bg-white shadow-[0_20px_20px_0_rgba(47,50,125,0.1)] '>
      <div className='relative flex w-full flex-row items-start justify-start gap-y-1 rounded-t-2xl bg-[#E3F2FD] px-8 py-5'>
        <p className='ml-[144px] text-xl font-medium lg:text-2xl 3xl:text-3xl'>{name}</p>
      </div>
      <div className='relative flex w-full flex-col items-center justify-start gap-y-1 rounded-b-2xl bg-white px-8 py-5'>
        <img
          src={profileImg}
          alt='profile pic'
          style={{
            alignSelf: 'flex-start',
            position: 'absolute',
            top: '-60px',
            aspectRatio: '1',
            height: 'auto',
            width: '120px',
            borderRadius: '9999px',
          }}
        />
        <div className='mt-[60px] h-fit w-fit self-start'>
          <Icon.OpenQuote className='h-auto w-5 lg:w-8 3xl:w-[44px]' />
        </div>
        <p className='text-justify text-base font-semibold lg:text-xl 3xl:text-2xl'>{sharing}</p>
        <div className='h-fit w-fit self-end'>
          <Icon.CloseQuote className='h-auto w-5 lg:w-8 3xl:w-[44px]' />
        </div>
      </div>
    </div>
  );
};

export default Desktop;
