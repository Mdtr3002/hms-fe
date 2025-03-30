import React, { useRef, useState } from 'react';
import DatePicker from 'react-datepicker';
import { Link } from 'react-router-dom';

import { ReactComponent as NoData } from '../../../assets/svgs/NoData.svg';
import { Icon } from '../../../components';
import DeleteModal from '../../../components/Modal/DeleteModal';
import PatientRecordModal from '../../../components/Modal/PatientRecordModal';
import { Page, Wrapper } from '../../../layout';
import { MedicalRecord } from '../../../types/patient';

interface CustomTimeInputProps {
  date: Date | null;
  onChangeCustom: (date: Date | null, time: string, isStartDate: boolean) => void;
  isStartDate: boolean;
}

export const CustomTimeInput: React.FC<CustomTimeInputProps> = ({
  date,
  onChangeCustom,
  isStartDate,
}) => {
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

const PatientCreate = () => {
  const recordToDelete = useRef<string | null>(null);
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [dob, setDob] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);
  const tableRef = React.useRef<HTMLDivElement>(null);
  const [deleteModal, setDeleteModal] = useState(false);
  const [modalProps, setModalProps] = useState<{
    isOpen: boolean;
    isEditing: boolean;
    medicalRecord?: MedicalRecord;
  }>({
    isOpen: false,
    isEditing: false,
    medicalRecord: undefined,
  });
  const [medicalRecord, setMedicalRecord] = useState<MedicalRecord[]>([
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
  ]);

  const submitDisabled = name === '' || phoneNumber === '' || loading || dob === 0;

  const handleChangeTime = (date: Date | null, time: string, isStartDate: boolean) => {
    const [hh, mm, ss] = time.split(':');
    const targetDate = date instanceof Date ? date : new Date();
    targetDate.setHours(Number(hh) || 0, Number(mm) || 0, Number(ss) || 0);
    // if (isStartDate) {
    //   setEventDuration({ ...eventDuration, start: new Date(targetDate || 0).getTime() });
    // } else setEventDuration({ ...eventDuration, end: new Date(targetDate || 0).getTime() });
    setDob(new Date(targetDate || 0).getTime());
  };

  const createEvent = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setLoading(true);
    const data = {
      name,
      description,
      phoneNumber,
    };
    // EventService.create(data)
    //   .then((_) => {
    //     toast.success('Tạo sự kiện thành công');
    //     setName('');
    //     setEventType('');
    //     setPhonenNNumber('');
    //     setDescription('');
    //   })
    //   .catch((err) => {
    //     toast.error(err.response.data.message);
    //   })
    //   .finally(() => setLoading(false));
  };

  return (
    <Page>
      <PatientRecordModal
        {...modalProps}
        handleOpen={() => {}}
        setIsOpen={(value) => setModalProps({ ...modalProps, isOpen: value })}
      />
      <DeleteModal
        text='Do you want to delete this record?'
        onClose={() => setDeleteModal(false)}
        show={deleteModal}
        onDelete={() => {
          if (recordToDelete.current) {
            setMedicalRecord((prev) =>
              prev.filter((record) => record._id !== recordToDelete.current)
            );
          }
          setDeleteModal(false);
        }}
      />
      <Wrapper className='flex flex-1 flex-col'>
        <div className='w-full bg-[#4285F4]/90 py-4'>
          <p className='text-center text-sm font-bold text-white md:text-2xl 3xl:text-4xl'>
            Create Patient Entry
          </p>
        </div>
        <div className='w-full p-4'>
          <Link className='mb-2 flex items-center hover:underline md:hidden' to='/'>
            <Icon.Chevron className='h-5 -rotate-90 fill-black' />
            <p className='text-sm text-[#5B5B5B]'>Back</p>
          </Link>
          <div
            className='h-full w-full rounded-lg bg-white px-8 py-2
            lg:px-10 lg:py-4 3xl:px-12 3xl:py-6'
          >
            <form className='flex flex-col gap-y-6'>
              <div className='flex w-full flex-col items-start justify-center'>
                <label className='mb-2 w-full' htmlFor='patient-name'>
                  <p className='w-full text-sm font-semibold lg:text-base 3xl:text-xl'>
                    Patient's name
                  </p>
                </label>
                <input
                  id='patient-name'
                  className='flex w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium
                  lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'
                  value={name}
                  placeholder="Enter patient's name"
                  onChange={({ target }) => setName(target.value)}
                />
              </div>

              <div className='flex w-full flex-1 flex-row items-end justify-start gap-x-4'>
                <div className='flex w-full flex-1 flex-col'>
                  <label htmlFor='patient-tel'>
                    <p className='w-full text-sm font-semibold lg:text-base 3xl:text-xl'>
                      Phone number
                    </p>
                  </label>
                  <input
                    id='patient-tel'
                    className='flex w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium
                  lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'
                    value={phoneNumber}
                    type='number'
                    placeholder="Enter patient's phone number"
                    onChange={({ target }) => setPhoneNumber(target.value)}
                  />
                </div>

                <div className='flex w-full flex-1 flex-col'>
                  <p className='w-full text-sm font-semibold lg:block lg:text-base 3xl:text-xl'>
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

              <div className='flex w-full flex-col items-start justify-center'>
                <label className='mb-2 w-full' htmlFor='event-description'>
                  <p className='w-full text-sm font-semibold lg:text-base 3xl:text-xl'>Notes</p>
                </label>
                <textarea
                  id='event-description'
                  className='flex w-full rounded-lg border border-[#CCC] p-1 text-xs
                  font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base '
                  value={description}
                  placeholder='Notes about this patient'
                  rows={5}
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
                          <p className='w-full text-center'>Không tìm thấy chương</p>
                        </div>
                      ) : (
                        medicalRecord.map((record) => (
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
                                  recordToDelete.current = record._id;
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

              <div className='flex w-full flex-row items-center justify-center gap-x-4'>
                <button
                  type='submit'
                  disabled={submitDisabled}
                  onClick={createEvent}
                  className={`flex items-center rounded-lg px-6 py-1
                  transition-all duration-200 lg:px-7 lg:py-2 3xl:px-8 3xl:py-3 ${
                    submitDisabled ? 'bg-gray-400/80' : 'bg-[#4285F4]/80 hover:bg-[#4285F4]'
                  }`}
                >
                  <p className='font-medium text-white'>Save</p>
                </button>

                <button
                  type='button'
                  className='flex items-center rounded-lg px-6 py-1 text-[#DB4437]
                  transition-all duration-200 hover:bg-[#DB4437] hover:text-white
                  focus:outline-none lg:px-7 lg:py-2 3xl:px-8 3xl:py-3'
                  onClick={() => {
                    setName('');
                    setPhoneNumber('');
                    setDescription('');
                    setDob(0);
                  }}
                >
                  <p className='font-medium text-inherit'>Cancel</p>
                </button>
              </div>
            </form>
          </div>
        </div>
      </Wrapper>
    </Page>
  );
};

export default PatientCreate;
