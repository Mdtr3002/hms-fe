import Icon from '../Icon';

const CarouselArrowNext = (clickHandler: () => void, _hasNext: boolean, _label: string) => {
  return (
    <button
      className='absolute top-0 right-0 z-[1] flex 
      h-[100%] w-[10px] items-center justify-center 
      bg-black/20 opacity-20 transition-all duration-700 ease-in hover:opacity-100
      md:w-[30px] xl:w-[50px]'
      onClick={clickHandler}
    >
      <Icon.ChevronRight className='aspect-[36.6/65] h-auto w-[50%]' fill={'#FFFFFF'} />
    </button>
  );
};

export default CarouselArrowNext;
