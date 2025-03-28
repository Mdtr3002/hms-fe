import _ from 'lodash';
import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Icon } from '../../../components';
import { useDebounce } from '../../../hooks';
import { Page, Wrapper } from '../../../layout';
import SubjectService from '../../../service/subject.service';
import { Subject } from '../../../types';

const SubjectEdit = () => {
  const params = useParams();
  const id = params?.id ?? '';
  const navigate = useNavigate();
  const [subject, setSubject] = useState<Subject>();
  const [loading, setLoading] = useState(false);

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  const [canSave, setCanSave] = useState(false);

  const setSave = useDebounce(() => {
    if (subject) {
      setCanSave(name === subject.name && _.trim(description) === subject.description);
    }
  });

  useEffect(() => {
    setLoading(true);
    SubjectService.getById(id, true)
      .then((res) => setSubject(res.data.payload))
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  useEffect(() => {
    setName(subject?.name ?? '');
    setDescription(subject?.description ?? '');
  }, [subject]);

  useEffect(() => {
    setSave();
  }, [name, description, setSave]);

  const handleOnSave = () => {
    setLoading(true);
    SubjectService.edit(id, true, name, description)
      .then((res) => {
        toast.success('Chỉnh sửa thành công');
        setSubject(res.data.payload);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      })
      .finally(() => setLoading(false));
  };

  return (
    <Page>
      <Wrapper className='flex flex-1 flex-col'>
        <div className='w-full bg-[#4285F4]/90 py-4'>
          <p className='text-center text-sm font-bold text-white md:text-2xl 3xl:text-4xl'>
            Chỉnh sửa môn học
          </p>
        </div>
        <div className='w-full p-4'>
          <button
            type='button'
            onClick={() => navigate(-1)}
            className='mb-2 flex items-center hover:underline'
          >
            <Icon.Chevron className='h-5 -rotate-90 fill-black' />
            <p className='text-sm text-[#5B5B5B]'>Quay lại</p>
          </button>
          <div className='h-full w-full rounded-lg bg-white p-4 lg:p-6 3xl:p-8'>
            {loading ? (
              <>
                <p className='mb-5 w-full px-6 lg:px-8 3xl:px-10'>
                  <Skeleton width={'100%'} baseColor='#9DCCFF' height={56} />
                </p>
                <p className='w-full px-6 lg:px-8 3xl:px-10'>
                  {
                    <Skeleton
                      count={10}
                      className='my-2 box-content lg:my-4 3xl:my-6'
                      width={'100%'}
                      height={40}
                      baseColor='#9DCCFF'
                    />
                  }
                </p>
              </>
            ) : (
              <main className='flex flex-col gap-y-4'>
                <p className='flex flex-[2.5] text-base lg:text-lg 3xl:text-xl'>ID môn học: {id}</p>
                <div className='flex flex-col gap-y-1'>
                  <label
                    className='flex flex-[2.5] text-base lg:text-lg 3xl:text-xl'
                    htmlFor='name'
                  >
                    Tên
                  </label>
                  <input
                    id='name'
                    className='flex w-full flex-1 rounded-lg border border-[#D9D9D9] p-1 text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'
                    value={name}
                    onChange={({ target }) => {
                      setName(target.value);
                    }}
                  />
                </div>
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
                    placeholder='Chưa có chú thích'
                    onChange={({ target }) => {
                      setDescription(target.value);
                    }}
                  />
                </div>
                <div className='flex w-full flex-row items-center justify-center gap-x-4'>
                  <button
                    type='submit'
                    disabled={canSave}
                    onClick={(e) => {
                      e.preventDefault();
                      handleOnSave();
                    }}
                    className={`flex items-center rounded-lg px-6 py-1
                  transition-all duration-200 lg:px-7 lg:py-2 3xl:px-8 3xl:py-3 ${
                    canSave ? 'bg-gray-400/80' : 'bg-[#4285F4]/80 hover:bg-[#4285F4]'
                  }`}
                  >
                    <p className='font-medium text-white'>Lưu thay đổi</p>
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

export default SubjectEdit;
