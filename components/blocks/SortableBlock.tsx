'use client';

import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Block, BlockType } from '@/types/blocks';
import BlockRenderer from './BlockRenderer';

interface SortableBlockProps {
  block: Block;
  onUpdate: (blockId: string, data: Partial<Block>) => void;
  onDelete: (blockId: string) => void;
  onFocus: (blockId: string) => void;
  onAddBlock?: (afterBlockId: string) => void;
  onConvertBlockType?: (blockId: string, newType: BlockType) => void;
  disabled?: boolean;
}

export default function SortableBlock({
  block,
  onUpdate,
  onDelete,
  onFocus,
  onAddBlock,
  onConvertBlockType,
  disabled = false,
}: SortableBlockProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} className="relative group py-0.5">
      {/* Drag handle */}
      {!disabled && (
        <div
          {...attributes}
          {...listeners}
          className="absolute -left-8 top-1 opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing"
        >
          <button className="w-5 h-5 flex items-center justify-center text-[#5a5a5a] hover:text-[#9b9b9b] rounded transition-colors text-sm">
            ⋮⋮
          </button>
        </div>
      )}

      {/* Block content */}
      <BlockRenderer
        block={block}
        onUpdate={onUpdate}
        onDelete={onDelete}
        onFocus={onFocus}
        onConvertBlockType={onConvertBlockType}
      />

      {/* Add block button */}
      {!disabled && onAddBlock && (
        <div className="absolute -left-8 top-8 opacity-0 group-hover:opacity-100 transition-opacity">
          <button
            onClick={() => onAddBlock(block.id)}
            className="w-5 h-5 flex items-center justify-center text-[#5a5a5a] hover:text-[#9b9b9b] rounded transition-colors text-base"
            title="Add block below"
          >
            +
          </button>
        </div>
      )}
    </div>
  );
}

