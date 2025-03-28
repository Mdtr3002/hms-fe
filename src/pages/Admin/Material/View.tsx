import { useEffect, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Link, useNavigate, useParams } from 'react-router-dom';
import './index.css';
import { toast } from 'react-toastify';

import { Icon } from '../../../components';
import { useDebounce } from '../../../hooks';
import { Page, Wrapper } from '../../../layout';
import MaterialService from '../../../service/material.service';
import { Material } from '../../../types';

const MaterialView = () => {
  const params = useParams();
  const id = params?.id ?? '';
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [material, setMaterial] = useState<Material>();
  const [url, setUrl] = useState('');

  useEffect(() => {
    MaterialService.download(id, true)
      .then((res) => {
        const stringResult = window.URL.createObjectURL(res?.data);
        setUrl(stringResult);
      })
      .catch((err) => {
        console.log(err);
        setUrl('');
      });
  }, [id]);

  const handleOnDownload = useDebounce(() => {
    if (url) {
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `${material?.name ?? 'ctct'}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  });

  useEffect(() => {
    setLoading(true);
    MaterialService.getById(id, true)
      .then((res) => {
        const result = res.data.payload;
        console.log('>>> result', result);
        setMaterial(result);
      })
      .catch((err) => {
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
            Xem thông tin tài liệu
          </p>
        </div>
        <div className='w-full p-4'>
          <Link className='mb-2 flex items-center hover:underline' to='/admin/material/manage'>
            <Icon.Chevron className='h-5 -rotate-90 fill-black' />
            <p className='text-sm text-[#5B5B5B]'>Quay lại</p>
          </Link>
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
            <div
              className='h-full w-full rounded-lg bg-white px-8 py-2
            lg:px-10 lg:py-4 3xl:px-12 3xl:py-6'
            >
              <form className='flex flex-col gap-y-6'>
                <p className='flex flex-[2.5] text-base lg:text-lg 3xl:text-xl'>
                  ID tài liệu: {id}
                </p>
                <div className='flex w-full flex-col items-start justify-center'>
                  <label className='mb-2 w-full' htmlFor='exam-name'>
                    <p className='w-full text-sm lg:text-base 3xl:text-xl'>Tên đề thi</p>
                  </label>
                  <div
                    id='exam-name'
                    className='flex w-full rounded-lg border border-[#CCC] p-1 text-xs font-medium
                  lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'
                  >
                    {material?.name}
                  </div>
                </div>
                <div className='flex w-full flex-1 flex-row items-center justify-start gap-x-4'>
                  <div className='flex w-full flex-1 flex-col'>
                    <p className='w-full text-sm lg:text-base 3xl:text-xl'>Môn</p>
                    <div className='flex h-full w-full flex-1 rounded-lg border border-[#CCC] p-1 text-xs font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base'>
                      <span>{material?.subject?.name}</span>
                    </div>
                  </div>
                  <div className='flex w-full flex-1 flex-col'>
                    <p className='w-full text-sm lg:text-base 3xl:text-xl'>Chương</p>
                    <div
                      className={`flex h-full w-full flex-1 rounded-lg border border-[#CCC] p-1 text-xs ${
                        material?.chapter?.name ? '' : 'text-[#5B5B5B]'
                      } font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base`}
                    >
                      <span>{material?.chapter?.name ?? 'Không có thông tin'}</span>
                    </div>
                  </div>
                </div>
                <div className='flex w-full flex-col items-start justify-center'>
                  <label className='mb-2 w-full' htmlFor='exam-description'>
                    <p className='w-full text-sm lg:text-base 3xl:text-xl'>Chú thích</p>
                  </label>
                  <div
                    className={`flex w-full rounded-lg border border-[#CCC] p-1 text-xs ${
                      material?.description ? '' : 'text-[#5B5B5B]'
                    }
                  font-medium lg:p-3 lg:text-sm 3xl:p-5 3xl:text-base`}
                  >
                    {material?.description ? material.description : 'Không có chú thích'}
                  </div>
                </div>
                <div className='flex w-full flex-row items-center justify-start gap-x-4'>
                  <p className='flex text-sm font-medium lg:text-base 3xl:text-base'>
                    Hiển thị với người dùng:
                  </p>
                  <input
                    type='checkbox'
                    className='allow-checked h-7 w-7 cursor-not-allowed'
                    checked={!material?.isHidden}
                    disabled
                  />
                </div>
                <div className='flex w-full flex-1 flex-col'>
                  <p className='w-full text-sm font-semibold lg:text-base 3xl:text-xl'>Tài liệu</p>
                  {/* <PDF url={`${API_URL}admin/material/${id}/download`} title={material?.name} /> */}
                  {url && (
                    <embed
                      src={url}
                      type='application/pdf'
                      title={material?.name}
                      height={800}
                      width='100%'
                    />
                  )}
                </div>
              </form>
              <div className='my-4 flex flex-row-reverse gap-x-8'>
                <button
                  type='button'
                  onClick={() => navigate(`/admin/material/edit/${params.id}`)}
                  className='w-fit cursor-pointer rounded-lg bg-[#4285F4]/80 px-1 transition-all duration-200 hover:bg-[#4285F4] lg:px-3 3xl:px-5'
                >
                  <p className='p-1 text-xs font-medium text-white lg:p-2 lg:text-sm 3xl:p-3 3xl:text-base'>
                    Chỉnh sửa
                  </p>
                </button>
                <button
                  type='button'
                  onClick={() => handleOnDownload()}
                  className='w-fit cursor-pointer rounded-lg bg-[#4285F4]/80 px-1 hover:bg-[#4285F4] lg:px-3 3xl:px-5'
                >
                  <p className='p-1 text-xs font-medium text-white lg:p-2 lg:text-sm 3xl:p-3 3xl:text-base'>
                    Tải về
                  </p>
                </button>
              </div>
            </div>
          )}
        </div>
      </Wrapper>
    </Page>
  );
};

export default MaterialView;
