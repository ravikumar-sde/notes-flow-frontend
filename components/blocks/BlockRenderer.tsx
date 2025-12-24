'use client';

import { Block, BlockType } from '@/types/blocks';
import ParagraphBlock from './ParagraphBlock';
import HeadingBlock from './HeadingBlock';
import ImageBlock from './ImageBlock';
import TableBlock from './TableBlock';
import EmbedBlock from './EmbedBlock';
import CodeBlock from './CodeBlock';

interface BlockRendererProps {
  block: Block;
  onUpdate: (blockId: string, data: any) => void;
  onDelete: (blockId: string) => void;
  onFocus: (blockId: string) => void;
  onAddBlock?: (afterBlockId: string) => void;
  onConvertBlockType?: (blockId: string, newType: BlockType) => void;
}

export default function BlockRenderer({ block, onUpdate, onDelete, onFocus, onAddBlock, onConvertBlockType }: BlockRendererProps) {
  const handleUpdate = (data: any) => {
    onUpdate(block.id, data);
  };

  const handleDelete = () => {
    onDelete(block.id);
  };

  const handleFocus = () => {
    onFocus(block.id);
  };

  const handleAddBlock = () => {
    if (onAddBlock) {
      onAddBlock(block.id);
    }
  };

  const handleConvertToType = (type: BlockType) => {
    if (onConvertBlockType) {
      onConvertBlockType(block.id, type);
    }
  };

  switch (block.type) {
    case 'paragraph':
      return (
        <ParagraphBlock
          block={block}
          onUpdate={(content) => handleUpdate({ content })}
          onDelete={handleDelete}
          onFocus={handleFocus}
          onConvertToType={handleConvertToType}
        />
      );

    case 'heading1':
    case 'heading2':
    case 'heading3':
      return (
        <HeadingBlock
          block={block}
          onUpdate={(content) => handleUpdate({ content })}
          onDelete={handleDelete}
          onFocus={handleFocus}
        />
      );

    case 'image':
      return (
        <ImageBlock
          block={block}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onFocus={handleFocus}
        />
      );

    case 'table':
      return (
        <TableBlock
          block={block}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onFocus={handleFocus}
        />
      );

    case 'embed':
      return (
        <EmbedBlock
          block={block}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onFocus={handleFocus}
        />
      );

    case 'code':
      return (
        <CodeBlock
          block={block}
          onUpdate={handleUpdate}
          onDelete={handleDelete}
          onFocus={handleFocus}
          onAddBlock={handleAddBlock}
        />
      );

    default:
      return null;
  }
}

