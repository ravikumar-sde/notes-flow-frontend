'use client';

import { NumberedListBlock as NumberedListBlockType } from '@/types/blocks';
import { useRef, useEffect } from 'react';

interface NumberedListBlockProps {
  block: NumberedListBlockType;
  onUpdate: (content: string) => void;
  onDelete: () => void;
  onFocus: () => void;
  onAddBlock?: () => void;
  onConvertToType?: (type: 'paragraph' | 'numberedList') => void;
  index?: number; // For displaying the number
}

export default function NumberedListBlock({ block, onUpdate, onDelete, onFocus, onAddBlock, onConvertToType, index = 1 }: NumberedListBlockProps) {
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
    // Convert to paragraph if empty and backspace is pressed
    if (e.key === 'Backspace' && block.content === '') {
      e.preventDefault();
      if (onConvertToType) {
        onConvertToType('paragraph');
      } else {
        onDelete();
      }
      return;
    }

    // Create new numbered list item on Enter
    if (e.key === 'Enter' && onAddBlock) {
      e.preventDefault();
      onAddBlock();
    }
  };

  return (
    <div className="group relative flex items-start gap-2">
      {/* Number */}
      <div className="shrink-0 mt-1 min-w-6 text-[#9b9b9b] text-[15px] leading-[1.6]">
        {index}.
      </div>
      
      {/* Content */}
      <textarea
        ref={textareaRef}
        value={block.content}
        onChange={(e) => onUpdate(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={onFocus}
        onInput={adjustHeight}
        placeholder="List item"
        rows={1}
        className="flex-1 resize-none overflow-hidden text-wrap border-none outline-none focus:ring-0 py-1 px-0 bg-transparent text-[#e3e3e3] placeholder-[#5a5a5a] transition-colors text-md leading-[1.6]"
      />
    </div>
  );
}

