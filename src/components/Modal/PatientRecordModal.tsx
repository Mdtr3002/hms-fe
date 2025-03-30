import { Dialog, Transition } from '@headlessui/react';
import { useQueryClient } from '@tanstack/react-query';
import { Fragment, FC, SetStateAction, Dispatch, useState, FormEvent, useEffect } from 'react';

import { Icon } from '..';
import { MedicalRecord } from '../../types/patient';

const PatientRecordModal: FC<{
  isOpen: boolean;
  isEditing: boolean;
  medicalRecord?: MedicalRecord;
  setIsOpen: (value: boolean) => void;
  handleOpen: Dispatch<SetStateAction<boolean>>;
}> = ({ isOpen, isEditing, handleOpen, setIsOpen, medicalRecord }) => {
  const [record, setRecord] = useState<Omit<MedicalRecord, '_id'>>({
    date: 0,
    followUpDate: 0,
    treatment: '',
    notes: '',
  });
  const queryClient = useQueryClient();

  // const registerBookfair = useMutation({
  //   mutationFn: BookFairService.registerBookfair,
  //   onSuccess: () => {
  //     toast.success('Đăng ký thành công');
  //     closeModal();
  //     queryClient.invalidateQueries({ queryKey: ['get-bookfair-registration-info'] });
  //   },
  //   onError: (error) => {
  //     if (error instanceof AxiosError && error.response?.data.message) {
  //       if (typeof error.response.data.message === 'string') {
  //         return toast.error(error.response.data.message);
  //       } else {
  //         return toast.error('Thông tin không hợp lệ hoặc đã tồn tại. Vui lòng kiểm tra lại');
  //       }
  //     }
  //     toast.error('Đã có lỗi xảy ra. Vui lòng thử lại');
  //   },
  // });

  const onAccept = (e: FormEvent) => {
    e.preventDefault();
    // registerBookfair.mutate(studentInfo);
  };

  function closeModal() {
    setIsOpen(false);
    handleOpen(false);
    setRecord({
      date: 0,
      followUpDate: 0,
      treatment: '',
      notes: '',
    });
  }

  const disabled =
    // registerBookfair.isLoading ||
    !record.treatment || !record.date || !record.followUpDate;

  useEffect(() => {
    if (isEditing && medicalRecord) {
      setRecord({
        date: medicalRecord.date,
        followUpDate: medicalRecord.followUpDate,
        treatment: medicalRecord.treatment,
        notes: medicalRecord.notes ?? '',
      });
    }
  }, [isEditing, medicalRecord]);

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as='div' className='relative z-50' onClose={closeModal}>
        <Transition.Child
          as={Fragment}
          enter='ease-out duration-300'
          enterFrom='opacity-0'
          enterTo='opacity-100'
          leave='ease-in duration-200'
          leaveFrom='opacity-100'
          leaveTo='opacity-0'
        >
          <div className='fixed inset-0 bg-black bg-opacity-25' />
        </Transition.Child>

        <div className='fixed inset-0 overflow-y-auto'>
          <div className='flex min-h-full items-center justify-center p-4 text-center'>
            <Transition.Child
              as={Fragment}
              enter='ease-out duration-300'
              enterFrom='opacity-0 scale-95'
              enterTo='opacity-100 scale-100'
              leave='ease-in duration-200'
              leaveFrom='opacity-100 scale-100'
              leaveTo='opacity-0 scale-95'
            >
              <Dialog.Panel
                as='form'
                onSubmit={onAccept}
                className='relative w-full max-w-[80vw] transform rounded-lg bg-white p-6 text-left align-middle shadow-xl transition-all sm:max-w-[60vw] xl:max-w-[40vw]'
              >
                <Icon.NotebookDecor className='absolute right-3 top-3 hidden h-10 w-10 rotate-12 sm:block md:h-12 md:w-12' />
                <Dialog.Title as='h3' className='text-2xl font-semibold leading-6 text-[#4285f4]'>
                  {isEditing ? 'Edit Record' : 'Add Record'}
                </Dialog.Title>

                <div
                  className={`mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 ${
                    isEditing && 'mb-2'
                  }`}
                >
                  <div className='flex flex-col gap-y-1'>
                    <label
                      className='flex flex-[2.5] text-base lg:text-lg 3xl:text-xl'
                      htmlFor='familyAndMiddleName'
                    >
                      Treatment <span className='text-[#db4437]'>*</span>
                    </label>
                    <input
                      id='treatment'
                      required
                      className='flex w-full flex-1 rounded-lg border border-[#D9D9D9] p-2 text-xs font-medium lg:p-3 lg:text-sm 3xl:text-base'
                      value={record.treatment}
                      onChange={(e) => setRecord({ ...record, treatment: e.target.value })}
                    />
                  </div>
                  <div className='flex flex-col gap-y-1'>
                    <label
                      className='flex flex-[2.5] text-base lg:text-lg 3xl:text-xl'
                      htmlFor='name'
                    >
                      Date <span className='text-[#db4437]'>*</span>
                    </label>
                    <input
                      id='treatment-date'
                      required
                      type='date'
                      className='flex w-full flex-1 rounded-lg border border-[#D9D9D9] p-2 text-xs font-medium lg:p-3 lg:text-sm 3xl:text-base'
                      value={record.date ? new Date(record.date).toISOString().split('T')[0] : ''}
                      onChange={(e) =>
                        setRecord({ ...record, date: new Date(e.target.value).getTime() })
                      }
                    />
                  </div>
                  <div className='flex flex-col gap-y-1'>
                    <label
                      className='flex flex-[2.5] text-base lg:text-lg 3xl:text-xl'
                      htmlFor='studentId'
                    >
                      Follow-up Date <span className='text-[#db4437]'>*</span>
                    </label>
                    <input
                      id='follow-up-date'
                      required
                      type='date'
                      className='flex w-full flex-1 rounded-lg border border-[#D9D9D9] p-2 text-xs font-medium lg:p-3 lg:text-sm 3xl:text-base'
                      value={
                        record.followUpDate
                          ? new Date(record.followUpDate).toISOString().split('T')[0]
                          : ''
                      }
                      onChange={(e) =>
                        setRecord({ ...record, followUpDate: new Date(e.target.value).getTime() })
                      }
                    />
                  </div>
                  <div className='flex flex-col gap-y-1'>
                    <label
                      className='flex flex-[2.5] text-base lg:text-lg 3xl:text-xl'
                      htmlFor='email'
                    >
                      Notes
                    </label>
                    <input
                      id='notes'
                      className='flex w-full flex-1 rounded-lg border border-[#D9D9D9] p-2 text-xs font-medium lg:p-3 lg:text-sm 3xl:text-base'
                      value={record.notes}
                      onChange={(e) => setRecord({ ...record, notes: e.target.value })}
                    />
                  </div>
                </div>

                <div className='mt-8 flex w-full flex-row items-center justify-end gap-x-2 md:mt-8'>
                  <button
                    type='button'
                    className='flex w-[98px] items-center justify-center rounded-md border border-transparent bg-[#DB4437]/80 
                    py-2  hover:bg-[#DB4437] focus:outline-none disabled:bg-[#DB4437] disabled:opacity-75'
                    onClick={closeModal}
                  >
                    <p className='text-base font-semibold text-white'>Hủy bỏ</p>
                  </button>
                  <button
                    type='submit'
                    disabled={disabled}
                    className='flex w-[98px] items-center justify-center rounded-md border border-transparent bg-[#4285F4]/80 
                    py-2  hover:bg-[#4285F4] focus:outline-none disabled:bg-[#4285F4] disabled:opacity-75'
                  >
                    {/* {registerBookfair.isLoading ? (
                        <LoadingSpinner spinnerStyle='h-6 w-6 fill-white text-gray-200' />
                      ) : ( */}
                    <p className='text-base font-semibold text-white'>Xác nhận</p>
                  </button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

export default PatientRecordModal;
