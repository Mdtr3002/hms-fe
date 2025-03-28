import { markdown, markdownLanguage } from '@codemirror/lang-markdown';
import { languages } from '@codemirror/language-data';
import { Extension } from '@codemirror/state';
import { EditorView, ViewUpdate } from '@codemirror/view';
import { githubLightInit } from '@uiw/codemirror-theme-github';
import CodeMirror from '@uiw/react-codemirror';
import './index.css';
import React, { memo } from 'react';

type BaseEditorProps = {
  id?: string;
  className?: string;
  value?: string;
  width?: string;
  height?: string;
  placeholder?: string;
  readOnly?: boolean;
  onChange?: (value: string, viewUpdate: ViewUpdate) => void;
  extensions?: Extension[];
};

const BaseEditor = ({
  className,
  value,
  onChange,
  extensions,
  id,
  width,
  height,
  placeholder,
  readOnly,
}: BaseEditorProps) => {
  return (
    <CodeMirror
      id={id}
      className={className}
      value={value}
      width={width ?? '100%'}
      height={height ?? '500px'}
      theme={githubLightInit({
        settings: {
          fontFamily: 'monospace',
          lineHighlight: 'none',
        },
      })}
      readOnly={readOnly}
      onChange={onChange}
      placeholder={placeholder}
      extensions={extensions}
    />
  );
};

type MarkdownEditorProps = {
  id?: string;
  width?: string;
  height?: string;
  className?: string;
  value?: string;
  placeholder?: string;
  readOnly?: boolean;
  onChange?: (value: string, viewUpdate: ViewUpdate) => void;
};

const MarkdownEditor = memo(function MarkdownEditor(props: MarkdownEditorProps) {
  return (
    <BaseEditor
      {...props}
      extensions={[
        markdown({
          base: markdownLanguage,
          codeLanguages: languages,
        }),
        EditorView.lineWrapping,
      ]}
    />
  );
});

type ExpressionEditorProps = MarkdownEditorProps;

const ExpressionEditor = memo(function ExpressionEditor(props: ExpressionEditorProps) {
  return <BaseEditor {...props} extensions={[EditorView.lineWrapping]} />;
});

export { MarkdownEditor, ExpressionEditor };
