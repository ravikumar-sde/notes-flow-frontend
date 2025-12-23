'use client';

import { CodeBlock as CodeBlockType } from '@/types/blocks';
import { useState } from 'react';

interface CodeBlockProps {
  block: CodeBlockType;
  onUpdate: (data: Partial<CodeBlockType>) => void;
  onDelete: () => void;
  onFocus: () => void;
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

export default function CodeBlock({ block, onUpdate, onDelete, onFocus }: CodeBlockProps) {
  const [isCopied, setIsCopied] = useState(false);

  const handleCopy = async () => {
    await navigator.clipboard.writeText(block.code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Handle Tab key for indentation
    if (e.key === 'Tab') {
      e.preventDefault();
      const target = e.currentTarget;
      const start = target.selectionStart;
      const end = target.selectionEnd;
      const newCode = block.code.substring(0, start) + '  ' + block.code.substring(end);
      onUpdate({ code: newCode });
      
      // Set cursor position after the inserted spaces
      setTimeout(() => {
        target.selectionStart = target.selectionEnd = start + 2;
      }, 0);
    }
  };

  return (
    <div className="group relative my-1" onClick={onFocus}>
      {/* Header with language selector and copy button */}
      <div className="flex items-center justify-between bg-[#191919] border border-[#2f2f2f] border-b-0 rounded-t-md px-3 py-1.5">
        <select
          value={block.language}
          onChange={(e) => onUpdate({ language: e.target.value })}
          className="bg-transparent text-[#9b9b9b] text-[13px] border-none outline-none focus:ring-0 cursor-pointer"
        >
          {LANGUAGES.map((lang) => (
            <option key={lang.value} value={lang.value} className="bg-[#191919]">
              {lang.label}
            </option>
          ))}
        </select>

        <button
          onClick={handleCopy}
          className="px-2 py-0.5 text-[12px] text-[#9b9b9b] hover:text-[#e3e3e3] transition-colors"
        >
          {isCopied ? '✓ Copied' : 'Copy'}
        </button>
      </div>

      {/* Code editor */}
      <div className="relative">
        <textarea
          value={block.code}
          onChange={(e) => onUpdate({ code: e.target.value })}
          onKeyDown={handleKeyDown}
          placeholder="// Write your code here..."
          className="w-full min-h-[200px] p-3 bg-[#191919] text-[#e3e3e3] border border-[#2f2f2f] rounded-b-md font-mono text-[13px] leading-[1.6] outline-none resize-y placeholder-[#5a5a5a]"
          spellCheck={false}
          style={{
            tabSize: 2,
          }}
        />

        {/* Line numbers overlay */}
        <div className="absolute left-0 top-0 bottom-0 w-10 bg-[#151515] border-r border-[#2f2f2f] rounded-bl-md pointer-events-none flex flex-col items-end pr-2 pt-3 text-[#5a5a5a] text-[11px] font-mono leading-[1.6]">
          {block.code.split('\n').map((_, index) => (
            <div key={index} className="h-[1.6em]">
              {index + 1}
            </div>
          ))}
        </div>

        {/* Adjust padding for line numbers */}
        <style jsx>{`
          textarea {
            padding-left: 3rem;
          }
        `}</style>
      </div>

      {/* Delete button (appears on hover) */}
      <div className="absolute top-1.5 right-12 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={onDelete}
          className="px-2 py-0.5 text-[11px] text-[#9b9b9b] hover:text-red-400 transition-colors"
        >
          Delete
        </button>
      </div>
    </div>
  );
}

