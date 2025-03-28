import { useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { ReactComponent as NoData } from '../../../assets/svgs/NoData.svg';
import { Icon, Pagination, Select } from '../../../components';
import DeleteModal from '../../../components/Modal/DeleteModal';
import { Option } from '../../../components/Select';
import { useDebounce } from '../../../hooks';
import { Page, Wrapper } from '../../../layout';
import ExamArchiveService from '../../../service/examArchive.service';
import SubjectService from '../../../service/subject.service';
import useBoundStore from '../../../store';
import { ExamArchive } from '../../../types';
import { EXAM_TYPE_OPTIONS, SEMESTER_OPTIONS } from '../../../types/examArchive';

const ITEMS_PER_PAGE = 10;

const ExamList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const filterName = useBoundStore.use.filterName();
  const setFilterName = useBoundStore.use.setFilterName();
  const filterSubject = useBoundStore.use.filterSubject();
  const setFilterSubject = useBoundStore.use.setFilterSubject();
  const filterSemester = useBoundStore.use.filterSemster();
  const setFilterSemester = useBoundStore.use.setFilterSemester();
  const filterExamType = useBoundStore.use.filterChapter();
  const setFilterExamType = useBoundStore.use.setFilterChapter();
  const page = useBoundStore.use.page();
  const setPage = useBoundStore.use.setPage();

  const [filterSubjectOptions, setFilterSubjectOptions] = useState<Option[]>([]);
  const [examArchives, setExamArchives] = useState<ExamArchive[]>([]);
  const [totalCount, setTotalCount] = useState(1);

  const tableRef = useRef<HTMLDivElement>(null);

  const examArchiveToDelete = useRef<string | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);

  const onDeleteExamArchive = () => {
    const examArchiveId = examArchiveToDelete.current;
    if (examArchiveId !== null) {
      ExamArchiveService.deleteById(examArchiveId)
        .then((_res) => {
          toast.success('Xóa đề thi thành công');
          setPage(1);
          fetchExamArchive();
        })
        .catch((err) => {
          toast.error(err.response.data.message);
        });
    }
    examArchiveToDelete.current = null;
  };

  useEffect(() => {
    const handleWheeling = (e: WheelEvent) => {
      if (tableRef.current) {
        if (tableRef.current.scrollWidth > tableRef.current.clientWidth) {
          e.preventDefault();
          tableRef.current?.scrollBy(e.deltaY, 0);
        }
      }
    };
    const tableElement = tableRef.current;
    tableElement?.addEventListener('wheel', handleWheeling);

    return () => {
      tableElement?.removeEventListener('wheel', handleWheeling);
    };
  }, []);

  const fetchExamArchive = useDebounce(() => {
    setLoading(true);
    ExamArchiveService.getAllPaginated(
      {
        name: filterName,
        subject: filterSubject === '' ? undefined : filterSubject,
        semester: filterSemester === '' ? undefined : filterSemester,
        type: filterExamType === '' ? undefined : filterExamType,
        pageNumber: page,
        pageSize: ITEMS_PER_PAGE,
      },
      true
    )
      .then((res) => {
        const { total, result: allExamArchives } = res.data.payload;
        setExamArchives(allExamArchives);
        setTotalCount(total);
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  });

  useEffect(() => {
    fetchExamArchive();
  }, [page, filterName, filterSubject, filterSemester, filterExamType, fetchExamArchive]);

  useEffect(() => {
    SubjectService.getAll({}, true)
      .then((res) => {
        const { result: allSubjects } = res.data.payload;
        setFilterSubjectOptions(
          allSubjects.map((subject) => ({
            value: subject._id,
            label: subject.name,
          }))
        );
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }, []);

  return (
    <Page>
      <DeleteModal
        text='Bạn có chắc chắn muốn xóa đề thi này?'
        onClose={() => setDeleteModal(false)}
        show={deleteModal}
        onDelete={() => onDeleteExamArchive()}
      />
      <Wrapper className='flex flex-1 flex-col'>
        <div className='w-full bg-[#4285F4]/90 py-4'>
          <p className='text-center text-sm font-bold text-white md:text-2xl 3xl:text-4xl'>
            Danh sách đề thi
          </p>
        </div>
        <div className='w-full p-4'>
          <Link className='mb-2 flex items-center hover:underline md:hidden' to='/admin'>
            <Icon.Chevron className='h-5 -rotate-90 fill-black' />
            <p className='text-sm text-[#5B5B5B]'>Quay lại</p>
          </Link>
          <div className='h-full rounded-lg bg-white p-4 lg:p-6 3xl:p-8'>
            <main className='flex w-full flex-col'>
              <div className='mb-8 flex flex-1 flex-col items-center justify-between gap-x-4 gap-y-4 px-6 md:flex-row lg:px-8 3xl:px-10'>
                <div className='relative flex w-full flex-[2] items-center'>
                  <input
                    className='flex flex-1 rounded-lg border border-[#CCC] p-1 text-xs font-medium
                    lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'
                    value={filterName}
                    onChange={({ target }) => {
                      setFilterName(target.value);
                      setPage(1);
                    }}
                    placeholder='Tìm tên đề thi'
                  />
                </div>
                <div className='flex w-full flex-[3] flex-col gap-y-4 md:flex-row md:gap-x-4'>
                  <Select
                    options={filterSubjectOptions}
                    value={filterSubjectOptions.find((x) => x.value === filterSubject) ?? null}
                    onChange={(v) => {
                      if (v !== null) {
                        setFilterSubject(v.value);
                        setPage(1);
                      }
                    }}
                    placeholder='Chọn môn'
                  />
                  <Select
                    options={SEMESTER_OPTIONS}
                    onChange={(v) => {
                      if (v !== null) {
                        setFilterSemester(v.value);
                        setPage(1);
                      }
                    }}
                    value={SEMESTER_OPTIONS.find((x) => x.value === filterSemester) ?? null}
                    placeholder='Chọn học kì'
                  />
                  <Select
                    options={EXAM_TYPE_OPTIONS}
                    onChange={(v) => {
                      if (v !== null) {
                        setFilterExamType(v.value);
                        setPage(1);
                      }
                    }}
                    value={EXAM_TYPE_OPTIONS.find((x) => x.value === filterExamType) ?? null}
                    placeholder='Chọn loại đề thi'
                  />
                </div>
                <button
                  className={`flex flex-[0.5] ${
                    filterName !== '' ||
                    filterSubject !== '' ||
                    filterSemester !== '' ||
                    filterExamType !== ''
                      ? 'opacity-1'
                      : 'opacity-0'
                  }`}
                  disabled={
                    filterName === '' &&
                    filterSubject === '' &&
                    filterSemester === '' &&
                    filterExamType === ''
                  }
                  onClick={() => {
                    setFilterName('');
                    setFilterSubject('');
                    setFilterSemester('');
                    setFilterExamType('');
                    setPage(1);
                  }}
                >
                  <p className='text-xs lg:text-sm 3xl:text-base'>Xoá bộ lọc</p>
                </button>
              </div>
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
                  <div ref={tableRef} className='w-full overflow-x-auto overscroll-auto'>
                    <table className='flex w-full min-w-[900px] table-fixed flex-col gap-y-3 overflow-auto'>
                      <thead>
                        <tr className='flex w-full flex-1 items-center justify-start gap-x-4 px-6 lg:px-8 3xl:px-10'>
                          <th className='flex flex-[1.5] items-center justify-start text-base font-semibold text-[#4285f4] lg:text-lg 3xl:text-xl'>
                            Tên đề thi
                          </th>
                          <th className='flex flex-[1.5] items-center justify-start text-base font-semibold text-[#4285f4] lg:text-lg 3xl:text-xl'>
                            Môn
                          </th>
                          <th className='flex flex-1 items-center justify-start text-base font-semibold text-[#4285f4] lg:text-lg 3xl:text-xl'>
                            Học kì
                          </th>
                          <th className='flex flex-1 items-center justify-start text-base font-semibold text-[#4285f4] lg:text-lg 3xl:text-xl'>
                            Kì thi
                          </th>
                          <th className='flex flex-1 items-center justify-start text-base font-semibold text-[#4285f4] lg:text-lg 3xl:text-xl'>
                            {''}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {examArchives.length === 0 ? (
                          <div className='z-10 rounded-[20px] bg-white px-4 py-3 md:p-5 xl:p-6 2xl:p-7'>
                            <NoData width={200} className='mx-auto w-[200px] p-7 xl:w-[300px]' />
                            <p className='w-full text-center'>Không tìm thấy đề thi</p>
                          </div>
                        ) : (
                          examArchives.map((exam) => (
                            <tr
                              key={`exam-${exam._id}`}
                              className='flex w-full flex-1 items-center justify-start gap-x-4 border-b border-b-[#CCC] p-2 px-6 hover:cursor-pointer hover:bg-[#F1F1F1] lg:p-4 lg:px-8 3xl:p-6 3xl:px-10'
                              onClick={() => navigate(`/admin/exam-archive/view/${exam._id}`)}
                            >
                              <td className='flex flex-[1.5] items-center justify-start text-xs font-medium lg:text-sm 3xl:text-base'>
                                {exam.name}
                              </td>
                              <td className='flex flex-[1.5] items-center justify-start text-xs font-medium lg:text-sm 3xl:text-base'>
                                {exam?.subject?.name}
                              </td>
                              <td className='flex flex-1 items-center justify-start text-xs font-medium lg:text-sm 3xl:text-base'>
                                {SEMESTER_OPTIONS.find((x) => x.value === exam.semester)?.label}
                              </td>
                              <td className='flex flex-1 items-center justify-start text-xs font-medium lg:text-sm 3xl:text-base'>
                                {EXAM_TYPE_OPTIONS.find((x) => x.value === exam.type)?.label}
                              </td>
                              <td className='flex flex-1 flex-wrap items-center justify-end gap-x-4 gap-y-2'>
                                <button
                                  type='button'
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/admin/exam-archive/edit/${exam._id}`);
                                  }}
                                  className='flex items-center justify-center rounded-full bg-[#4285F4]/90 p-2 hover:bg-[#4285F4]'
                                >
                                  <Icon.Edit
                                    fill='white'
                                    className='h-4 w-4 lg:h-5 lg:w-5 3xl:h-6 3xl:w-6'
                                  />
                                </button>
                                <button
                                  className='flex items-center justify-center rounded-full bg-[#DB4437]/90 p-2 hover:bg-[#DB4437]'
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    examArchiveToDelete.current = exam._id;
                                    setDeleteModal(true);
                                  }}
                                >
                                  <Icon.Delete
                                    fill='white'
                                    className='h-4 w-4 lg:h-5 lg:w-5 3xl:h-6 3xl:w-6'
                                  />
                                </button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </>
              )}

              <Pagination
                pageSize={ITEMS_PER_PAGE}
                totalCount={totalCount}
                currentPage={page}
                onPageChange={setPage}
              />
            </main>
          </div>
        </div>
      </Wrapper>
    </Page>
  );
};

export default ExamList;
