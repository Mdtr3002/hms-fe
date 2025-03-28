declare module '*.png';
declare module '*.jpg';
declare module '*.webp';
declare module '*.svg' {
  export const ReactComponent: React.FC<React.SVGProps<SVGSVGElement>>;
}

declare module 'react-loading-skeleton/dist/skeleton.css';
declare module 'pdfjs-dist/build/pdf.worker.entry';
