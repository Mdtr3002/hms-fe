import React, { ChangeEvent, useEffect, useState } from 'react';
import { SingleValue } from 'react-select';
import { toast } from 'react-toastify';

import { Select } from '../../../components';
import { Option } from '../../../components/Select';
import { Page, Wrapper } from '../../../layout';
import ChapterService from '../../../service/chapter.service';
import SubjectService from '../../../service/subject.service';

const CreateChapterPage = () => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [subject, setSubject] = useState('');
  const [loading, setLoading] = useState(false);

  const [subjectOptions, setSubjectOptions] = useState<Option[]>([]);

  const createDisabled = name.trim().length === 0 || subject === '' || loading;

  const onInputName = (event: ChangeEvent<HTMLInputElement>) => {
    setName(event.target.value);
  };

  const onInputDescription = (event: ChangeEvent<HTMLTextAreaElement>) => {
    setDescription(event.target.value);
  };

  const createChapter = (_event: React.MouseEvent<HTMLButtonElement>) => {
    setLoading(true);
    ChapterService.create(name, subject, description)
      .then((_res) => {
        toast.success('Tạo chương mới thành công');
        setName('');
        setSubject('');
        setDescription('');
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      })
      .finally(() => setLoading(false));
  };

  const onSelectSubject = (event: SingleValue<Option>) => {
    if (event !== null) {
      setSubject(event.value);
    }
  };

  useEffect(() => {
    SubjectService.getAll({}, true)
      .then((res) => {
        const { result: allSubjects } = res.data.payload;
        setSubjectOptions(
          allSubjects.map((sub) => {
            return {
              label: sub.name,
              value: sub._id,
            };
          })
        );
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
  }, []);

  return (
    <Page>
      <Wrapper className='flex flex-1 flex-col'>
        <div className='w-full bg-[#4285F4]/90 py-4'>
          <p className='text-center text-sm font-bold text-white md:text-2xl 3xl:text-4xl'>
            Tạo chương mới
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
              <div className='flex flex-col gap-y-1'>
                <p className='flex flex-[2.5] text-base lg:text-lg 3xl:text-xl'>Tên môn</p>
                <Select
                  options={subjectOptions}
                  value={subjectOptions.find((x) => x.value === subject) ?? null}
                  onChange={onSelectSubject}
                  placeholder='Chọn môn'
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
                  disabled={createDisabled}
                  onClick={createChapter}
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

export default CreateChapterPage;
