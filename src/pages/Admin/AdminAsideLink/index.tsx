import { SVGProps, useState } from 'react';
import { NavLink, useLocation } from 'react-router-dom';

import { Icon } from '../../../components';

type AdminAsideLinkProps = {
  path:
    | 'patient'
    | 'doctor'
    | 'nurse'
    | 'material'
    | 'exam'
    | 'exercise'
    | 'question'
    | 'subject'
    | 'chapter'
    | 'mockTest'
    | 'event'
    | 'bookFair'
    | 'video';
  titleName: string;
  isOpen: boolean;
  handleClick: (
    type:
      | 'patient'
      | 'doctor'
      | 'nurse'
      | 'material'
      | 'exam'
      | 'exercise'
      | 'question'
      | 'subject'
      | 'chapter'
      | 'mockTest'
      | 'event'
      | 'bookFair'
      | 'video'
  ) => void;
  IconProp: React.FC<SVGProps<SVGSVGElement>>;
};

const AdminAsideLink: React.FC<AdminAsideLinkProps> = ({
  path,
  titleName,
  isOpen,
  handleClick,
  IconProp,
}) => {
  const { pathname } = useLocation();
  const [isHover, setIsHover] = useState(false);
  const [isHoverListButton, setIsHoverListButton] = useState(false);
  const [isHoverCreateButton, setIsHoverCreateButton] = useState(false);
  const [isHoverCheckinButton, setIsHoverCheckinButton] = useState(false);

  let pathLink;
  switch (path) {
    case 'patient':
      pathLink = 'patient';
      break;
    case 'doctor':
      pathLink = 'doctor';
      break;
    case 'nurse':
      pathLink = 'nurse';
      break;
    case 'question':
      pathLink = 'questions';
      break;
    case 'exam':
      pathLink = 'exam-archive';
      break;
    case 'exercise':
      pathLink = 'exercises';
      break;
    case 'mockTest':
      pathLink = 'mock-test';
      break;
    case 'bookFair':
      pathLink = 'book-fair';
      break;
    default:
      pathLink = path;
      break;
  }

  return (
    <div className='flex h-[fit-content] w-full flex-col bg-white transition-all duration-300 ease-linear'>
      <button
        className='z-20 flex w-full flex-row
              items-center justify-between rounded-[12px] bg-white px-[20px] py-[16px] transition-all duration-300 ease-in-out'
        onMouseEnter={() => setIsHover(true)}
        onMouseLeave={() => setIsHover(false)}
        onClick={() => handleClick(path)}
      >
        <div className='flex flex-row items-center justify-start gap-x-[16px]'>
          <IconProp fill={pathname.includes(`/${pathLink}`) || isHover ? '#4285F4' : '#5B5B5B'} />
          <p
            style={{
              color: pathname.includes(`/${pathLink}`) || isHover ? '#4285F4' : '#5B5B5B',
            }}
          >
            {`${titleName} Management`}
          </p>
        </div>
        <Icon.ChevronUp
          className={`${isOpen ? '' : 'rotate-180'} transition-all duration-300 ease-linear`}
          fill={
            pathname.includes(`/${pathLink}`) || pathname.includes(`/${pathLink}/create`) || isHover
              ? '#4285F4'
              : '#5B5B5B'
          }
          width={'20px'}
        />
      </button>
      <nav
        className='flex flex-col pl-10 pr-5 transition-all ease-in-out'
        style={{
          maxHeight: isOpen ? '300px' : '0px',
          overflow: 'hidden',
          transitionDuration: isOpen ? '1.2s' : '0.8s',
        }}
      >
        <NavLink
          to={`/${pathLink}/manage`}
          className='flex w-full flex-row items-center justify-start gap-x-[16px] rounded-[12px] bg-transparent px-[20px] py-[16px]'
          style={(a) => ({
            color: a.isActive || a.isPending || isHoverListButton ? '#4285F4' : '#5B5B5B',
            backgroundColor:
              a.isActive || a.isPending || isHoverListButton ? '#f1f6fe' : 'transparent',
          })}
          onMouseEnter={() => setIsHoverListButton(true)}
          onMouseLeave={() => setIsHoverListButton(false)}
        >
          {`${titleName} List`}
        </NavLink>
        <NavLink
          to={`/${pathLink}/create`}
          className='flex w-full flex-row items-center justify-start gap-x-[16px] rounded-[12px] bg-transparent px-[20px] py-[16px]'
          style={(a) => ({
            color: a.isActive || a.isPending || isHoverCreateButton ? '#4285F4' : '#5B5B5B',
            backgroundColor:
              a.isActive || a.isPending || isHoverCreateButton ? '#f1f6fe' : 'transparent',
          })}
          onMouseEnter={() => setIsHoverCreateButton(true)}
          onMouseLeave={() => setIsHoverCreateButton(false)}
        >
          {`Create ${titleName}`}
        </NavLink>
        {path === 'bookFair' && (
          <NavLink
            to={`/${pathLink}/checkin`}
            className='flex w-full flex-row items-center justify-start gap-x-[16px] rounded-[12px] bg-transparent px-[20px] py-[16px]'
            style={(a) => ({
              color: a.isActive || a.isPending || isHoverCheckinButton ? '#4285F4' : '#5B5B5B',
              backgroundColor:
                a.isActive || a.isPending || isHoverCheckinButton ? '#f1f6fe' : 'transparent',
            })}
            onMouseEnter={() => setIsHoverCheckinButton(true)}
            onMouseLeave={() => setIsHoverCheckinButton(false)}
          >
            Điểm danh
          </NavLink>
        )}
      </nav>
    </div>
  );
};

export default AdminAsideLink;
