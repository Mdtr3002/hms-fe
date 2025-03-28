import { ReactNode } from 'react';

import LazyLoadImage from '../LazyLoadImage';

type ParagraphWithImgProps = {
  title?: string;
  titleStyles?: string;
  children: ReactNode;
  imageStyles?: string;
  image?: string;
  imagePlaceholder?: string;
  imageAlt?: string;
};

const ParagraphWithImg = (props: ParagraphWithImgProps) => {
  const {
    title,
    titleStyles = '',
    children,
    imageStyles = '',
    image,
    imagePlaceholder,
    imageAlt = '',
  } = props;

  return (
    <div className='mt-7 flex w-full flex-col items-start justify-between gap-5 md:mt-12 md:flex-row md:gap-8 md:px-12 lg:gap-12 lg:px-24 2xl:gap-[56px] 2xl:px-32 3xl:px-40'>
      <div
        className={`flex flex-col justify-center gap-2 lg:gap-4 2xl:gap-5 ${
          image && imagePlaceholder && 'md:max-w-[46%]'
        }`}
      >
        {title && (
          <h2
            className={`text-start text-[24px] font-semibold text-[#000000] xl:text-[28px] 2xl:text-[32px] ${titleStyles}`}
          >
            {title}
          </h2>
        )}
        <p className='z-[1] text-start leading-7 text-[#696984] md:leading-7 lg:leading-9 2xl:leading-10'>
          {children}
        </p>
      </div>
      {image && imagePlaceholder && (
        <div className='w-[100%] md:w-[50%]'>
          <LazyLoadImage
            className={`z-[1] block rounded-[20px] ${imageStyles}`}
            src={image}
            placeHolderSrc={imagePlaceholder}
            alt={imageAlt}
            objectFit='cover'
          />
        </div>
      )}
    </div>
  );
};

export default ParagraphWithImg;
