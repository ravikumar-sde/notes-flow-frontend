// Block types supported in the editor
export type BlockType =
  | 'paragraph'
  | 'heading1'
  | 'heading2'
  | 'heading3'
  | 'bulletList'
  | 'numberedList'
  | 'image'
  | 'table'
  | 'embed'
  | 'code';

// Base block interface
export interface BaseBlock {
  id: string;
  type: BlockType;
  createdAt: Date;
  updatedAt: Date;
}

// Text-based blocks
export interface ParagraphBlock extends BaseBlock {
  type: 'paragraph';
  content: string;
}

export interface Heading1Block extends BaseBlock {
  type: 'heading1';
  content: string;
}

export interface Heading2Block extends BaseBlock {
  type: 'heading2';
  content: string;
}

export interface Heading3Block extends BaseBlock {
  type: 'heading3';
  content: string;
}

// List blocks
export interface BulletListBlock extends BaseBlock {
  type: 'bulletList';
  content: string;
}

export interface NumberedListBlock extends BaseBlock {
  type: 'numberedList';
  content: string;
}

// Image block
export interface ImageBlock extends BaseBlock {
  type: 'image';
  url: string;
  alt: string;
  caption?: string;
}

// Table block
export interface TableCell {
  content: string;
}

export interface TableRow {
  cells: TableCell[];
}

export interface TableBlock extends BaseBlock {
  type: 'table';
  rows: TableRow[];
  hasHeader: boolean;
}

// Embed block (for YouTube, etc.)
export interface EmbedBlock extends BaseBlock {
  type: 'embed';
  url: string;
  embedType: 'youtube' | 'vimeo' | 'generic';
  title?: string;
}

// Code block
export interface CodeBlock extends BaseBlock {
  type: 'code';
  code: string;
  language: string;
}

// Union type for all blocks
export type Block =
  | ParagraphBlock
  | Heading1Block
  | Heading2Block
  | Heading3Block
  | BulletListBlock
  | NumberedListBlock
  | ImageBlock
  | TableBlock
  | EmbedBlock
  | CodeBlock;

// Page structure
export interface Page {
  id: string;
  workspaceId: string; // Multi-tenant: page belongs to a workspace
  title: string;
  blocks: Block[];
  createdBy: string; // userId of creator
  createdAt: Date;
  updatedAt: Date;
  updatedBy?: string; // userId of last editor
  isPublic: boolean; // Whether page is publicly accessible
  icon?: string; // Page icon/emoji
}

