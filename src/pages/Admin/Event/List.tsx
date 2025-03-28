import { useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

import { ReactComponent as NoData } from '../../../assets/svgs/NoData.svg';
import { Icon, Pagination, Select } from '../../../components';
import DeleteModal from '../../../components/Modal/DeleteModal';
// import { Option } from '../../../components/Select';
import { useDebounce } from '../../../hooks';
import { Page, Wrapper } from '../../../layout';
import EventService from '../../../service/event.service';
import useBoundStore from '../../../store';
import { EVENT_TYPE_OPTIONS, Event } from '../../../types/events';

const ITEMS_PER_PAGE = 10;

const convertEpochToVietnameseDateAndTime = (epoch: number) => {
  const date = new Date(epoch);
  const day = date.getDate();
  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const hour = date.getHours();
  const minute = date.getMinutes();
  return `${hour}:${minute < 10 ? `0${minute}` : minute}, ${day < 10 ? `0${day}` : day}/${
    month < 10 ? `0${month}` : month
  }/${year} `;
};

const EventList = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const filterName = useBoundStore.use.filterName();
  const setFilterName = useBoundStore.use.setFilterName();
  const filterEventType = useBoundStore.use.filterEventType();
  const setFilterEventType = useBoundStore.use.setFilterEventType();
  const page = useBoundStore.use.page();
  const setPage = useBoundStore.use.setPage();

  const [events, setEvents] = useState<Event[]>([]);
  const [totalCount, setTotalCount] = useState(1);

  const tableRef = useRef<HTMLDivElement>(null);

  const eventToDelete = useRef<string | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);

  const onDeleteEvent = () => {
    const eventId = eventToDelete.current;
    if (eventId !== null) {
      EventService.deleteById(eventId)
        .then((_res) => {
          toast.success('Xóa sự kiện thành công');
          setPage(1);
          fetchEvent();
        })
        .catch((err) => {
          toast.error(err.response.data.message);
        });
    }
    eventToDelete.current = null;
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

  const fetchEvent = useDebounce(() => {
    setLoading(true);
    EventService.getAllPaginated(
      {
        name: filterName,
        eventType: filterEventType,
        pageNumber: page,
        pageSize: ITEMS_PER_PAGE,
      },
      true
    )
      .then((res) => {
        const { total, result: allEvents } = res.data.payload;
        setEvents(allEvents);
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
    fetchEvent();
  }, [page, filterName, filterEventType, fetchEvent]);

  return (
    <Page>
      <DeleteModal
        text='Bạn có chắc chắn muốn xóa sự kiện này?'
        onClose={() => setDeleteModal(false)}
        show={deleteModal}
        onDelete={() => onDeleteEvent()}
      />
      <Wrapper className='flex flex-1 flex-col'>
        <div className='w-full bg-[#4285F4]/90 py-4'>
          <p className='text-center text-sm font-bold text-white md:text-2xl 3xl:text-4xl'>
            Danh sách sự kiện
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
                    placeholder='Tìm tên đợt thi thử'
                  />
                </div>
                <div className='flex w-full flex-[3] flex-col gap-y-4 md:flex-row md:gap-x-4'>
                  <Select
                    options={EVENT_TYPE_OPTIONS}
                    value={EVENT_TYPE_OPTIONS.find((x) => x.value === filterEventType) ?? null}
                    onChange={(v) => {
                      if (v !== null) {
                        setFilterEventType(v.value);
                        setPage(1);
                      }
                    }}
                    placeholder='Chọn danh mục'
                  />
                </div>
                <button
                  className={`flex flex-[0.5] ${
                    filterName !== '' || filterEventType !== '' ? 'opacity-1' : 'opacity-0'
                  }`}
                  disabled={filterName === '' && filterEventType === ''}
                  onClick={() => {
                    setFilterName('');
                    setFilterEventType('');
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
                            Tên sự kiện
                          </th>
                          <th className='flex flex-[1.5] items-center justify-start text-base font-semibold text-[#4285f4] lg:text-lg 3xl:text-xl'>
                            Danh mục
                          </th>
                          <th className='flex flex-1 items-center justify-start text-base font-semibold text-[#4285f4] lg:text-lg 3xl:text-xl'>
                            T.gian bắt đầu
                          </th>
                          <th className='flex flex-1 items-center justify-start text-base font-semibold text-[#4285f4] lg:text-lg 3xl:text-xl'>
                            T.gian kết thúc
                          </th>
                          <th className='flex flex-1 items-center justify-start text-base font-semibold text-[#4285f4] lg:text-lg 3xl:text-xl'>
                            {''}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {events.length === 0 ? (
                          <div className='z-10 rounded-[20px] bg-white px-4 py-3 md:p-5 xl:p-6 2xl:p-7'>
                            <NoData width={200} className='mx-auto w-[200px] p-7 xl:w-[300px]' />
                            <p className='w-full text-center'>Không tìm thấy đợt thi thử</p>
                          </div>
                        ) : (
                          events.map((event) => (
                            <tr
                              key={`event-${event._id}`}
                              className='flex w-full flex-1 items-center justify-start gap-x-4 border-b border-b-[#CCC] p-2 px-6 hover:cursor-pointer hover:bg-[#F1F1F1] lg:p-4 lg:px-8 3xl:p-6 3xl:px-10'
                              onClick={() => navigate(`/admin/event/view/${event._id}`)}
                            >
                              <td className='flex flex-[1.5] items-center justify-start text-xs font-medium lg:text-sm 3xl:text-base'>
                                {event.name}
                              </td>
                              <td className='flex flex-[1.5] items-center justify-start text-xs font-medium lg:text-sm 3xl:text-base'>
                                {event.eventType === 'LOP_HOC_ON_TAP' ? 'Lớp học ôn tập' : 'Khác'}
                              </td>
                              <td className='flex flex-1 items-center justify-start text-xs font-medium lg:text-sm 3xl:text-base'>
                                {convertEpochToVietnameseDateAndTime(event.startedAt)}
                              </td>
                              <td className='flex flex-1 items-center justify-start text-xs font-medium lg:text-sm 3xl:text-base'>
                                {convertEpochToVietnameseDateAndTime(event.endedAt)}
                              </td>
                              <td className='flex flex-1 flex-wrap items-center justify-end gap-x-4 gap-y-2'>
                                <button
                                  type='button'
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/admin/event/edit/${event._id}`);
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
                                    eventToDelete.current = event._id;
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

export default EventList;
