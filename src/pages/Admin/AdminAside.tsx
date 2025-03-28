import { FC, useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import { Icon } from '../../components';
import { Aside } from '../../layout';
import useBoundStore from '../../store';

import AdminAsideLink from './AdminAsideLink';

type AdminAsideState = {
  isActive:
    | 'patient'
    | 'material'
    | 'exam'
    | 'exercise'
    | 'question'
    | 'subject'
    | 'chapter'
    | 'mockTest'
    | 'event'
    | 'bookFair'
    | 'video'
    | null;
  patient: boolean;
  material: boolean;
  exam: boolean;
  exercise: boolean;
  question: boolean;
  subject: boolean;
  chapter: boolean;
  mockTest: boolean;
  event: boolean;
  bookFair: boolean;
  video: boolean;
};

const AdminAside: FC = () => {
  const [menuState, setMenuState] = useState<AdminAsideState>({
    isActive: null,
    patient: false,
    material: false,
    exam: false,
    exercise: false,
    question: false,
    subject: false,
    chapter: false,
    mockTest: false,
    event: false,
    bookFair: false,
    video: false,
  });
  const { pathname } = useLocation();
  const pathState = useBoundStore.use.pathState();
  const setPathState = useBoundStore.use.setPathState();
  const setFilterName = useBoundStore.use.setFilterName();
  const setFilterSubject = useBoundStore.use.setFilterSubject();
  const setFilterChapter = useBoundStore.use.setFilterChapter();
  const setFilterSemester = useBoundStore.use.setFilterSemester();
  const setPage = useBoundStore.use.setPage();

  const handleClick = (
    type:
      | 'patient'
      | 'material'
      | 'exam'
      | 'exercise'
      | 'question'
      | 'subject'
      | 'chapter'
      | 'mockTest'
      | 'event'
      | 'bookFair'
      | 'video'
  ) => {
    setMenuState((prevState) => {
      const newState = { ...prevState };
      const newStateForType = !newState[type];

      (Object.keys(newState) as Array<keyof typeof newState>).forEach((key) => {
        if (key !== type && key !== 'isActive') {
          if (!newState.isActive || key !== newState.isActive) {
            newState[key] = false;
          }
        }
      });

      newState[type] = newStateForType;

      return newState;
    });
  };

  useEffect(() => {
    if (!pathname.includes(`/admin/${pathState}`)) {
      setFilterName('');
      setFilterChapter('');
      setFilterSemester('');
      setFilterSubject('');
      setPage(1);
    }

    if (pathname.includes('/material')) {
      setMenuState((prevState) => ({ ...prevState, isActive: 'material' }));
      setPathState('material');
    } else if (pathname.includes('/exam-archive')) {
      setMenuState((prevState) => ({ ...prevState, isActive: 'exam' }));
      setPathState('exam');
    } else if (pathname.includes('/exercises')) {
      setMenuState((prevState) => ({ ...prevState, isActive: 'exercise' }));
      setPathState('exercise');
    } else if (pathname.includes('/questions')) {
      setMenuState((prevState) => ({ ...prevState, isActive: 'question' }));
      setPathState('question');
    } else if (pathname.includes('/subject')) {
      setMenuState((prevState) => ({ ...prevState, isActive: 'subject' }));
      setPathState('subject');
    } else if (pathname.includes('/chapter')) {
      setMenuState((prevState) => ({ ...prevState, isActive: 'chapter' }));
      setPathState('chapter');
    } else if (pathname.includes('/mockTest')) {
      setMenuState((prevState) => ({ ...prevState, isActive: 'mockTest' }));
      setPathState('mockTest');
    } else if (pathname.includes('/book-fair')) {
      setMenuState((prevState) => ({ ...prevState, isActive: 'bookFair' }));
      setPathState('bookFair');
    } else if (pathname.includes('/video')) {
      setMenuState((prevState) => ({ ...prevState, isActive: 'video' }));
      setPathState('bookFair');
    } else setPathState(null);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  return (
    <Aside>
      <div className='flex flex-col bg-white'>
        <AdminAsideLink
          path='patient'
          titleName='Patient'
          isOpen={menuState.patient}
          handleClick={handleClick}
          IconProp={Icon.Profile}
        />
        <AdminAsideLink
          path='subject'
          titleName='môn'
          isOpen={menuState.subject}
          handleClick={handleClick}
          IconProp={Icon.Subject}
        />
        <AdminAsideLink
          path='chapter'
          titleName='chương'
          isOpen={menuState.chapter}
          handleClick={handleClick}
          IconProp={Icon.ContentPaste}
        />
        <AdminAsideLink
          path='material'
          titleName='tài liệu'
          isOpen={menuState.material}
          handleClick={handleClick}
          IconProp={Icon.Document}
        />
        <AdminAsideLink
          path='exam'
          titleName='đề thi'
          isOpen={menuState.exam}
          handleClick={handleClick}
          IconProp={Icon.Quiz}
        />
        <AdminAsideLink
          path='video'
          titleName='video'
          isOpen={menuState.video}
          handleClick={handleClick}
          IconProp={Icon.Video}
        />
        <AdminAsideLink
          path='exercise'
          titleName='bài tập rèn luyện'
          isOpen={menuState.exercise}
          handleClick={handleClick}
          IconProp={Icon.Exercise}
        />
        <AdminAsideLink
          path='question'
          titleName='câu hỏi'
          isOpen={menuState.question}
          handleClick={handleClick}
          IconProp={Icon.Test}
        />
        <AdminAsideLink
          path='mockTest'
          titleName='thi thử'
          isOpen={menuState.mockTest}
          handleClick={handleClick}
          IconProp={Icon.MockTestIcon}
        />
        <AdminAsideLink
          path='event'
          titleName='sự kiện'
          isOpen={menuState.event}
          handleClick={handleClick}
          IconProp={Icon.CalendarIcon}
        />
        <AdminAsideLink
          path='bookFair'
          titleName='sách'
          isOpen={menuState.bookFair}
          handleClick={handleClick}
          IconProp={Icon.Document}
        />
      </div>
    </Aside>
  );
};

export default AdminAside;
