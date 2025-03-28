import { ViewUpdate } from '@codemirror/view';
import _ from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import {
  Icon,
  Markdown,
  QuestionCard,
  Select,
  MarkdownEditor,
  ExpressionEditor,
} from '../../../components';
import { Option } from '../../../components/Select';
import { useDebounce } from '../../../hooks';
import { Page, Wrapper } from '../../../layout';
import './index.css';
import ChapterService from '../../../service/chapter.service';
import QuestionService from '../../../service/question.service';
import SubjectService from '../../../service/subject.service';
import { ConcreteQuestion, Question, QuestionType, SessionStatus } from '../../../types';
import { MULTIPLE_CHOICE_LABELS } from '../../../utils/helper';

const EditQuestionPage = () => {
  const navigate = useNavigate();
  const params = useParams();
  const id = params?.questionId ?? '';
  const [question, setQuestion] = useState<Question>();
  const [chapterOptions, setChapterOptions] = useState<Option[]>([]);
  const [subjectOptions, setSubjectOptions] = useState<Option[]>([]);

  const [name, setName] = useState('');
  const [subject, setSubject] = useState('');
  const [chapter, setChapter] = useState('');
  const [description, setDescription] = useState('');
  const [code, setCode] = useState('');
  const [options, setOptions] = useState<string[]>([]);
  const [answerKey, setAnswerKey] = useState(0);
  const [shuffleOptions, setShuffleOptions] = useState(false);
  const [explanation, setExplanation] = useState('');

  const [loading, setLoading] = useState(false);
  const [canSave, setCanSave] = useState(false);
  const [preview, setPreview] = useState<ConcreteQuestion | null>(null);

  const fetchData = useCallback(() => {
    setLoading(true);
    QuestionService.getById(id, true)
      .then((res) => {
        setQuestion(res.data.payload);
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  const handleOnSave = useDebounce(() => {
    setLoading(true);
    const data = {
      name,
      chapter,
      subject,
      description,
      code,
      options,
      answerKeys: [answerKey],
      shuffleOptions,
      explanation,
    };
    QuestionService.edit(id, data, true)
      .then(() => {
        toast.success('Chỉnh sửa thành công');
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.response.data.message);
      })
      .finally(() => fetchData());
  });

  const handleOnSetSave = useDebounce(() => {
    if (question) {
      const data1 = {
        name,
        chapter,
        subject,
        description,
        code,
        options,
        answerKeys: [answerKey],
        shuffleOptions,
        explanation,
      };
      const data2 = {
        name: question.name,
        chapter: question?.chapter?._id ?? '',
        subject: question?.subject?._id ?? '',
        description: question.description,
        code: question.code,
        options: question?.options?.map((option) => option.description) ?? [],
        answerKeys: question.answerKeys,
        shuffleOptions: question.shuffleOptions,
        explanation: question.explanation,
      };
      setCanSave(!_.isEqual(data1, data2) && chapter !== '');
    }
  });

  const previewQuestion = () => {
    QuestionService.preview({
      code,
      type: QuestionType.MULTIPLE_CHOICE_SINGLE_ANSWER,
      description,

      options: options,
      answerKeys: [answerKey],
      shuffleOptions,
      explanation,
    })
      .then((res) => {
        const questionPreview = res.data.payload;
        questionPreview.isCorrect = true;
        setPreview(questionPreview);
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.response.data.message);
      });
  };

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    if (question) {
      setName(question.name);
      setSubject(question.subject._id);
      setChapter(question.chapter._id);
      setDescription(question.description ?? '');
      setCode(question.code ?? '');
      setOptions(question?.options?.map((option) => option.description) ?? []);
      setAnswerKey(question?.answerKeys?.[0] ?? 0);
      setShuffleOptions(question?.shuffleOptions ?? false);
      setExplanation(question.explanation);
    }
  }, [question]);

  useEffect(() => {
    if (subject === '') {
      setChapterOptions([]);
      setChapter('');
      return;
    }
    ChapterService.getAll({ subject: subject })
      .then((res) => {
        const { result: chapters } = res.data.payload;
        const listOption = chapters.map((chap) => ({
          value: chap._id,
          label: chap.name,
        }));
        setChapterOptions(listOption);
        if (listOption.length === 0 || !listOption.find((option) => option.value === chapter)) {
          setChapter('');
        }
      })
      .catch((err) => {
        toast.error(err.response.data.message);
      });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subject]);

  useEffect(() => {
    SubjectService.getAll({})
      .then((res) => {
        const { result: allSubjects } = res.data.payload;
        const formattedData = allSubjects.map((sub) => {
          return {
            value: sub._id,
            label: sub.name,
          };
        });
        setSubjectOptions(formattedData);
      })
      .catch((err) => {
        console.error(err);
        toast.error(err.response.data.message);
      });
  }, []);

  useEffect(() => {
    handleOnSetSave();
  }, [
    name,
    subject,
    chapter,
    description,
    code,
    options,
    shuffleOptions,
    explanation,
    handleOnSetSave,
    question,
  ]);

  const onInputDescription = useCallback((value: string, _viewUpdate: ViewUpdate) => {
    setDescription(value);
  }, []);

  const onInputCode = useCallback((value: string, _viewUpdate: ViewUpdate) => {
    setCode(value);
  }, []);

  const onInputExplanation = useCallback((value: string, _viewUpdate: ViewUpdate) => {
    setExplanation(value);
  }, []);

  return (
    <Page>
      <Wrapper className='flex flex-1 flex-col'>
        <div className='w-full bg-[#4285F4]/90 py-4'>
          <p className='text-center text-sm font-bold text-white md:text-2xl 3xl:text-4xl'>
            Chỉnh sửa câu hỏi
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
          <div className='w-full rounded-lg bg-white p-4 pb-8 lg:p-6 3xl:p-8'>
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
                <p className='flex flex-[2.5] text-base lg:text-lg 3xl:text-xl'>ID câu hỏi: {id}</p>
                <div className='flex flex-col gap-y-1'>
                  <label
                    className='flex flex-[2.5] text-base lg:text-lg 3xl:text-xl'
                    htmlFor='question_name'
                  >
                    Dạng câu hỏi
                  </label>
                  <input
                    id='question_name'
                    className='flex w-full flex-1 rounded-lg border border-[#D9D9D9] p-1 text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'
                    value={name}
                    placeholder={'Nhập tên câu hỏi'}
                    onChange={({ target }) => setName(target.value)}
                  />
                </div>
                <div className='flex flex-row gap-x-8'>
                  <div className='flex w-full flex-col gap-y-1'>
                    <p className='flex flex-[2.5] text-base lg:text-lg 3xl:text-xl'>Môn</p>
                    <Select
                      options={subjectOptions}
                      placeholder='Chọn môn'
                      value={subjectOptions.find((x) => x.value === subject) ?? null}
                      onChange={(v) => {
                        if (v !== null) {
                          setSubject(v?.value);
                        }
                      }}
                    />
                  </div>
                  <div className='flex w-full flex-col'>
                    <p className='flex flex-[2.5] text-base lg:text-lg 3xl:text-xl'>Chương</p>
                    <Select
                      options={chapterOptions}
                      placeholder='Chọn chương'
                      value={chapterOptions.find((x) => x.value === chapter) ?? null}
                      onChange={(v) => {
                        if (v !== null) {
                          setChapter(v.value);
                        }
                      }}
                    />
                  </div>
                </div>
                <div className='mt-4 flex flex-row justify-between gap-x-8'>
                  <div className='flex flex-row-reverse gap-x-2 md:gap-x-4 2xl:gap-x-6'>
                    <button
                      className={`items-center rounded-lg px-6 py-1 transition-all duration-200 lg:px-7 lg:py-2 3xl:px-8 3xl:py-3 ${
                        preview ? 'bg-[#4285F4]' : 'bg-[#4285F4]/40 hover:bg-[#4285F4]/80'
                      }`}
                      onClick={previewQuestion}
                    >
                      <p className='text-white'>Xem trước</p>
                    </button>
                    <button
                      className={`items-center rounded-lg px-6 py-1 transition-all duration-200 lg:px-7 lg:py-2 3xl:px-8 3xl:py-3 ${
                        !preview ? 'bg-[#4285F4]' : 'bg-[#4285F4]/40 hover:bg-[#4285F4]/80'
                      }`}
                      onClick={() => setPreview(null)}
                      disabled={preview === null}
                    >
                      <p className='text-white'>Soạn câu hỏi</p>
                    </button>
                  </div>
                  <button
                    className={`items-center rounded-lg px-6 py-1
                      transition-all duration-200 lg:px-7 lg:py-2 3xl:px-8 3xl:py-3 ${
                        canSave ? 'bg-[#4285F4]/80 hover:bg-[#4285F4]' : 'bg-gray-400/80'
                      }`}
                    disabled={!canSave}
                    onClick={() => handleOnSave()}
                  >
                    <p className='text-white'>Lưu thay đổi</p>
                  </button>
                </div>

                {preview === null ? (
                  <>
                    <div className='flex flex-col gap-y-1'>
                      <label
                        className='flex flex-[2.5] text-base lg:text-lg 3xl:text-xl'
                        htmlFor='description'
                      >
                        Đề
                      </label>
                      <MarkdownEditor
                        id='description'
                        className='flex w-full flex-1 text-xs font-medium lg:text-sm 3xl:text-base'
                        value={description}
                        placeholder='Nhập đề câu hỏi'
                        onChange={onInputDescription}
                      />
                    </div>
                    <div className='flex flex-col gap-y-1'>
                      <div className='flex flex-row items-center gap-x-4'>
                        <label className='flex text-base lg:text-lg 3xl:text-xl' htmlFor='code'>
                          Biểu thức
                        </label>
                        <a
                          href='https://link.gdsc.app/CTCTQuestionWritingGuide'
                          target='_blank'
                          rel='noreferrer'
                        >
                          <Icon.Help
                            fill='#666666'
                            className='h-4 w-4 lg:h-5 lg:w-5 3xl:h-6 3xl:w-6'
                          />
                        </a>
                      </div>
                      <ExpressionEditor
                        id='code'
                        className='flex w-full flex-1 text-xs font-medium lg:text-sm 3xl:text-base'
                        value={code}
                        placeholder='Nhập biểu thức'
                        onChange={onInputCode}
                      />
                    </div>
                    <div className='flex flex-col gap-y-8'>
                      <div className='flex flex-row items-center gap-x-8'>
                        <p className='flex text-base lg:text-lg 3xl:text-xl'>Lựa chọn</p>
                        <button
                          className='h-9 w-36 rounded-lg bg-[#4285F4] px-4'
                          onClick={() => {
                            setOptions([...options, '']);
                          }}
                        >
                          <p className='text-white'>Thêm lựa chọn</p>
                        </button>
                      </div>
                      <div className='flex flex-col gap-y-4'>
                        {options.map((option, index) => {
                          return (
                            <div key={index} className='flex flex-row items-center gap-x-8'>
                              <label className='align-middle' htmlFor={`option_${index}`}>
                                {index + 1}
                              </label>
                              <input
                                id={`option_${index}`}
                                className='flex flex-1 rounded-lg border border-[#D9D9D9] p-1 font-mono text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'
                                value={option}
                                onChange={({ target }) => {
                                  const newOptions = JSON.parse(
                                    JSON.stringify(options)
                                  ) as string[];
                                  newOptions[index] = target.value;
                                  setOptions(newOptions);
                                }}
                              />
                              {options.length > 1 && (
                                <button
                                  className='flex items-center justify-center rounded-full bg-[#DB4437]/90 p-2 hover:bg-[#DB4437]'
                                  onClick={() => {
                                    const newOptions = JSON.parse(
                                      JSON.stringify(options)
                                    ) as string[];
                                    newOptions.splice(index, 1);
                                    setOptions(newOptions);
                                    setAnswerKey(Math.min(answerKey, newOptions.length));
                                  }}
                                >
                                  <Icon.Delete
                                    fill='white'
                                    className='h-4 w-4 lg:h-5 lg:w-5 3xl:h-6 3xl:w-6'
                                  />
                                </button>
                              )}
                            </div>
                          );
                        })}
                      </div>
                      <div className='flex w-full flex-row flex-wrap items-center gap-x-8 gap-y-4'>
                        <div className='flex w-full min-w-[200px] flex-1 flex-row items-center gap-x-4'>
                          <p className='flex text-base lg:text-lg 3xl:text-xl'>Đáp án đúng:</p>
                          <Select
                            options={options.map((option, index) => ({
                              value: index.toString(),
                              label: (index + 1).toString(),
                            }))}
                            value={{
                              value: answerKey.toString(),
                              label: (answerKey + 1).toString(),
                            }}
                            onChange={(v) => {
                              if (v !== null) {
                                setAnswerKey(JSON.parse(v.value));
                              }
                            }}
                          />
                        </div>
                        <div className='flex w-full flex-[5] flex-row items-center gap-x-4'>
                          <p className='flex text-base lg:text-lg 3xl:text-xl'>
                            Xáo trộn lựa chọn:
                          </p>
                          <input
                            type='checkbox'
                            className='allow-checked h-8 w-8'
                            checked={shuffleOptions}
                            onChange={() => setShuffleOptions(!shuffleOptions)}
                          />
                        </div>
                      </div>
                    </div>
                    <div className='flex flex-col gap-y-1'>
                      <label
                        className='flex flex-[2.5] text-base lg:text-lg 3xl:text-xl'
                        htmlFor='explanation'
                      >
                        Giải thích
                      </label>
                      <MarkdownEditor
                        id='explaination'
                        className='flex w-full flex-1 text-xs font-medium lg:text-sm 3xl:text-base'
                        value={explanation}
                        placeholder='Nhập giải thích'
                        onChange={onInputExplanation}
                      />
                    </div>
                  </>
                ) : (
                  <div className='flex flex-col gap-y-1'>
                    <p className='flex flex-[2.5] text-base lg:text-lg 3xl:text-xl'>
                      Xem trước câu hỏi
                    </p>
                    <QuestionCard
                      question={preview}
                      status={SessionStatus.ENDED}
                      questionNumber={1}
                      showInfo={false}
                    />
                    <div className='flex h-full w-full flex-row gap-x-4'>
                      <div className='flex h-full w-full flex-1 flex-col rounded-lg border border-[#49CCCF] bg-white p-4'>
                        <h3 className='mb-2 text-xl font-semibold'>Đáp án</h3>
                        <div className='flex flex-col items-start justify-center gap-y-1'>
                          <div className='flex flex-row items-center gap-x-2'>
                            <Icon.Answer className='h-5 w-auto' fill='#49BBBD' />
                            <p className='text-base font-semibold text-[#666]'>
                              Đáp án đúng:{' '}
                              {MULTIPLE_CHOICE_LABELS.at(
                                preview.options?.findIndex(
                                  (option) => option.key === (preview.answerKeys?.at(0) ?? 0)
                                ) || 0
                              )}
                            </p>
                          </div>
                        </div>
                        <span className='my-4 border-t border-[#666]' />
                        <h3 className='mb-2 text-xl font-semibold'>Giải thích</h3>
                        <Markdown>{preview.explanation}</Markdown>
                      </div>
                    </div>
                  </div>
                )}
              </main>
            )}
          </div>
        </div>
      </Wrapper>
    </Page>
  );
};

export default EditQuestionPage;
