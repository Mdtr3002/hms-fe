import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import Skeleton from 'react-loading-skeleton';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Icon } from '../../../components';
import { Option } from '../../../components/Select';
import { useDebounce } from '../../../hooks';
import { Page, Wrapper } from '../../../layout';
import ChapterService from '../../../service/chapter.service';
import MockTestService from '../../../service/mockTest.service';
import SubjectService from '../../../service/subject.service';
import { SlotQuestion, Slots } from '../../../types/mockTest';

interface CustomTimeInputProps {
  date: Date | null;
  onChangeCustom: (date: Date | null, time: string, isStartDate: boolean) => void;
  isStartDate: boolean;
}

const CustomTimeInput: React.FC<CustomTimeInputProps> = ({ date, onChangeCustom, isStartDate }) => {
  const value =
    date instanceof Date
      ? // Getting time from Date because `value` comes here without seconds
        date.toLocaleTimeString('it-IT')
      : '';

  return (
    <input
      type='time'
      step='1'
      value={value}
      onChange={(event) => onChangeCustom(date, event.target.value, isStartDate)}
    />
  );
};

const EditSlot = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params?.id ?? '';
  const slotId = params?.slotId ?? '';
  const [slot, setSlot] = useState<Slots>();
  const [name, setName] = useState('');
  const [duration, setDuration] = useState({ start: 0, end: 0 });
  const [limit, setLimit] = useState(0);
  const [subject] = useState('');
  const [chapter, setChapter] = useState('');

  const [potentialQuestions, setPotentialQuestions] = useState<SlotQuestion[]>([]);

  const [subjectOptions, setSubjectOptions] = useState<Option[]>([]);
  const [chapterOptionsAll, setChapterOptionsAll] = useState<Option[]>([]);

  const [loading, setLoading] = useState(false);
  const [canSave, setCanSave] = useState(false);

  const handleChangeTime = (date: Date | null, time: string, isStartDate: boolean) => {
    const [hh, mm, ss] = time.split(':');
    const targetDate = date instanceof Date ? date : new Date();
    targetDate.setHours(Number(hh) || 0, Number(mm) || 0, Number(ss) || 0);
    if (isStartDate) {
      setDuration({ ...duration, start: new Date(targetDate || 0).getTime() });
    } else setDuration({ ...duration, end: new Date(targetDate || 0).getTime() });
  };

  const formattedDate = (date: number) => {
    const d = new Date(date);
    const dateString = d.getDate() < 10 ? `0${d.getDate()}` : `${d.getDate()}`;
    const monthString = d.getMonth() + 1 < 10 ? `0${d.getMonth() + 1}` : `${d.getMonth() + 1}`;
    const hourString = d.getHours() < 10 ? `0${d.getHours()}` : `${d.getHours()}`;
    const minuteString = d.getMinutes() < 10 ? `0${d.getMinutes()}` : `${d.getMinutes()}`;
    const secondString = d.getSeconds() < 10 ? `0${d.getSeconds()}` : `${d.getSeconds()}`;
    return `${dateString}/${monthString}/${d.getFullYear()} ${hourString}:${minuteString}:${secondString}`;
  };

  const fetchData = useCallback(() => {
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
      .finally(() => setLoading(false));
  }, [id, slotId]);

  useEffect(() => {
    if (slot) {
      setName(slot.name);
      setDuration({ start: slot.startedAt, end: slot.endedAt });
      setLimit(slot.userLimit);
      setPotentialQuestions(slot?.questions ?? []);
    }
  }, [slot]);

  const handleOnSetSave = useDebounce(() => {
    if (slot) {
      const data1 = {
        name,
        duration,
        limit,
        potentialQuestions: potentialQuestions,
      };
      const data2 = {
        name: slot.name,
        duration: { start: slot.startedAt, end: slot.endedAt },
        limit: slot.userLimit,
        potentialQuestions: slot.questions,
      };
      setCanSave(!_.isEqual(data1, data2));
    }
  });

  const handleOnSave = useDebounce(() => {
    setLoading(true);
    const mockTestId = id;
    const slotNumber = parseInt(slotId) || 0;
    MockTestService.editSlot(
      {
        name,
        userLimit: limit,
        startedAt: duration.start,
        endedAt: duration.end,
        questions: potentialQuestions.map((question) => question._id),
      },
      mockTestId,
      slotNumber
    )
      .then(() => {
        toast.success('Chỉnh sửa ca thi thành công');
        fetchData();
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      })
      .finally(() => setLoading(false));
  });

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect((): void => {
    handleOnSetSave();
  }, [name, duration, limit, potentialQuestions, handleOnSetSave]);

  useEffect(() => {
    SubjectService.getAll({})
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
    if (subject === '') {
      setChapter('');
      return;
    }
    ChapterService.getAll({ subject: subject })
      .then((res) => {
        const { result: chapters } = res.data.payload;
        const listOption = chapters.map((chap) => ({
          value: chap._id,
          label: chap.name,
        }));
        if (listOption.length === 0 || !listOption.find((option) => option.value === chapter)) {
          setChapter('');
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject]);

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
  }, [subject]);

  return (
    <Page>
      <Wrapper className='flex flex-1 flex-col'>
        <div className='w-full bg-[#4285F4]/90 py-4'>
          <p className='text-center text-sm font-bold text-white md:text-2xl 3xl:text-4xl'>
            Chỉnh sửa ca thi thử
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
            <main className='flex w-full flex-col gap-y-4'>
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
                      value={name}
                      placeholder={'Nhập tên bài tập'}
                      onChange={({ target }) => setName(target.value)}
                    />
                  </div>
                  <div className='flex w-full flex-1 flex-row flex-wrap gap-x-8 gap-y-4'>
                    <div className='flex flex-1 flex-col'>
                      <p className='mb-2 w-full text-sm lg:text-base 3xl:text-xl'>
                        Thời gian bắt đầu
                      </p>
                      <DatePicker
                        selected={duration.start === 0 ? new Date() : new Date(duration.start)}
                        showTimeInput
                        timeInputLabel='Time:'
                        onChange={(date) =>
                          setDuration({ ...duration, start: new Date(date || 0).getTime() })
                        }
                        className='flex w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium
                    lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'
                        dateFormat={'dd/MM/yyyy HH:mm:ss'}
                        customTimeInput={
                          <CustomTimeInput
                            date={duration.start === 0 ? new Date() : new Date(duration.start)}
                            onChangeCustom={handleChangeTime}
                            isStartDate
                          />
                        }
                      />
                    </div>
                    <div className='flex flex-1 flex-col'>
                      <p className='mb-2 w-full text-sm lg:text-base 3xl:text-xl'>
                        Thời gian kết thúc
                      </p>
                      <DatePicker
                        selected={duration.end === 0 ? new Date() : new Date(duration.end)}
                        showTimeInput
                        timeInputLabel='Time:'
                        onChange={(date) =>
                          setDuration({ ...duration, end: new Date(date || 0).getTime() })
                        }
                        className='flex w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium
                    lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'
                        dateFormat={'dd/MM/yyyy HH:mm:ss'}
                        customTimeInput={
                          <CustomTimeInput
                            date={duration.end === 0 ? new Date() : new Date(duration.end)}
                            onChangeCustom={handleChangeTime}
                            isStartDate={false}
                          />
                        }
                      />
                    </div>
                    <div className='flex flex-1 flex-col'>
                      <p className='mb-2 w-full text-sm lg:text-base 3xl:text-xl'>
                        Giới hạn đăng ký
                      </p>
                      <input
                        type='number'
                        id='user-limit'
                        name='user-limit'
                        value={limit}
                        onChange={({ target }) => setLimit(parseInt(target.value))}
                        className='flex w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium
                  lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'
                      />
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
                        <div className='flex flex-1' />
                      </div>
                      {potentialQuestions.map((question, index) => (
                        <div
                          key={question._id}
                          className='flex flex-1 flex-shrink-0 flex-row items-center gap-x-4 border-b border-b-[#CCC]/60
                      px-6 py-2 lg:py-4 lg:px-8 3xl:py-6 3xl:px-10'
                        >
                          <p className='flex flex-[2.5] text-xs font-medium lg:text-sm 3xl:text-base'>
                            {question.name}
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
                            {formattedDate(question?.createdAt)}
                          </p>
                          <div className='flex flex-1 flex-wrap items-center justify-end gap-x-4 gap-y-4'>
                            <button
                              className='flex items-center justify-center rounded-full bg-[#DB4437]/90 p-2 hover:bg-[#DB4437]'
                              onClick={() => {
                                const newPotentialQuestions = JSON.parse(
                                  JSON.stringify(potentialQuestions)
                                ) as SlotQuestion[];
                                newPotentialQuestions.splice(index, 1);
                                setPotentialQuestions(newPotentialQuestions);
                              }}
                            >
                              <Icon.Delete
                                fill='white'
                                className='h-4 w-4 lg:h-5 lg:w-5 3xl:h-6 3xl:w-6'
                              />
                            </button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className='my-5 flex w-full flex-row justify-between'>
                    <div className='flex flex-row-reverse gap-x-8'>
                      <button
                        className={`flex items-center rounded-lg px-6 py-1
                      transition-all duration-200 lg:px-7 lg:py-2 3xl:px-8 3xl:py-3 ${
                        canSave ? 'bg-[#4285F4]/80 hover:bg-[#4285F4]' : 'bg-gray-400/80'
                      }`}
                        disabled={!canSave}
                        onClick={(e) => {
                          e.preventDefault();
                          handleOnSave();
                        }}
                      >
                        <p className='whitespace-nowrap text-white'>Lưu thay đổi</p>
                      </button>
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

export default EditSlot;
