import { Block, BlockType, ParagraphBlock, Heading1Block, Heading2Block, Heading3Block, BulletListBlock, NumberedListBlock, ImageBlock, TableBlock, EmbedBlock, CodeBlock } from '@/types/blocks';

// Generate unique ID for blocks
export function generateBlockId(): string {
  return `block_${Date.now()}_${Math.random().toString(36).substring(2, 11)}`;
}

// Create a new block of specified type
export function createBlock(type: BlockType): Block {
  const baseBlock = {
    id: generateBlockId(),
    createdAt: new Date(),
    updatedAt: new Date(),
  };

  switch (type) {
    case 'paragraph':
      return {
        ...baseBlock,
        type: 'paragraph',
        content: '',
      } as ParagraphBlock;

    case 'heading1':
      return {
        ...baseBlock,
        type: 'heading1',
        content: '',
      } as Heading1Block;

    case 'heading2':
      return {
        ...baseBlock,
        type: 'heading2',
        content: '',
      } as Heading2Block;

    case 'heading3':
      return {
        ...baseBlock,
        type: 'heading3',
        content: '',
      } as Heading3Block;

    case 'bulletList':
      return {
        ...baseBlock,
        type: 'bulletList',
        content: '',
      } as BulletListBlock;

    case 'numberedList':
      return {
        ...baseBlock,
        type: 'numberedList',
        content: '',
      } as NumberedListBlock;

    case 'image':
      return {
        ...baseBlock,
        type: 'image',
        url: '',
        alt: '',
      } as ImageBlock;

    case 'table':
      return {
        ...baseBlock,
        type: 'table',
        rows: [
          { cells: [{ content: '' }, { content: '' }] },
          { cells: [{ content: '' }, { content: '' }] },
        ],
        hasHeader: true,
      } as TableBlock;

    case 'embed':
      return {
        ...baseBlock,
        type: 'embed',
        url: '',
        embedType: 'generic',
      } as EmbedBlock;

    case 'code':
      return {
        ...baseBlock,
        type: 'code',
        code: '',
        language: 'javascript',
      } as CodeBlock;

    default:
      return {
        ...baseBlock,
        type: 'paragraph',
        content: '',
      } as ParagraphBlock;
  }
}

// Update block content
export function updateBlockContent<T extends Block>(block: T, content: Partial<T>): T {
  return {
    ...block,
    ...content,
    updatedAt: new Date(),
  };
}

// Insert block at position
export function insertBlockAt(blocks: Block[], index: number, block: Block): Block[] {
  const newBlocks = [...blocks];
  newBlocks.splice(index, 0, block);
  return newBlocks;
}

// Remove block by ID
export function removeBlock(blocks: Block[], blockId: string): Block[] {
  return blocks.filter(block => block.id !== blockId);
}

// Move block from one position to another
export function moveBlock(blocks: Block[], fromIndex: number, toIndex: number): Block[] {
  const newBlocks = [...blocks];
  const [movedBlock] = newBlocks.splice(fromIndex, 1);
  newBlocks.splice(toIndex, 0, movedBlock);
  return newBlocks;
}

// Find block index by ID
export function findBlockIndex(blocks: Block[], blockId: string): number {
  return blocks.findIndex(block => block.id === blockId);
}

// Detect embed type from URL
export function detectEmbedType(url: string): 'youtube' | 'vimeo' | 'generic' {
  if (url.includes('youtube.com') || url.includes('youtu.be')) {
    return 'youtube';
  }
  if (url.includes('vimeo.com')) {
    return 'vimeo';
  }
  return 'generic';
}

