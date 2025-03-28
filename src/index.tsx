import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import FilePondPluginImageExifOrientation from 'filepond-plugin-image-exif-orientation';
import FilePondPluginImagePreview from 'filepond-plugin-image-preview';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { registerPlugin } from 'react-filepond';
import { pdfjs } from 'react-pdf';
import { BrowserRouter } from 'react-router-dom';

import App from './App';

import './index.css';
import 'filepond/dist/filepond.min.css';
import 'filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css';
import 'react-loading-skeleton/dist/skeleton.css';
import 'react-tooltip/dist/react-tooltip.css';

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

console.log('Worker:', pdfjs.GlobalWorkerOptions.workerSrc);

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 5,
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
    },
  },
});

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);
root.render(
  // <StrictMode>
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </QueryClientProvider>
  // </StrictMode>
);
