import React, { ChangeEvent, useEffect, useState, useRef } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Link, useNavigate } from 'react-router-dom';

import { ReactComponent as NoData } from '../../../assets/svgs/NoData.svg';
import { Icon, Pagination } from '../../../components';
import DeleteModal from '../../../components/Modal/DeleteModal';
import { useDebounce } from '../../../hooks';
import { Page, Wrapper } from '../../../layout';
import useBoundStore from '../../../store';
import { nurse } from '../../../types/nurse';

const mockNurses: nurse[] = [
  {
    _id: '1',
    name: 'Trần Thị D',
    phoneNum: '0987654321',
    dob: '2021-10-01',
    specialization: 'Pediatrics',
    schedule: {
      _id: '',
      workingTime: { startTime: '8:00:00AM', endTime: '5:00:00PM' },
      workDay: ['Tuesday', 'Thursday'],
      workDescription: 'Caring for pediatric patients',
    },
    lastUpdatedAt: '2021-10-01',
  },
  {
    _id: '2',
    name: 'Lê Thị E',
    phoneNum: '0987654000',
    dob: '2021-11-01',
    specialization: 'ICU',
    schedule: {
      _id: '',
      workingTime: { startTime: '7:00:00AM', endTime: '3:00:00PM' },
      workDay: ['Monday', 'Wednesday', 'Friday'],
      workDescription: 'ICU nurse for critical care',
    },
    lastUpdatedAt: '2021-11-01',
  },
];

const ITEMS_PER_PAGE = 10;

