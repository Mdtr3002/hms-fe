import { SVGProps } from 'react';
import { NavLink } from 'react-router-dom';

import { default as IconComponent } from '../Icon';

type AsideLinkProps = {
  to: string;
  Icon: React.FC<SVGProps<SVGSVGElement>>;
  content: string;
};

const AsideLink: React.FC<AsideLinkProps> = ({ to, content, Icon }) => {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? `group flex flex-1 items-center justify-between rounded-lg border-[1px] border-[#4285F4] bg-[#9DCCFF] 
          bg-opacity-30 px-5 py-3 transition-all duration-300 
          hover:bg-[#4285F4] hover:bg-opacity-90 
          md:bg-[#4285F4] md:bg-opacity-90 3xl:px-6 3xl:py-4`
          : `group flex flex-1 items-center justify-between rounded-lg border-0 border-[#4285F4] bg-[#9DCCFF]/30 px-5 py-4 transition-all duration-300
          hover:bg-[#4285F4]/80 md:border-[1px] md:bg-white md:bg-transparent 
          md:py-3 3xl:px-6 3xl:py-4`
      }
    >
      {({ isActive }) => (
        <>
          <div className='flex items-center space-x-4'>
            <Icon
              className={
                isActive
                  ? 'fill-white group-hover:fill-white'
                  : 'fill-[#252641] group-hover:fill-white'
              }
            />
            <p
              className={`max-w-[200px] truncate font-medium md:max-w-[96px] md:font-normal lg:max-w-[175px] xl:max-w-[200px] ${
                isActive
                  ? 'text-[#252641] group-hover:text-white md:text-white'
                  : 'text-[#252641] group-hover:text-white'
              }  `}
            >
              {content}
            </p>
          </div>
          <IconComponent.ChevronRight
            className={`max-w-2 min-w-2 min-h-3 hidden h-auto max-h-3 md:block ${
              isActive ? 'md:fill-white' : 'fill-[#252641] group-hover:fill-white'
            } `}
          />
        </>
      )}
    </NavLink>
  );
};

export default AsideLink;
