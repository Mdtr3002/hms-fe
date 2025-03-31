import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import Skeleton from 'react-loading-skeleton';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Icon } from '../../../components';
import { useDebounce } from '../../../hooks';
import { Page, Wrapper } from '../../../layout';
import { Appointment } from '../../../types/appointment';
import { Doctor } from '../../../types/doctor';

function arraysAreEqual<T>(arr1: T[], arr2: T[]) {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((value, index) => value === arr2[index]);
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const DoctorEdit = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params?.id ?? '';

  const [doctor, setDoctor] = useState<Doctor>();
  const [loading, setLoading] = useState(false);
  const [canSave, setCanSave] = useState(false);

  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [dob, setDob] = useState<number>(new Date().getTime());

  const [workingTime, setWorkingTime] = useState<{ startTime: string; endTime: string }>({
    startTime: '08:00',
    endTime: '17:00',
  });
  const [workDays, setWorkDays] = useState<string[]>([]);
  const [workDescription, setWorkDescription] = useState('');

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: '1',
      patientName: 'Nguyễn Văn A',
      doctorId: '1',
      date: new Date('2025-04-01T10:00:00'),
      reason: 'General Check-up',
      status: 'pending',
    },
    {
      id: '2',
      patientName: 'Trần Văn B',
      doctorId: '1',
      date: new Date('2025-04-02T11:00:00'),
      reason: 'Consultation',
      status: 'scheduled',
    },
    {
      id: '3',
      patientName: 'Lê Thị C',
      doctorId: '1',
      date: new Date('2025-04-03T09:00:00'),
      reason: 'Follow-up',
      status: 'completed',
    },
  ]);

  const handleAppointmentAction = (appointmentId: string, action: 'accept' | 'deny') => {
    setAppointments((prevAppointments) =>
      prevAppointments.map((app) => {
        if (app.id === appointmentId) {
          return {
            ...app,
            status: action === 'accept' ? 'scheduled' : 'canceled',
          };
        }
        return app;
      })
    );
    toast.success(`Appointment ${action === 'accept' ? 'accepted' : 'denied'}`);
  };

  const setSave = useDebounce(() => {
    if (doctor) {
      const doctorDobTimestamp = new Date(doctor.dob).getTime();
      const schedule = doctor.schedule;
      const scheduleChanged =
        !schedule ||
        workingTime.startTime !== schedule.workingTime.startTime ||
        workingTime.endTime !== schedule.workingTime.endTime ||
        !arraysAreEqual(workDays, schedule.workDay) ||
        _.trim(workDescription) !== (schedule.workDescription || '');

      setCanSave(
        name !== doctor.name ||
          phoneNumber !== doctor.phoneNum ||
          specialization !== doctor.specialization ||
          dob !== doctorDobTimestamp ||
          scheduleChanged
      );
    }
  });

  useEffect(() => {
    if (doctor) {
      setName(doctor.name);
      setPhoneNumber(doctor.phoneNum);
      setSpecialization(doctor.specialization);
      setDob(new Date(doctor.dob).getTime());
      if (doctor.schedule) {
        setWorkingTime(doctor.schedule.workingTime);
        setWorkDays(doctor.schedule.workDay);
        setWorkDescription(doctor.schedule.workDescription || '');
      }
    }
  }, [doctor]);

  useEffect(() => {
    setSave();
  }, [name, phoneNumber, specialization, dob, workingTime, workDays, workDescription, setSave]);

  const fetchData = useCallback(() => {
    setLoading(true);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleOnSave = useDebounce(() => {
    const updatedDoctor: Doctor = {
      _id: id,
      name,
      phoneNum: phoneNumber,
      specialization,
      dob: new Date(dob).toISOString(),
      schedule: {
        _id: doctor?.schedule?._id || '0',
        workingTime,
        workDay: workDays,
        workDescription,
      },
      lastUpdatedAt: new Date().toISOString(),
    };

    console.log('Updated Doctor:', updatedDoctor);
  });

  const toggleWorkDay = (day: string) => {
    setWorkDays((prevDays) =>
      prevDays.includes(day) ? prevDays.filter((d) => d !== day) : [...prevDays, day]
    );
  };

  return (
    <Page>
      <Wrapper className='flex flex-1 flex-col'>
        <div className='w-full bg-[#4285F4]/90 py-4'>
          <p className='text-center text-sm font-bold text-white md:text-2xl 3xl:text-4xl'>
            Edit Doctor&apos;s Information
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
                  <Skeleton width='100%' baseColor='#9DCCFF' height={56} />
                </p>
                <p className='w-full px-6 lg:px-8 3xl:px-10'>
                  <Skeleton
                    count={10}
                    className='my-2 lg:my-4 3xl:my-6'
                    width='100%'
                    height={40}
                    baseColor='#9DCCFF'
                  />
                </p>
              </>
            ) : (
              <main className='flex flex-col gap-y-4'>
                <p className='flex text-base lg:text-lg 3xl:text-xl'>Doctor&apos;s ID: {id}</p>
                <div className='flex flex-col gap-y-1'>
                  <label className='text-base lg:text-lg 3xl:text-xl' htmlFor='name'>
                    Name
                  </label>
                  <input
                    id='name'
                    defaultValue={doctor?.name || ''}
                    value={name}
                    onChange={({ target }) => setName(target.value)}
                    className='w-full rounded-lg border border-[#D9D9D9] p-1 text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'
                  />
                </div>
                <div className='flex flex-col gap-y-1'>
                  <label className='text-base lg:text-lg 3xl:text-xl' htmlFor='phone-number'>
                    Phone Number
                  </label>
                  <input
                    id='phone-number'
                    defaultValue={doctor?.phoneNum || ''}
                    value={phoneNumber}
                    onChange={({ target }) => setPhoneNumber(target.value)}
                    className='w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'
                  />
                </div>
                <div className='flex flex-col gap-y-1'>
                  <label className='text-base lg:text-lg 3xl:text-xl' htmlFor='specialization'>
                    Specialization
                  </label>
                  <input
                    id='specialization'
                    defaultValue={doctor?.specialization || ''}
                    value={specialization}
                    onChange={({ target }) => setSpecialization(target.value)}
                    className='w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'
                  />
                </div>
                <div className='flex flex-col gap-y-1'>
                  <label className='text-base lg:text-lg 3xl:text-xl' htmlFor='dob'>
                    Date of Birth
                  </label>
                  <DatePicker
                    id='dob'
                    selected={dob === 0 ? new Date() : new Date(dob)}
                    onChange={(date) => setDob(new Date(date || 0).getTime())}
                    className='w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'
                    dateFormat='dd/MM/yyyy'
                  />
                </div>

                <div className='mt-4'>
                  <p className='text-lg font-semibold'>Schedule</p>
                  <div className='mt-2 flex flex-col gap-y-3'>
                    <div className='flex flex-col gap-y-1'>
                      <label className='text-base lg:text-lg 3xl:text-xl'>Working Time</label>
                      <div className='flex gap-x-4'>
                        <div className='flex flex-col'>
                          <label className='text-sm'>Start Time</label>
                          <input
                            type='time'
                            defaultValue={doctor?.schedule?.workingTime.startTime || '08:00'}
                            value={workingTime.startTime}
                            onChange={(e) =>
                              setWorkingTime({ ...workingTime, startTime: e.target.value })
                            }
                            className='rounded-lg border border-[#CCC] p-1 text-xs'
                          />
                        </div>
                        <div className='flex flex-col'>
                          <label className='text-sm'>End Time</label>
                          <input
                            type='time'
                            defaultValue={doctor?.schedule?.workingTime.endTime || '17:00'}
                            value={workingTime.endTime}
                            onChange={(e) =>
                              setWorkingTime({ ...workingTime, endTime: e.target.value })
                            }
                            className='rounded-lg border border-[#CCC] p-1 text-xs'
                          />
                        </div>
                      </div>
                    </div>
                    <div className='flex flex-col gap-y-1'>
                      <label className='text-base lg:text-lg 3xl:text-xl'>Work Days</label>
                      <div className='flex flex-wrap gap-x-4 gap-y-2'>
                        {daysOfWeek.map((day) => (
                          <label key={day} className='flex items-center space-x-2'>
                            <input
                              type='checkbox'
                              checked={workDays.includes(day)}
                              onChange={() => toggleWorkDay(day)}
                              className='rounded'
                            />
                            <span className='text-sm'>{day}</span>
                          </label>
                        ))}
                      </div>
                    </div>
                    <div className='flex flex-col gap-y-1'>
                      <label
                        className='text-base lg:text-lg 3xl:text-xl'
                        htmlFor='work-description'
                      >
                        Work Description
                      </label>
                      <textarea
                        id='work-description'
                        rows={3}
                        defaultValue={doctor?.schedule?.workDescription || ''}
                        value={workDescription}
                        onChange={({ target }) => setWorkDescription(target.value)}
                        className='w-full rounded-lg border border-[#D9D9D9] p-1 text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'
                      />
                    </div>
                  </div>
                </div>
                <div className='mt-4 flex w-full items-center justify-center'>
                  <button
                    type='submit'
                    disabled={!canSave}
                    onClick={(e) => {
                      e.preventDefault();
                      handleOnSave();
                    }}
                    className={`flex items-center rounded-lg px-6 py-1 transition-all duration-200 lg:px-7 lg:py-2 3xl:px-8 3xl:py-3 ${
                      canSave ? 'bg-[#4285F4]/80 hover:bg-[#4285F4]' : 'bg-gray-400/80'
                    }`}
                  >
                    <p className='font-medium text-white'>Save changes</p>
                  </button>
                </div>

                {/* Appointments Section */}
                <div className='mt-8'>
                  <p className='mb-4 text-lg font-semibold'>Appointments</p>
                  <div className='overflow-x-auto'>
                    <table className='min-w-full table-auto border-collapse'>
                      <thead>
                        <tr className='bg-gray-200'>
                          <th className='px-4 py-2 text-left'>Patient Name</th>
                          <th className='px-4 py-2 text-left'>Date</th>
                          <th className='px-4 py-2 text-left'>Reason</th>
                          <th className='px-4 py-2 text-left'>Status</th>
                          <th className='px-4 py-2 text-left'>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {appointments.map((appointment) => (
                          <tr key={appointment.id} className='border-b'>
                            <td className='px-4 py-2'>{appointment.patientName}</td>
                            <td className='px-4 py-2'>{appointment.date.toLocaleString()}</td>
                            <td className='px-4 py-2'>{appointment.reason}</td>
                            <td className='px-4 py-2 capitalize'>{appointment.status}</td>
                            <td className='px-4 py-2'>
                              {appointment.status === 'pending' ? (
                                <div className='flex gap-2'>
                                  <button
                                    type='button'
                                    onClick={() =>
                                      handleAppointmentAction(appointment.id, 'accept')
                                    }
                                    className='rounded bg-green-500 px-2 py-1 text-xs text-white hover:bg-green-600'
                                  >
                                    Accept
                                  </button>
                                  <button
                                    type='button'
                                    onClick={() => handleAppointmentAction(appointment.id, 'deny')}
                                    className='rounded bg-red-500 px-2 py-1 text-xs text-white hover:bg-red-600'
                                  >
                                    Deny
                                  </button>
                                </div>
                              ) : (
                                <span className='text-sm'>—</span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
                {/* End of Appointments Section */}
              </main>
            )}
          </div>
        </div>
      </Wrapper>
    </Page>
  );
};

export default DoctorEdit;
