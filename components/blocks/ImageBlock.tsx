'use client';

import { ImageBlock as ImageBlockType } from '@/types/blocks';
import { useState } from 'react';
import Image from 'next/image';

interface ImageBlockProps {
  block: ImageBlockType;
  onUpdate: (data: Partial<ImageBlockType>) => void;
  onDelete: () => void;
  onFocus: () => void;
}

export default function ImageBlock({ block, onUpdate, onDelete, onFocus }: ImageBlockProps) {
  const [isEditing, setIsEditing] = useState(!block.url);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (block.url) {
      setIsEditing(false);
    }
  };

  if (isEditing || !block.url) {
    return (
      <div className="group relative p-4 border-2 border-dashed border-[#2a2a2a] rounded-lg hover:border-[#3a3a3a] transition-colors">
        <form onSubmit={handleUrlSubmit} className="space-y-2">
          <input
            type="url"
            value={block.url}
            onChange={(e) => onUpdate({ url: e.target.value })}
            onFocus={onFocus}
            placeholder="Paste image URL..."
            className="w-full px-3 py-2 bg-[#1f1f1f] border border-[#2a2a2a] text-[#e5e5e5] placeholder-[#6b6b6b] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <input
            type="text"
            value={block.alt}
            onChange={(e) => onUpdate({ alt: e.target.value })}
            placeholder="Alt text (optional)"
            className="w-full px-3 py-2 bg-[#1f1f1f] border border-[#2a2a2a] text-[#e5e5e5] placeholder-[#6b6b6b] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Image
            </button>
            <button
              type="button"
              onClick={onDelete}
              className="px-4 py-2 bg-[#252525] text-[#e5e5e5] rounded-md hover:bg-[#2f2f2f] transition-colors"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="group relative" onClick={onFocus}>
      <div className="relative w-full max-w-3xl">
        <img
          src={block.url}
          alt={block.alt || 'Image'}
          className="w-full h-auto rounded-lg shadow-md"
        />
        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 bg-[#252525] text-[#e5e5e5] rounded-md shadow-md hover:bg-[#2f2f2f] transition-colors text-sm"
          >
            Edit
          </button>
        </div>
      </div>
      {block.caption && (
        <p className="text-sm text-[#9b9b9b] mt-2 text-center italic">{block.caption}</p>
      )}
      <input
        type="text"
        value={block.caption || ''}
        onChange={(e) => onUpdate({ caption: e.target.value })}
        placeholder="Add a caption..."
        className="w-full mt-2 px-2 py-1 text-sm text-center border-none outline-none focus:ring-0 bg-transparent text-[#9b9b9b] placeholder-[#6b6b6b] italic hover:bg-[#252525] focus:bg-[#252525] rounded transition-colors"
      />
    </div>
  );
}

