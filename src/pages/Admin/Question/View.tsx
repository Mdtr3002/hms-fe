import React, { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';

import { Icon, Markdown, QuestionCard } from '../../../components';
import { MarkdownEditor, ExpressionEditor } from '../../../components/CodeEditor';
import { Page, Wrapper } from '../../../layout';
import './index.css';
import QuestionService from '../../../service/question.service';
import { ConcreteQuestion, Question, QuestionType, SessionStatus } from '../../../types';
import { MULTIPLE_CHOICE_LABELS } from '../../../utils/helper';

const ViewQuestionPage = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState<Question>();
  const params = useParams();
  const id = params?.questionId ?? '';
  const [loading, setLoading] = useState(false);
  const [preview, setPreview] = useState<ConcreteQuestion | null>(null);

  const previewQuestion = (_: React.MouseEvent<HTMLButtonElement>) => {
    QuestionService.preview({
      code: question?.code ?? '',
      type: QuestionType.MULTIPLE_CHOICE_SINGLE_ANSWER,
      description: question?.description ?? '',

      options: question?.options?.map((option) => option.description) ?? [],
      answerKeys: question?.answerKeys,
      shuffleOptions: question?.shuffleOptions,
      explanation: question?.explanation ?? '',
    })
      .then((res) => {
        const questionPreview = res.data.payload;
        questionPreview.isCorrect = true;
        setPreview(questionPreview);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      });
  };

  useEffect(() => {
    setLoading(true);
    QuestionService.getById(id, true)
      .then((res) => {
        setQuestion(res.data.payload);
      })
      .catch((err) => {
        console.log(err);
        toast.error(err.response.data.message);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [id]);

  return (
    <Page>
      <Wrapper className='flex flex-1 flex-col'>
        <div className='w-full bg-[#4285F4]/90 py-4'>
          <p className='text-center text-sm font-bold text-white md:text-2xl 3xl:text-4xl'>
            Xem thông tin câu hỏi
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
                    disabled
                    className='flex w-full flex-1 rounded-lg border border-[#D9D9D9] p-1 text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'
                    value={question?.name}
                  />
                </div>
                <div className='flex flex-row gap-x-8'>
                  <div className='flex w-full flex-col gap-y-1'>
                    <p className='flex flex-[2.5] text-base lg:text-lg 3xl:text-xl'>Môn</p>
                    <div className='flex w-full flex-1 items-center rounded-lg border border-[#CCC] bg-[#efefef4d]  p-1 text-xs font-medium text-[#252641] lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'>
                      {question?.subject?.name ?? 'Không có thông tin môn học'}
                    </div>
                  </div>
                  <div className='flex w-full flex-col'>
                    <p className='flex flex-[2.5] text-base lg:text-lg 3xl:text-xl'>Chương</p>
                    <div className='flex w-full flex-1 items-center  rounded-lg border border-[#CCC] bg-[#efefef4d]  p-1 text-xs font-medium text-[#252641] lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'>
                      {question?.chapter?.name ?? 'Không có thông tin chương'}
                    </div>
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
                  <Link
                    to={`/admin/questions/edit/${id}`}
                    className='items-center rounded-lg bg-[#4285F4]/80 px-6 py-1 transition-all duration-200 hover:bg-[#4285F4] lg:px-7 lg:py-2 3xl:px-8 3xl:py-3'
                  >
                    <p className='text-white'>Chỉnh sửa</p>
                  </Link>
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
                        className='flex w-full flex-1 cursor-not-allowed text-xs font-medium lg:text-sm 3xl:text-base'
                        value={question?.description}
                        placeholder='Không có đề cho câu hỏi này'
                        readOnly={true}
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
                          <Icon.LiveHelpIcon
                            fill='#666666'
                            className='h-4 w-4 lg:h-5 lg:w-5 3xl:h-6 3xl:w-6'
                          />
                        </a>
                      </div>
                      <ExpressionEditor
                        id='code'
                        className='flex w-full flex-1 cursor-not-allowed text-xs font-medium lg:text-sm 3xl:text-base'
                        value={question?.code}
                        placeholder='Không có biểu thức cho câu hỏi này'
                        readOnly={true}
                      />
                    </div>
                    <div className='flex flex-col gap-y-8'>
                      <div className='flex flex-row items-center gap-x-8'>
                        <p className='flex text-base lg:text-lg 3xl:text-xl'>Lựa chọn</p>
                      </div>
                      <div className='flex flex-col gap-y-4'>
                        {question?.options?.map((option, index) => {
                          return (
                            <div key={index} className='flex flex-row items-center gap-x-8'>
                              <label className='align-middle' htmlFor={`option_${index}`}>
                                {index + 1}
                              </label>
                              <input
                                id={`option_${index}`}
                                className='flex flex-1 rounded-lg border border-[#D9D9D9] p-1 font-mono text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'
                                value={option.description}
                                disabled
                              />
                            </div>
                          );
                        })}
                      </div>
                      <div className='flex flex-row items-center gap-x-8'>
                        <div className='flex flex-row items-center gap-x-4'>
                          <p className='flex text-base lg:text-lg 3xl:text-xl'>Đáp án đúng:</p>
                          {question?.answerKeys?.map((key) => (
                            <div
                              className='flex h-8 w-8 flex-1 items-center justify-center rounded-lg bg-[#0f9d58] text-xs font-medium text-white lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'
                              key={key}
                            >
                              {key + 1}
                            </div>
                          ))}
                        </div>
                        <div className='flex flex-row items-center gap-x-4'>
                          <p className='flex text-base lg:text-lg 3xl:text-xl'>
                            Xáo trộn lựa chọn:
                          </p>
                          <input
                            type='checkbox'
                            className='allow-checked h-8 w-8'
                            checked={question?.shuffleOptions}
                            disabled
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
                        id='explanation'
                        className='flex w-full flex-1 cursor-not-allowed text-xs font-medium lg:text-sm 3xl:text-base'
                        value={question?.explanation}
                        placeholder='Không có giải thích cho câu hỏi này'
                        readOnly={true}
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

export default ViewQuestionPage;
