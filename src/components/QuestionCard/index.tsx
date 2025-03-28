import { useMutation, useQueryClient } from '@tanstack/react-query';
import _, { debounce } from 'lodash';
import { ChangeEvent, Dispatch, SetStateAction, memo, useCallback, useRef, useState } from 'react';
import { useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useLocalStorage } from 'usehooks-ts';

import { Markdown } from '..';
import ExamSessionService from '../../service/examSession.service';
import QuizSessionService from '../../service/quizSession.service';
import { SessionStatus } from '../../types';
import { QuestionType, type ConcreteQuestion, UserAnswer } from '../../types/question';
import { MULTIPLE_CHOICE_LABELS } from '../../utils/helper';
import Icon from '../Icon';

import './index.css';

type InputAnswerProps = {
  status: SessionStatus;
  question: ConcreteQuestion;
  helpers: {
    stringAnswer: string;
    numberAnswer: number[];
    setStringAnswer: Dispatch<SetStateAction<string>>;
    setNumberAnswer: Dispatch<SetStateAction<number[]>>;
    setQuestion?: (question: ConcreteQuestion) => void;
  };
};

const InputAnswer = memo(function Component({ status, question, helpers }: InputAnswerProps) {
  const { stringAnswer, numberAnswer, setNumberAnswer, setQuestion } = helpers;
  const params = useParams();
  const queryClient = useQueryClient();

  const answerMutation = useMutation({
    mutationFn: async ({
      sessionId,
      questionId,
      answer,
    }: {
      sessionId: string;
      questionId: string;
      answer: UserAnswer;
    }) => {
      if (params['*']?.includes('tests')) {
        const { data } = await ExamSessionService.saveAnswer(sessionId, questionId, answer);
        return data.payload;
      }
      const { data } = await QuizSessionService.saveAnswer(sessionId, questionId, answer);
      return data.payload;
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries([params.sessionId]);
      await queryClient.invalidateQueries([params.sessionId, 'question board']);
    },
    onError: () => {
      toast.error('Lưu câu trả lời thất bại');
    },
  });

  const optimizedSetMultipleValueAnswer = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setQuestion?.({
        ...question,
        userAnswerKeys: _.includes(numberAnswer, Number(e.target.value))
          ? numberAnswer.length === 1
            ? undefined
            : _.without(numberAnswer, Number(e.target.value))
          : _.concat(numberAnswer, Number(e.target.value)),
      });
      setNumberAnswer((prevState) =>
        _.includes(prevState, Number(e.target.value))
          ? _.without(prevState, Number(e.target.value))
          : _.concat(prevState, Number(e.target.value))
      );
      debounce(
        () =>
          answerMutation.mutate({
            sessionId: params.sessionId as string,
            questionId: String(question.questionId),
            answer: {
              answerKeys: _.includes(numberAnswer, Number(e.target.value))
                ? numberAnswer.length === 1
                  ? undefined
                  : _.without(numberAnswer, Number(e.target.value))
                : _.concat(numberAnswer, Number(e.target.value)),
            },
          }),
        500
      )();
    },
    [setNumberAnswer, numberAnswer, answerMutation, params.sessionId, question, setQuestion]
  );

  switch (question.type) {
    case QuestionType.MULTIPLE_CHOICE_SINGLE_ANSWER:
      return (
        <div className='flex h-fit flex-col flex-wrap items-start justify-center gap-y-4'>
          {question.options?.map((option, index) => (
            <div
              key={`question-${question.questionId}-answer-${option.key}`}
              className='relative flex flex-row flex-nowrap items-center justify-center gap-x-2'
            >
              <div className='relative flex items-center'>
                <input
                  id={`question-${question.questionId}-answer-${option.key}`}
                  onChange={() => {
                    setQuestion?.({
                      ...question,
                      userAnswerKeys: [option.key],
                    });
                    setNumberAnswer([option.key]);
                    debounce(
                      () =>
                        answerMutation.mutate({
                          sessionId: params.sessionId as string,
                          questionId: String(question.questionId),
                          answer: {
                            answerKeys: [option.key],
                          },
                        }),
                      500
                    )();
                  }}
                  disabled={status !== SessionStatus.ONGOING}
                  className={`question checkbox ${
                    status === SessionStatus.ONGOING
                      ? 'checked:bg-[#4285F4]'
                      : question.answerKeys?.includes(option.key)
                      ? 'checked:bg-[#49CCCF]'
                      : question.userAnswerKeys?.includes(option.key)
                      ? 'checked:bg-[#DB4437]'
                      : ''
                  }`}
                  style={{ borderRadius: '9999px' }}
                  type='checkbox'
                  name={`question-${question.questionId}`}
                  value={option.key || -1}
                  multiple={status === SessionStatus.ENDED}
                  checked={
                    numberAnswer[0] === option.key ||
                    (status === SessionStatus.ENDED &&
                      question.answerKeys &&
                      question.answerKeys[0] === option.key)
                  }
                />
                <label
                  htmlFor={`question-${question.questionId}-answer-${option.key}`}
                  className='absolute left-1/2 flex items-center justify-center'
                >
                  <p className='-ml-[100%] h-full text-sm text-inherit md:text-base lg:text-lg 3xl:text-2xl'>
                    {MULTIPLE_CHOICE_LABELS[index]}
                  </p>
                </label>
              </div>
              <label htmlFor={`question-${question.questionId}-answer-${option.key}`}>
                <Markdown className='text-sm lg:text-base xl:text-lg 3xl:text-2xl'>
                  {option.description}
                </Markdown>
              </label>
            </div>
          ))}
        </div>
      );
    case QuestionType.MULTIPLE_CHOICE_MULTIPLE_ANSWERS:
      return (
        <div className='flex flex-col flex-wrap items-start justify-center gap-y-4'>
          {question.options?.map((option) => (
            <div
              key={`question-${question.questionId}-answer-${option.key}`}
              className='relative flex flex-row flex-nowrap items-center justify-center gap-x-2'
            >
              <div className='relative flex items-center'>
                <input
                  id={`question-${question.questionId}-answer-${option.key}`}
                  className={`question checkbox ${
                    status === SessionStatus.ONGOING
                      ? 'checked:bg-[#4285F4]'
                      : question.answerKeys?.includes(option.key)
                      ? 'checked:bg-[#49CCCF]'
                      : question.userAnswerKeys?.includes(option.key)
                      ? 'checked:bg-[#DB4437]'
                      : ''
                  }`}
                  disabled={status !== SessionStatus.ONGOING}
                  onChange={optimizedSetMultipleValueAnswer}
                  name={`question-${question.questionId}`}
                  type='checkbox'
                  multiple
                  value={option.key || -1}
                  checked={
                    numberAnswer.includes(option.key) ||
                    (status === SessionStatus.ENDED && question.answerKeys?.includes(option.key))
                  }
                />
                <span className='absolute left-1/2 flex items-center justify-center'>
                  <span className='-ml-[100%] h-full text-xs md:text-base'>
                    {question.answerKeys?.includes(option.key) ? (
                      <Icon.Checkmark className='h-4 w-auto md:h-6' />
                    ) : question.userAnswerKeys?.includes(option.key) ? (
                      <Icon.XMark className='h-4 w-auto md:h-6' />
                    ) : null}
                  </span>
                </span>
              </div>
              <label htmlFor={`question-${question.questionId}-answer-${option.key}`}>
                <Markdown className='text-sm lg:text-base xl:text-lg 3xl:text-2xl'>
                  {option.description}
                </Markdown>
              </label>
            </div>
          ))}
        </div>
      );
    case QuestionType.TEXT:
      return (
        <div
          key={`question-${question.questionId}-answer-field`}
          className='relative flex flex-row flex-nowrap items-center justify-center gap-x-2'
        >
          <label htmlFor={`question-${question.questionId}-answer-field`}>
            <p className='text-base font-semibold'>Trả lời: </p>
          </label>
          <input
            id={`question-${question.questionId}-answer-field`}
            type='text'
            disabled={status !== SessionStatus.ONGOING}
            placeholder='Nhập câu trả lời'
            value={stringAnswer || ''}
          />
        </div>
      );
    default:
      return null;
  }
});