const NurseListPage: React.FC = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  const filterName = useBoundStore.use.filterName();
  const setFilterName = useBoundStore.use.setFilterName();
  const page = useBoundStore.use.page();
  const setPage = useBoundStore.use.setPage();

  const [nurses, setNurses] = useState<nurse[]>(mockNurses);
  const [totalCount, setTotalCount] = useState(mockNurses.length);

  const tableRef = useRef<HTMLDivElement>(null);
  const nurseToDelete = useRef<string | null>(null);
  const [deleteModal, setDeleteModal] = useState(false);

  const onDeleteNurse = () => {
    const nurseId = nurseToDelete.current;
    if (nurseId !== null) {
      // TEMP DELETE FROM ARRAY
      setNurses((prev) => prev.filter((nurse) => nurse._id !== nurseId));
      setTotalCount((prev) => prev - 1);
      setDeleteModal(false);
    }
    nurseToDelete.current = null;
  };

  const onInputFilterName = (event: ChangeEvent<HTMLInputElement>) => {
    setFilterName(event.target.value);
    setPage(1);
  };

  const fetchNurses = useDebounce(() => {
    setLoading(true);
    setLoading(false);
  });

  useEffect(() => {
    fetchNurses();
  }, [page, filterName, fetchNurses]);

  return (
    <Page>
      <DeleteModal
        text="Do you want to delete this nurse?"
        onClose={() => setDeleteModal(false)}
        show={deleteModal}
        onDelete={onDeleteNurse}
      />
      <Wrapper className="flex flex-1 flex-col">
        <div className="w-full bg-[#4285F4]/90 py-4">
          <p className="text-center text-sm font-bold text-white md:text-2xl 3xl:text-4xl">
            Nurse list
          </p>
        </div>
        <div className="w-full p-4">
          <Link className="mb-2 flex items-center hover:underline md:hidden" to="/">
            <Icon.Chevron className="h-5 -rotate-90 fill-black" />
            <p className="text-sm text-[#5B5B5B]">Back</p>
          </Link>
          <div className="h-full w-full rounded-lg bg-white p-4 lg:p-6 3xl:p-8">
            <main className="flex flex-col">
              <div className="mb-8 flex flex-1 flex-col items-center gap-x-4 gap-y-4 px-6 md:flex-row lg:px-8 3xl:px-10">
                <div className="relative flex w-full flex-1 items-center">
                  <input
                    className="flex flex-1 rounded-lg border border-[#CCC] p-1 text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base"
                    value={filterName}
                    onChange={onInputFilterName}
                    placeholder="Search nurse"
                  />
                </div>
                <button
                  className={`flex flex-[0.5] ${filterName !== '' ? 'opacity-1' : 'opacity-0'}`}
                  disabled={filterName === ''}
                  onClick={() => {
                    setFilterName('');
                    setPage(1);
                  }}
                >
                  <p className="text-xs lg:text-sm 3xl:text-base">Clear filter</p>
                </button>
              </div>
              {loading ? (
                <>
                  <p className="mb-5 w-full px-6 lg:px-8 3xl:px-10">
                    <Skeleton width="100%" baseColor="#9DCCFF" height={56} />
                  </p>
                  <p className="w-full px-6 lg:px-8 3xl:px-10">
                    <Skeleton
                      count={10}
                      className="my-2 box-content lg:my-4 3xl:my-6"
                      width="100%"
                      height={40}
                      baseColor="#9DCCFF"
                    />
                  </p>
                </>
              ) : (
                <>
                  <div ref={tableRef} className="w-full overflow-auto">
                    <table className="flex w-full min-w-[720px] table-fixed flex-col gap-y-3 overflow-auto">
                      <thead>
                        <tr className="flex w-full flex-1 items-center justify-start gap-x-4 px-4 lg:px-6 3xl:px-8">
                          <th className="flex flex-[3] items-center justify-start text-base font-semibold text-[#4285F4] lg:text-lg 3xl:text-xl">
                            Name
                          </th>
                          <th className="flex flex-[1.5] items-center justify-start text-base font-semibold text-[#4285F4] lg:text-lg 3xl:text-xl">
                            Phone number
                          </th>
                          <th className="flex flex-[2.5] items-center justify-start text-base font-semibold text-[#4285F4] lg:text-lg 3xl:text-xl">
                            Date of birth
                          </th>
                          <th className="flex flex-[2.5] items-center justify-start text-base font-semibold text-[#4285F4] lg:text-lg 3xl:text-xl">
                            Specialization
                          </th>
                          <th className="flex flex-[2.5] items-center justify-start text-base font-semibold text-[#4285F4] lg:text-lg 3xl:text-xl">
                            Working Time
                          </th>
                          <th className="flex flex-[2.5] items-center justify-start text-base font-semibold text-[#4285F4] lg:text-lg 3xl:text-xl">
                            Work Days
                          </th>
                          <th className="flex flex-[2.5] items-center justify-start text-base font-semibold text-[#4285F4] lg:text-lg 3xl:text-xl">
                            Work Description
                          </th>
                          <th className="flex flex-1 items-center justify-start text-base font-semibold text-[#4285F4] lg:text-lg 3xl:text-xl">
                            {''}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {nurses.length === 0 ? (
                          <tr className="z-10 rounded-[20px] bg-white px-4 py-3 md:p-5 xl:p-6 2xl:p-7">
                            <td colSpan={8} className="w-full text-center">
                              <NoData width={200} className="mx-auto w-[200px] p-7 xl:w-[300px]" />
                              <p>No nurse found</p>
                            </td>
                          </tr>
                        ) : (
                          nurses.map((nurse) => (
                            <tr
                              key={`nurse-${nurse._id}`}
                              className="flex w-full flex-1 items-center justify-start gap-x-3 border-b border-b-[#CCC] p-2 px-2 hover:cursor-pointer hover:bg-[#F1F1F1] lg:p-4 lg:px-4 3xl:p-6 3xl:px-6"
                              onClick={() => navigate(`/nurse/view/${nurse._id}`)}
                            >
                              <td className="flex flex-[3] items-center justify-start text-xs font-medium lg:text-sm 3xl:text-base">
                                {nurse.name}
                              </td>
                              <td className="flex flex-[1.5] items-center justify-start text-xs font-medium lg:text-sm 3xl:text-base">
                                {nurse.phoneNum}
                              </td>
                              <td className="flex flex-[2.5] items-center justify-start text-xs font-medium lg:text-sm 3xl:text-base">
                                {new Date(nurse.dob).toLocaleDateString()}
                              </td>
                              <td className="flex flex-[2.5] items-center justify-start text-xs font-medium lg:text-sm 3xl:text-base">
                                {nurse.specialization}
                              </td>
                              <td className="flex flex-[2.5] items-center justify-start text-xs font-medium lg:text-sm 3xl:text-base">
                                {nurse.schedule
                                  ? `${nurse.schedule.workingTime.startTime} - ${nurse.schedule.workingTime.endTime}`
                                  : '-'}
                              </td>
                              <td className="flex flex-[2.5] items-center justify-start text-xs font-medium lg:text-sm 3xl:text-base">
                                {nurse.schedule && nurse.schedule.workDay.length > 0
                                  ? nurse.schedule.workDay.join(', ')
                                  : '-'}
                              </td>
                              <td className="flex flex-[2.5] items-center justify-start text-xs font-medium lg:text-sm 3xl:text-base">
                                {nurse.schedule && nurse.schedule.workDescription
                                  ? nurse.schedule.workDescription
                                  : '-'}
                              </td>
                              <td className="flex flex-1 items-center justify-end gap-x-2 gap-y-2 whitespace-nowrap">
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    navigate(`/nurse/edit/${nurse._id}`);
                                  }}
                                  className="flex items-center justify-center rounded-full bg-[#4285F4]/90 p-2 hover:bg-[#4285F4]"
                                >
                                  <Icon.Edit
                                    fill="white"
                                    className="h-3 w-3 lg:h-4 lg:w-4 3xl:h-5 3xl:w-5"
                                  />
                                </button>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    nurseToDelete.current = nurse._id;
                                    setDeleteModal(true);
                                  }}
                                  className="flex items-center justify-center rounded-full bg-[#DB4437]/90 p-2 hover:bg-[#DB4437]"
                                >
                                  <Icon.Delete
                                    fill="white"
                                    className="h-3 w-3 lg:h-4 lg:w-4 3xl:h-5 3xl:w-5"
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

export default NurseListPage;
