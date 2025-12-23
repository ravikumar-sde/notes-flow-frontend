'use client';

import { BlockType } from '@/types/blocks';
import { useEffect, useMemo, useRef, useState } from 'react';

interface BlockTypeOption {
  type: BlockType;
  label: string;
  description: string;
  icon: string;
  keywords: string[];
}

const BLOCK_TYPES: BlockTypeOption[] = [
  {
    type: 'paragraph',
    label: 'Paragraph',
    description: 'Plain text block',
    icon: '📝',
    keywords: ['text', 'paragraph', 'p'],
  },
  {
    type: 'heading1',
    label: 'Heading 1',
    description: 'Large section heading',
    icon: 'H1',
    keywords: ['heading', 'h1', 'title'],
  },
  {
    type: 'heading2',
    label: 'Heading 2',
    description: 'Medium section heading',
    icon: 'H2',
    keywords: ['heading', 'h2', 'subtitle'],
  },
  {
    type: 'heading3',
    label: 'Heading 3',
    description: 'Small section heading',
    icon: 'H3',
    keywords: ['heading', 'h3'],
  },
  {
    type: 'image',
    label: 'Image',
    description: 'Upload or embed an image',
    icon: '🖼️',
    keywords: ['image', 'img', 'picture', 'photo'],
  },
  {
    type: 'table',
    label: 'Table',
    description: 'Create a table',
    icon: '📊',
    keywords: ['table', 'grid', 'spreadsheet'],
  },
  {
    type: 'embed',
    label: 'Embed',
    description: 'Embed external content',
    icon: '🔗',
    keywords: ['embed', 'link', 'iframe', 'video'],
  },
  {
    type: 'code',
    label: 'Code',
    description: 'Code block with syntax highlighting',
    icon: '</>',
    keywords: ['code', 'programming', 'snippet'],
  },
];

interface SlashCommandMenuProps {
  onSelect: (type: BlockType) => void;
  onClose: () => void;
  position: { top: number; left: number };
  searchQuery?: string;
}

export default function SlashCommandMenu({ onSelect, onClose, position, searchQuery = '' }: SlashCommandMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

  // Filter block types based on search query
  const filteredTypes = useMemo(() => {
    return BLOCK_TYPES.filter(blockType => {
      const query = searchQuery.toLowerCase();
      return (
        blockType.label.toLowerCase().includes(query) ||
        blockType.description.toLowerCase().includes(query) ||
        blockType.keywords.some(keyword => keyword.includes(query))
      );
    });
  }, [searchQuery]);

  // Store both the selected index and the query it's associated with
  // This allows us to reset the index when the query changes without using useEffect
  const [selection, setSelection] = useState({ index: 0, query: searchQuery });

  // Derive the actual selected index - reset to 0 if query changed
  const selectedIndex = selection.query === searchQuery ? selection.index : 0;

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelection(prev => ({
          index: (prev.index + 1) % filteredTypes.length,
          query: searchQuery
        }));
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelection(prev => ({
          index: (prev.index - 1 + filteredTypes.length) % filteredTypes.length,
          query: searchQuery
        }));
      } else if (e.key === 'Enter') {
        e.preventDefault();
        if (filteredTypes[selectedIndex]) {
          onSelect(filteredTypes[selectedIndex].type);
        }
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedIndex, filteredTypes, onSelect, onClose, searchQuery]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        onClose();
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  if (filteredTypes.length === 0) {
    return null;
  }

  return (
    <div
      ref={menuRef}
      className="fixed z-50 w-72 bg-[#191919] border border-[#2f2f2f] rounded-lg shadow-xl overflow-hidden animate-fade-in"
      style={{
        top: `${position.top}px`,
        left: `${position.left}px`,
      }}
    >
      <div className="py-1.5 px-2 border-b border-[#2f2f2f]">
        <div className="text-[11px] font-medium text-[#9b9b9b] px-2 py-1">
          BASIC BLOCKS
        </div>
      </div>
      <div className="max-h-80 overflow-y-auto py-1">
        {filteredTypes.map((blockType, index) => (
          <button
            key={blockType.type}
            onClick={() => onSelect(blockType.type)}
            onMouseEnter={() => setSelection({ index, query: searchQuery })}
            className={`w-full flex items-center gap-2.5 px-2 py-1.5 text-left transition-colors ${
              index === selectedIndex
                ? 'bg-[#2f2f2f]'
                : 'hover:bg-[#232323]'
            }`}
          >
            <span className="text-base shrink-0 w-6 h-6 flex items-center justify-center opacity-70">
              {blockType.icon}
            </span>
            <div className="flex-1 min-w-0">
              <div className="text-[13px] font-normal text-[#e3e3e3]">{blockType.label}</div>
              <div className="text-[11px] text-[#9b9b9b] leading-tight">
                {blockType.description}
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

