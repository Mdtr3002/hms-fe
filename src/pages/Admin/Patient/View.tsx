import { useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Link, useNavigate, useParams } from 'react-router-dom';

import { ReactComponent as NoData } from '../../../assets/svgs/NoData.svg';
import { Icon } from '../../../components';
import { Page, Wrapper } from '../../../layout';
import { Patient } from '../../../types/patient';

const PatientView = () => {
  const params = useParams();
  const id = params?.id ?? '';
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [patient, setPatient] = useState<Patient>({
    _id: '1',
    name: 'Nguyễn Văn A',
    phoneNum: '123456789',
    dob: 1743344526683,
    description: 'Lorem ipsum dolor sit amet',
    medicalRecords: [
      {
        _id: '1',
        treatment: 'Treatment 1',
        date: 1743344526683,
        followUpDate: 1743344526683,
      },
      {
        _id: '2',
        treatment: 'Treatment 2',
        date: 1743344526683,
        followUpDate: 1743344526683,
      },
    ],
  });
  const tableRef = useRef<HTMLDivElement>(null);

  // useEffect(() => {
  //   setLoading(true);
  //   ChapterService.getById(id, true)
  //     .then((res) => {
  //       const result = res.data.payload;
  //       setChapter(result);
  //     })
  //     .catch((err) => {
  //       toast.error(err.response.data.message);
  //     })
  //     .finally(() => {
  //       setLoading(false);
  //     });
  // }, [id]);

  return (
    <Page>
      <Wrapper className='flex flex-1 flex-col'>
        <div className='w-full bg-[#4285F4]/90 py-4'>
          <p className='text-center text-sm font-bold text-white md:text-2xl 3xl:text-4xl'>
            View Patient's Information
          </p>
        </div>
        <div className='w-full p-4'>
          <Link className='mb-2 flex items-center hover:underline' to='/patient/manage'>
            <Icon.Chevron className='h-5 -rotate-90 fill-black' />
            <p className='text-sm text-[#5B5B5B]'>Back</p>
          </Link>
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
            lg:px-10 lg:py-4 3xl:px-12 3xl:py-8'
            >
              <main className='flex flex-col gap-y-4'>
                <p className='flex flex-[2.5] text-base lg:text-lg 3xl:text-xl'>
                  Patient's ID: {id}
                </p>
                <div className='flex flex-col gap-y-1'>
                  <label
                    className='flex flex-[2.5] text-base lg:text-lg 3xl:text-xl'
                    htmlFor='name'
                  >
                    Name
                  </label>
                  <input
                    id='patient-name'
                    value={patient?.name}
                    placeholder='No information'
                    className='flex w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium
                  lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'
                    disabled
                  />
                </div>
                <div className='flex w-full flex-1 flex-row items-end justify-start gap-x-4'>
                  <div className='flex w-full flex-col gap-y-1'>
                    <p className='flex flex-[2.5] text-base lg:text-lg 3xl:text-xl'>Phone number</p>
                    <input
                      id='patient-phone-number'
                      value={patient.phoneNum}
                      placeholder='No information'
                      className='flex w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium
                lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'
                      disabled
                    />
                  </div>
                  <div className='flex w-full flex-col gap-y-1'>
                    <p className='flex flex-[2.5] text-base lg:text-lg 3xl:text-xl'>
                      Date of Birth
                    </p>
                    <input
                      id='patient-dob'
                      value={patient.dob}
                      placeholder='No information'
                      className='flex w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium
                lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'
                      disabled
                    />
                  </div>
                </div>

                {/**
                 * Description field
                 */}
                <div className='flex flex-col gap-y-1'>
                  <label
                    className='flex flex-[2.5] text-base lg:text-lg 3xl:text-xl'
                    htmlFor='description'
                  >
                    Notes
                  </label>
                  <div
                    className='flex w-full rounded-lg border border-[#CCC] p-1 text-xs
                  font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'
                  >
                    {patient?.description ? patient.description : ''}
                  </div>
                </div>

                <p className='mt-2 w-full text-sm font-semibold lg:text-base 3xl:text-xl'>
                  Medical records
                </p>
                <>
                  <div ref={tableRef} className='w-full overflow-auto'>
                    <table className='flex w-full min-w-[720px] table-fixed flex-col gap-y-3 overflow-auto'>
                      <thead>
                        <tr className='flex w-full flex-1 items-center justify-start gap-x-4 px-4 lg:px-6 3xl:px-8'>
                          <th className='flex flex-[3] items-center justify-start text-base font-semibold text-[#4285f4] lg:text-lg 3xl:text-xl'>
                            Treatment
                          </th>
                          <th className='flex flex-[2.5] items-center justify-start text-base font-semibold text-[#4285f4] lg:text-lg 3xl:text-xl'>
                            Date
                          </th>
                          <th className='flex flex-[2.5] items-center justify-start text-left text-base font-semibold text-[#4285f4] lg:text-lg 3xl:text-xl'>
                            Follow up Date
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {patient.medicalRecords?.length === 0 ? (
                          <div className='z-10 rounded-[20px] bg-white px-4 py-3 md:p-5 xl:p-6 2xl:p-7'>
                            <NoData width={200} className='mx-auto w-[200px] p-7 xl:w-[300px]' />
                            <p className='w-full text-center'>No records found</p>
                          </div>
                        ) : (
                          patient.medicalRecords?.map((record) => (
                            <tr
                              key={`material-${record._id}`}
                              className='flex w-full flex-1 items-center justify-start gap-x-3 border-b border-b-[#CCC] p-2 px-2 hover:cursor-pointer hover:bg-[#F1F1F1] lg:p-4 lg:px-4 3xl:p-6 3xl:px-6'
                            >
                              <td className='flex flex-[3] items-center justify-start text-xs font-medium lg:text-sm 3xl:text-base'>
                                {record.treatment}
                              </td>
                              <td className='flex flex-[2.5] items-center justify-start text-xs font-medium lg:text-sm 3xl:text-base'>
                                {new Date(record.date).toLocaleString()}
                              </td>
                              <td className='flex flex-[2.5] items-center justify-start text-xs font-medium lg:text-sm 3xl:text-base'>
                                {new Date(record.followUpDate).toLocaleString()}
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </>

                <div className='my-4 flex w-full justify-end'>
                  <button
                    type='button'
                    onClick={() => navigate(`/patient/edit/${params.id}`)}
                    className='w-fit cursor-pointer rounded-lg bg-[#4285F4]/80 px-1 transition-all duration-200 hover:bg-[#4285F4] lg:px-3 3xl:px-5'
                  >
                    <p className='p-1 text-xs font-medium text-white lg:p-2 lg:text-sm 3xl:p-3 3xl:text-base'>
                      Edit
                    </p>
                  </button>
                </div>
              </main>
            </div>
          )}
        </div>
      </Wrapper>
    </Page>
  );
};

export default PatientView;
