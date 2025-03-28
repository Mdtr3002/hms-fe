import { FC } from 'react';

type ContentBoxProps = {
  title: string;
  content: string;
  Icon: any;
  containerClass?: string;
};

const ContentBox: FC<ContentBoxProps> = ({ title, content, Icon, containerClass }) => {
  return (
    <div className={`flex flex-row gap-x-4 ${containerClass}`}>
      <div className='max-w-16 flex aspect-square max-h-16 w-16 items-center justify-center rounded-xl border border-[#4285F4]'>
        <Icon className='aspect-square w-12 fill-[#4285F4]' />
      </div>
      <div className='flex flex-col justify-evenly'>
        <p className='text-base text-[#696984] md:text-lg 2xl:text-2xl'>{title}</p>
        <p className='text-base font-bold text-[#696984] md:text-lg 2xl:text-2xl'>{content}</p>
      </div>
    </div>
  );
};

export default ContentBox;
