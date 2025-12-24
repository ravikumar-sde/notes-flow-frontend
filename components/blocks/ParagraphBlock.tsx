'use client';

import { ParagraphBlock as ParagraphBlockType, BlockType } from '@/types/blocks';
import { useState, useRef } from 'react';
import SlashCommandMenu from './SlashCommandMenu';

interface ParagraphBlockProps {
  block: ParagraphBlockType;
  onUpdate: (content: string) => void;
  onDelete: () => void;
  onFocus: () => void;
  onConvertToType?: (type: BlockType) => void;
}

export default function ParagraphBlock({ block, onUpdate, onDelete, onFocus, onConvertToType }: ParagraphBlockProps) {
  const [showSlashMenu, setShowSlashMenu] = useState(false);
  const [slashMenuPosition, setSlashMenuPosition] = useState({ top: 0, left: 0 });
  const [searchQuery, setSearchQuery] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    // Delete block if empty and backspace is pressed
    if (e.key === 'Backspace' && block.content === '') {
      e.preventDefault();
      onDelete();
      return;
    }

    // Close slash menu on escape
    if (e.key === 'Escape' && showSlashMenu) {
      e.preventDefault();
      setShowSlashMenu(false);
      setSearchQuery('');
      return;
    }
  };

  const handleChange = (value: string) => {
    onUpdate(value);

    // Check if user typed '/' at the start or after a space
    const cursorPosition = textareaRef.current?.selectionStart || 0;
    const textBeforeCursor = value.substring(0, cursorPosition);
    const lastSlashIndex = textBeforeCursor.lastIndexOf('/');

    if (lastSlashIndex !== -1) {
      const textAfterSlash = textBeforeCursor.substring(lastSlashIndex + 1);
      const textBeforeSlash = textBeforeCursor.substring(0, lastSlashIndex);

      // Show menu if '/' is at start or after a space/newline
      if (lastSlashIndex === 0 || /[\s\n]$/.test(textBeforeSlash)) {
        setSearchQuery(textAfterSlash);
        setShowSlashMenu(true);

        // Calculate menu position
        if (textareaRef.current) {
          const rect = textareaRef.current.getBoundingClientRect();
          setSlashMenuPosition({
            top: rect.bottom + window.scrollY + 4,
            left: rect.left + window.scrollX,
          });
        }
      } else {
        setShowSlashMenu(false);
      }
    } else {
      setShowSlashMenu(false);
    }
  };

  const handleSelectBlockType = (type: BlockType) => {
    // Remove the slash command from content
    const cursorPosition = textareaRef.current?.selectionStart || 0;
    const textBeforeCursor = block.content.substring(0, cursorPosition);
    const lastSlashIndex = textBeforeCursor.lastIndexOf('/');

    if (lastSlashIndex !== -1) {
      const newContent =
        block.content.substring(0, lastSlashIndex) +
        block.content.substring(cursorPosition);
      onUpdate(newContent);
    }

    setShowSlashMenu(false);
    setSearchQuery('');

    // Convert block type if handler is provided
    if (onConvertToType) {
      onConvertToType(type);
    }
  };

  return (
    <>
      <div className="group relative">
        <textarea
          ref={textareaRef}
          value={block.content}
          onChange={(e) => handleChange(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={onFocus}
          placeholder="Type '/' for commands or start writing..."
          className="w-full resize-none border-none outline-none focus:ring-0 text-md leading-[1.6] py-1 px-0 bg-transparent text-[#e3e3e3] placeholder-[#5a5a5a] transition-colors"
          rows={1}
          style={{
            minHeight: '1.6em',
            height: 'auto',
          }}
          onInput={(e) => {
            const target = e.target as HTMLTextAreaElement;
            target.style.height = 'auto';
            target.style.height = target.scrollHeight + 'px';
          }}
        />
      </div>

      {showSlashMenu && (
        <SlashCommandMenu
          onSelect={handleSelectBlockType}
          onClose={() => {
            setShowSlashMenu(false);
            setSearchQuery('');
          }}
          position={slashMenuPosition}
          searchQuery={searchQuery}
        />
      )}
    </>
  );
}

