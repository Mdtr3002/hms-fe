import { useLocation, useNavigate } from 'react-router-dom';

import { Icon, Linkify } from '..';
import { ExamArchive, ExamType, Material } from '../../types';
import CopyIcon from '../CopyIcon';

interface DocumentCardProps {
  document: Material | ExamArchive;
  title: string;
  subTitle?: string;
  to: string;
  copyContent?: any;
}

const DocumentCard: React.FC<DocumentCardProps> = ({ document, title, to, copyContent }) => {
  const { pathname } = useLocation();
  const isMaterial = (doc: unknown): doc is Material => pathname.split('/').includes('material');
  const navigate = useNavigate();

  const handleDescriptionPress = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.stopPropagation();
  };

  return (
    <div
      onClick={() => navigate(to)}
      className='relative flex cursor-pointer flex-col rounded-lg border-[1px] border-[#dadce0] bg-white px-4 py-3 
      hover:shadow-[0px_10px_40px_0px_rgba(66,133,244,0.1)] lg:px-6 lg:py-4 3xl:px-8 3xl:py-6'
    >
      <div
        className='absolute right-4 top-4 flex space-x-1 md:space-x-2 lg:right-6 lg:top-6 
        lg:space-x-3 xl:space-x-4 2xl:space-x-5 3xl:right-8 3xl:top-8'
      >
        <CopyIcon copyContent={copyContent} />
        {/* <div>
          <button
            className='share-anchor flex aspect-square items-center justify-center rounded-full bg-[#4285F4] p-1'
            data-tooltip-content='Share'
          >
            <Icon.Share className='h-4 w-4 fill-white' />
          </button>
          <Tooltip anchorSelect='.share-anchor' />
        </div> */}
      </div>
      <div className='mb-4 w-full pr-[8%] text-start text-lg font-semibold md:font-normal lg:text-xl 3xl:text-2xl'>
        <p className='flex flex-wrap leading-5 lg:leading-7'>{title}</p>
      </div>
      <div className='flex flex-col-reverse gap-y-4 lg:gap-y-6 3xl:gap-y-8'>
        <div className='flex flex-row items-center justify-between'>
          <div className='flex h-fit flex-1 flex-row flex-wrap items-center justify-start gap-x-2 gap-y-2 md:w-fit md:flex-none lg:gap-x-4 3xl:gap-x-6'>
            <div className='flex flex-1 flex-row items-center gap-x-3'>
              {isMaterial(document) ? (
                <>
                  <Icon.Document className='h-4 w-auto fill-[#4285F4] lg:h-5 3xl:h-6' />
                  <p className='whitespace-nowrap text-xs text-[#666] lg:text-sm 3xl:text-base'>
                    {document.chapter ? document.chapter.name : 'Chương không xác định'}
                  </p>
                </>
              ) : (
                <>
                  <Icon.Test className='h-4 w-auto fill-[#4285F4] lg:h-5 3xl:h-6' />
                  <p className='whitespace-nowrap text-xs text-[#666] lg:text-sm 3xl:text-base'>
                    {document.semester
                      ? `Học kì ${document.semester.slice(-3)}`
                      : 'Học kì không xác định'}
                  </p>
                </>
              )}
            </div>
            {isMaterial(document) ? null : (
              <>
                <span className='mx-1 block h-6 w-0 border-l-2' />
                <div className='flex flex-1 flex-row items-center gap-x-3'>
                  <Icon.List className='h-4 w-auto fill-[#4285F4] lg:h-5 3xl:h-6' />
                  <p className='whitespace-nowrap text-xs text-[#666] lg:text-sm 3xl:text-base'>
                    {document.type === ExamType.MIDTERM_EXAM ? 'Giữa kì' : 'Cuối kì'}
                  </p>
                </div>
              </>
            )}
          </div>
          {/* <Link to={to} className='flex rounded-lg bg-[#4285F4]/80 px-7 py-2 hover:bg-[#4285F4]'>
            <p className='text-xs text-white lg:text-sm 3xl:text-base'>Xem chi tiết</p>
          </Link> */}
        </div>
        {document?.description !== '' && (
          <div
            className='w-full rounded-lg bg-[#9DCCFF]/20 p-2 lg:p-4 3xl:p-6'
            onClick={handleDescriptionPress}
          >
            <p className='cursor-text text-justify text-[#666]'>
              <Linkify>{document.description}</Linkify>
            </p>
          </div>
        )}
        {/* <Link
          to={to}
          className='flex w-fit rounded-lg bg-[#4285F4]/80 px-7 py-2 hover:bg-[#4285F4] md:hidden'
        >
          <p className='text-xs text-white lg:text-sm 3xl:text-base'>Xem chi tiết</p>
        </Link> */}
      </div>
    </div>
  );
};

export default DocumentCard;
