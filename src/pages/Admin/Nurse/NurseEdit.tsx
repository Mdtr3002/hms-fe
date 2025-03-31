import _ from 'lodash';
import React, { useCallback, useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import Skeleton from 'react-loading-skeleton';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Icon } from '../../../components';
import { Page, Wrapper } from '../../../layout';
import { nurse } from '../../../types/nurse';
import { useDebounce } from '../../../hooks';

function arraysAreEqual<T>(arr1: T[], arr2: T[]) {
  if (arr1.length !== arr2.length) return false;
  return arr1.every((value, index) => value === arr2[index]);
}

const daysOfWeek = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

const NurseEdit = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params?.id ?? '';

  // State for the fetched nurse details.
  const [nurseData, setNurseData] = useState<nurse>();
  const [loading, setLoading] = useState(false);
  const [canSave, setCanSave] = useState(false);

  // Form fields.
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [specialization, setSpecialization] = useState('');
  // We store the nurse's date of birth as a timestamp.
  const [dob, setDob] = useState<number>(new Date().getTime());

  // Schedule fields.
  const [workingTime, setWorkingTime] = useState<{ startTime: string; endTime: string }>({
    startTime: '08:00',
    endTime: '17:00',
  });
  const [workDays, setWorkDays] = useState<string[]>([]);
  const [workDescription, setWorkDescription] = useState('');

  // Debounced function that checks whether any field has been modified.
  const setSave = useDebounce(() => {
    if (nurseData) {
      const nurseDobTimestamp = new Date(nurseData.dob).getTime();
      const schedule = nurseData.schedule;
      const scheduleChanged =
        !schedule ||
        workingTime.startTime !== schedule.workingTime.startTime ||
        workingTime.endTime !== schedule.workingTime.endTime ||
        !arraysAreEqual(workDays, schedule.workDay) ||
        _.trim(workDescription) !== (schedule.workDescription || '');

      setCanSave(
        name !== nurseData.name ||
          phoneNumber !== nurseData.phoneNum ||
          specialization !== nurseData.specialization ||
          dob !== nurseDobTimestamp ||
          scheduleChanged
      );
    }
  });

  // When nurse data is loaded, initialize all form fields.
  useEffect(() => {
    if (nurseData) {
      setName(nurseData.name);
      setPhoneNumber(nurseData.phoneNum);
      setSpecialization(nurseData.specialization);
      setDob(new Date(nurseData.dob).getTime());
      if (nurseData.schedule) {
        setWorkingTime(nurseData.schedule.workingTime);
        setWorkDays(nurseData.schedule.workDay);
        setWorkDescription(nurseData.schedule.workDescription || '');
      }
    }
  }, [nurseData]);

  // Check for field changes.
  useEffect(() => {
    setSave();
  }, [name, phoneNumber, specialization, dob, workingTime, workDays, workDescription, setSave]);

  // Function to fetch nurse data (replace with your API call).
  const fetchData = useCallback(() => {
    setLoading(true);
    // Example:
    // NurseService.getById(id)
    //   .then((res) => setNurseData(res.data.payload))
    //   .catch((err) => {
    //     console.error(err);
    //     toast.error(err.response.data.message);
    //   })
    //   .finally(() => setLoading(false));
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // Debounced function to save the updated nurse information.
  const handleOnSave = useDebounce(() => {
    const updatedNurse: nurse = {
      _id: id,
      name,
      phoneNum: phoneNumber,
      specialization,
      // Convert the dob timestamp to an ISO string.
      dob: new Date(dob).toISOString(),
      schedule: {
        _id: nurseData?.schedule?._id || '0',
        workingTime,
        workDay: workDays,
        workDescription,
      },
      lastUpdatedAt: new Date().toISOString(),
    };

    // Replace the following with your API update call.
    // NurseService.edit(id, updatedNurse)
    //   .then(() => {
    //     toast.success('Edit successfully');
    //     fetchData();
    //   })
    //   .catch((err) => {
    //     console.error(err);
    //     toast.error(err.response.data.message);
    //   });
    console.log('Updated Nurse:', updatedNurse);
  });

  const toggleWorkDay = (day: string) => {
    setWorkDays((prevDays) =>
      prevDays.includes(day) ? prevDays.filter((d) => d !== day) : [...prevDays, day]
    );
  };

  return (
    <Page>
      <Wrapper className="flex flex-1 flex-col">
        <div className="w-full bg-[#4285F4]/90 py-4">
          <p className="text-center text-sm font-bold text-white md:text-2xl 3xl:text-4xl">
            Edit Nurse&apos;s Information
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
                    className="my-2 lg:my-4 3xl:my-6"
                    width="100%"
                    height={40}
                    baseColor="#9DCCFF"
                  />
                </p>
              </>
            ) : (
              <main className="flex flex-col gap-y-4">
                {/* Displaying the nurse's id */}
                <p className="flex text-base lg:text-lg 3xl:text-xl">
                  Nurse&apos;s ID: {id}
                </p>

                {/* Nurse Name */}
                <div className="flex flex-col gap-y-1">
                  <label className="text-base lg:text-lg 3xl:text-xl" htmlFor="name">
                    Name
                  </label>
                  <input
                    id="name"
                    defaultValue={nurseData?.name || ''}
                    value={name}
                    onChange={({ target }) => setName(target.value)}
                    className="w-full rounded-lg border border-[#D9DCC9] p-1 text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base"
                  />
                </div>

                {/* Nurse Phone Number */}
                <div className="flex flex-col gap-y-1">
                  <label className="text-base lg:text-lg 3xl:text-xl" htmlFor="phone-number">
                    Phone Number
                  </label>
                  <input
                    id="phone-number"
                    defaultValue={nurseData?.phoneNum || ''}
                    value={phoneNumber}
                    onChange={({ target }) => setPhoneNumber(target.value)}
                    className="w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base"
                  />
                </div>

                {/* Nurse Specialization */}
                <div className="flex flex-col gap-y-1">
                  <label className="text-base lg:text-lg 3xl:text-xl" htmlFor="specialization">
                    Specialization
                  </label>
                  <input
                    id="specialization"
                    defaultValue={nurseData?.specialization || ''}
                    value={specialization}
                    onChange={({ target }) => setSpecialization(target.value)}
                    className="w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base"
                  />
                </div>

                {/* Nurse Date of Birth */}
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

                {/* Schedule Section */}
                <div className="mt-4">
                  <p className="text-lg font-semibold">Schedule</p>
                  <div className="flex flex-col gap-y-3 mt-2">
                    {/* Working Time */}
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
                    {/* Work Days */}
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
                    {/* Work Description */}
                    <div className="flex flex-col gap-y-1">
                      <label className="text-base lg:text-lg 3xl:text-xl" htmlFor="work-description">
                        Work Description
                      </label>
                      <textarea
                        id="work-description"
                        rows={3}
                        defaultValue={nurseData?.schedule?.workDescription || ''}
                        value={workDescription}
                        onChange={({ target }) => setWorkDescription(target.value)}
                        className="w-full rounded-lg border border-[#D9D9D9] p-1 text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base"
                      />
                    </div>
                  </div>
                </div>

                {/* Save Button */}
                <div className="flex w-full items-center justify-center mt-4">
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
            )}
          </div>
        </div>
      </Wrapper>
    </Page>
  );
};

export default NurseEdit;
