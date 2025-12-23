'use client';

import { EmbedBlock as EmbedBlockType } from '@/types/blocks';
import { useState } from 'react';
import { detectEmbedType } from '@/lib/blockUtils';

interface EmbedBlockProps {
  block: EmbedBlockType;
  onUpdate: (data: Partial<EmbedBlockType>) => void;
  onDelete: () => void;
  onFocus: () => void;
}

export default function EmbedBlock({ block, onUpdate, onDelete, onFocus }: EmbedBlockProps) {
  const [isEditing, setIsEditing] = useState(!block.url);

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (block.url) {
      const embedType = detectEmbedType(block.url);
      onUpdate({ embedType });
      setIsEditing(false);
    }
  };

  const getEmbedUrl = () => {
    if (block.embedType === 'youtube') {
      const videoId = block.url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\s]+)/)?.[1];
      return videoId ? `https://www.youtube.com/embed/${videoId}` : block.url;
    }
    if (block.embedType === 'vimeo') {
      const videoId = block.url.match(/vimeo\.com\/(\d+)/)?.[1];
      return videoId ? `https://player.vimeo.com/video/${videoId}` : block.url;
    }
    return block.url;
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
            placeholder="Paste embed URL (YouTube, Vimeo, etc.)..."
            className="w-full px-3 py-2 bg-[#1f1f1f] border border-[#2a2a2a] text-[#e5e5e5] placeholder-[#6b6b6b] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            autoFocus
          />
          <input
            type="text"
            value={block.title || ''}
            onChange={(e) => onUpdate({ title: e.target.value })}
            placeholder="Title (optional)"
            className="w-full px-3 py-2 bg-[#1f1f1f] border border-[#2a2a2a] text-[#e5e5e5] placeholder-[#6b6b6b] rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Embed
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
      {block.title && (
        <h4 className="text-sm font-medium text-[#e5e5e5] mb-2">{block.title}</h4>
      )}
      <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
        <iframe
          src={getEmbedUrl()}
          className="absolute top-0 left-0 w-full h-full rounded-lg shadow-md"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
      <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={() => setIsEditing(true)}
          className="px-3 py-1 bg-[#252525] text-[#e5e5e5] rounded-md shadow-md hover:bg-[#2f2f2f] transition-colors text-sm"
        >
          Edit
        </button>
      </div>
    </div>
  );
}

