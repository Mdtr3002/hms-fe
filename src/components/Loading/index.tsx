import { LottieOptions, useLottie } from 'lottie-react';
import { CSSProperties } from 'react';

const Loading = () => {
  const style: CSSProperties = {
    height: 'auto',
    width: '50vw',
    aspectRatio: 1,
  };
  const options: LottieOptions<'svg'> = {
    animationData: require('../../assets/animations/Loading.json'),
    loop: true,
    autoplay: true,
  };

  const { View } = useLottie(options, style);

  return (
    <div
      className='fixed z-[10000000] flex h-[100dvh] max-h-screen w-screen items-center
      justify-center bg-white'
    >
      {View}
    </div>
  );
};

export default Loading;
