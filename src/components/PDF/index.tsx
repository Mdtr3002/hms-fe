import { debounce } from 'lodash';
import { useCallback, useEffect, useRef, useState } from 'react';
import Skeleton from 'react-loading-skeleton';
import { Document, Outline, Page, pdfjs } from 'react-pdf';
import { OnItemClickArgs } from 'react-pdf/dist/cjs/shared/types';

import { useDebounce } from '../../hooks';
import useBoundStore from '../../store';
import Icon from '../Icon';

import 'react-pdf/dist/esm/Page/TextLayer.css';
import './index.css';

pdfjs.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.js`;
const options = {
  cMapUrl: 'cmaps/',
  cMapPacked: true,
  httpHeaders: {
    Authorization: `Bearer ${JSON.parse(localStorage.getItem('token') || '{}')}`,
  },
};

interface PDFProps {
  renderMode?: 'canvas' | 'svg' | 'none';
  className?: string;
  pageClassName?: string;
  title?: string;
  file?: File | undefined;
}

const PDF: React.FC<PDFProps> = ({ renderMode, className, pageClassName, file }) => {
  const [numPages, setNumPages] = useState(1);
  const [zoom, setZoom] = useState(1);
  const [width, setWidth] = useState<number | undefined>();
  const [isShowOutline, setIsShowOutline] = useState(false);
  const [isShowTool, setIsShowTool] = useState(false);
  const [isMouseIn, setIsMouseIn] = useState(false);
  const canZoomIn = zoom < 2;
  const canZoomOut = zoom > 0.4;
  const timeRef = useRef<NodeJS.Timeout>();
  const [hasOutline, setHasOutline] = useState(true);
  const isAsideOpen = useBoundStore.use.isAsideOpen();
  const toggleAside = useBoundStore.use.toggleAside();

  useEffect(() => {
    setZoom(1);
  }, [isAsideOpen]);

  const handleOnMouseIn = (isIn: boolean) => {
    if (timeRef.current) {
      clearTimeout(timeRef.current);
    }
    if (isIn) setIsMouseIn(true);
    else
      timeRef.current = setTimeout(() => {
        setIsMouseIn(false);
      }, 2000);
  };

  const onZoomIn = () => {
    if (canZoomIn) setZoom(zoom + 0.1);
  };

  const onZoomOut = () => {
    if (canZoomOut) setZoom(zoom - 0.1);
  };

  const onDocumentLoadSuccess = ({ numPages: nextNumPages }: any) => {
    setNumPages(nextNumPages);
  };
  const pdfWrapperRef = useRef<HTMLDivElement>(null);
  const pageRefs = useRef<HTMLCanvasElement[]>([]);
  const outlineRef = useRef<HTMLDivElement>(null);

  const onItemClick = ({ pageNumber }: OnItemClickArgs) => {
    pageRefs.current[pageNumber].scrollIntoView();
  };

  const setWrapperSize = () => {
    setWidth(pdfWrapperRef.current?.clientWidth);
  };

  const setTool = useDebounce(() => {
    setIsShowTool(false);
  }, 3000);

  const handleOnScroll = useCallback(() => {
    setIsShowTool(true);
    setTool();
  }, [setIsShowTool, setTool]);

  useEffect(() => {
    const closeOutline = (event: MouseEvent) => {
      if (outlineRef.current && !outlineRef.current.contains(event.target as Node)) {
        setIsShowOutline(false);
      }
    };
    if (isShowOutline) {
      setTimeout(() => {
        window.addEventListener('click', closeOutline);
      }, 0);
      return () => window.removeEventListener('click', closeOutline);
    }
  }, [isShowOutline]);

  useEffect(() => {
    const element = document.getElementById('content-wrapper');
    window.addEventListener('resize', debounce(setWrapperSize, 700));
    element?.addEventListener('scroll', handleOnScroll);

    return () => {
      window.removeEventListener('scroll', handleOnScroll);
      element?.removeEventListener('resize', debounce(setWrapperSize, 700));
    };
  }, [handleOnScroll]);

  useEffect(() => {
    if (pdfWrapperRef.current) {
      setWrapperSize();
    }
  }, [pdfWrapperRef.current?.clientWidth]);

  return (
    <div
      id='pdfWrapperRef'
      className='flex w-full flex-col gap-y-1 text-sm font-medium md:text-sm lg:text-base 2xl:text-lg'
      ref={pdfWrapperRef}
    >
      {width && (
        <Document
          className={`flex flex-row justify-between ${className || ''}`}
          options={options}
          renderMode={renderMode || 'svg'}
          error={<Skeleton baseColor='#9DCCFF' borderRadius={0} height='100vh' />}
          loading={<Skeleton baseColor='#9DCCFF' borderRadius={0} height='100vh' />}
          file={file}
          onLoadSuccess={onDocumentLoadSuccess}
          onItemClick={onItemClick}
        >
          <div ref={outlineRef} className='text-sm md:text-xs lg:text-sm 2xl:text-base'>
            <Outline
              onItemClick={onItemClick}
              className={`with-nav-height ${isShowOutline ? '' : 'hidden'}`}
              onLoadSuccess={(outline) => {
                setHasOutline(outline != null);
              }}
            />
          </div>
          <div
            className={`fixed bottom-0 left-[50%] z-10 flex translate-x-[-50%] translate-y-[-50%] flex-row justify-center gap-x-2 rounded-lg border-[1px] border-[#0c0c0d] bg-[#38383d] p-2 text-[#d4d4d5] transition-all duration-200 hover:text-[#efeff0] ${
              isShowTool || isMouseIn ? 'opacity-100' : 'opacity-0'
            }`}
            onMouseEnter={() => handleOnMouseIn(true)}
            onMouseLeave={() => handleOnMouseIn(false)}
          >
            <button
              type='button'
              className={`flex flex-1 items-center whitespace-nowrap rounded-lg p-1 text-[#d4d4d5] md:p-1 lg:p-2 3xl:p-3 ${
                !hasOutline ? 'cursor-not-allowed' : 'hover:bg-[#606063]'
              }`}
              onClick={() => {
                setIsShowOutline(!isShowOutline);
                if (isAsideOpen) toggleAside();
              }}
              disabled={!hasOutline}
            >
              {hasOutline ? `${isShowOutline ? 'Ẩn' : 'Hiện'} mục lục` : 'Không có mục lục'}
            </button>
            <button
              type='button'
              onClick={onZoomOut}
              className='rounded-lg p-1 hover:bg-[#606063] md:p-1 lg:p-2 3xl:p-3'
              disabled={zoom < 0.4}
            >
              <Icon.ZoomOutIcon
                fill='#c3c3c5'
                className='h-5 w-5 md:h-4 md:w-4 lg:h-5 lg:w-5 2xl:h-6 2xl:w-6'
              />
            </button>
            <span className='flex flex-1 items-center justify-center rounded-lg bg-[#4a4a4f] p-1 text-[#f9f9fa] md:p-1 lg:p-2 3xl:p-3'>{`${Math.floor(
              zoom * 100
            )}%`}</span>
            <button
              type='button'
              onClick={onZoomIn}
              className='rounded-lg p-1 hover:bg-[#606063] md:p-1 lg:p-2 3xl:p-3'
              disabled={zoom > 2}
            >
              <Icon.ZoomInIcon
                fill='#c3c3c5'
                className='h-5 w-5 md:h-4 md:w-4 lg:h-5 lg:w-5 2xl:h-6 2xl:w-6'
              />
            </button>
          </div>
          <div className='flex w-full flex-col items-center gap-y-1 lg:gap-y-2 2xl:gap-y-3'>
            {Array.from(new Array(numPages), (_el, index) => (
              <Page
                canvasRef={(el) => {
                  if (el) {
                    pageRefs.current[index + 1] = el;
                  }
                }}
                width={width * 0.8}
                className={pageClassName}
                loading={<Skeleton baseColor='#9DCCFF' borderRadius={0} height='100vh' />}
                key={`page_${index + 1}`}
                pageNumber={index + 1}
                renderAnnotationLayer={false}
                renderTextLayer={false}
                renderMode='canvas'
                scale={zoom}
              />
            ))}
          </div>
        </Document>
      )}
    </div>
  );
};

export default PDF;
