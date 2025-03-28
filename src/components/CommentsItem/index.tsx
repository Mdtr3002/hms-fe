import { Icon } from '..';

interface CommentsItemProps {
  name: string;
  profileImg: string;
  comment: string;
}

const CommentsItem = ({ name, comment, profileImg }: CommentsItemProps) => {
  return (
    <div className='flex min-h-[15rem] w-[60rem] flex-row space-x-[1rem] rounded-[1.25rem] bg-white p-[1rem] shadow-[0_0_20px_0_rgba(0,0,0,0.1)]'>
      <div className='flex min-w-[20%] flex-col items-center justify-center space-y-[1rem] md:space-y-[1.5rem]'>
        <img className='aspect-square w-[6rem] rounded-full' src={profileImg} alt={profileImg} />
        <p className='text-center text-[16px] font-semibold text-[#252641] md:text-[20px]'>
          {name}
        </p>
      </div>
      <div className='flex h-full max-w-[80%] flex-col items-center justify-center space-y-[0.5rem]'>
        <div className='flex w-full justify-start'>
          <Icon.OpenQuote />
        </div>
        <div className='flex w-full justify-start'>
          <p className='text-[16px] font-medium text-[#252641] md:text-[20px]'>{comment}</p>
        </div>
        <div className='flex w-full justify-end'>
          <Icon.CloseQuote />
        </div>
      </div>
    </div>
  );
};

export default CommentsItem;
