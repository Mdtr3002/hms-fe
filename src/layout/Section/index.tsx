type SectionProps = {
  children: React.ReactNode;
  containerClass?: string;
  className?: string;
};

const Section: React.FC<SectionProps> = ({ children, containerClass, className }) => {
  return (
    <section
      className={`flex w-full flex-col gap-y-9 px-5 py-8 md:gap-y-12 md:px-[48px] lg:gap-y-20 lg:px-24 xl:py-10 2xl:gap-y-24 2xl:py-12 2xl:px-32 3xl:gap-y-28 3xl:py-14 3xl:px-40 ${containerClass}`}
    >
      <div className='flex flex-col gap-y-12 md:gap-y-24 lg:gap-y-32 xl:gap-y-40 2xl:gap-y-44 3xl:gap-48'>
        <div
          className={`flex w-full flex-col-reverse items-center justify-center gap-y-8 md:flex-row md:justify-between md:gap-x-16 lg:gap-x-24 2xl:gap-x-32 3xl:gap-x-40 ${className}`}
        >
          {children}
        </div>
      </div>
    </section>
  );
};

export default Section;
