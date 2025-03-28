import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Icon } from '../../../components';
import { Option } from '../../../components/Header/SearchBar';
import { Page, Wrapper } from '../../../layout';
import ChapterService from '../../../service/chapter.service';
import MockTestService from '../../../service/mockTest.service';
import SubjectService from '../../../service/subject.service';
import { Slots } from '../../../types/mockTest';

const ViewSlot = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params?.id || '';
  const slotId = params?.slotId || '';
  const [slot, setSlot] = useState<Slots>();
  const [loading, setLoading] = useState(false);
  const [subjectOptions, setSubjectOptions] = useState<Option[]>([]);
  const [chapterOptionsAll, setChapterOptionsAll] = useState<Option[]>([]);

  const formattedDate = (date: number) => {
    const d = new Date(date);
    const dateString = d.getDate() < 10 ? `0${d.getDate()}` : `${d.getDate()}`;
    const monthString = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : `${d.getMonth() + 1}`;
    const hourString = d.getHours() < 10 ? `0${d.getHours()}` : `${d.getHours()}`;
    const minuteString = d.getMinutes() < 10 ? `0${d.getMinutes()}` : `${d.getMinutes()}`;
    const secondString = d.getSeconds() < 10 ? `0${d.getSeconds()}` : `${d.getSeconds()}`;
    return `${dateString}/${monthString}/${d.getFullYear()} ${hourString}:${minuteString}:${secondString}`;
  };

  useEffect(() => {
    SubjectService.getAll({}, true)
      .then((res) => {
        const { result: allSubjects } = res.data.payload;
        setSubjectOptions(
          allSubjects.map((sub) => {
            return {
              value: sub._id,
              label: sub.name,
            };
          })
        );
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }, []);

  useEffect(() => {
    setLoading(true);
    MockTestService.getById(id, true)
      .then((res) => {
        const result = res.data.payload;
        const slotInfo = result?.slots.find((el) => el.slotId === parseInt(slotId));
        setSlot(slotInfo);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id, slotId]);

  useEffect(() => {
    ChapterService.getAll({ subject: '' })
      .then((res) => {
        const { result: chapters } = res.data.payload;
        const listOption = chapters.map((chap) => ({
          value: chap._id,
          label: chap.name,
        }));
        setChapterOptionsAll(listOption);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }, []);

  return (
    <Page>
      <Wrapper className='flex flex-1 flex-col'>
        <div className='w-full bg-[#4285F4]/90 py-4'>
          <p className='text-center text-sm font-bold text-white md:text-2xl 3xl:text-4xl'>
            Xem ca thi thử
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
                    ID đợt thi thử: {id}
                  </p>
                  <p className='flex flex-[2.5] text-base lg:text-lg 3xl:text-xl'>
                    ID ca thi: {slotId}
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
                      value={slot?.name}
                      placeholder={''}
                      disabled
                    />
                  </div>
                  <div className='flex w-full flex-1 flex-row flex-wrap gap-x-8 gap-y-4'>
                    <div className='flex w-full min-w-[200px] flex-1 flex-col gap-y-1'>
                      <p className='flex flex-[2.5] text-base lg:text-lg 3xl:text-xl'>
                        Số người đăng ký
                      </p>
                      <div className='flex w-full flex-1 items-center rounded-lg border border-[#CCC] bg-[#efefef4d]  p-1 text-xs font-medium text-[#252641] lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'>
                        {slot?.registeredUsers?.length || 0}/{slot?.userLimit}
                      </div>
                    </div>
                    <div className='flex w-full min-w-[200px] flex-1 flex-col gap-y-1'>
                      <p className='flex flex-[2.5] text-base lg:text-lg 3xl:text-xl'>Bắt đầu</p>
                      <div className='flex w-full flex-1 items-center rounded-lg border border-[#CCC] bg-[#efefef4d]  p-1 text-xs font-medium text-[#252641] lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'>
                        {formattedDate(slot?.startedAt || 0) || 'Chưa có thời gian'}
                      </div>
                    </div>
                    <div className='flex w-full min-w-[200px] flex-1 flex-col gap-y-1'>
                      <p className='flex flex-[2.5] text-base lg:text-lg 3xl:text-xl'>Kết thúc</p>
                      <div className='flex w-full flex-1 items-center rounded-lg border border-[#CCC] bg-[#efefef4d]  p-1 text-xs font-medium text-[#252641] lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'>
                        {formattedDate(slot?.endedAt || 0) || 'Chưa có thời gian'}
                      </div>
                    </div>
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
                      {slot?.questions?.map((question) => (
                        <div
                          key={question?._id}
                          className='flex flex-1 flex-shrink-0 flex-row items-center gap-x-4 border-b border-b-[#CCC]/60
                        px-6 py-2 lg:py-4 lg:px-8 3xl:py-6 3xl:px-10'
                        >
                          <p className='flex flex-[2.5] text-xs font-medium lg:text-sm 3xl:text-base'>
                            {question?.name}
                          </p>
                          <p className='flex flex-[2] text-xs font-medium lg:text-sm 3xl:text-base'>
                            {subjectOptions.find((sub) => sub.value === question?.subject)?.label ||
                              ''}
                          </p>
                          <p className='flex flex-[1.2] text-xs font-medium lg:text-sm 3xl:text-base'>
                            {chapterOptionsAll.find((sub) => sub.value === question?.chapter)
                              ?.label || ''}
                          </p>
                          <p className='flex flex-[1.5] text-xs font-medium lg:text-sm 3xl:text-base'>
                            {formattedDate(question?.createdAt || 0)}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className='my-5 flex w-full flex-row justify-end'>
                    <div className='flex items-center justify-center'>
                      <Link
                        to={`/admin/mock-test/slot/edit/${id}/${slotId}`}
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

export default ViewSlot;
