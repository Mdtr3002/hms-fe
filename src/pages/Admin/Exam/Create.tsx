import React, { useEffect, useRef, useState } from 'react';
import { FilePond } from 'react-filepond';
// eslint-disable-next-line import/order
import { Link } from 'react-router-dom';
import './index.css';
import { toast } from 'react-toastify';

import { Icon, Select } from '../../../components';
import { Option } from '../../../components/Select';
import { Page, Wrapper } from '../../../layout';
import ExamArchiveService from '../../../service/examArchive.service';
import SubjectService from '../../../service/subject.service';
import { EXAM_TYPE_OPTIONS, SEMESTER_OPTIONS } from '../../../types/examArchive';

const ExamCreate = () => {
  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [type, setType] = useState('');
  const [semester, setSemester] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);

  const [subjectOptions, setSubjectOptions] = useState<Option[]>([]);

  const fileUploaderRef = useRef<FilePond>(null);
  const submitDisabled =
    name === '' ||
    subject === '' ||
    type === '' ||
    semester === '' ||
    uploadedFiles.length === 0 ||
    loading;

  useEffect(() => {
    SubjectService.getAll({}, true)
      .then((res) => {
        const { result: allSubjects } = res.data.payload;
        setSubjectOptions(
          allSubjects.map((sub) => {
            return {
              value: sub._id,
              label: sub.name,
            };
          })
        );
      })
      .catch((err) => {
        console.error(err);
      });
  }, []);

  const createExamArchive = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    setLoading(true);
    const formData = new FormData();
    formData.append('name', name);
    formData.append('', uploadedFiles[0]);
    formData.append('subject', subject);
    formData.append('type', type);
    formData.append('semester', semester);
    ExamArchiveService.create(formData)
      .then((_) => {
        toast.success('Tạo đề thi thành công');
        setName('');
        setSubject('');
        setType('');
        setSemester('');
        setDescription('');
        setUploadedFiles([]);
        fileUploaderRef.current?.removeFiles();
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
            Tạo đề thi
          </p>
        </div>
        <div className='w-full p-4'>
          <Link className='mb-2 flex items-center hover:underline md:hidden' to='/admin'>
            <Icon.Chevron className='h-5 -rotate-90 fill-black' />
            <p className='text-sm text-[#5B5B5B]'>Quay lại</p>
          </Link>
          <div
            className='h-full w-full rounded-lg bg-white px-8 py-2
            lg:px-10 lg:py-4 3xl:px-12 3xl:py-6'
          >
            <form className='flex flex-col gap-y-6'>
              <div className='flex w-full flex-col items-start justify-center'>
                <label className='mb-2 w-full' htmlFor='exam-name'>
                  <p className='w-full text-sm font-semibold lg:text-base 3xl:text-xl'>
                    Tên đề thi
                  </p>
                </label>
                <input
                  id='exam-name'
                  className='flex w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium
                  lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'
                  value={name}
                  placeholder='Nhập tên đề thi'
                  onChange={({ target }) => setName(target.value)}
                />
              </div>
              <div className='flex w-full flex-1 flex-row items-center justify-start gap-x-4'>
                <div className='flex w-full flex-1 flex-col'>
                  <p className='w-full text-sm font-semibold lg:text-base 3xl:text-xl'>Môn</p>
                  <Select
                    options={subjectOptions}
                    value={subjectOptions.find((x) => x.value === subject) ?? null}
                    onChange={(v) => {
                      if (v !== null) {
                        setSubject(v.value);
                      }
                    }}
                    placeholder='Chọn môn'
                  />
                </div>
                <div className='flex w-full flex-1 flex-col'>
                  <p className='w-full text-sm font-semibold lg:text-base 3xl:text-xl'>Kì thi</p>
                  <Select
                    options={EXAM_TYPE_OPTIONS}
                    value={EXAM_TYPE_OPTIONS.find((x) => x.value === type) ?? null}
                    onChange={(v) => {
                      if (v !== null) {
                        setType(v.value);
                      }
                    }}
                    placeholder='Chọn kì thi'
                  />
                </div>
                <div className='flex w-full flex-1 flex-col'>
                  <p className='w-full text-sm font-semibold lg:text-base 3xl:text-xl'>Học kì</p>
                  <Select
                    options={SEMESTER_OPTIONS}
                    value={SEMESTER_OPTIONS.find((x) => x.value === semester) ?? null}
                    onChange={(v) => {
                      if (v !== null) {
                        setSemester(v.value);
                      }
                    }}
                    placeholder='Chọn học kì'
                  />
                </div>
              </div>
              <div className='flex w-full flex-col items-start justify-center'>
                <label className='mb-2 w-full' htmlFor='exam-description'>
                  <p className='w-full text-sm font-semibold lg:text-base 3xl:text-xl'>Chú thích</p>
                </label>
                <textarea
                  id='exam-description'
                  className='flex w-full rounded-lg border border-[#CCC] p-1 text-xs
                  font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base '
                  value={description}
                  placeholder='Nhập chú thích đề thi'
                  rows={5}
                  onChange={({ target }) => {
                    setDescription(target.value);
                  }}
                />
              </div>

              <div className='flex w-full flex-col'>
                <p className='mb-2 w-full text-sm font-semibold lg:text-base 3xl:text-xl'>
                  Đăng tải đề thi
                </p>
                <FilePond
                  ref={fileUploaderRef}
                  onupdatefiles={(files) => {
                    setUploadedFiles(files[0] ? [files[0].file as File] : []);
                  }}
                  allowMultiple={false}
                  labelIdle='Kéo & Thả hoặc <span class="filepond--label-action">Chọn đề thi</span>'
                />
              </div>

              <div className='flex w-full flex-row items-center justify-center gap-x-4'>
                <button
                  type='submit'
                  disabled={submitDisabled}
                  onClick={createExamArchive}
                  className={`flex items-center rounded-lg px-6 py-1
                  transition-all duration-200 lg:px-7 lg:py-2 3xl:px-8 3xl:py-3 ${
                    submitDisabled ? 'bg-gray-400/80' : 'bg-[#4285F4]/80 hover:bg-[#4285F4]'
                  }`}
                >
                  <p className='font-medium text-white'>Lưu</p>
                </button>
                <button
                  type='button'
                  className='flex items-center rounded-lg px-6 py-1 text-[#DB4437]
                  transition-all duration-200 hover:bg-[#DB4437] hover:text-white
                  focus:outline-none lg:px-7 lg:py-2 3xl:px-8 3xl:py-3'
                  onClick={() => {
                    setName('');
                    setSubject('');
                    setType('');
                    setSemester('');
                    setDescription('');
                    setUploadedFiles([]);
                    fileUploaderRef.current?.removeFiles();
                  }}
                >
                  <p className='font-medium text-inherit'>Huỷ</p>
                </button>
              </div>
            </form>
          </div>
        </div>
      </Wrapper>
    </Page>
  );
};

export default ExamCreate;
