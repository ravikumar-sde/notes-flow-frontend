'use client';

import { useRef, useEffect } from 'react';
import { Heading1Block, Heading2Block, Heading3Block } from '@/types/blocks';

type HeadingBlockType = Heading1Block | Heading2Block | Heading3Block;

interface HeadingBlockProps {
  block: HeadingBlockType;
  onUpdate: (content: string) => void;
  onDelete: () => void;
  onFocus: () => void;
}

export default function HeadingBlock({ block, onUpdate, onDelete, onFocus }: HeadingBlockProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    adjustHeight();
  }, [block.content]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Backspace' && block.content === '') {
      e.preventDefault();
      onDelete();
    }
  };

  const getHeadingStyles = () => {
    switch (block.type) {
      case 'heading1':
        return 'text-[2.5em] font-bold leading-[1.2] tracking-tight';
      case 'heading2':
        return 'text-[1.875em] font-bold leading-[1.3] tracking-tight';
      case 'heading3':
        return 'text-[1.5em] font-semibold leading-[1.3] tracking-tight';
      default:
        return 'text-[1.5em] font-semibold leading-[1.3] tracking-tight';
    }
  };

  const getPlaceholder = () => {
    switch (block.type) {
      case 'heading1':
        return 'Heading 1';
      case 'heading2':
        return 'Heading 2';
      case 'heading3':
        return 'Heading 3';
      default:
        return 'Heading';
    }
  };

  return (
    <div className="group relative">
      <textarea
        ref={textareaRef}
        value={block.content}
        onChange={(e) => onUpdate(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        onInput={adjustHeight}
        placeholder={getPlaceholder()}
        rows={1}
        className={`w-full resize-none overflow-hidden text-wrap border-none outline-none focus:ring-0 py-1 px-0 bg-transparent text-[#e3e3e3] placeholder-[#5a5a5a] transition-colors ${getHeadingStyles()}`}
      />
    </div>
  );
}