type Props = {
  question: ConcreteQuestion;
  status: SessionStatus;
  questionNumber: number;
  showInfo?: boolean;
  showExplanation?: boolean;
  showNote?: boolean;
  setQuestion?: (question: ConcreteQuestion) => void;
};

const QuestionCard = ({
  question,
  status,
  questionNumber,
  setQuestion,
  showInfo = true,
  showExplanation = true,
  showNote = true,
}: Props) => {
  const params = useParams();

  const [stringAnswer, setStringAnswer] = useState<string>(
    String(question.userAnswerField || question.answerField)
  );
  const [numberAnswer, setNumberAnswer] = useState<number[]>(
    question.userAnswerKeys || question.answerKeys || []
  );
  const [note, setNote] = useState<string>(question.userNote || '');
  const [saved, setSaved] = useState<boolean>(true);
  const [starList, setStarList] = useLocalStorage<number[]>(`${params.sessionId}-starList`, []);

  const answerBox = useRef<HTMLDivElement>(null);
  const noteBox = useRef<HTMLFormElement>(null);

  const noteMutation = useMutation({
    mutationFn: async ({
      sessionId,
      questionId,
      body,
    }: {
      sessionId: string;
      body: string;
      questionId: string;
    }) => {
      const newNote = {
        note: body,
      };

      await QuizSessionService.note(sessionId, questionId, newNote);
    },
    onSuccess: () => {
      toast.success('Đã lưu ghi chú');
    },
    onError: () => {
      setSaved(false);
      toast.error('Lưu ghi chú thất bại');
    },
  });
  const debouncedNoteMutate = debounce(noteMutation.mutate, 1000);

  const handleNoteChange = useCallback(
    (event: ChangeEvent<HTMLTextAreaElement>) => {
      if (event.target.value === question.userNote) {
        setSaved(true);
      } else {
        setSaved(false);
      }
      setNote(event.target.value);
    },
    [question.userNote]
  );

  const extractUserAnswer = useCallback(() => {
    switch (question.type) {
      case 'MULTIPLE_CHOICE_SINGLE_ANSWER':
        return `${
          question.userAnswerKeys === undefined
            ? 'Không trả lời'
            : MULTIPLE_CHOICE_LABELS[
                _.findIndex(
                  question.options,
                  (option) => !!question.userAnswerKeys?.includes(option.key)
                )
              ]
        }`;
      case 'MULTIPLE_CHOICE_MULTIPLE_ANSWERS':
        return `${
          question.userAnswerKeys === undefined
            ? 'Không trả lời'
            : question.userAnswerKeys.join(', ')
        }`;
      default:
        return 'Không trả lời';
    }
  }, [question]);

  const extractAnswer = useCallback(() => {
    switch (question.type) {
      case 'MULTIPLE_CHOICE_SINGLE_ANSWER':
        return `${
          question.answerKeys === undefined
            ? 'Không trả lời'
            : MULTIPLE_CHOICE_LABELS[
                _.findIndex(
                  question.options,
                  (option) => !!question.answerKeys?.includes(option.key)
                )
              ]
        }`;
      case 'MULTIPLE_CHOICE_MULTIPLE_ANSWERS':
        return `${
          question.answerKeys === undefined ? 'Không trả lời' : question.answerKeys.join(', ')
        }`;
      default:
        return 'Không trả lời';
    }
  }, [question]);

  return (
    <>
      <div
        id={`question-${question.questionId}-card`}
        className='flex w-full flex-1 flex-col items-start space-y-3 rounded-lg bg-white p-4
      md:bg-[#9DCCFF]/20 3xl:space-y-6'
      >
        <div className='flex w-full flex-row items-center justify-between gap-x-6'>
          <div className='flex flex-row items-center gap-x-2'>
            <div
              className={`flex h-5 w-5 items-center justify-center rounded-full p-1 ${
                status === SessionStatus.ENDED ? '' : 'hidden'
              } ${
                question.isCorrect === undefined
                  ? 'border border-[#49CCCF] bg-transparent'
                  : question.isCorrect
                  ? 'bg-[#49CCCF]'
                  : 'bg-[#DB4437]'
              }`}
            >
              <Icon.XMark
                className={`h-full w-full ${
                  question.isCorrect === undefined ? 'hidden' : question.isCorrect ? 'hidden' : ''
                }`}
              />
            </div>
            <p className='text-base font-semibold md:text-lg 3xl:text-xl'>Câu {questionNumber}</p>
          </div>

          <div className='relative flex flex-row items-center'>
            <button
              type='button'
              onClick={() => {
                setStarList((prev) => prev.concat(questionNumber));
              }}
              disabled={status === SessionStatus.ENDED || starList.includes(questionNumber)}
              className={`absolute transition-all duration-300 ${
                starList.includes(questionNumber) ? '-z-10 opacity-0' : ''
              }`}
            >
              <Icon.StarDim className='h-6 w-auto' />
            </button>
            <button
              type='button'
              onClick={() => {
                setStarList((prev) => prev.filter((star) => star !== questionNumber));
              }}
              disabled={status === SessionStatus.ENDED || !starList.includes(questionNumber)}
              className={`relative transition-all duration-300 ${
                starList.includes(questionNumber) ? '' : '-z-10 opacity-0'
              }`}
            >
              <Icon.StarLit className='h-6 w-auto' />
            </button>
          </div>
        </div>

        <span className='hidden w-full border border-t-[#666] md:flex' />

        <div
          className='flex w-full flex-col items-start space-y-2 rounded-lg bg-[#9DCCFF]/20 p-2
        md:bg-transparent md:p-0 lg:space-y-3
        3xl:space-y-6'
        >
          <Markdown>{question.description}</Markdown>
          <InputAnswer
            status={status}
            question={question}
            helpers={{
              stringAnswer,
              numberAnswer,
              setStringAnswer,
              setNumberAnswer,
              setQuestion,
            }}
          />
        </div>
      </div>
      {status === SessionStatus.ENDED && showInfo === true && (
        <div ref={answerBox} className='flex h-full w-full flex-col gap-y-4 md:flex-row md:gap-x-4'>
          <div className='flex h-full w-full flex-1 flex-col rounded-lg border border-[#49CCCF] bg-white p-4 md:w-1/2'>
            <h3 className='mb-2 text-xl font-semibold'>Đáp án</h3>
            <div className='flex flex-col items-start justify-center gap-y-1'>
              <div className='flex flex-row items-center gap-x-2'>
                <Icon.UserAnswer className='h-5 w-auto' fill='#49BBBD' />
                <p className='text-base font-semibold text-[#666]'>
                  Đáp án bạn chọn: {extractUserAnswer()}
                </p>
              </div>
              <div className='flex flex-row items-center gap-x-2'>
                <Icon.Answer className='h-5 w-auto' fill='#49BBBD' />
                <p className='text-base font-semibold text-[#666]'>
                  Đáp án đúng: {extractAnswer()}
                </p>
              </div>
            </div>
            {showExplanation ? (
              <>
                <span className='my-4 border-t border-[#666]' />
                <h3 className='mb-2 text-xl font-semibold'>Giải thích</h3>
                <Markdown>{question.explanation}</Markdown>
              </>
            ) : null}
          </div>
          {showNote ? (
            <form
              ref={noteBox}
              className='flex min-h-full w-full flex-1 flex-col rounded-lg border border-[#49CCCF] bg-white p-4 md:w-1/2'
            >
              <div className='mb-2 flex flex-row items-center justify-between gap-x-2'>
                <div className='flex flex-row items-center gap-x-2'>
                  <Icon.Pen fill='#49CCCF' className='h-5 w-auto' />
                  <h3 className='text-xl font-semibold'>Ghi chú</h3>
                </div>

                <button
                  type='submit'
                  disabled={saved}
                  onClick={(event) => {
                    event.preventDefault();
                    setSaved(true);
                    debouncedNoteMutate({
                      body: note,
                      sessionId: params.sessionId as string,
                      questionId: String(question.questionId),
                    });
                  }}
                >
                  <p className={`${saved ? 'font-normal' : 'font-semibold text-[#4284F4]'}`}>Lưu</p>
                </button>
              </div>

              <textarea
                className='h-full w-full resize-none focus:outline-none'
                value={note}
                onChange={handleNoteChange}
              />
            </form>
          ) : null}
        </div>
      )}
    </>
  );
};

export default QuestionCard;
