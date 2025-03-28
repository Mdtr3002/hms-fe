import AchievementData from '../../data/AchivementData';

const Achievement2 = () => {
  return (
    <div className='mx-auto grid w-full grid-cols-2 gap-[1.25rem] rounded-[1.25rem] bg-[#010514] bg-opacity-10 p-[1.25rem]'>
      {AchievementData.map((achievement) => (
        <div
          className='mx-auto flex h-full w-full flex-col items-center justify-start space-y-1'
          key={achievement.id}
        >
          <p className='text-[36px] leading-[2.5rem] text-[#4285F4] md:text-[48px] xl:text-[60px] xl:leading-[3rem] 2xl:text-[80px] 2xl:leading-[5rem]'>
            {achievement.number}
          </p>
          <p className='text-center font-medium text-[#010514]'>{achievement.title}</p>
        </div>
      ))}
    </div>
  );
};

export default Achievement2;
