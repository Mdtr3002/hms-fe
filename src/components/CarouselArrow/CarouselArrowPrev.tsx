import Icon from '../Icon';

const CarouselArrowPrev = (clickHandler: () => void, _hasPrev: boolean, _label: string) => {
  return (
    <button
      className='absolute z-[1] flex 
      h-[100%] w-[10px] items-center justify-center 
      bg-black/20 opacity-20 transition-all duration-700 ease-in hover:opacity-100
      md:w-[30px] xl:w-[50px]'
      onClick={clickHandler}
    >
      <Icon.ChevronLeft className='aspect-[36.6/65] h-auto w-[50%]' fill={'#FFFFFF'} />
    </button>
  );
};

export default CarouselArrowPrev;
