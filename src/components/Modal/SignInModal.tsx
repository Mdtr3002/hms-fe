import { Dialog, Transition } from '@headlessui/react';
import { Fragment, FC } from 'react';
import { useLocation } from 'react-router-dom';

import { LazyLoadImage, LoginButton } from '..';
import useBoundStore from '../../store';

const SignInModal: FC = () => {
  const isOpen = useBoundStore.use.isSignInModalOpen();
  const closeSignInModal = useBoundStore.use.closeSignInModal();
  const { pathname } = useLocation();

  return (
    <Transition appear show={isOpen && pathname === '/'} as={Fragment}>
      <Dialog as='div' className='relative z-50' onClose={closeSignInModal}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-25' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel className='w-full max-w-md transform overflow-hidden rounded-lg bg-white text-left align-middle shadow-xl transition-all'>
                <div className='relative w-full p-6'>
                  <LazyLoadImage
                    src={require('../../assets/images/IntroductionPic.jpg')}
                    placeHolderSrc={require('../../assets/images/Introduction-placeholder.jpg')}
                    containerClassName='absolute w-[calc(100%+48px)] -m-6'
                    alt='Introduction'
                    className='object-[50%_60%] brightness-[0.4]'
                    objectFit='cover'
                  />
                  <div className='relative z-[1]'>
                    <Dialog.Title
                      as='h3'
                      className='text-center text-2xl font-semibold leading-snug text-white'
                    >
                      Đăng nhập tài khoản
                    </Dialog.Title>
                    <Dialog.Description className='mt-2 text-justify text-base text-white' as='p'>
                      Bạn cần đăng nhập bằng tài khoản Google để có thể truy cập tính năng này
                    </Dialog.Description>
                  </div>
                </div>

                <div className='flex items-center justify-center p-6'>
                  <LoginButton />
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default SignInModal;
