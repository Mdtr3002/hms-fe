import AchievementData from '../../data/AchivementData';
import { useWindowDimensions } from '../../hooks';

const Achievement1 = () => {
  const { width } = useWindowDimensions();

  return (
    <>
      {width >= 1200 ? (
        <div className='mx-auto flex flex-row justify-center gap-10 space-x-[6.25rem] lg:space-x-[4.5rem] 2xl:space-x-[8.75rem]'>
          {AchievementData.map((achievement) => (
            <div
              key={achievement.id}
              className='mx-auto flex flex-col items-center justify-start space-y-1'
            >
              <p className='h-[100px] text-[80px] text-[#4285F4]'>{achievement.number}</p>
              <p className='text-center font-medium text-[#010514]'>{achievement.title}</p>
            </div>
          ))}
        </div>
      ) : width >= 576 ? (
        <div className='mx-auto flex flex-row justify-center'>
          <div className='mx-auto grid grid-cols-2 gap-x-[6.25rem] gap-y-[2.5rem]'>
            {AchievementData.map((achievement) => (
              <div
                key={achievement.id}
                className='mx-auto flex flex-col items-center justify-start space-y-1'
              >
                <p className='h-[100px] text-[80px] text-[#4285F4]'>{achievement.number}</p>
                <p className='text-center font-medium text-[#010514]'>{achievement.title}</p>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className='mx-auto flex flex-row justify-center'>
          <div className='mx-auto grid grid-cols-2 gap-x-[3.75rem] gap-y-[1.75rem]'>
            {AchievementData.map((achievement) => (
              <div
                key={achievement.id}
                className='mx-auto flex flex-col items-center justify-start space-y-1'
              >
                <p className='h-[3.75rem] text-[48px] text-[#4285F4]'>{achievement.number}</p>
                <p className='text-center font-medium text-[#010514]'>{achievement.title}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default Achievement1;
