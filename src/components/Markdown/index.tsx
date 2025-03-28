import 'katex/dist/katex.min.css'; // `rehype-katex` does not import the CSS for you
import './index.css';

import { useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import { ReactMarkdownOptions } from 'react-markdown/lib/react-markdown';
import rehypeKatex from 'rehype-katex';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';

const Markdown = ({ children, className, ...rest }: ReactMarkdownOptions) => {
  const remarkPlugins = useMemo(() => [remarkGfm, remarkMath], []);
  const rehypePlugins = useMemo(() => [rehypeKatex], []);

  return (
    <ReactMarkdown
      {...rest}
      className={`markdown ${className}`}
      remarkPlugins={remarkPlugins}
      rehypePlugins={rehypePlugins}
    >
      {children}
    </ReactMarkdown>
  );
};

export default Markdown;
