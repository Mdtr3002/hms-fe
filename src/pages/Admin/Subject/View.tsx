import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Icon } from '../../../components';
import { Page, Wrapper } from '../../../layout';
import SubjectService from '../../../service/subject.service';
import { Subject } from '../../../types';

const SubjectView = () => {
  const params = useParams();
  const id = params?.id ?? '';
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState<Subject>();

  useEffect(() => {
    setLoading(true);
    SubjectService.getById(id, true)
      .then((res) => {
        const result = res.data.payload;
        setSubject(result);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  return (
    <Page>
      <Wrapper className='flex flex-1 flex-col'>
        <div className='w-full bg-[#4285F4]/90 py-4'>
          <p className='text-center text-sm font-bold text-white md:text-2xl 3xl:text-4xl'>
            Xem thông tin Môn học
          </p>
        </div>
        <div className='w-full p-4'>
          <Link className='mb-2 flex items-center hover:underline' to={`/admin/subject/manage`}>
            <Icon.Chevron className='h-5 -rotate-90 fill-black' />
            <p className='text-sm text-[#5B5B5B]'>Quay lại</p>
          </Link>
          <div
            className='h-full w-full rounded-lg bg-white px-8 py-2
            lg:px-10 lg:py-4 3xl:px-12 3xl:py-8'
          >
            {loading ? (
              <>
                <p className='mb-5 w-full px-6 lg:px-8 3xl:px-10'>
                  <Skeleton width={'100%'} baseColor='#9DCCFF' height={56} />
                </p>
                <p className='w-full px-6 lg:px-8 3xl:px-10'>
                  {
                    <Skeleton
                      count={10}
                      className='my-2 box-content lg:my-4 3xl:my-6'
                      width={'100%'}
                      height={40}
                      baseColor='#9DCCFF'
                    />
                  }
                </p>
              </>
            ) : (
              <main className='flex flex-col gap-y-4'>
                <p className='flex flex-[2.5] text-base lg:text-lg 3xl:text-xl'>ID môn học: {id}</p>
                <div className='flex flex-col gap-y-1'>
                  <label
                    className='flex flex-[2.5] text-base lg:text-lg 3xl:text-xl'
                    htmlFor='name'
                  >
                    Tên
                  </label>
                  <div
                    id='exam-name'
                    className='flex w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium
                  lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'
                  >
                    {subject?.name}
                  </div>
                </div>

                {/**
                 * Description field
                 */}
                <div className='flex flex-col gap-y-1'>
                  <label
                    className='flex flex-[2.5] text-base lg:text-lg 3xl:text-xl'
                    htmlFor='description'
                  >
                    Chú thích
                  </label>
                  <div
                    className='flex w-full rounded-lg border border-[#CCC] p-1 text-xs
                  font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'
                  >
                    {subject?.description ? subject.description : 'Không có chú thích'}
                  </div>
                </div>
                {/**
                 * Create button
                 */}
                <div className='my-4 flex w-full justify-end'>
                  <button
                    type='button'
                    onClick={() => navigate(`/admin/subject/edit/${params.id}`)}
                    className='w-fit cursor-pointer rounded-lg bg-[#4285F4]/80 px-1 transition-all duration-200 hover:bg-[#4285F4] lg:px-3 3xl:px-5'
                  >
                    <p className='p-1 text-xs font-medium text-white lg:p-2 lg:text-sm 3xl:p-3 3xl:text-base'>
                      Chỉnh sửa
                    </p>
                  </button>
                </div>
              </main>
            )}
          </div>
        </div>
      </Wrapper>
    </Page>
  );
};

export default SubjectView;
