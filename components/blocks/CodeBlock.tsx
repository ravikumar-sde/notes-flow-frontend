'use client';

import { CodeBlock as CodeBlockType } from '@/types/blocks';
import { useState, useRef, useMemo } from 'react';
import Prism from 'prismjs';
import '@/app/prism-custom.css';

// Import base languages first (dependencies)
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-markup'; // HTML (required for markup-templating)
import 'prismjs/components/prism-css';
import 'prismjs/components/prism-javascript';

// Import languages that depend on base languages
import 'prismjs/components/prism-typescript';
import 'prismjs/components/prism-python';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-csharp';
import 'prismjs/components/prism-go';
import 'prismjs/components/prism-rust';
import 'prismjs/components/prism-markup-templating'; // Required for PHP
import 'prismjs/components/prism-php';
import 'prismjs/components/prism-ruby';
import 'prismjs/components/prism-swift';
import 'prismjs/components/prism-kotlin';
import 'prismjs/components/prism-sql';
import 'prismjs/components/prism-bash';
import 'prismjs/components/prism-json';
import 'prismjs/components/prism-yaml';
import 'prismjs/components/prism-markdown';

interface CodeBlockProps {
  block: CodeBlockType;
  onUpdate: (data: Partial<CodeBlockType>) => void;
  onDelete: () => void;
  onFocus: () => void;
  onAddBlock?: () => void;
}

const LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Bash' },
  { value: 'json', label: 'JSON' },
  { value: 'yaml', label: 'YAML' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'plaintext', label: 'Plain Text' },
];

const LANGUAGE_MAP: Record<string, string> = {
  javascript: 'javascript',
  typescript: 'typescript',
  python: 'python',
  java: 'java',
  cpp: 'cpp',
  csharp: 'csharp',
  go: 'go',
  rust: 'rust',
  php: 'php',
  ruby: 'ruby',
  swift: 'swift',
  kotlin: 'kotlin',
  html: 'markup',
  css: 'css',
  sql: 'sql',
  bash: 'bash',
  json: 'json',
  yaml: 'yaml',
  markdown: 'markdown',
  plaintext: 'plaintext',
};

export default function CodeBlock({
  block,
  onUpdate,
  onDelete,
  onAddBlock,
  onFocus,
}: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const highlightRef = useRef<HTMLPreElement>(null);
  const lineNumbersRef = useRef<HTMLDivElement>(null);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(block.code || '');
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleScroll = () => {
    const textarea = textareaRef.current;
    const pre = highlightRef.current;
    const lineNumbers = lineNumbersRef.current;

    if (pre && textarea) {
      pre.scrollTop = textarea.scrollTop;
      pre.scrollLeft = textarea.scrollLeft;
    }

    if (lineNumbers && textarea) {
      lineNumbers.scrollTop = textarea.scrollTop;
    }
  };

  const highlightedCode = useMemo(() => {
    const language = LANGUAGE_MAP[block.language] || 'plaintext';
    const grammar = Prism.languages[language];

    if (!grammar) {
      return Prism.util.encode(block.code || '');
    }

    return Prism.highlight(block.code || '', grammar, language);
  }, [block.code, block.language]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle Tab key for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;

      const updatedCode =
        block.code.slice(0, start) + '  ' + block.code.slice(end);

      onUpdate({ code: updatedCode });

      requestAnimationFrame(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      });
      return;
    }

    // Handle Enter key - create new block if at the end of code
    if (e.key === 'Enter' && onAddBlock) {
      const target = e.currentTarget;
      const cursorPosition = target.selectionStart;
      const codeLength = (block.code || '').length;

      // If cursor is at the very end and the last character is a newline, create new block
      if (cursorPosition === codeLength && block.code.endsWith('\n')) {
        e.preventDefault();
        // Remove the trailing newline
        onUpdate({ code: block.code.slice(0, -1) });
        // Create new paragraph block below
        onAddBlock();
      }
    }
  };

  return (
    <div className="group relative my-1" onClick={onFocus}>
      {/* Header */}
      <div className="flex items-center justify-between bg-[#191919] border border-[#2f2f2f] border-b-0 rounded-t-md px-3 py-1.5">
        <select
          value={block.language}
          onChange={(e) => onUpdate({ language: e.target.value })}
          className="bg-transparent text-[#9b9b9b] text-[13px] border-none outline-none cursor-pointer"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.value} value={lang.value} className="bg-[#191919]">
              {lang.label}
            </option>
          ))}
        </select>

        <button
          onClick={handleCopy}
          className={`px-2 py-0.5 text-xs text-[#9b9b9b] hover:text-[#e3e3e3] ${isCopied ? 'bg-green-400 rounded-md text-white font-bold outline-none border-none' : ''}`}
        >
          {isCopied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {/* Editor */}
      <div className="relative bg-[#191919] border border-[#2f2f2f] border-t-0 rounded-b-md overflow-hidden">
        <div className="relative max-h-[90vh] overflow-auto">
          {/* Highlight Layer */}
          <pre
            ref={highlightRef}
            aria-hidden="true"
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              margin: 0,
              padding: '0.75rem 0.75rem 0.75rem 3rem',
              backgroundColor: 'transparent',
              color: '#e3e3e3',
              pointerEvents: 'none',
              whiteSpace: 'pre',
              overflow: 'auto',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              lineHeight: '1.6',
              border: 'none',
            }}
          >
            <code
              className={`language-${LANGUAGE_MAP[block.language] || 'plaintext'}`}
              dangerouslySetInnerHTML={{ __html: highlightedCode }}
              style={{
                fontFamily: 'inherit',
                fontSize: 'inherit',
                lineHeight: 'inherit',
              }}
            />
          </pre>

          {/* Textarea */}
          <textarea
            ref={textareaRef}
            value={block.code}
            onChange={(e) => onUpdate({ code: e.target.value })}
            onKeyDown={handleKeyDown}
            onScroll={handleScroll}
            placeholder="// Write your code here..."
            spellCheck={false}
            className="relative w-full resize-none min-h-[400px]
                       bg-transparent text-transparent caret-white
                       outline-none placeholder-[#5a5a5a] overflow-auto border-none"
            style={{
              tabSize: 2,
              padding: '0.75rem 0.75rem 0.75rem 3rem',
              fontFamily: 'monospace',
              fontSize: '0.875rem',
              lineHeight: '1.6',
              WebkitTextFillColor: 'transparent',
            }}
          />

          {/* Line Numbers */}
          <div
            ref={lineNumbersRef}
            className="absolute left-0 top-0 bottom-0 pointer-events-none text-right overflow-hidden
                        text-[#5a5a5a] bg-[#151515] border-r border-[#2f2f2f]"
            style={{
              width: '2.5rem',
              paddingTop: '0.75rem',
              paddingRight: '0.5rem',
              fontFamily: 'monospace',
              fontSize: '0.75rem',
              lineHeight: '1.6',
            }}
          >
            {block.code.split('\n').map((_, i) => (
              <div key={i}>{i + 1}</div>
            ))}
          </div>
        </div>
      </div>

      {/* Delete */}
      <div className="absolute top-0.5 right-15 opacity-0 group-hover:opacity-100">
        <button
          onClick={onDelete}
          className="px-2 py-0.5 text-xs text-[#9b9b9b] hover:text-red-600"
        >
          Delete
        </button>
      </div>
    </div>
  );
}
