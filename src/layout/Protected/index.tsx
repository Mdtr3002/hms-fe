import _ from 'lodash';
import React, { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

import { ReactComponent as Tab } from '../../assets/svgs/Tab.svg';
import useBoundStore from '../../store';
import Wrapper from '../Wrapper';

type ProtectedRouteProps = {
  admin?: boolean;
};

const Protected: React.FC<ProtectedRouteProps> = ({ admin = false } = {}) => {
  const isAuthenticated = useBoundStore.use.isAuthenticated();
  const user = useBoundStore.use.user();
  const openSignInModal = useBoundStore.use.openSignInModal();

  const { pathname } = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      openSignInModal();
    }
  }, [isAuthenticated, openSignInModal]);

  if (!isAuthenticated) {
    return (
      <>
        <Navigate to='/' />
      </>
    );
  }

  if (
    admin &&
    !user.isManager &&
    !_.some(user.accessLevels, (accessLevel) => accessLevel.name.includes('ADMIN'))
  ) {
    return (
      <>
        <Navigate to='/' />
      </>
    );
  }

  return (
    <>
      <Outlet />
      {!admin ||
      pathname !== '/admin' ||
      (!user.isManager &&
        !_.some(user.accessLevels, (accessLevel) => accessLevel.name.includes('ADMIN'))) ? null : (
        <Wrapper className='flex flex-1 flex-col'>
          <div className='mb-6 flex-1 space-y-5 px-5 pt-5 md:space-y-6 md:pt-0 lg:px-9 lg:pt-8 xl:space-y-7 xl:px-10 xl:pt-10 2xl:space-y-8 2xl:px-11 2xl:pt-11'>
            <div className='z-10 mt-2 rounded-[20px] bg-white px-4 py-3 md:mt-4 md:p-5 lg:mt-5 xl:mt-6 xl:p-6 2xl:mt-7 2xl:p-7'>
              <Tab className='mx-auto w-[200px] p-7 xl:w-[300px]' />
              <p className='w-full text-center'>Chọn một mục</p>
            </div>
          </div>
        </Wrapper>
      )}
    </>
  );
};

export default Protected;
