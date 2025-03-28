import { useEffect, useRef, useState } from 'react';
import { NavLink } from 'react-router-dom';

import HCMUTLogo from '../../assets/logos/HCMUTLogo.png';
import { useThrottle } from '../../hooks';
import useBoundStore from '../../store';
import Icon from '../Icon';
import LoginButton from '../LoginButton';

const LargeHeader = () => {
  const libraryRef = useRef<HTMLDivElement>(null);
  const roomRef = useRef<HTMLDivElement>(null);
  const aboutUsRef = useRef<HTMLDivElement>(null);
  const profileRef = useRef<HTMLDivElement>(null);
  const eventRef = useRef<HTMLDivElement>(null);

  const [isLibraryOpen, setIsLibraryOpen] = useState(false);
  const [isRoomOpen, setIsRoomOpen] = useState(false);
  const [isAboutUsOpen, setIsAboutUsOpen] = useState(false);
  const [isProfileDrop, setIsProfileDrop] = useState(false);
  const [isEventsOpen, setIsEventOpen] = useState(false);

  const isAuthenticated = useBoundStore.use.isAuthenticated();
  const user = useBoundStore.use.user();
  const logout = useBoundStore.use.logout();

  useEffect(() => {
    document.addEventListener('click', (event) => {
      if (event.target instanceof HTMLElement) {
        if (libraryRef.current && !libraryRef.current.contains(event.target)) {
          setIsLibraryOpen(false);
        }
        if (roomRef.current && !roomRef.current.contains(event.target)) {
          setIsRoomOpen(false);
        }
        if (aboutUsRef.current && !aboutUsRef.current.contains(event.target)) {
          setIsAboutUsOpen(false);
        }
        if (profileRef.current && !profileRef.current.contains(event.target)) {
          setIsProfileDrop(false);
        }
        if (eventRef.current && !eventRef.current.contains(event.target)) {
          setIsEventOpen(false);
        }
      }
    });
  }, [libraryRef, roomRef, aboutUsRef, profileRef, eventRef]);

  const onLibraryClick = () => {
    setIsLibraryOpen(!isLibraryOpen);
  };

  const onProfileClick = () => setIsProfileDrop(!isProfileDrop);
  const onLogout = () => {
    logout();
    setIsProfileDrop(false);
  };

  const throttledLibraryClick = useThrottle(onLibraryClick);

  return (
    <div
      className='relative top-0 z-30 hidden min-h-[68px] w-full flex-row flex-wrap items-center
        justify-between bg-white px-8 shadow-md md:flex md:px-5 lg:px-10 xl:px-20 3xl:px-[100px]'
    >
      <div className='flex flex-row text-[14px] md:text-[14px] lg:gap-x-4 xl:gap-x-6 xl:text-[16px] 2xl:gap-x-8 3xl:gap-x-10 3xl:text-[20px]'>
        <NavLink
          to='/'
          className='flex aspect-[107/60] min-h-[36px] w-auto flex-1 items-center py-3 lg:py-4'
        >
          <img src={HCMUTLogo} alt='logo' className='h-[28px] w-auto  xl:h-[36px] 2xl:h-[42px]' />
        </NavLink>
      </div>
      <div className='relative flex h-full flex-row items-center justify-end md:gap-x-10 lg:gap-x-8 3xl:gap-x-10'>
        {!isAuthenticated && <LoginButton />}
        {isAuthenticated && (
          <>
            <div ref={profileRef}>
              <button
                className='flex flex-row items-center justify-center'
                onClick={onProfileClick}
              >
                <img
                  alt='profile_pic'
                  src={user?.picture || require('../../assets/images/AvatarPic.png')}
                  className='mr-4 h-8 w-8 rounded-full border-2
                    border-[#49BBBD] bg-white 2xl:h-[40px] 2xl:w-[40px] 3xl:mr-6 3xl:h-[44px] 3xl:w-[44px]'
                />
                <Icon.ChevronUp
                  fill={'#3b3b3b'}
                  fillOpacity={0.87}
                  className={`transform-all aspect-[10/7] h-auto w-2 duration-300 ${
                    isProfileDrop ? 'rotate-0' : 'rotate-180'
                  }`}
                />
              </button>
            </div>
            <nav
              className='set-11 absolute right-0 top-[136%] z-10 mt-1 flex w-[200px] flex-col
                 rounded-lg bg-[#FBFCFF]
                transition-all duration-300'
              style={{
                transform: isProfileDrop ? 'translateY(0%)' : 'translateY(10%)',
                maxHeight: isProfileDrop ? '1000px' : '0px',
                opacity: isProfileDrop ? 1 : 0,
                overflow: 'hidden',
                boxShadow: '0px 0px 20px rgba(0, 0, 0, 0.1)',
              }}
            >
              <NavLink
                to='/profile'
                end
                className='flex w-full items-center justify-center bg-inherit px-[16px] py-[8px] text-[#5B5B5B] hover:bg-[#F1F1F1] 3xl:px-[32px] 3xl:py-[12px]'
                onClick={throttledLibraryClick}
              >
                <p
                  className='whitespace-nowrap bg-inherit px-2
                py-1 text-[14px] font-normal 3xl:px-3
                3xl:py-2 3xl:text-[18px]
                '
                >
                  Thông tin của tôi
                </p>
              </NavLink>
              <button
                className='bg-inherit px-[16px] py-[8px] hover:bg-[#F1F1F1] 3xl:px-[32px] 3xl:py-[12px]'
                onClick={onLogout}
              >
                <p
                  className='whitespace-nowrap bg-inherit px-2 py-1 text-[14px] font-bold text-[#B42926] 3xl:px-3
                    3xl:py-2 3xl:text-[18px]'
                >
                  Đăng xuất
                </p>
              </button>
            </nav>
          </>
        )}
      </div>
    </div>
  );
};

export default LargeHeader;
