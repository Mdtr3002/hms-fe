import { useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { ReactComponent as NoData } from '../../../assets/svgs/NoData.svg';
import { Icon } from '../../../components';
import { Page, Wrapper } from '../../../layout';
import { Doctor } from '../../../types/doctor';
import { Appointment } from '../../../types/appointment';

const DoctorView = () => {
  const params = useParams();
  const id = params?.id ?? '';
  const navigate = useNavigate();
  const tableRef = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState(false);

  const [doctor, setDoctor] = useState<Doctor>({
    _id: 'doc1',
    name: 'Dr. John Doe',
    phoneNum: '987654321',
    specialization: 'Cardiology',
    dob: '2025-01-01T00:00:00.000Z',
    schedule: {
      _id: 'sched1',
      workingTime: { startTime: '08:00', endTime: '17:00' },
      workDay: ['Monday', 'Wednesday', 'Friday'],
      workDescription: 'Available for consultations and follow-ups.',
    },
    lastUpdatedAt: '2025-03-31T00:00:00.000Z',
  });

  const [appointments, setAppointments] = useState<Appointment[]>([
    {
      id: 'a1',
      patientName: 'Alice Smith',
      date: new Date('2025-04-10T10:00:00'),
      reason: 'Consultation',
      status: 'pending',
    },
    {
      id: 'a2',
      patientName: 'Bob Johnson',
      date: new Date('2025-04-11T11:30:00'),
      reason: 'Follow-up',
      status: 'scheduled',
    },
    {
      id: 'a3',
      patientName: 'Carol White',
      date: new Date('2025-04-12T09:00:00'),
      reason: 'General Check-up',
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

  return (
    <Page>
      <Wrapper className="flex flex-1 flex-col">
        {/* Header Section */}
        <div className="w-full bg-[#4285F4]/90 py-4">
          <p className="text-center text-sm font-bold text-white md:text-2xl 3xl:text-4xl">
            View Doctor&apos;s Information
          </p>
        </div>
        <div className="w-full p-4">
          {/* Back Link */}
          <Link className="mb-2 flex items-center hover:underline" to="/doctor/manage">
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
          ) : (
            <div className="h-full w-full rounded-lg bg-white px-8 py-2 lg:px-10 lg:py-4 3xl:px-12 3xl:py-8">
              <main className="flex flex-col gap-y-4">
                {/* Doctor's Basic Information */}
                <p className="flex text-base lg:text-lg 3xl:text-xl">
                  Doctor&apos;s ID: {id}
                </p>
                <div className="flex flex-col gap-y-1">
                  <label className="text-base lg:text-lg 3xl:text-xl" htmlFor="doctor-name">
                    Name
                  </label>
                  <input
                    id="doctor-name"
                    value={doctor.name}
                    className="w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base"
                    disabled
                  />
                </div>
                <div className="flex flex-col gap-y-1">
                  <label className="text-base lg:text-lg 3xl:text-xl" htmlFor="doctor-phone">
                    Phone Number
                  </label>
                  <input
                    id="doctor-phone"
                    value={doctor.phoneNum}
                    className="w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base"
                    disabled
                  />
                </div>
                <div className="flex flex-col gap-y-1">
                  <label className="text-base lg:text-lg 3xl:text-xl" htmlFor="doctor-specialization">
                    Specialization
                  </label>
                  <input
                    id="doctor-specialization"
                    value={doctor.specialization}
                    className="w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base"
                    disabled
                  />
                </div>
                <div className="flex flex-col gap-y-1">
                  <label className="text-base lg:text-lg 3xl:text-xl" htmlFor="doctor-dob">
                    Date of Birth
                  </label>
                  <input
                    id="doctor-dob"
                    value={new Date(doctor.dob).toLocaleDateString()}
                    className="w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base"
                    disabled
                  />
                </div>

                {/* Doctor's Schedule Section */}
                <div className="mt-4">
                  <p className="text-lg font-semibold mb-2">Schedule</p>
                  <div className="flex flex-col gap-y-2">
                    <div className="flex flex-col gap-y-1">
                      <label className="text-base lg:text-lg 3xl:text-xl" htmlFor="working-time">
                        Working Time
                      </label>
                      <input
                        id="working-time"
                        value={`${doctor.schedule.workingTime.startTime} - ${doctor.schedule.workingTime.endTime}`}
                        className="w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base"
                        disabled
                      />
                    </div>
                    <div className="flex flex-col gap-y-1">
                      <label className="text-base lg:text-lg 3xl:text-xl" htmlFor="work-days">
                        Work Days
                      </label>
                      <input
                        id="work-days"
                        value={doctor.schedule.workDay.join(', ')}
                        className="w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base"
                        disabled
                      />
                    </div>
                    <div className="flex flex-col gap-y-1">
                      <label className="text-base lg:text-lg 3xl:text-xl" htmlFor="work-description">
                        Work Description
                      </label>
                      <div
                        id="work-description"
                        className="w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base"
                      >
                        {doctor.schedule.workDescription}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Appointments Section */}
                <div className="mt-8">
                  <p className="text-lg font-semibold mb-4">Appointments</p>
                  <div className="overflow-x-auto">
                    {appointments.length === 0 ? (
                      <div className="z-10 rounded-[20px] bg-white px-4 py-3 md:p-5 xl:p-6 2xl:p-7">
                        <NoData width={200} className="mx-auto w-[200px] p-7 xl:w-[300px]" />
                        <p className="w-full text-center">No appointments found</p>
                      </div>
                    ) : (
                      <table ref={tableRef} className="min-w-full table-auto border-collapse">
                        <thead>
                          <tr className="bg-gray-200">
                            <th className="px-4 py-2 text-left">Patient Name</th>
                            <th className="px-4 py-2 text-left">Date</th>
                            <th className="px-4 py-2 text-left">Reason</th>
                            <th className="px-4 py-2 text-left">Status</th>
                            <th className="px-4 py-2 text-left">Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {appointments.map((appointment) => (
                            <tr key={appointment.id} className="border-b">
                              <td className="px-4 py-2">{appointment.patientName}</td>
                              <td className="px-4 py-2">{appointment.date.toLocaleString()}</td>
                              <td className="px-4 py-2">{appointment.reason}</td>
                              <td className="px-4 py-2 capitalize">{appointment.status}</td>
                              <td className="px-4 py-2">
                                {appointment.status === 'pending' ? (
                                  <div className="flex gap-2">
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleAppointmentAction(appointment.id, 'accept')
                                      }
                                      className="bg-green-500 hover:bg-green-600 text-white px-2 py-1 text-xs rounded"
                                    >
                                      Accept
                                    </button>
                                    <button
                                      type="button"
                                      onClick={() =>
                                        handleAppointmentAction(appointment.id, 'deny')
                                      }
                                      className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 text-xs rounded"
                                    >
                                      Deny
                                    </button>
                                  </div>
                                ) : (
                                  <span className="text-sm">—</span>
                                )}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    )}
                  </div>
                </div>

                {/* Edit Button */}
                <div className="my-4 flex w-full justify-end">
                  <button
                    type="button"
                    onClick={() => navigate(`/doctor/edit/${id}`)}
                    className="w-fit cursor-pointer rounded-lg bg-[#4285F4]/80 px-1 transition-all duration-200 hover:bg-[#4285F4] lg:px-3 3xl:px-5"
                  >
                    <p className="p-1 text-xs font-medium text-white lg:p-2 lg:text-sm 3xl:p-3 3xl:text-base">
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

export default DoctorView;
