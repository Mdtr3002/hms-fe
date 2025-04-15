import React, { useState, useEffect, useRef } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { ReactComponent as NoData } from '../../../assets/svgs/NoData.svg';
import { Icon } from '../../../components';
import { Page, Wrapper } from '../../../layout';
import { Nurse } from '../../../types/nurse';
import { NurseService } from '../../../service/staff.service';

function transformSchedule(rawSchedule: any): any {
  return {
    _id: rawSchedule?._id || "",
    workingTime: {
      startTime: rawSchedule.scheduleStartTime,
      endTime: rawSchedule.scheduleEndTime,
    },
    workDay: rawSchedule.workDays,
    workDescription: rawSchedule.scheduleWorkDescription,
  };
}

function transformNurse(raw: any): Nurse {
  return {
    _id: raw._id,
    name: raw.name,
    phoneNum: raw.phoneNumber,
    specialization: raw.specialization,
    dob: typeof raw.dob === "number" ? new Date(raw.dob).toISOString() : raw.dob,
    schedule: transformSchedule(raw.schedule),
    lastUpdatedAt: raw.lastUpdatedAt,
  };
}

const NurseView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [nurseData, setNurseData] = useState<Nurse | null>(null);

  useEffect(() => {
    setLoading(true);
    NurseService.getById(id ?? '', true)
      .then((response) => {
        const raw = response.data.payload;
        const transformedNurse = transformNurse(raw);
        setNurseData(transformedNurse);
      })
      .catch((error) => {
        console.error('Failed to fetch nurse details:', error);
        toast.error(
          error.response?.data?.message || 'Failed to fetch nurse details'
        );
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  if (!nurseData && !loading) {
    return (
      <Page>
        <Wrapper className="flex flex-1 flex-col">
          <div className="w-full bg-[#4285F4]/90 py-4">
            <p className="text-center text-sm font-bold text-white md:text-2xl 3xl:text-4xl">
              Nurse Information Not Found
            </p>
          </div>
        </Wrapper>
      </Page>
    );
  }

  return (
    <Page>
      <Wrapper className="flex flex-1 flex-col">
        {/* Header Section */}
        <div className="w-full bg-[#4285F4]/90 py-4">
          <p className="text-center text-sm font-bold text-white md:text-2xl 3xl:text-4xl">
            View Nurse's Information
          </p>
        </div>
        <div className="w-full p-4">
          {/* Back Link */}
          <Link className="mb-2 flex items-center hover:underline" to="/nurse/manage">
            <Icon.Chevron className="h-5 -rotate-90 fill-black" />
            <p className="text-sm text-[#5B5B5B]">Back</p>
          </Link>
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
          ) : nurseData ? (
            <div className="h-full w-full rounded-lg bg-white px-8 py-2 lg:px-10 lg:py-4 3xl:px-12 3xl:py-8">
              <main className="flex flex-col gap-y-4">
                {/* Nurse's Basic Information */}
                <p className="flex text-base lg:text-lg 3xl:text-xl">
                  Nurse's ID: {nurseData._id}
                </p>
                <div className="flex flex-col gap-y-1">
                  <label
                    className="text-base lg:text-lg 3xl:text-xl"
                    htmlFor="nurse-name"
                  >
                    Name
                  </label>
                  <input
                    id="nurse-name"
                    value={nurseData.name}
                    className="w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base"
                    disabled
                  />
                </div>
                <div className="flex flex-col gap-y-1">
                  <label
                    className="text-base lg:text-lg 3xl:text-xl"
                    htmlFor="nurse-phone"
                  >
                    Phone Number
                  </label>
                  <input
                    id="nurse-phone"
                    value={nurseData.phoneNum}
                    className="w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base"
                    disabled
                  />
                </div>
                <div className="flex flex-col gap-y-1">
                  <label
                    className="text-base lg:text-lg 3xl:text-xl"
                    htmlFor="nurse-specialization"
                  >
                    Specialization
                  </label>
                  <input
                    id="nurse-specialization"
                    value={nurseData.specialization}
                    className="w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base"
                    disabled
                  />
                </div>
                <div className="flex flex-col gap-y-1">
                  <label className="text-base lg:text-lg 3xl:text-xl" htmlFor="nurse-dob">
                    Date of Birth
                  </label>
                  <input
                    id="nurse-dob"
                    value={new Date(nurseData.dob).toLocaleDateString()}
                    className="w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base"
                    disabled
                  />
                </div>

                {/* Nurse's Schedule Section */}
                <div className="mt-4">
                  <p className="mb-2 text-lg font-semibold">Schedule</p>
                  <div className="flex flex-col gap-y-2">
                    <div className="flex flex-col gap-y-1">
                      <label
                        className="text-base lg:text-lg 3xl:text-xl"
                        htmlFor="nurse-working-time"
                      >
                        Working Time
                      </label>
                      <input
                        id="nurse-working-time"
                        value={`${nurseData.schedule?.workingTime?.startTime ?? '-'} - ${nurseData.schedule?.workingTime?.endTime ?? '-'}`}
                        className="w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base"
                        disabled
                      />
                    </div>
                    <div className="flex flex-col gap-y-1">
                      <label
                        className="text-base lg:text-lg 3xl:text-xl"
                        htmlFor="nurse-work-days"
                      >
                        Work Days
                      </label>
                      <input
                        id="nurse-work-days"
                        value={nurseData.schedule?.workDay?.join(', ') ?? '-'}
                        className="w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base"
                        disabled
                      />
                    </div>
                    <div className="flex flex-col gap-y-1">
                      <label
                        className="text-base lg:text-lg 3xl:text-xl"
                        htmlFor="nurse-work-description"
                      >
                        Work Description
                      </label>
                      <div
                        id="nurse-work-description"
                        className="w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base"
                      >
                        {nurseData.schedule?.workDescription ?? '-'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Edit Button */}
                <div className="my-4 flex w-full justify-end">
                  <button
                    type="button"
                    onClick={() => navigate(`/nurse/edit/${nurseData._id}`)}
                    className="w-fit cursor-pointer rounded-lg bg-[#4285F4]/80 px-1 transition-all duration-200 hover:bg-[#4285F4] lg:px-3 3xl:px-5"
                  >
                    <p className="p-1 text-xs font-medium text-white lg:p-2 lg:text-sm 3xl:p-3 3xl:text-base">
                      Edit
                    </p>
                  </button>
                </div>
              </main>
            </div>
          ) : null}
        </div>
      </Wrapper>
    </Page>
  );
};

export default NurseView;
