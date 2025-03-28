import React, { ChangeEvent, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import { useNavigate, useParams } from 'react-router-dom';
import { SingleValue } from 'react-select';
import { toast } from 'react-toastify';

import { Icon, InputNumber, Select } from '../../../components';
import { Option } from '../../../components/Select';
import { useDebounce } from '../../../hooks';
import { Page, Wrapper } from '../../../layout';
import ChapterService from '../../../service/chapter.service';
import MockTestService from '../../../service/mockTest.service';
import QuestionService from '../../../service/question.service';
import SubjectService from '../../../service/subject.service';
import { Question } from '../../../types';

type OptionWithQuestion = Option & { question: Question };

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

const CreateSlot = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params?.id ?? '';
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);

  const [filterSubject, setFilterSubject] = useState('');
  const [filterChapter, setFilterChapter] = useState('');
  const [potentialQuestions, setPotentialQuestions] = useState<Question[]>([]);
  const [duration, setDuration] = useState<{ start: number; end: number }>({ start: 0, end: 0 });
  const [limit, setLimit] = useState<number>(0);

  const [subjectOptions, setSubjectOptions] = useState<Option[]>([]);
  const [questionOptions, setQuestionOptions] = useState<Question[]>([]);
  const [filterChapterOptions, setFilterChapterOptions] = useState<Option[]>([]);

  const handleChangeTime = (date: Date | null, time: string, isStartDate: boolean) => {
    const [hh, mm, ss] = time.split(':');
    const targetDate = date instanceof Date ? date : new Date();
    targetDate.setHours(Number(hh) || 0, Number(mm) || 0, Number(ss) || 0);
    if (isStartDate) {
      setDuration({ ...duration, start: new Date(targetDate || 0).getTime() });
    } else setDuration({ ...duration, end: new Date(targetDate || 0).getTime() });
  };

  const createDisabled =
    name.trim().length === 0 ||
    duration.start === 0 ||
    duration.end === 0 ||
    limit === 0 ||
    potentialQuestions.length === 0 ||
    loading;

  const onInputName = (event: ChangeEvent<HTMLInputElement>) => setName(event.target.value);

  const onSelectAddQuestion = (value: SingleValue<Option>) => {
    if (value !== null) {
      const duplicate = potentialQuestions.find(
        (x) => x._id === (value as OptionWithQuestion).question._id
      );
      if (!duplicate) {
        setPotentialQuestions([...potentialQuestions, (value as OptionWithQuestion).question]);
      } else {
        toast.error('Câu hỏi đã được thêm');
      }
    }
  };

  const onSelectFilterSubject = (event: SingleValue<Option>) => {
    if (event !== null) {
      setFilterSubject(event.value);
    }
  };

  const onSelectFilterChapter = (event: SingleValue<Option>) => {
    if (event !== null) {
      setFilterChapter(event.value);
    }
  };

  const createExercise = (_event: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    const mockTestId = id;
    MockTestService.createSlot(
      {
        name,
        userLimit: limit,
        startedAt: duration.start,
        endedAt: duration.end,
        questions: potentialQuestions.map((question) => question._id),
      },
      mockTestId
    )
      .then((_res) => {
        toast.success('Tạo ca thi thành công');
        setName('');
        setLimit(0);
        setDuration({ start: 0, end: 0 });
        setPotentialQuestions([]);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      })
      .finally(() => setLoading(false));
  };

  const fetchQuestions = useDebounce(() => {
    QuestionService.getAll(
      {
        subject: filterSubject === '' ? undefined : filterSubject,
        chapter: filterChapter === '' ? undefined : filterChapter,
      },
      true
    )
      .then((res) => {
        const { result: allQuestions } = res.data.payload;
        setQuestionOptions(allQuestions);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  });

  useEffect(() => {
    fetchQuestions();
  }, [filterSubject, filterChapter, fetchQuestions]);

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
    if (filterSubject === '') {
      setFilterChapterOptions([]);
      setFilterChapter('');
      return;
    }

    ChapterService.getAll({ subject: filterSubject }, true)
      .then((res) => {
        const { result: allFilterChapters } = res.data.payload;
        setFilterChapterOptions(
          allFilterChapters.map((chap) => ({
            value: chap._id,
            label: chap.name,
          }))
        );
        setFilterChapter('');
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }, [filterSubject]);

  return (
    <Page>
      <Wrapper className='flex flex-1 flex-col'>
        <div className='w-full bg-[#4285F4]/90 py-4'>
          <p className='text-center text-sm font-bold text-white md:text-2xl 3xl:text-4xl'>
            Tạo ca thi thử
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
            <p className='flex flex-[2.5] text-base lg:text-lg 3xl:text-xl'>ID đề thi: {id}</p>
            <main className='flex flex-col gap-y-4'>
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
                  onChange={onInputName}
                />
              </div>

              <div className='flex w-full flex-1 flex-row flex-wrap gap-x-8 gap-y-4'>
                <div className='flex flex-1 flex-col'>
                  <p className='mb-2 w-full text-sm lg:text-base 3xl:text-xl'>Thời gian bắt đầu</p>
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
                  <p className='mb-2 w-full text-sm lg:text-base 3xl:text-xl'>Thời gian kết thúc</p>
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
                <div className='flex min-w-[100px] flex-1 flex-col'>
                  <p className='flex flex-[2.5] whitespace-nowrap text-base lg:text-lg 3xl:text-xl'>
                    Giới hạn đăng ký
                  </p>
                  <InputNumber
                    containerClassName='border border-[#D9D9D9] rounded-lg'
                    className='rounded-lg p-1 text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'
                    controllerClassName='rounded-lg'
                    buttonClassName='rounded-lg md:pl-2 md:pr-[10px] lg:pl-3 lg:pr-[15px] 3xl:pl-4 3xl:pr-5 3xl:py-3'
                    value={limit}
                    min={0}
                    placeholder={'Chọn số lượng đăng ký tối đa'}
                    onChange={({ target }) => {
                      setLimit(parseInt(target.value));
                    }}
                  />
                </div>
              </div>

              <div className='flex flex-col'>
                <p className='w-full text-base font-semibold lg:text-lg 3xl:text-xl'>
                  Danh sách câu hỏi
                </p>
                <div className='mb-8 flex flex-row items-center gap-x-8'>
                  <label
                    className='flex text-base lg:text-lg 3xl:text-xl'
                    htmlFor='search_question'
                  >
                    Các câu hỏi có thể ra
                  </label>
                  <div className='flex flex-[2] flex-row items-center gap-x-8'>
                    <Select
                      options={questionOptions.map((question) => {
                        return {
                          value: question._id,
                          label: question.name,
                          question: question,
                        } as OptionWithQuestion;
                      })}
                      placeholder='Chọn câu hỏi'
                      value={null}
                      onChange={onSelectAddQuestion}
                    />
                    <Select
                      options={subjectOptions}
                      placeholder='Chọn môn'
                      value={subjectOptions.find((x) => x.value === filterSubject) ?? null}
                      onChange={onSelectFilterSubject}
                    />
                    <Select
                      options={filterChapterOptions}
                      placeholder='Chọn chương'
                      value={filterChapterOptions.find((x) => x.value === filterChapter) ?? null}
                      onChange={onSelectFilterChapter}
                    />
                    <button
                      className={`flex flex-[0.5] ${
                        filterSubject !== '' || filterChapter !== '' ? 'opacity-1' : 'opacity-0'
                      }`}
                      disabled={filterSubject === '' && filterChapter === ''}
                      onClick={() => {
                        setFilterSubject('');
                        setFilterChapter('');
                      }}
                    >
                      <p className='text-xs lg:text-sm 3xl:text-base'>Xoá bộ lọc</p>
                    </button>
                  </div>
                </div>
                <div>
                  <div className='mb-5 flex flex-1 flex-shrink-0 flex-row gap-x-4 px-6 lg:px-8 3xl:px-10'>
                    <p className='flex flex-[2.5] text-base font-semibold text-[#4285f4] lg:text-lg 3xl:text-xl'>
                      Tên
                    </p>
                    <p className='flex flex-[2] text-base font-semibold text-[#4285F4] lg:text-lg 3xl:text-xl'>
                      Môn
                    </p>
                    <p className='flex flex-[1.2] text-base font-semibold text-[#4285F4] lg:text-lg 3xl:text-xl'>
                      Chương
                    </p>
                    <p className='flex flex-[1.5] text-base font-semibold text-[#4285F4] lg:text-lg 3xl:text-xl'>
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
                        {question?.subject?.name}
                      </p>
                      <p className='flex flex-[1.2] text-xs font-medium lg:text-sm 3xl:text-base'>
                        {question?.chapter?.name}
                      </p>
                      <p className='flex flex-[1.5] text-xs font-medium lg:text-sm 3xl:text-base'>
                        {new Date(question.createdAt).toLocaleString()}
                      </p>
                      <div className='flex flex-1 flex-wrap items-center justify-end gap-x-4 gap-y-4'>
                        <button
                          className='flex items-center justify-center rounded-full bg-[#DB4437]/90 p-2 hover:bg-[#DB4437]'
                          onClick={() => {
                            const newPotentialQuestions = JSON.parse(
                              JSON.stringify(potentialQuestions)
                            ) as Question[];
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
              <div className='my-5 flex flex-row-reverse gap-x-8'>
                <button
                  className={`flex items-center rounded-lg transition-all duration-200 ${
                    createDisabled ? 'bg-gray-400/80' : 'bg-[#4285F4]/80 hover:bg-[#4285F4]'
                  } px-6 py-1 lg:px-7 lg:py-2 3xl:px-8 3xl:py-3`}
                  disabled={createDisabled}
                  onClick={createExercise}
                >
                  <p className='text-white'>Tạo</p>
                </button>
              </div>
            </main>
          </div>
        </div>
      </Wrapper>
    </Page>
  );
};

export default CreateSlot;
