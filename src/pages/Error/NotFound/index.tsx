import React from 'react';

import { ReactComponent as NotFoundVector } from '../../../assets/svgs/404.svg';
import { Page } from '../../../layout';

const NotFoundPage: React.FC = () => {
  return (
    <Page title='Không tìm thấy trang'>
      <div className='z-10 flex min-h-[100svh] flex-col items-center justify-center rounded-[20px] bg-white px-4 py-3 md:p-5 xl:p-6 2xl:p-7'>
        <NotFoundVector className='mx-auto w-[200px] p-7 md:w-[400px] xl:w-[500px]' />
        <p className='w-full text-center text-3xl text-blue-600'>
          Rất tiếc chúng tôi không tìm thấy trang bạn cần !
        </p>
      </div>
    </Page>
  );
};

export default NotFoundPage;
