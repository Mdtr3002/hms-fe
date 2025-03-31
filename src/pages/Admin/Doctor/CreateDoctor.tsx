import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import { Link } from 'react-router-dom';

import { Icon } from '../../../components';
import { Page, Wrapper } from '../../../layout';
import { Doctor } from '../../../types/doctor';

interface CustomTimeInputProps {
  date: Date | null;
  onChangeCustom: (date: Date | null, time: string, isStartDate: boolean) => void;
  isStartDate: boolean;
}

const CustomTimeInput: React.FC<CustomTimeInputProps> = ({ date, onChangeCustom, isStartDate }) => {
  const value = date instanceof Date ? date.toLocaleTimeString('it-IT') : '';
  return (
    <input
      type="time"
      step="1"
      value={value}
      onChange={(event) => onChangeCustom(date, event.target.value, isStartDate)}
    />
  );
};

const DoctorCreate = () => {
  // Doctor basic info
  const [name, setName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [specialization, setSpecialization] = useState('');
  const [dob, setDob] = useState<number>(0);
  const [loading, setLoading] = useState(false);

  const [scheduleStartTime, setScheduleStartTime] = useState('09:00:00');
  const [scheduleEndTime, setScheduleEndTime] = useState('18:00:00');
  const [workDays, setWorkDays] = useState<string[]>([]);
  const [scheduleWorkDescription, setScheduleWorkDescription] = useState('');

  // Disable submit if any required field is missing.
  const submitDisabled =
    name === '' ||
    phoneNumber === '' ||
    specialization === '' ||
    loading ||
    dob === 0 ||
    !scheduleStartTime ||
    !scheduleEndTime ||
    workDays.length === 0;

  const handleChangeTime = (date: Date | null, time: string, isStartDate: boolean) => {
    const [hh, mm, ss] = time.split(':');
    const targetDate = date instanceof Date ? new Date(date) : new Date();
    targetDate.setHours(Number(hh) || 0, Number(mm) || 0, Number(ss) || 0);
    setDob(new Date(targetDate).getTime());
  };

  // Weekdays for rendering checkboxes
  const weekdays: string[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];

  const handleWorkDayChange = (day: string, checked: boolean) => {
    if (checked) {
      setWorkDays((prev) => [...prev, day]);
    } else {
      setWorkDays((prev) => prev.filter((d) => d !== day));
    }
  };

  const createDoctor = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setLoading(true);

    const data: Doctor = {
      _id: '', 
      name,
      phoneNum: phoneNumber,
      dob: new Date(dob).toISOString(),
      specialization: specialization,
      schedule: {
        _id: '', 
        workingTime: {
          startTime: scheduleStartTime,
          endTime: scheduleEndTime,
        },
        workDay: workDays,
        workDescription: scheduleWorkDescription,
      },
      lastUpdatedAt: new Date().toISOString(),
    };

    
    console.log(data);

    setName('');
    setPhoneNumber('');
    setSpecialization('');
    setDob(0);
    setScheduleStartTime('09:00:00');
    setScheduleEndTime('18:00:00');
    setWorkDays([]);
    setScheduleWorkDescription('');
    setLoading(false);
  };

  return (
    <Page>
      <Wrapper className="flex flex-1 flex-col">
        <div className="w-full bg-[#4285F4]/90 py-4">
          <p className="text-center text-sm font-bold text-white md:text-2xl 3xl:text-4xl">
            Create Doctor Entry
          </p>
        </div>
        <div className="w-full p-4">
          <Link className="mb-2 flex items-center hover:underline md:hidden" to="/admin">
            <Icon.Chevron className="h-5 -rotate-90 fill-black" />
            <p className="text-sm text-[#5B5B5B]">Back</p>
          </Link>
          <div className="h-full w-full rounded-lg bg-white px-8 py-2 lg:px-10 lg:py-4 3xl:px-12 3xl:py-6">
            <form className="flex flex-col gap-y-6">

              {/* Doctor's Name */}
              <div className="flex w-full flex-col items-start justify-center">
                <label htmlFor="doctor-name" className="mb-2 w-full">
                  <p className="w-full text-sm font-semibold lg:text-base 3xl:text-xl">Doctor's Name</p>
                </label>
                <input
                  id="doctor-name"
                  className="flex w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base"
                  value={name}
                  placeholder="Enter doctor's name"
                  onChange={({ target }) => setName(target.value)}
                />
              </div>

              {/* Phone Number and Date of Birth */}
              <div className="flex w-full flex-1 flex-row items-end justify-start gap-x-4">
                <div className="flex w-full flex-1 flex-col">
                  <label htmlFor="doctor-tel">
                    <p className="w-full text-sm font-semibold lg:text-base 3xl:text-xl">Phone Number</p>
                  </label>
                  <input
                    id="doctor-tel"
                    className="flex w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base"
                    value={phoneNumber}
                    type="number"
                    placeholder="Enter doctor's phone number"
                    onChange={({ target }) => setPhoneNumber(target.value)}
                  />
                </div>

                <div className="flex w-full flex-1 flex-col">
                  <p className="w-full text-sm font-semibold lg:text-base 3xl:text-xl">Date of Birth</p>
                  <DatePicker
                    selected={dob === 0 ? new Date() : new Date(dob)}
                    showTimeInput
                    timeInputLabel="Time:"
                    onChange={(date) => setDob(new Date(date || 0).getTime())}
                    className="flex w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base"
                    dateFormat="dd/MM/yyyy"
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

              {/* Specialization */}
              <div className="flex w-full flex-col items-start justify-center">
                <label htmlFor="doctor-specialization" className="mb-2 w-full">
                  <p className="w-full text-sm font-semibold lg:text-base 3xl:text-xl">Specialization</p>
                </label>
                <input
                  id="doctor-specialization"
                  className="flex w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base"
                  value={specialization}
                  placeholder="Enter doctor's specialization"
                  onChange={({ target }) => setSpecialization(target.value)}
                />
              </div>

              {/* Schedule Section */}
              <div className="flex w-full flex-col items-start justify-center gap-y-4">
                <p className="w-full text-sm font-semibold lg:text-base 3xl:text-xl">Schedule</p>

                {/* Working Time */}
                <div className="flex flex-col w-full">
                  <label className="mb-2">
                    <p className="text-sm font-medium">Working Time</p>
                  </label>
                  <div className="flex gap-x-4">
                    <div className="flex flex-col">
                      <label htmlFor="schedule-start" className="text-xs">Start Time</label>
                      <input
                        id="schedule-start"
                        type="time"
                        step="1"
                        value={scheduleStartTime}
                        onChange={({ target }) => setScheduleStartTime(target.value)}
                        className="rounded-lg border border-[#CCC] p-1 text-xs lg:p-2 lg:text-sm"
                      />
                    </div>
                    <div className="flex flex-col">
                      <label htmlFor="schedule-end" className="text-xs">End Time</label>
                      <input
                        id="schedule-end"
                        type="time"
                        step="1"
                        value={scheduleEndTime}
                        onChange={({ target }) => setScheduleEndTime(target.value)}
                        className="rounded-lg border border-[#CCC] p-1 text-xs lg:p-2 lg:text-sm"
                      />
                    </div>
                  </div>
                </div>

                {/* Work Days */}
                <div className="flex flex-col w-full">
                  <label className="mb-2">
                    <p className="text-sm font-medium">Work Days</p>
                  </label>
                  <div className="flex flex-wrap gap-x-4 gap-y-2">
                    {weekdays.map((day) => (
                      <div key={day} className="flex items-center">
                        <input
                          type="checkbox"
                          id={`day-${day}`}
                          value={day}
                          checked={workDays.includes(day)}
                          onChange={(e) => handleWorkDayChange(day, e.target.checked)}
                          className="mr-1"
                        />
                        <label htmlFor={`day-${day}`} className="text-xs">{day}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Work Description */}
                <div className="flex w-full flex-col items-start justify-center">
                  <label htmlFor="schedule-work-description" className="mb-2 w-full">
                    <p className="w-full text-sm font-semibold lg:text-base 3xl:text-xl">Work Description</p>
                  </label>
                  <textarea
                    id="schedule-work-description"
                    className="flex w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base"
                    value={scheduleWorkDescription}
                    placeholder="Enter work description"
                    rows={3}
                    onChange={({ target }) => setScheduleWorkDescription(target.value)}
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex w-full flex-row items-center justify-center gap-x-4">
                <button
                  type="submit"
                  disabled={submitDisabled}
                  onClick={createDoctor}
                  className={`flex items-center rounded-lg px-6 py-1 transition-all duration-200 lg:px-7 lg:py-2 3xl:px-8 3xl:py-3 ${
                    submitDisabled ? 'bg-gray-400/80' : 'bg-[#4285F4]/80 hover:bg-[#4285F4]'
                  }`}
                >
                  <p className="font-medium text-white">Save</p>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setName('');
                    setPhoneNumber('');
                    setSpecialization('');
                    setDob(0);
                    setScheduleStartTime('09:00:00');
                    setScheduleEndTime('18:00:00');
                    setWorkDays([]);
                    setScheduleWorkDescription('');
                  }}
                  className="flex items-center rounded-lg px-6 py-1 text-[#DB4437] transition-all duration-200 hover:bg-[#DB4437] hover:text-white focus:outline-none lg:px-7 lg:py-2 3xl:px-8 3xl:py-3"
                >
                  <p className="font-medium">Cancel</p>
                </button>
              </div>
            </form>
          </div>
        </div>
      </Wrapper>
    </Page>
  );
};

export default DoctorCreate;
