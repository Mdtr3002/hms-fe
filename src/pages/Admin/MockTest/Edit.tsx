import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { Icon, Select } from '../../../components';
import DeleteModal from '../../../components/Modal/DeleteModal';
import { Option } from '../../../components/Select';
import { useDebounce } from '../../../hooks';
import { Page, Wrapper } from '../../../layout';
import MockTestService from '../../../service/mockTest.service';
import SubjectService from '../../../service/subject.service';
import { EXAM_TYPE_OPTIONS, SEMESTER_OPTIONS } from '../../../types/examArchive';
import { MockTest, Slots } from '../../../types/mockTest';

const MockTestEdit = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params?.id ?? '';
  const [mockTest, setMockTest] = useState<MockTest>();

  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [type, setType] = useState('');
  const [semester, setSemester] = useState('');
  const [description, setDescription] = useState('');
  const [isHidden, setIsHidden] = useState(false);
  const [slots, setSlots] = useState<Slots[]>([]);

  const [subjectOptions, setSubjectOptions] = useState<Option[]>([]);

  const [canSave, setCanSave] = useState(false);
  const [loading, setLoading] = useState(false);
  const [slotToDelete, setSlotToDelete] = useState<number | null>(null);

  const [deleteModal, setDeleteModal] = useState(false);

  const onDeleteSlot = (slotNumber: number) => {
    if (mockTest?._id !== null) {
      MockTestService.deleteSlot(mockTest?._id || '', slotNumber)
        .then((_res) => {
          toast.success('Xóa ca thi thử thành công');
          setMockTest(_res.data.payload);
        })
        .catch((err) => {
          toast.error(err.response.data.message);
        });
    }
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

  const setSave = useDebounce(() => {
    if (mockTest) {
      setCanSave(
        name === mockTest.name &&
          subject === mockTest.subject._id &&
          type === mockTest.type &&
          semester === mockTest.semester &&
          _.trim(description) === mockTest.description &&
          isHidden === mockTest.isHidden
      );
    }
  });

  const fetchData = useCallback(() => {
    setLoading(true);
    MockTestService.getById(id, true)
      .then((res) => {
        setMockTest(res.data.payload);
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
      subject,
      type,
      semester,
      isHidden,
    };

    MockTestService.editGeneralInformation(id, formData, true)
      .then(() => {
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
    if (mockTest) {
      setName(mockTest.name);
      setDescription(mockTest.description);
      setType(mockTest.type);
      setSemester(mockTest.semester);
      setSubject(mockTest.subject._id);
      setIsHidden(mockTest.isHidden);
      setSlots(mockTest.slots);
    }
  }, [mockTest]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    setSave();
  }, [name, subject, type, semester, description, isHidden, setSave]);

  useEffect(() => {
    SubjectService.getAll({})
      .then((res) => {
        const { result: allSubjects } = res.data.payload;
        const formattedData = allSubjects.map((sub) => {
          return {
            value: sub._id,
            label: sub.name,
          };
        });
        setSubjectOptions(formattedData);
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  return (
    <Page>
      <DeleteModal
        text='Bạn có chắc chắn muốn xóa ca thi này?'
        onClose={() => setDeleteModal(false)}
        show={deleteModal}
        onDelete={() => onDeleteSlot(slotToDelete ?? -1)}
      />
      <Wrapper className='flex flex-1 flex-col'>
        <div className='w-full bg-[#4285F4]/90 py-4'>
          <p className='text-center text-sm font-bold text-white md:text-2xl 3xl:text-4xl'>
            Chỉnh sửa đề thi
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
                <p className='flex flex-[2.5] text-base lg:text-lg 3xl:text-xl'>ID đề thi: {id}</p>
                <div className='flex w-full flex-col items-start justify-center'>
                  <label className='mb-2 w-full' htmlFor='exam-name'>
                    <p className='w-full text-sm lg:text-base 3xl:text-xl'>Tên đề thi</p>
                  </label>
                  <input
                    id='exam-name'
                    className='flex w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium
                  lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'
                    value={name}
                    placeholder='Nhập tên đề thi'
                    onChange={({ target }) => setName(target.value)}
                  />
                </div>
                <div className='flex w-full flex-1 flex-row items-center justify-start gap-x-4'>
                  <div className='flex w-full flex-1 flex-col'>
                    <p className='w-full text-sm lg:text-base 3xl:text-xl'>Môn</p>
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
                  <div className='flex w-full flex-1 flex-col'>
                    <p className='w-full text-sm lg:text-base 3xl:text-xl'>Kì thi</p>
                    <Select
                      options={EXAM_TYPE_OPTIONS}
                      value={EXAM_TYPE_OPTIONS.find((x) => x.value === type) ?? null}
                      onChange={(v) => {
                        if (v !== null) {
                          setType(v.value);
                        }
                      }}
                      placeholder='Chọn kì thi'
                    />
                  </div>
                  <div className='flex w-full flex-1 flex-col'>
                    <p className='w-full text-sm lg:text-base 3xl:text-xl'>Học kì</p>
                    <Select
                      options={SEMESTER_OPTIONS}
                      value={SEMESTER_OPTIONS.find((x) => x.value === semester) ?? null}
                      onChange={(v) => {
                        if (v !== null) {
                          setSemester(v.value);
                        }
                      }}
                      placeholder='Chọn học kì'
                    />
                  </div>
                </div>

                <div className='flex w-full flex-col items-start justify-center'>
                  <label className='mb-2 w-full' htmlFor='exam-description'>
                    <p className='w-full text-sm lg:text-base 3xl:text-xl'>Chú thích</p>
                  </label>
                  <textarea
                    id='exam-description'
                    className='flex w-full rounded-lg border border-[#CCC] p-1 text-xs
                  font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base '
                    value={description}
                    placeholder='Nhập chú thích đề thi'
                    rows={5}
                    onChange={({ target }) => {
                      setDescription(target.value);
                    }}
                  />
                </div>
                <div className='flex flex-col gap-y-8'>
                  <div className='flex flex-row items-center gap-x-8'>
                    <label
                      className='flex text-base lg:text-lg 3xl:text-xl'
                      htmlFor='search_question'
                    >
                      Các ca thi hiện có
                    </label>
                    <div className='flex flex-[2] flex-row items-center gap-x-8'>
                      <Link
                        to={`/admin/mock-test/slot/create/${mockTest?._id}`}
                        className='flex items-center rounded-lg bg-[#4285F4]/80 px-6
                      py-1 text-white transition-all duration-200 hover:bg-[#4285F4] lg:px-7 lg:py-2 3xl:px-8 3xl:py-3'
                      >
                        Tạo ca thi
                      </Link>
                    </div>
                  </div>
                  <div>
                    <div className='mb-5 flex flex-1 flex-shrink-0 flex-row gap-x-4 px-6 lg:px-8 3xl:px-10'>
                      <p className='flex flex-[2.5] text-base text-[#4285f4] lg:text-lg 3xl:text-xl'>
                        Tên
                      </p>
                      <p className='flex flex-[2] text-base text-[#4285F4] lg:text-lg 3xl:text-xl'>
                        Số người đăng ký
                      </p>
                      <p className='flex flex-[1.2] text-base text-[#4285F4] lg:text-lg 3xl:text-xl'>
                        Bắt đầu
                      </p>
                      <p className='flex flex-[1.5] text-base text-[#4285F4] lg:text-lg 3xl:text-xl'>
                        Kết Thúc
                      </p>
                      <div className='flex flex-1' />
                    </div>
                    {slots.map((slot) => (
                      <Link
                        to={`/admin/mock-test/slot/view/${mockTest?._id}/${slot.slotId}`}
                        key={slot.slotId}
                        className='flex flex-1 flex-shrink-0 flex-row items-center gap-x-4 border-b border-b-[#CCC]/60 px-6
                      py-2 hover:bg-[#F1F1F1] lg:py-4 lg:px-8 3xl:px-10 3xl:py-6'
                      >
                        <p className='flex flex-[2.5] text-xs font-medium lg:text-sm 3xl:text-base'>
                          {slot?.name || 'Chưa có tên'}
                        </p>
                        <p className='flex flex-[2] text-xs font-medium lg:text-sm 3xl:text-base'>
                          {slot?.registeredUsers.length ?? 0}/{slot?.userLimit ?? 0}
                        </p>
                        <p className='flex flex-[1.2] text-xs font-medium lg:text-sm 3xl:text-base'>
                          {formattedDate(slot?.startedAt) || 'Chưa có thời gian'}
                        </p>
                        <p className='flex flex-[1.5] text-xs font-medium lg:text-sm 3xl:text-base'>
                          {formattedDate(slot?.endedAt) || 'Chưa có thời gian'}
                        </p>
                        <div className='flex flex-1 flex-wrap items-center justify-end gap-x-4 gap-y-4'>
                          <Link
                            to={`/admin/mock-test/slot/edit/${mockTest?._id}/${slot.slotId}`}
                            className='flex items-center justify-center rounded-full bg-[#4285F4]/90 p-2 hover:bg-[#4285F4]'
                          >
                            <Icon.Edit
                              fill='white'
                              className='h-4 w-4 lg:h-5 lg:w-5 3xl:h-6 3xl:w-6'
                            />
                          </Link>
                          <button
                            className='flex items-center justify-center rounded-full bg-[#DB4437]/90 p-2 hover:bg-[#DB4437]'
                            onClick={(e) => {
                              e.preventDefault();
                              setSlotToDelete(slot.slotId);
                              setDeleteModal(true);
                            }}
                          >
                            <Icon.Delete
                              fill='white'
                              className='h-4 w-4 lg:h-5 lg:w-5 3xl:h-6 3xl:w-6'
                            />
                          </button>
                        </div>
                      </Link>
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
                      className='allow-checked h-7 w-7 cursor-pointer'
                      checked={!isHidden}
                      onChange={() => setIsHidden(!isHidden)}
                    />
                  </div>
                  <div className='flex flex-row-reverse gap-x-8'>
                    <button
                      className={`flex items-center rounded-lg px-6 py-1
                      transition-all duration-200 lg:px-7 lg:py-2 3xl:px-8 3xl:py-3 ${
                        !canSave ? 'bg-[#4285F4]/80 hover:bg-[#4285F4]' : 'bg-gray-400/80'
                      }`}
                      disabled={canSave}
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

export default MockTestEdit;
