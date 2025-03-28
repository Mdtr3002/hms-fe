import { ReactNode } from 'react';
import { useLocation, useParams } from 'react-router-dom';

import useBoundStore from '../../store';

type WrapperProps = {
  children: ReactNode;
  className?: string;
};

const Wrapper: React.FC<WrapperProps> = ({ children, className }) => {
  const { pathname } = useLocation();
  const isAsideOpen = useBoundStore.use.isAsideOpen();
  const params = useParams();
  const pdfId = params?.pdfId ?? '';

  return (
    <div
      className={`with-nav-height flex flex-1 overflow-y-auto ${
        pathname.includes('/admin') ? 'bg-[#e0edfb]' : pdfId !== '' ? `bg-[#fcfbf9]` : 'bg-white'
      }`}
    >
      <div
        id='content-wrapper'
        className={`h-fit w-fit overflow-x-auto pl-0 transition-all duration-300 ${
          isAsideOpen ? 'md:pl-[264px] lg:pl-[332px] xl:pl-[400px] 3xl:pl-[500px]' : ''
        } ${className}`}
      >
        {children}
      </div>
    </div>
  );
};

export default Wrapper;
