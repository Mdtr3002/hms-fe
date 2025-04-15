import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import Skeleton from 'react-loading-skeleton';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Icon } from '../../../components';
import { useDebounce } from '../../../hooks';
import { Page, Wrapper } from '../../../layout';
import { Nurse } from '../../../types/nurse';
import { NurseService } from '../../../service/staff.service';

function arraysAreEqual<T>(arr1: T[], arr2: T[]): boolean {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((value, index) => value === arr2[index]);
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const NurseEdit: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  
  const [nurse, setNurse] = useState<Nurse | undefined>(undefined);
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
  
  const setSave = useDebounce(() => {
    if (nurse) {
      const nurseDobTimestamp = new Date(nurse.dob).getTime();
      const schedule = nurse.schedule;
      const scheduleChanged =
        !schedule ||
        workingTime.startTime !== schedule.workingTime.startTime ||
        workingTime.endTime !== schedule.workingTime.endTime ||
        !arraysAreEqual(workDays, schedule.workDay) ||
        _.trim(workDescription) !== (schedule.workDescription || '');
  
      setCanSave(
        name !== nurse.name ||
          phoneNumber !== nurse.phoneNum ||
          specialization !== nurse.specialization ||
          dob !== nurseDobTimestamp ||
          scheduleChanged
      );
    }
  }, 300);
  
  useEffect(() => {
    if (nurse) {
      setName(nurse.name);
      setPhoneNumber(nurse.phoneNum);
      setSpecialization(nurse.specialization);
      setDob(new Date(nurse.dob).getTime());
      if (nurse.schedule) {
        setWorkingTime(nurse.schedule.workingTime);
        setWorkDays(nurse.schedule.workDay);
        setWorkDescription(nurse.schedule.workDescription || '');
      }
    }
  }, [nurse]);
  
  useEffect(() => {
    setSave();
  }, [name, phoneNumber, specialization, dob, workingTime, workDays, workDescription, setSave]);
  
  const fetchData = useCallback(() => {
    setLoading(true);
    NurseService.getById(id ?? '', true)
      .then((response) => {
        setNurse(response.data.payload);
      })
      .catch((error) => {
        console.error('Failed to fetch nurse details:', error);
        toast.error(error.response?.data?.message || 'Failed to fetch nurse details');
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);
  
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  
  const handleOnSave = useDebounce(async () => {
    const updatedData = {
      name,
      phoneNumber,
      dob,
      description: nurse?.description ?? '',
      specialization,
      scheduleStartTime: workingTime.startTime,
      scheduleEndTime: workingTime.endTime,
      workDays,
      scheduleWorkDescription: workDescription,
    };
  
    try {
      setLoading(true);
      const response = await NurseService.editById(id ?? '', updatedData);
      toast.success('Nurse updated successfully');
      setNurse(response.data);
      navigate(`/nurse/view/${id}`);
    } catch (error: any) {
      console.error('Error updating nurse:', error);
      toast.error(
        error.response?.data?.message || 'Failed to update nurse, please try again'
      );
    } finally {
      setLoading(false);
    }
  }, 500);
  
  const toggleWorkDay = (day: string) => {
    setWorkDays((prevDays) =>
      prevDays.includes(day)
        ? prevDays.filter((d) => d !== day)
        : [...prevDays, day]
    );
  };
  
  return (
    <Page>
      <Wrapper className="flex flex-1 flex-col">
        <div className="w-full bg-[#4285F4]/90 py-4">
          <p className="text-center text-sm font-bold text-white md:text-2xl 3xl:text-4xl">
            Edit Nurse's Information
          </p>
        </div>
        <div className="w-full p-4">
          <button
            type="button"
            onClick={() => navigate(-1)}
            className="mb-2 flex items-center hover:underline"
          >
            <Icon.Chevron className="h-5 -rotate-90 fill-black" />
            <p className="text-sm text-[#5B5B5B]">Back</p>
          </button>
          <div className="h-full w-full rounded-lg bg-white p-4 lg:p-6 3xl:p-8">
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
              nurse && (
                <main className="flex flex-col gap-y-4">
                  <p className="flex text-base lg:text-lg 3xl:text-xl">
                    Nurse's ID: {id}
                  </p>
                  <div className="flex flex-col gap-y-1">
                    <label className="text-base lg:text-lg 3xl:text-xl" htmlFor="name">
                      Name
                    </label>
                    <input
                      id="name"
                      value={name}
                      onChange={({ target }) => setName(target.value)}
                      className="w-full rounded-lg border border-[#D9DCC9] p-1 text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base"
                    />
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <label className="text-base lg:text-lg 3xl:text-xl" htmlFor="phone-number">
                      Phone Number
                    </label>
                    <input
                      id="phone-number"
                      value={phoneNumber}
                      onChange={({ target }) => setPhoneNumber(target.value)}
                      className="w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base"
                    />
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <label className="text-base lg:text-lg 3xl:text-xl" htmlFor="specialization">
                      Specialization
                    </label>
                    <input
                      id="specialization"
                      value={specialization}
                      onChange={({ target }) => setSpecialization(target.value)}
                      className="w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base"
                    />
                  </div>
                  <div className="flex flex-col gap-y-1">
                    <label className="text-base lg:text-lg 3xl:text-xl" htmlFor="dob">
                      Date of Birth
                    </label>
                    <DatePicker
                      id="dob"
                      selected={dob === 0 ? new Date() : new Date(dob)}
                      onChange={(date) => setDob(new Date(date || 0).getTime())}
                      className="w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base"
                      dateFormat="dd/MM/yyyy"
                    />
                  </div>
                  <div className="mt-4">
                    <p className="text-lg font-semibold">Schedule</p>
                    <div className="mt-2 flex flex-col gap-y-3">
                      <div className="flex flex-col gap-y-1">
                        <label className="text-base lg:text-lg 3xl:text-xl">Working Time</label>
                        <div className="flex gap-x-4">
                          <div className="flex flex-col">
                            <label className="text-sm">Start Time</label>
                            <input
                              type="time"
                              defaultValue={nurseData?.schedule?.workingTime.startTime || '08:00'}
                              value={workingTime.startTime}
                              onChange={(e) =>
                                setWorkingTime({ ...workingTime, startTime: e.target.value })
                              }
                              className="rounded-lg border border-[#CCC] p-1 text-xs"
                            />
                          </div>
                          <div className="flex flex-col">
                            <label className="text-sm">End Time</label>
                            <input
                              type="time"
                              defaultValue={nurseData?.schedule?.workingTime.endTime || '17:00'}
                              value={workingTime.endTime}
                              onChange={(e) =>
                                setWorkingTime({ ...workingTime, endTime: e.target.value })
                              }
                              className="rounded-lg border border-[#CCC] p-1 text-xs"
                            />
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-y-1">
                        <label className="text-base lg:text-lg 3xl:text-xl">Work Days</label>
                        <div className="flex flex-wrap gap-x-4 gap-y-2">
                          {daysOfWeek.map((day) => (
                            <label key={day} className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                checked={workDays.includes(day)}
                                onChange={() => toggleWorkDay(day)}
                                className="rounded"
                              />
                              <span className="text-sm">{day}</span>
                            </label>
                          ))}
                        </div>
                      </div>
                      <div className="flex flex-col gap-y-1">
                        <label className="text-base lg:text-lg 3xl:text-xl" htmlFor="work-description">
                          Work Description
                        </label>
                        <textarea
                          id="work-description"
                          value={workDescription}
                          onChange={({ target }) => setWorkDescription(target.value)}
                          rows={3}
                          className="w-full rounded-lg border border-[#D9DCC9] p-1 text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base"
                        />
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 flex w-full items-center justify-center">
                    <button
                      type="submit"
                      disabled={!canSave}
                      onClick={(e) => {
                        e.preventDefault();
                        handleOnSave();
                      }}
                      className={`flex items-center rounded-lg px-6 py-1 transition-all duration-200 lg:px-7 lg:py-2 3xl:px-8 3xl:py-3 ${
                        canSave ? 'bg-[#4285F4]/80 hover:bg-[#4285F4]' : 'bg-gray-400/80'
                      }`}
                    >
                      <p className="font-medium text-white">Save changes</p>
                    </button>
                  </div>
                </main>
              )
            )}
          </div>
        </div>
      </Wrapper>
    </Page>
  );
};

export default NurseEdit;
