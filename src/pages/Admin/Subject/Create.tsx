import React, { ChangeEvent, useState } from 'react';
import { toast } from 'react-toastify';

import { Page, Wrapper } from '../../../layout';
import SubjectService from '../../../service/subject.service';

const CreateSubjectPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const createDisabled = name.trim().length === 0 || loading;

  const onInputName = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const onInputDescription = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  const onCreateSubject = (_event: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    SubjectService.create(name, description)
      .then((_res) => {
        toast.success('Tạo môn học thành công');
        setName('');
        setDescription('');
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Page>
      <Wrapper className='flex flex-1 flex-col'>
        <div className='w-full bg-[#4285F4]/90 py-4'>
          <p className='text-center text-sm font-bold text-white md:text-2xl 3xl:text-4xl'>
            Tạo môn mới
          </p>
        </div>
        <div className='w-full p-4'>
          <div className='h-full w-full rounded-lg bg-white p-4 lg:p-6 3xl:p-8'>
            <main className='flex flex-col gap-y-4'>
              {/**
               * Name field
               */}
              <div className='flex flex-col gap-y-1'>
                <label className='flex flex-[2.5] text-base lg:text-lg 3xl:text-xl' htmlFor='name'>
                  Tên
                </label>
                <input
                  id='name'
                  className='flex w-full flex-1 rounded-lg border border-[#D9D9D9] p-1 text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'
                  value={name}
                  onChange={onInputName}
                />
              </div>
              {/**
               * Description field
               */}
              <div className='flex flex-col gap-y-1'>
                <label
                  className='flex flex-[2.5] text-base lg:text-lg 3xl:text-xl'
                  htmlFor='description'
                >
                  Chú thích
                </label>
                <textarea
                  id='description'
                  rows={10}
                  className='flex w-full flex-1 rounded-lg border border-[#D9D9D9] p-1 text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'
                  value={description}
                  onChange={onInputDescription}
                />
              </div>
              {/**
               * Create button
               */}
              <div className='my-5 flex flex-row-reverse gap-x-8'>
                <button
                  className={`flex items-center rounded-lg transition-all duration-200 ${
                    createDisabled ? 'bg-gray-400/80' : 'bg-[#4285F4]/80 hover:bg-[#4285F4]'
                  } px-6 py-1 lg:px-7 lg:py-2 3xl:px-8 3xl:py-3`}
                  onClick={onCreateSubject}
                  disabled={createDisabled}
                >
                  <p className='text-white'>Tạo</p>
                </button>
              </div>
            </main>
          </div>
        </div>
      </Wrapper>
    </Page>
  );
};

export default CreateSubjectPage;
