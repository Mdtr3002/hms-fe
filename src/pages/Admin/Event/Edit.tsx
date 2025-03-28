import { useCallback, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import Skeleton from 'react-loading-skeleton';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Icon, Select } from '../../../components';
import { Option } from '../../../components/Select';
// import DeleteModal from '../../../components/Modal/DeleteModal';
import { useDebounce } from '../../../hooks';
import { Page, Wrapper } from '../../../layout';
import EventService from '../../../service/event.service';
import SubjectService from '../../../service/subject.service';
import { EVENT_TYPE_OPTIONS, Event, EventType } from '../../../types/events';

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

const EventEdit = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params?.id ?? '';
  const [event, setEvent] = useState<Event>();

  const [name, setName] = useState('');
  const [venue, setVenue] = useState('');
  const [eventType, setEventType] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const [subject, setSubject] = useState('');
  const [hasRegistrationTime, setHasRegistrationTime] = useState(false);
  const [eventDuration, setEventDuration] = useState<{ start: number; end: number }>({
    start: 0,
    end: 0,
  });
  const [registrationDuration, setRegistrationDuration] = useState<{ start: number; end: number }>({
    start: 0,
    end: 0,
  });
  const [subjectOptions, setSubjectOptions] = useState<Option[]>([]);
  const [canSave, setCanSave] = useState(false);

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
        console.error(err);
      });
  }, []);

  const handleChangeTime = (date: Date | null, time: string, isStartDate: boolean) => {
    const [hh, mm, ss] = time.split(':');
    const targetDate = date instanceof Date ? date : new Date();
    targetDate.setHours(Number(hh) || 0, Number(mm) || 0, Number(ss) || 0);
    if (isStartDate) {
      setEventDuration({ ...eventDuration, start: new Date(targetDate || 0).getTime() });
    } else setEventDuration({ ...eventDuration, end: new Date(targetDate || 0).getTime() });
  };

  const handleChangeRegistrationTime = (date: Date | null, time: string, isStartDate: boolean) => {
    const [hh, mm, ss] = time.split(':');
    const targetDate = date instanceof Date ? date : new Date();
    targetDate.setHours(Number(hh) || 0, Number(mm) || 0, Number(ss) || 0);
    if (isStartDate) {
      setRegistrationDuration({
        ...registrationDuration,
        start: new Date(targetDate || 0).getTime(),
      });
    } else
      setRegistrationDuration({
        ...registrationDuration,
        end: new Date(targetDate || 0).getTime(),
      });
  };

  const submitDisabled =
    name === '' ||
    venue === '' ||
    eventType === '' ||
    subject === '' ||
    loading ||
    eventDuration.start === 0 ||
    eventDuration.end === 0 ||
    eventDuration.start > eventDuration.end ||
    (eventType === EventType.LHOT && subject === '') ||
    (hasRegistrationTime && (registrationDuration.start === 0 || registrationDuration.end === 0)) ||
    (hasRegistrationTime && registrationDuration.start > registrationDuration.end);

  const setSave = useDebounce(() => {
    if (event) {
      setCanSave(
        name === event.name &&
          description === event.description &&
          eventType === event.eventType &&
          venue === event.venue &&
          hasRegistrationTime === event.hasRegistrationTime &&
          eventDuration.start === event.startedAt &&
          eventDuration.end === event.endedAt &&
          (registrationDuration.start === event.registrationStartedAt ||
            event.registrationStartedAt === undefined) &&
          (registrationDuration.end === event.registrationEndedAt ||
            event.registrationEndedAt === undefined) &&
          subject === event.lhotMetadata.subject._id
      );
    }
  });

  const fetchData = useCallback(() => {
    setLoading(true);
    EventService.getById(id, true)
      .then((res) => {
        setEvent(res.data.payload);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleOnSave = useDebounce((): void => {
    const formData = {
      name,
      description,
      eventType,
      venue,
      hasRegistrationTime,
      registrationStartedAt: registrationDuration.start,
      registrationEndedAt: registrationDuration.end,
      startedAt: eventDuration.start,
      endedAt: eventDuration.end,
      lhotMetadata: {
        subject,
      },
    };

    EventService.editById(id, formData)
      .then((_) => {
        toast.success('Chỉnh sửa thành công');
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      })
      .finally(() => {
        fetchData();
      });
  });

  useEffect(() => {
    if (event) {
      setName(event.name);
      setDescription(event.description);
      setEventType(event.eventType);
      setVenue(event.venue);
      setHasRegistrationTime(event.hasRegistrationTime);
      setSubject(event.lhotMetadata.subject._id);
      setEventDuration({ start: event.startedAt, end: event.endedAt });
      setRegistrationDuration({
        start: event.registrationStartedAt ?? 0,
        end: event.registrationEndedAt ?? 0,
      });
    }
  }, [event]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setSave();
  }, [
    name,
    description,
    eventType,
    venue,
    hasRegistrationTime,
    eventDuration,
    registrationDuration,
    setSave,
    subject,
  ]);

  return (
    <Page>
      <Wrapper className='flex flex-1 flex-col'>
        <div className='w-full bg-[#4285F4]/90 py-4'>
          <p className='text-center text-sm font-bold text-white md:text-2xl 3xl:text-4xl'>
            Chỉnh sửa sự kiện
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
            <div
              className='h-full w-full rounded-lg bg-white px-8 py-2
            lg:px-10 lg:py-4 3xl:px-12 3xl:py-6'
            >
              <form className='flex flex-col gap-y-6'>
                <p className='flex flex-[2.5] text-base lg:text-lg 3xl:text-xl'>ID sự kiện: {id}</p>
                <div className='flex w-full flex-col items-start justify-center'>
                  <label className='mb-2 w-full' htmlFor='event-name'>
                    <p className='w-full text-sm font-semibold lg:text-base 3xl:text-xl'>
                      Tên sự kiện
                    </p>
                  </label>
                  <input
                    id='event-name'
                    className='flex w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium
                  lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'
                    value={name}
                    placeholder='Nhập tên sự kiện'
                    onChange={({ target }) => setName(target.value)}
                  />
                </div>

                <div className='flex w-full flex-1 flex-row items-end justify-start gap-x-4'>
                  <div className='flex w-full flex-1 flex-col'>
                    <p className='w-full text-sm font-semibold lg:text-base 3xl:text-xl'>
                      Danh mục
                    </p>
                    <Select
                      options={EVENT_TYPE_OPTIONS}
                      value={EVENT_TYPE_OPTIONS.find((x) => x.value === eventType) ?? null}
                      onChange={(v) => {
                        if (v !== null) {
                          setEventType(v.value);
                        }
                      }}
                      placeholder='Chọn danh mục'
                    />
                  </div>

                  <div className='flex w-full flex-1 flex-col'>
                    <p className='w-full text-sm font-semibold lg:text-base 3xl:text-xl'>
                      Địa điểm
                    </p>
                    <input
                      id='event-venue'
                      className='flex w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium
                  lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'
                      value={venue}
                      placeholder='Nhập địa điểm tổ chức'
                      onChange={({ target }) => setVenue(target.value)}
                    />
                  </div>

                  <div className='flex w-full flex-1 flex-col'>
                    <p className='hidden w-full text-sm font-semibold lg:block lg:text-base 3xl:text-xl'>
                      Thời gian bắt đầu
                    </p>
                    <p className='hidden w-full text-sm font-semibold md:block lg:hidden lg:text-base 3xl:text-xl'>
                      T.gian bắt đầu
                    </p>
                    <p className='block w-full text-sm font-semibold md:hidden lg:text-base 3xl:text-xl'>
                      Bắt đầu
                    </p>
                    <DatePicker
                      selected={
                        eventDuration.start === 0 ? new Date() : new Date(eventDuration.start)
                      }
                      showTimeInput
                      timeInputLabel='Time:'
                      onChange={(date) =>
                        setEventDuration({ ...eventDuration, start: new Date(date || 0).getTime() })
                      }
                      className='flex w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium
                    lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'
                      dateFormat={'dd/MM/yyyy HH:mm:ss'}
                      customTimeInput={
                        <CustomTimeInput
                          date={
                            eventDuration.start === 0 ? new Date() : new Date(eventDuration.start)
                          }
                          onChangeCustom={handleChangeTime}
                          isStartDate
                        />
                      }
                    />
                  </div>

                  <div className='flex w-full flex-1 flex-col'>
                    <p className='hidden w-full text-sm font-semibold lg:block lg:text-base 3xl:text-xl'>
                      Thời gian kết thúc
                    </p>
                    <p className='hidden w-full text-sm font-semibold md:block lg:hidden lg:text-base 3xl:text-xl'>
                      T.gian kết thúc
                    </p>
                    <p className='block w-full text-sm font-semibold md:hidden lg:text-base 3xl:text-xl'>
                      Kết thúc
                    </p>
                    <DatePicker
                      selected={eventDuration.end === 0 ? new Date() : new Date(eventDuration.end)}
                      showTimeInput
                      timeInputLabel='Time:'
                      onChange={(date) =>
                        setEventDuration({ ...eventDuration, end: new Date(date || 0).getTime() })
                      }
                      className='flex w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium
                    lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'
                      dateFormat={'dd/MM/yyyy HH:mm:ss'}
                      customTimeInput={
                        <CustomTimeInput
                          date={eventDuration.end === 0 ? new Date() : new Date(eventDuration.end)}
                          onChangeCustom={handleChangeTime}
                          isStartDate={false}
                        />
                      }
                    />
                  </div>
                </div>

                {eventType === EventType.LHOT && (
                  <div className='flex w-full flex-1 flex-row items-end justify-start gap-x-4'>
                    <div className='flex w-full flex-1 flex-col'>
                      <p className='w-full text-sm font-semibold lg:text-base 3xl:text-xl'>Môn</p>
                      <Select
                        options={subjectOptions}
                        value={subjectOptions.find((x) => x.value === subject) ?? null}
                        onChange={(v) => {
                          if (v !== null) {
                            setSubject(v.value);
                          }
                        }}
                        placeholder='Chọn môn'
                      />
                    </div>
                  </div>
                )}

                {eventType !== EventType.LHOT && eventType !== '' && (
                  <div className='flex w-full flex-1 flex-row items-end justify-start gap-x-4'>
                    <div className='flex w-full flex-row items-center justify-start gap-x-4'>
                      <p className='flex text-sm font-medium lg:text-base 3xl:text-base'>
                        Giới hạn thời gian đăng ký:
                      </p>
                      <input
                        type='checkbox'
                        className='allow-checked h-4 w-4 cursor-pointer'
                        checked={hasRegistrationTime}
                        onChange={() => setHasRegistrationTime(!hasRegistrationTime)}
                      />
                    </div>
                  </div>
                )}

                {hasRegistrationTime === true && eventType !== EventType.LHOT && (
                  <div className='flex w-full flex-1 flex-row items-end justify-start gap-x-4'>
                    <div className='flex w-full flex-1 flex-col'>
                      <p className='hidden w-full text-sm font-semibold lg:block lg:text-base 3xl:text-xl'>
                        Thời gian bắt đầu đăng ký
                      </p>
                      <p className='hidden w-full text-sm font-semibold md:block lg:hidden lg:text-base 3xl:text-xl'>
                        T.gian bắt đầu đ.ký
                      </p>
                      <p className='block w-full text-sm font-semibold md:hidden lg:text-base 3xl:text-xl'>
                        Bắt đầu đăng ký
                      </p>
                      <DatePicker
                        selected={
                          registrationDuration.start === 0
                            ? new Date()
                            : new Date(registrationDuration.start)
                        }
                        showTimeInput
                        timeInputLabel='Time:'
                        onChange={(date) =>
                          setRegistrationDuration({
                            ...registrationDuration,
                            start: new Date(date || 0).getTime(),
                          })
                        }
                        className='flex w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium
                    lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'
                        dateFormat={'dd/MM/yyyy HH:mm:ss'}
                        customTimeInput={
                          <CustomTimeInput
                            date={
                              registrationDuration.start === 0
                                ? new Date()
                                : new Date(registrationDuration.start)
                            }
                            onChangeCustom={handleChangeRegistrationTime}
                            isStartDate
                          />
                        }
                      />
                    </div>

                    <div className='flex w-full flex-1 flex-col'>
                      <p className='hidden w-full text-sm font-semibold lg:block lg:text-base 3xl:text-xl'>
                        Thời gian kết thúc đăng ký
                      </p>
                      <p className='hidden w-full text-sm font-semibold md:block lg:hidden lg:text-base 3xl:text-xl'>
                        T.gian kết thúc đ.ký
                      </p>
                      <p className='block w-full text-sm font-semibold md:hidden lg:text-base 3xl:text-xl'>
                        Kết thúc đăng ký
                      </p>
                      <DatePicker
                        selected={
                          registrationDuration.end === 0
                            ? new Date()
                            : new Date(registrationDuration.end)
                        }
                        showTimeInput
                        timeInputLabel='Time:'
                        onChange={(date) =>
                          setRegistrationDuration({
                            ...registrationDuration,
                            end: new Date(date || 0).getTime(),
                          })
                        }
                        className='flex w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium
                    lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'
                        dateFormat={'dd/MM/yyyy HH:mm:ss'}
                        customTimeInput={
                          <CustomTimeInput
                            date={
                              registrationDuration.end === 0
                                ? new Date()
                                : new Date(registrationDuration.end)
                            }
                            onChangeCustom={handleChangeRegistrationTime}
                            isStartDate={false}
                          />
                        }
                      />
                    </div>
                  </div>
                )}

                <div className='flex w-full flex-col items-start justify-center'>
                  <label className='mb-2 w-full' htmlFor='event-description'>
                    <p className='w-full text-sm font-semibold lg:text-base 3xl:text-xl'>
                      Chú thích
                    </p>
                  </label>
                  <textarea
                    id='event-description'
                    className='flex w-full rounded-lg border border-[#CCC] p-1 text-xs
                  font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base '
                    value={description}
                    placeholder='Nhập chú thích sự kiện'
                    rows={5}
                    onChange={({ target }) => {
                      setDescription(target.value);
                    }}
                  />
                </div>

                <div className='my-5 flex w-full flex-row justify-between'>
                  <div className='flex flex-row-reverse gap-x-8'>
                    <button
                      className={`flex items-center rounded-lg px-6 py-1
                      transition-all duration-200 lg:px-7 lg:py-2 3xl:px-8 3xl:py-3 ${
                        !canSave && !submitDisabled
                          ? 'bg-[#4285F4]/80 hover:bg-[#4285F4]'
                          : 'bg-gray-400/80'
                      }`}
                      disabled={canSave || submitDisabled}
                      onClick={(e) => {
                        e.preventDefault();
                        handleOnSave();
                      }}
                    >
                      <p className='whitespace-nowrap text-white'>Lưu thay đổi</p>
                    </button>
                  </div>
                </div>
              </form>
            </div>
          )}
        </div>
      </Wrapper>
    </Page>
  );
};

export default EventEdit;
