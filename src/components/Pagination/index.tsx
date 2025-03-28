import { Icon } from '..';
import { usePagination } from '../../hooks';

type Props = {
  totalCount: number;
  pageSize?: number;
  currentPage: number;
  onPageChange: (currentPage: number) => void;
};

const Pagination = ({ totalCount, pageSize = 10, currentPage, onPageChange }: Props) => {
  const pageRange = usePagination({ totalCount, pageSize: pageSize, siblingCount: 1, currentPage });
  if ((pageRange?.length || 0) <= 1) return null;

  return (
    <ul className='my-4 flex flex-row items-center justify-center lg:gap-x-4'>
      <li className='flex h-fit w-fit items-center'>
        <button
          className={`rounded-full p-2 ${currentPage === 1 ? '' : 'hover:bg-black/20'}`}
          disabled={currentPage === pageRange?.[0]}
          onClick={() => onPageChange(currentPage - 1)}
        >
          <Icon.Chevron fill='#5B5B5B' className='h-6 w-auto -rotate-90 3xl:h-7' />
        </button>
      </li>

      {pageRange?.map((pageNumber, index) => {
        if (pageNumber === 'DOTS') {
          return (
            <li className='flex h-fit w-fit items-center' key={`pagination-${pageNumber}-${index}`}>
              <p className='w-6 text-base 3xl:w-7 3xl:text-lg'>...</p>
            </li>
          );
        }

        return (
          <li key={`pagination-${pageNumber}`} className='flex h-fit w-fit items-center'>
            <button
              className={`aspect-square rounded-full p-2 3xl:p-4 ${
                pageNumber === currentPage ? 'bg-[#4285F4]/90' : 'hover:bg-black/20'
              }`}
              onClick={() => onPageChange(pageNumber as number)}
            >
              <p
                className={`w-6 text-base 3xl:w-7 3xl:text-lg ${
                  pageNumber === currentPage ? 'font-semibold text-white' : 'font-medium'
                }`}
              >
                {pageNumber}
              </p>
            </button>
          </li>
        );
      })}

      <li className='flex h-fit w-fit items-center'>
        <button
          className={`rounded-full p-2 ${
            currentPage === (pageRange?.[pageRange?.length - 1] as number)
              ? ''
              : 'hover:bg-black/20'
          }`}
          disabled={currentPage === (pageRange?.[pageRange?.length - 1] as number)}
          onClick={() => onPageChange(currentPage + 1)}
        >
          <Icon.Chevron fill='#5B5B5B' className='h-6 w-auto rotate-90 3xl:h-7' />
        </button>
      </li>
    </ul>
  );
};

export default Pagination;
