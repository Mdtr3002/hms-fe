import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Icon, InputNumber } from '../../../components';
import { Page, Wrapper } from '../../../layout';
import QuizTemplateService from '../../../service/quiz.service';
import { Quiz } from '../../../types';

const ViewExercisePage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params?.exerciseId ?? '';
  const [exercises, setExercises] = useState<Quiz>();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    QuizTemplateService.getById(id, true)
      .then((res) => {
        const result = res.data.payload;
        setExercises(result);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      })
      .finally(() => setLoading(false));
  }, [id]);

  return (
    <Page>
      <Wrapper className='flex flex-1 flex-col'>
        <div className='w-full bg-[#4285F4]/90 py-4'>
          <p className='text-center text-sm font-bold text-white md:text-2xl 3xl:text-4xl'>
            Xem bài tập rèn luyện
          </p>
        </div>
        <div className='w-full p-4'>
          <button
            type='button'
            onClick={() => navigate(-1)}
            className='mb-2 flex items-center hover:underline'
          >
            <Icon.Chevron className='h-5 -rotate-90 fill-black' />
            <p className='text-sm text-[#5B5B5B]'>Quay lại</p>
          </button>
          <div className='h-full w-full rounded-lg bg-white p-4 lg:p-6 3xl:p-8'>
            <main className='flex flex-col gap-y-4'>
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
                <>
                  <p className='flex flex-[2.5] text-base lg:text-lg 3xl:text-xl'>
                    ID bài tập rèn luyện: {id}
                  </p>
                  <div className='flex flex-col gap-y-1'>
                    <label
                      className='flex flex-[2.5] text-base lg:text-lg 3xl:text-xl'
                      htmlFor='question_name'
                    >
                      Tên
                    </label>
                    <input
                      id='question_name'
                      className='flex w-full flex-1 rounded-lg border border-[#D9D9D9] p-1 text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'
                      value={exercises?.name}
                      placeholder={''}
                      disabled
                    />
                  </div>
                  <div className='flex w-full flex-1 flex-row flex-wrap gap-x-8 gap-y-4'>
                    <div className='flex w-full min-w-[200px] flex-1 flex-col gap-y-1'>
                      <p className='flex flex-[2.5] text-base lg:text-lg 3xl:text-xl'>Môn</p>
                      <div className='flex w-full flex-1 items-center rounded-lg border border-[#CCC] bg-[#efefef4d]  p-1 text-xs font-medium text-[#252641] lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'>
                        {exercises?.subject?.name}
                      </div>
                    </div>
                    <div className='flex w-full min-w-[200px] flex-1 flex-col gap-y-1'>
                      <p className='flex flex-[2.5] text-base lg:text-lg 3xl:text-xl'>Chương</p>
                      <div className='flex w-full flex-1 items-center rounded-lg border border-[#CCC] bg-[#efefef4d]  p-1 text-xs font-medium text-[#252641] lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'>
                        {exercises?.chapter?.name}
                      </div>
                    </div>
                    <div className='flex w-full flex-[2] flex-row flex-wrap gap-x-8 gap-y-4'>
                      <div className='flex min-w-[300px] flex-[2] flex-col'>
                        <p className='flex w-full flex-[2.5] text-base lg:text-lg 3xl:text-xl'>
                          Thời gian làm bài (hh:mm:ss)
                        </p>
                        <div className='flex w-full flex-1 justify-around gap-x-2'>
                          <InputNumber
                            containerClassName='w-1/3 border border-[#D9D9D9] rounded-lg'
                            className='rounded-lg p-1 text-center text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'
                            controllerClassName='rounded-lg'
                            buttonClassName='rounded-lg md:pl-2 md:pr-[10px] lg:pl-3 lg:pr-[15px] 3xl:pl-4 3xl:pr-5 3xl:py-3'
                            value={Math.floor((exercises?.duration ?? 0) / 3600000)}
                            disabled
                          />
                          <InputNumber
                            containerClassName='w-1/3 border border-[#D9D9D9] rounded-lg'
                            className='rounded-lg p-1 text-center text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'
                            controllerClassName='rounded-lg'
                            buttonClassName='rounded-lg md:pl-2 md:pr-[10px] lg:pl-3 lg:pr-[15px] 3xl:pl-4 3xl:pr-5 3xl:py-3'
                            value={Math.floor((exercises?.duration ?? 0) / 60000) % 60}
                            disabled
                          />
                          <InputNumber
                            containerClassName='w-1/3 border border-[#D9D9D9] rounded-lg'
                            className='rounded-lg p-1 text-center text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'
                            controllerClassName='rounded-lg'
                            buttonClassName='rounded-lg md:pl-2 md:pr-[10px] lg:pl-3 lg:pr-[15px] 3xl:pl-4 3xl:pr-5 3xl:py-3'
                            value={Math.floor((exercises?.duration ?? 0) / 1000) % 60}
                            disabled
                          />
                        </div>
                      </div>
                      <div className='flex min-w-[100px] flex-1 flex-col'>
                        <p className='flex flex-[2.5] whitespace-nowrap text-base lg:text-lg 3xl:text-xl'>
                          Số câu hỏi
                        </p>
                        <InputNumber
                          containerClassName='border border-[#D9D9D9] rounded-lg'
                          className='rounded-lg p-1 text-center text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'
                          controllerClassName='rounded-lg'
                          buttonClassName='rounded-lg md:pl-2 md:pr-[10px] lg:pl-3 lg:pr-[15px] 3xl:pl-4 3xl:pr-5 3xl:py-3'
                          value={exercises?.sampleSize ?? 0}
                          disabled
                        />
                      </div>
                    </div>
                  </div>

                  <div className='flex flex-col gap-y-1'>
                    <label
                      className='flex flex-[2.5] text-base lg:text-lg 3xl:text-xl'
                      htmlFor='description'
                    >
                      Chú thích
                    </label>
                    <textarea
                      id='description'
                      rows={10}
                      className='flex w-full flex-1 rounded-lg border border-[#D9D9D9] p-1 text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'
                      value={exercises?.description}
                      placeholder={''}
                      disabled
                    />
                  </div>
                  <div className='flex flex-col gap-y-8'>
                    <div className='flex flex-row items-center gap-x-8'>
                      <label
                        className='flex text-base lg:text-lg 3xl:text-xl'
                        htmlFor='search_question'
                      >
                        Các câu hỏi có thể ra
                      </label>
                    </div>
                    <div>
                      <div className='mb-5 flex flex-1 flex-shrink-0 flex-row gap-x-4 px-6 lg:px-8 3xl:px-10'>
                        <p className='flex flex-[2.5] text-base text-[#4285f4] lg:text-lg 3xl:text-xl'>
                          Tên
                        </p>
                        <p className='flex flex-[2] text-base text-[#4285F4] lg:text-lg 3xl:text-xl'>
                          Môn
                        </p>
                        <p className='flex flex-[1.2] text-base text-[#4285F4] lg:text-lg 3xl:text-xl'>
                          Chương
                        </p>
                        <p className='flex flex-[1.5] text-base text-[#4285F4] lg:text-lg 3xl:text-xl'>
                          Thời gian tạo
                        </p>
                      </div>
                      {exercises?.potentialQuestions?.map((question) => (
                        <div
                          key={question._id}
                          className='flex flex-1 flex-shrink-0 flex-row items-center gap-x-4 border-b border-b-[#CCC]/60
                        px-6 py-2 lg:py-4 lg:px-8 3xl:py-6 3xl:px-10'
                        >
                          <p className='flex flex-[2.5] text-xs font-medium lg:text-sm 3xl:text-base'>
                            {question.name}
                          </p>
                          <p className='flex flex-[2] text-xs font-medium lg:text-sm 3xl:text-base'>
                            {question?.subject?.name}
                          </p>
                          <p className='flex flex-[1.2] text-xs font-medium lg:text-sm 3xl:text-base'>
                            {question?.chapter?.name}
                          </p>
                          <p className='flex flex-[1.5] text-xs font-medium lg:text-sm 3xl:text-base'>
                            {new Date(question.createdAt).toLocaleString()}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className='my-5 flex w-full flex-row justify-between'>
                    <div className='flex w-full flex-row items-center justify-start gap-x-4'>
                      <p className='flex text-sm font-medium lg:text-base 3xl:text-base'>
                        Hiển thị với người dùng:
                      </p>
                      <input
                        type='checkbox'
                        className='allow-checked h-7 w-7 cursor-not-allowed'
                        checked={!exercises?.isHidden}
                        disabled
                      />
                    </div>
                    <div className='flex items-center justify-center'>
                      <Link
                        to={`/admin/exercises/edit/${id}`}
                        className='w-fit cursor-pointer rounded-lg bg-[#4285F4]/80 px-1 transition-all duration-200 hover:bg-[#4285F4] lg:px-3 3xl:px-5'
                      >
                        <p className='whitespace-nowrap p-1 text-xs font-medium text-white lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'>
                          Chỉnh sửa
                        </p>
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </main>
          </div>
        </div>
      </Wrapper>
    </Page>
  );
};

export default ViewExercisePage;
