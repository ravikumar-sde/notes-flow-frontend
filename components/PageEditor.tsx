'use client';

import { useState, useRef } from 'react';
import { Block, BlockType, Page } from '@/types/blocks';
import { createBlock, updateBlockContent, removeBlock, insertBlockAt, findBlockIndex } from '@/lib/blockUtils';
import SortableBlock from './blocks/SortableBlock';
import { useWorkspace } from '@/contexts/WorkspaceContext';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';

interface PageEditorProps {
  page: Page;
}

export default function PageEditor({ page }: PageEditorProps) {
  const { updatePageTitle, canUserEdit } = useWorkspace();
  const [title, setTitle] = useState(page.title);
  const [blocks, setBlocks] = useState<Block[]>(
    page.blocks.length > 0 ? page.blocks : [createBlock('paragraph')]
  );
  const [focusedBlockId, setFocusedBlockId] = useState<string | null>(null);
  const [currentPageId, setCurrentPageId] = useState(page.id);

  const canEdit = canUserEdit();

  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };


  // Reset state when page changes (derived state pattern)
  if (page.id !== currentPageId) {
    setCurrentPageId(page.id);
    setTitle(page.title);
    setBlocks(page.blocks.length > 0 ? page.blocks : [createBlock('paragraph')]);
  }

  const handleConvertBlockType = (blockId: string, newType: BlockType) => {
    setBlocks(prevBlocks =>
      prevBlocks.map(block => {
        if (block.id === blockId) {
          const newBlock = createBlock(newType);
          // Preserve content if converting between text-based blocks (including lists)
          if (
            (block.type === 'paragraph' || block.type.startsWith('heading') || block.type === 'bulletList' || block.type === 'numberedList') &&
            (newType === 'paragraph' || newType.startsWith('heading') || newType === 'bulletList' || newType === 'numberedList')
          ) {
            // Type guard: only text-based blocks have content property
            const content = 'content' in block ? block.content : '';
            return { ...newBlock, id: block.id, content };
          }
          return { ...newBlock, id: block.id };
        }
        return block;
      })
    );

    // Maintain focus on the converted block
    setTimeout(() => {
      const blockElement = document.querySelector(`[data-block-id="${blockId}"]`);
      if (blockElement) {
        const input = blockElement.querySelector('textarea, input') as HTMLElement;
        if (input) {
          input.focus();
        }
      }
    }, 0);
  };

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleUpdateBlock = (blockId: string, data: Partial<Block>) => {
    setBlocks(prevBlocks =>
      prevBlocks.map(block =>
        block.id === blockId ? updateBlockContent(block, data) : block
      )
    );
  };

  const handleDeleteBlock = (blockId: string) => {
    setBlocks(prevBlocks => {
      const newBlocks = removeBlock(prevBlocks, blockId);
      // Ensure at least one block exists
      return newBlocks.length > 0 ? newBlocks : [createBlock('paragraph')];
    });
  };

  const handleAddBlock = (type: BlockType, afterBlockId?: string) => {
    const newBlock = createBlock(type);

    if (afterBlockId) {
      const index = findBlockIndex(blocks, afterBlockId);
      setBlocks(insertBlockAt(blocks, index + 1, newBlock));
    } else {
      setBlocks([...blocks, newBlock]);
    }

    // Focus the newly created block
    setTimeout(() => {
      setFocusedBlockId(newBlock.id);
      // Find and focus the input element of the new block
      const newBlockElement = document.querySelector(`[data-block-id="${newBlock.id}"]`);
      if (newBlockElement) {
        const input = newBlockElement.querySelector('textarea, input') as HTMLElement;
        if (input) {
          input.focus();
        }
      }
    }, 0);
  };

  const handleFocusBlock = (blockId: string) => {
    setFocusedBlockId(blockId);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      setBlocks((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);

        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    // Add new paragraph block on Enter at the end
    if (e.key === 'Enter' && focusedBlockId) {
      const index = findBlockIndex(blocks, focusedBlockId);
      const block = blocks[index];

      // For text-based blocks, add new paragraph on Enter
      if (block.type === 'paragraph' || block.type.startsWith('heading')) {
        e.preventDefault();
        handleAddBlock('paragraph', focusedBlockId);
      }
    }
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    updatePageTitle(page.id, newTitle);
  };

  return (
    <div className="min-h-screen bg-transparent">
      <div className="max-w-[900px] mx-auto px-24 py-12">
        {/* Permission Banner */}
        {!canEdit && (
          <div className="mb-4 px-4 py-2.5 bg-[#2a2520] border border-[#3d3020] rounded-md text-[#d4a574] text-[13px] flex items-center gap-2">
            <span className="text-base">⚠️</span>
            <span>You have view-only access to this page</span>
          </div>
        )}

        {/* Page Title */}
        <div className="mb-2">
          <textarea
            // type="text"
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Untitled"
            disabled={!canEdit}
            rows={1}
            ref={textareaRef}
            onInput={adjustHeight}
            className="w-full resize-none text-[2.5em] font-bold leading-[1.2] border-none outline-none focus:ring-0 py-1 px-0 bg-transparent text-[#e3e3e3] placeholder-[#5a5a5a] disabled:cursor-not-allowed disabled:opacity-60 tracking-tight"
          />
        </div>

        {/* Blocks with Drag and Drop */}
        <DndContext
          sensors={canEdit ? sensors : []}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={blocks.map((block) => block.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-0.5" onKeyDown={canEdit ? handleKeyDown : undefined}>
              {blocks.map((block, index) => {
                // Determine what type of block to create on Enter
                let newBlockType: BlockType = 'paragraph';
                if (block.type === 'bulletList') {
                  newBlockType = 'bulletList';
                } else if (block.type === 'numberedList') {
                  newBlockType = 'numberedList';
                }

                // Calculate list index for numbered lists
                let listIndex: number | undefined;
                if (block.type === 'numberedList') {
                  // Find the start of the current numbered list sequence
                  let startIndex = index;
                  for (let i = index - 1; i >= 0; i--) {
                    if (blocks[i].type === 'numberedList') {
                      startIndex = i;
                    } else {
                      break;
                    }
                  }
                  // Calculate position in the sequence (1-based)
                  listIndex = index - startIndex + 1;
                }

                return (
                  <SortableBlock
                    key={block.id}
                    block={block}
                    onUpdate={canEdit ? handleUpdateBlock : () => { }}
                    onDelete={canEdit ? handleDeleteBlock : () => { }}
                    onFocus={handleFocusBlock}
                    onAddBlock={canEdit ? (afterBlockId) => handleAddBlock(newBlockType, afterBlockId) : undefined}
                    onConvertBlockType={canEdit ? handleConvertBlockType : undefined}
                    disabled={!canEdit}
                    listIndex={listIndex}
                  />
                );
              })}
            </div>
          </SortableContext>
        </DndContext>


      </div>
    </div>
  );
}

