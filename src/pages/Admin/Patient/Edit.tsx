import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import Skeleton from 'react-loading-skeleton';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { ReactComponent as NoData } from '../../../assets/svgs/NoData.svg';
import { Icon } from '../../../components';
import DeleteModal from '../../../components/Modal/DeleteModal';
import PatientRecordModal from '../../../components/Modal/PatientRecordModal';
import { useDebounce } from '../../../hooks';
import { Page, Wrapper } from '../../../layout';
import PatientService from '../../../service/patient.service';
import { MedicalRecord, Patient } from '../../../types/patient';

import { CustomTimeInput } from './CreatePatient';

function arraysAreEqual<T>(arr1: T[], arr2: T[]) {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((value, index) => value === arr2[index]);
}

const PatientEdit = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params?.id ?? '';
  const tableRef = React.useRef<HTMLDivElement>(null);
  const recordToDelete = React.useRef<string | null>(null);

  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dob, setDob] = useState<number>(new Date().getTime());
  const [description, setDescription] = useState('');
  const [deleteModal, setDeleteModal] = useState(false);
  const [medicalRecord, setMedicalRecord] = useState<MedicalRecord[]>([]);
  const [modalProps, setModalProps] = useState<{
    isOpen: boolean;
    isEditing: boolean;
    medicalRecord?: MedicalRecord;
  }>({
    isOpen: false,
    isEditing: false,
    medicalRecord: undefined,
  });

  const [patient, setPatient] = useState<Patient>();
  const [loading, setLoading] = useState(false);
  const [canSave, setCanSave] = useState(false);

  const setSave = useDebounce(() => {
    if (patient) {
      setCanSave(
        name !== patient.name ||
          phoneNumber !== patient.phoneNumber ||
          dob !== patient.dob ||
          _.trim(description) !== patient.description ||
          !arraysAreEqual(medicalRecord, patient.medicalRecord || [])
      );
    }
  });

  const fetchData = useCallback(() => {
    setLoading(true);
    PatientService.getById(id, true)
      .then((res) => setPatient(res.data.payload))
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      })
      .finally(() => setLoading(false));
    setLoading(false);
  }, [id]);

  const handleChangeTime = (date: Date | null, time: string, isStartDate: boolean) => {
    const [hh, mm, ss] = time.split(':');
    const targetDate = date instanceof Date ? date : new Date();
    targetDate.setHours(Number(hh) || 0, Number(mm) || 0, Number(ss) || 0);
    // if (isStartDate) {
    //   setEventDuration({ ...eventDuration, start: new Date(targetDate || 0).getTime() });
    // } else setEventDuration({ ...eventDuration, end: new Date(targetDate || 0).getTime() });
    setDob(new Date(targetDate || 0).getTime());
  };

  const handleOnSave = useDebounce((): void => {
    PatientService.editById(id, {
      name,
      phoneNumber,
      dob,
      description,
      medicalRecord,
    })
      .then(() => {
        toast.success('Edit successfully');
        navigate(-1);
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.response.data.message);
      });
  });

  useEffect(() => {
    if (patient) {
      setName(patient.name);
      setPhoneNumber(patient.phoneNumber);
      setDob(new Date(patient.dob).getTime());
      setDescription(patient?.description || '');
      setMedicalRecord(patient?.medicalRecord || []);
    }
  }, [patient]);

  useEffect(() => {
    setSave();
  }, [name, phoneNumber, dob, description, medicalRecord, setSave]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <Page>
      <PatientRecordModal
        {...modalProps}
        handleOpen={() => {}}
        setIsOpen={(value) => setModalProps({ ...modalProps, isOpen: value })}
        onAccept={(record) => {
          if (modalProps.isEditing) {
            setMedicalRecord((prev) =>
              prev.map((rec) => (rec.recordId === record.recordId ? record : rec))
            );
          } else {
            setMedicalRecord((prev) => [...prev, { ...record, recordId: `${Date.now()}` }]);
          }
        }}
      />
      <DeleteModal
        text='Do you want to delete this record?'
        onClose={() => setDeleteModal(false)}
        show={deleteModal}
        onDelete={() => {
          if (recordToDelete.current) {
            setMedicalRecord((prev) =>
              prev.filter((record) => record.recordId !== recordToDelete.current)
            );
          }
          setDeleteModal(false);
        }}
      />
      <Wrapper className='flex flex-1 flex-col'>
        <div className='w-full bg-[#4285F4]/90 py-4'>
          <p className='text-center text-sm font-bold text-white md:text-2xl 3xl:text-4xl'>
            Edit Patient's Information
          </p>
        </div>
        <div className='w-full p-4'>
          <button
            type='button'
            onClick={() => navigate(-1)}
            className='mb-2 flex items-center hover:underline'
          >
            <Icon.Chevron className='h-5 -rotate-90 fill-black' />
            <p className='text-sm text-[#5B5B5B]'>Back</p>
          </button>
          <div className='h-full w-full rounded-lg bg-white p-4 lg:p-6 3xl:p-8'>
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
                    id='name'
                    className='flex w-full flex-1 rounded-lg border border-[#D9D9D9] p-1 text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'
                    value={name}
                    onChange={({ target }) => {
                      setName(target.value);
                    }}
                  />
                </div>
                <div className='flex w-full flex-1 flex-row items-end justify-start gap-x-4'>
                  <div className='flex w-full flex-1 flex-col gap-y-1'>
                    <p className='flex flex-[2.5] text-base lg:text-lg 3xl:text-xl'>Phone Number</p>
                    <input
                      id='patient-phone-number'
                      value={phoneNumber}
                      onChange={({ target }) => {
                        setPhoneNumber(target.value);
                      }}
                      placeholder='No information'
                      className='flex w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium
                lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'
                    />
                  </div>
                  <div className='flex w-full flex-1 flex-col'>
                    <p className='flex flex-[2.5] text-base lg:text-lg 3xl:text-xl'>
                      Date of Birth
                    </p>
                    <DatePicker
                      selected={dob === 0 ? new Date() : new Date(dob)}
                      showTimeInput
                      timeInputLabel='Time:'
                      onChange={(date) => setDob(new Date(date || 0).getTime())}
                      className='flex w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium
                                      lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'
                      dateFormat={'dd/MM/yyyy'}
                      customTimeInput={
                        <CustomTimeInput
                          date={dob === 0 ? new Date() : new Date(dob)}
                          onChangeCustom={handleChangeTime}
                          isStartDate
                        />
                      }
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
                  <textarea
                    id='description'
                    rows={10}
                    className='flex w-full flex-1 rounded-lg border border-[#D9D9D9] p-1 text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'
                    value={description}
                    onChange={({ target }) => {
                      setDescription(target.value);
                    }}
                  />
                </div>

                <div className='flex items-center space-x-2'>
                  <p className='text-sm font-semibold lg:text-base 3xl:text-xl'>Medical records</p>
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      setModalProps({ isOpen: true, isEditing: false, medicalRecord: undefined });
                    }}
                    className={
                      'flex items-center rounded-lg bg-[#4285F4]/80 px-6 py-1 transition-all duration-200 hover:bg-[#4285F4] lg:px-7 lg:py-2 3xl:px-8 3xl:py-3'
                    }
                  >
                    <p className='font-medium text-white'>Add record</p>
                  </button>
                </div>
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
                          <th className='flex flex-1 items-center justify-start text-base font-semibold text-[#4285f4] lg:text-lg 3xl:text-xl'>
                            {''}
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        {medicalRecord.length === 0 ? (
                          <div className='z-10 rounded-[20px] bg-white px-4 py-3 md:p-5 xl:p-6 2xl:p-7'>
                            <NoData width={200} className='mx-auto w-[200px] p-7 xl:w-[300px]' />
                            <p className='w-full text-center'>No records found</p>
                          </div>
                        ) : (
                          medicalRecord?.map((record) => (
                            <tr
                              key={`material-${record.recordId}`}
                              className='flex w-full flex-1 items-center justify-start gap-x-3 border-b border-b-[#CCC] p-2 px-2 hover:cursor-pointer hover:bg-[#F1F1F1] lg:p-4 lg:px-4 3xl:p-6 3xl:px-6'
                            >
                              <td className='flex flex-[3] items-center justify-start text-xs font-medium lg:text-sm 3xl:text-base'>
                                {record.treatment}
                              </td>
                              <td className='flex flex-[2.5] items-center justify-start text-xs font-medium lg:text-sm 3xl:text-base'>
                                {new Date(record.date).toLocaleDateString()}
                              </td>
                              <td className='flex flex-[2.5] items-center justify-start text-xs font-medium lg:text-sm 3xl:text-base'>
                                {new Date(record.followUpDate).toLocaleDateString()}
                              </td>
                              <td className='flex flex-1 items-center justify-end gap-x-2 gap-y-2 whitespace-nowrap'>
                                <button
                                  type='button'
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    setModalProps({
                                      isOpen: true,
                                      isEditing: true,
                                      medicalRecord: record,
                                    });
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
                                    e.preventDefault();
                                    recordToDelete.current = record.recordId;
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
                {/**
                 * Create button
                 */}
                <div className='flex w-full flex-row items-center justify-center gap-x-4'>
                  <button
                    type='submit'
                    disabled={!canSave}
                    onClick={(e) => {
                      e.preventDefault();
                      handleOnSave();
                    }}
                    className={`flex items-center rounded-lg px-6 py-1
                  transition-all duration-200 lg:px-7 lg:py-2 3xl:px-8 3xl:py-3 ${
                    canSave ? 'bg-[#4285F4]/80 hover:bg-[#4285F4]' : 'bg-gray-400/80'
                  }`}
                  >
                    <p className='font-medium text-white'>Save changes</p>
                  </button>
                </div>
              </main>
            )}
          </div>
        </div>
      </Wrapper>
    </Page>
  );
};

export default PatientEdit;
