const CarouselIndicator = (
  clickHandler: (e: React.MouseEvent<Element, MouseEvent> | React.KeyboardEvent<Element>) => void,
  isSelected: boolean,
  _index: number,
  _label: string
) => {
  return (
    <button
      className='mx-4 h-2 w-7 rounded-full transition-colors duration-700 
      ease-in-out md:mx-2 md:h-2 md:w-[30px] md:rounded-md 3xl:h-3
      3xl:w-10'
      style={{ backgroundColor: isSelected ? '#4285F4' : 'rgba(100, 100, 100, 0.5)' }}
      onClick={clickHandler}
    />
  );
};

export default CarouselIndicator;
