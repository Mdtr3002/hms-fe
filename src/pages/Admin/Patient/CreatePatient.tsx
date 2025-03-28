import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { Link } from 'react-router-dom';

import { Icon } from '../../../components';
import { Page, Wrapper } from '../../../layout';

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

const PatientCreate = () => {
  const [name, setName] = useState('');
  const [phoneNumber, setPhonenNNumber] = useState('');
  const [eventType, setEventType] = useState('');
  const [dob, setDob] = useState<number>(0);
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const submitDisabled =
    name === '' || phoneNumber === '' || eventType === '' || loading || dob === 0;

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
      eventType,
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
      <Wrapper className='flex flex-1 flex-col'>
        <div className='w-full bg-[#4285F4]/90 py-4'>
          <p className='text-center text-sm font-bold text-white md:text-2xl 3xl:text-4xl'>
            Create Patient Entry
          </p>
        </div>
        <div className='w-full p-4'>
          <Link className='mb-2 flex items-center hover:underline md:hidden' to='/admin'>
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
                    onChange={({ target }) => setPhonenNNumber(target.value)}
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
                    setEventType('');
                    setPhonenNNumber('');
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
