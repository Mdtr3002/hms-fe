import React, { ChangeEvent, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Link, useNavigate } from 'react-router-dom';
import { SingleValue } from 'react-select';
import { toast } from 'react-toastify';

import { ReactComponent as NoData } from '../../../assets/svgs/NoData.svg';
import { Icon, Pagination, Select } from '../../../components';
import DeleteModal from '../../../components/Modal/DeleteModal';
import { Option } from '../../../components/Select';
import { useDebounce } from '../../../hooks';
import { Page, Wrapper } from '../../../layout';
import ChapterService from '../../../service/chapter.service';
import SubjectService from '../../../service/subject.service';
import useBoundStore from '../../../store';
import { Chapter } from '../../../types';

const ITEMS_PER_PAGE = 10;

const ChapterListPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const filterName = useBoundStore.use.filterName();
  const setFilterName = useBoundStore.use.setFilterName();
  const filterSubject = useBoundStore.use.filterSubject();
  const setFilterSubject = useBoundStore.use.setFilterSubject();
  const page = useBoundStore.use.page();
  const setPage = useBoundStore.use.setPage();
  const [filterSubjectOptions, setFilterSubjectOptions] = useState<Option[]>([]);

  const [chapters, setChapters] = useState<Chapter[]>([]);
  const [totalCount, setTotalCount] = useState(1);

  const tableRef = React.useRef<HTMLDivElement>(null);

  const chapterToDelete = React.useRef<string | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);

  const onDeleteChapter = () => {
    const chapterId = chapterToDelete.current;
    if (chapterId !== null) {
      ChapterService.deleteById(chapterId)
        .then(() => {
          toast.success('Xóa chương thành công');
          setPage(1);
          fetchChapters();
        })
        .catch((err) => {
          toast.error(err.response.data.message);
        });
    }
    chapterToDelete.current = null;
  };

  const onInputFilterName = (event: ChangeEvent<HTMLInputElement>) => {
    setFilterName(event.target.value);
    setPage(1);
  };

  const onSelectFilterSubject = (event: SingleValue<Option>) => {
    if (event !== null) {
      setFilterSubject(event.value);
      setPage(1);
    }
  };

  const fetchChapters = useDebounce(() => {
    setLoading(true);
    ChapterService.getAllPaginated(
      {
        name: filterName,
        pageNumber: page,
        pageSize: ITEMS_PER_PAGE,
        subject: filterSubject === '' ? undefined : filterSubject,
      },
      true
    )
      .then((res) => {
        const { total, result: allChapters } = res.data.payload;
        setChapters(allChapters);
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
    fetchChapters();
  }, [page, filterName, filterSubject, fetchChapters]);

  useEffect(() => {
    SubjectService.getAll({}, true)
      .then((res) => {
        const { result: allSubjects } = res.data.payload;
        setFilterSubjectOptions(
          allSubjects.map((subject) => {
            return {
              value: subject._id,
              label: subject.name,
            };
          })
        );
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }, []);

  return (
    <Page>
      <DeleteModal
        text='Bạn có chắc chắn muốn xóa chương này?'
        onClose={() => setDeleteModal(false)}
        show={deleteModal}
        onDelete={() => onDeleteChapter()}
      />
      <Wrapper className='flex flex-1 flex-col'>
        <div className='w-full bg-[#4285F4]/90 py-4'>
          <p className='text-center text-sm font-bold text-white md:text-2xl 3xl:text-4xl'>
            Danh sách chương
          </p>
        </div>
        <div className='w-full p-4'>
          <Link className='mb-2 flex items-center hover:underline md:hidden' to='/admin'>
            <Icon.Chevron className='h-5 -rotate-90 fill-black' />
            <p className='text-sm text-[#5B5B5B]'>Quay lại</p>
          </Link>
          <div className='h-full w-full rounded-lg bg-white p-4 lg:p-6 3xl:p-8'>
            <main className='flex flex-col'>
              <div className='mb-8 flex flex-1 flex-col items-center gap-x-4 gap-y-4 px-6 md:flex-row lg:px-8 3xl:px-10'>
                <div className='relative flex w-full flex-1 items-center'>
                  <input
                    className='flex flex-1 rounded-lg border border-[#CCC] p-1 text-xs font-medium
                    lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'
                    value={filterName}
                    onChange={onInputFilterName}
                    placeholder='Tìm câu hỏi'
                  />
                </div>
                <div className='flex w-full flex-[2] flex-row gap-x-4'>
                  <Select
                    options={filterSubjectOptions}
                    value={filterSubjectOptions.find((x) => x.value === filterSubject) ?? null}
                    onChange={onSelectFilterSubject}
                    placeholder='Chọn môn'
                  />
                </div>
                <button
                  className={`flex flex-[0.5] ${
                    filterName !== '' || filterSubject !== '' ? 'opacity-1' : 'opacity-0'
                  }`}
                  disabled={filterName === '' && filterSubject === ''}
                  onClick={() => {
                    setFilterName('');
                    setFilterSubject('');
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
                  <div ref={tableRef} className='w-full overflow-auto'>
                    <table className='flex w-full min-w-[720px] table-fixed flex-col gap-y-3 overflow-auto'>
                      <thead>
                        <tr className='flex w-full flex-1 items-center justify-start gap-x-4 px-4 lg:px-6 3xl:px-8'>
                          <th className='flex flex-[3] items-center justify-start text-base font-semibold text-[#4285f4] lg:text-lg 3xl:text-xl'>
                            Tên
                          </th>
                          <th className='flex flex-[1.5] items-center justify-start text-base font-semibold text-[#4285f4] lg:text-lg 3xl:text-xl'>
                            Môn
                          </th>
                          <th className='flex flex-[2.5] items-center justify-start text-base font-semibold text-[#4285f4] lg:text-lg 3xl:text-xl'>
                            Thời gian tạo
                          </th>
                          <th className='flex flex-[2.5] items-center justify-start text-left text-base font-semibold text-[#4285f4] lg:text-lg 3xl:text-xl'>
                            Thời gian cập nhật
                          </th>
                          <th className='flex flex-1 items-center justify-start text-base font-semibold text-[#4285f4] lg:text-lg 3xl:text-xl'>
                            {''}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {chapters.length === 0 ? (
                          <div className='z-10 rounded-[20px] bg-white px-4 py-3 md:p-5 xl:p-6 2xl:p-7'>
                            <NoData width={200} className='mx-auto w-[200px] p-7 xl:w-[300px]' />
                            <p className='w-full text-center'>Không tìm thấy chương</p>
                          </div>
                        ) : (
                          chapters.map((chapter) => (
                            <tr
                              key={`material-${chapter._id}`}
                              className='flex w-full flex-1 items-center justify-start gap-x-3 border-b border-b-[#CCC] p-2 px-2 hover:cursor-pointer hover:bg-[#F1F1F1] lg:p-4 lg:px-4 3xl:p-6 3xl:px-6'
                              onClick={() => navigate(`/admin/chapter/view/${chapter._id}`)}
                            >
                              <td className='flex flex-[3] items-center justify-start text-xs font-medium lg:text-sm 3xl:text-base'>
                                {chapter.name}
                              </td>
                              <td className='flex flex-[1.5] items-center justify-start text-xs font-medium lg:text-sm 3xl:text-base'>
                                {chapter.subject.name}
                              </td>
                              <td className='flex flex-[2.5] items-center justify-start text-xs font-medium lg:text-sm 3xl:text-base'>
                                {new Date(chapter.createdAt).toLocaleString()}
                              </td>
                              <td className='flex flex-[2.5] items-center justify-start text-xs font-medium lg:text-sm 3xl:text-base'>
                                {chapter.lastUpdatedAt !== undefined
                                  ? new Date(chapter.lastUpdatedAt).toLocaleString()
                                  : undefined}
                              </td>
                              <td className='flex flex-1 items-center justify-end gap-x-2 gap-y-2 whitespace-nowrap'>
                                <button
                                  type='button'
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/admin/chapter/edit/${chapter._id}`);
                                  }}
                                  className='flex items-center justify-center rounded-full bg-[#4285F4]/90 p-2 hover:bg-[#4285F4]'
                                >
                                  <Icon.Edit
                                    fill='white'
                                    className='h-3 w-3 lg:h-4 lg:w-4 3xl:h-5 3xl:w-5'
                                  />
                                </button>
                                <button
                                  className='flex items-center justify-center rounded-full bg-[#DB4437]/90 p-2 hover:bg-[#DB4437]'
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    chapterToDelete.current = chapter._id;
                                    setDeleteModal(true);
                                  }}
                                >
                                  <Icon.Delete
                                    fill='white'
                                    className='h-3 w-3 lg:h-4 lg:w-4 3xl:h-5 3xl:w-5'
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
                currentPage={page}
                totalCount={totalCount}
                pageSize={ITEMS_PER_PAGE}
                onPageChange={setPage}
              />
            </main>
          </div>
        </div>
      </Wrapper>
    </Page>
  );
};

export default ChapterListPage;
