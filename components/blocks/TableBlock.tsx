'use client';

import { TableBlock as TableBlockType } from '@/types/blocks';

interface TableBlockProps {
  block: TableBlockType;
  onUpdate: (data: Partial<TableBlockType>) => void;
  // onDelete: () => void;
  onFocus: () => void;
}

export default function TableBlock({ block, onUpdate, onFocus }: TableBlockProps) {
  const updateCell = (rowIndex: number, cellIndex: number, content: string) => {
    const newRows = [...block.rows];
    newRows[rowIndex].cells[cellIndex].content = content;
    onUpdate({ rows: newRows });
  };

  const addRow = () => {
    const columnCount = block.rows[0]?.cells.length || 2;
    const newRow = {
      cells: Array(columnCount).fill(null).map(() => ({ content: '' })),
    };
    onUpdate({ rows: [...block.rows, newRow] });
  };

  const addColumn = () => {
    const newRows = block.rows.map(row => ({
      cells: [...row.cells, { content: '' }],
    }));
    onUpdate({ rows: newRows });
  };

  const deleteRow = (rowIndex: number) => {
    if (block.rows.length > 1) {
      const newRows = block.rows.filter((_, index) => index !== rowIndex);
      onUpdate({ rows: newRows });
    }
  };

  const deleteColumn = (cellIndex: number) => {
    if (block.rows[0]?.cells.length > 1) {
      const newRows = block.rows.map(row => ({
        cells: row.cells.filter((_, index) => index !== cellIndex),
      }));
      onUpdate({ rows: newRows });
    }
  };

  return (
    <div className="group relative" onClick={onFocus}>
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-[#2a2a2a]">
          <tbody>
            {block.rows.map((row, rowIndex) => (
              <tr key={rowIndex} className={block.hasHeader && rowIndex === 0 ? 'bg-[#252525]' : ''}>
                {row.cells.map((cell, cellIndex) => (
                  <td key={cellIndex} className="border border-[#2a2a2a] p-0">
                    <input
                      type="text"
                      value={cell.content}
                      onChange={(e) => updateCell(rowIndex, cellIndex, e.target.value)}
                      className={`w-full px-3 py-2 border-none outline-none bg-transparent text-[#e5e5e5] placeholder-[#6b6b6b] focus:ring-2 focus:ring-blue-500 ${
                        block.hasHeader && rowIndex === 0 ? 'font-semibold' : ''
                      }`}
                      placeholder={block.hasHeader && rowIndex === 0 ? 'Header' : 'Cell'}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      <div className="mt-2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
        <button
          onClick={addRow}
          className="px-3 py-1 text-sm bg-[#252525] text-[#e5e5e5] rounded hover:bg-[#2f2f2f] transition-colors"
        >
          + Row
        </button>
        <button
          onClick={addColumn}
          className="px-3 py-1 text-sm bg-[#252525] text-[#e5e5e5] rounded hover:bg-[#2f2f2f] transition-colors"
        >
          + Column
        </button>
        <button
          onClick={() => onUpdate({ hasHeader: !block.hasHeader })}
          className="px-3 py-1 text-sm bg-[#252525] text-[#e5e5e5] rounded hover:bg-[#2f2f2f] transition-colors"
        >
          {block.hasHeader ? 'Remove' : 'Add'} Header
        </button>
        {block.rows.length > 1 && (
          <button
            onClick={() => deleteRow(block.rows.length - 1)}
            className="px-3 py-1 text-sm bg-red-900/30 text-red-400 rounded hover:bg-red-900/50 transition-colors"
          >
            - Row
          </button>
        )}
        {block.rows[0]?.cells.length > 1 && (
          <button
            onClick={() => deleteColumn(block.rows[0].cells.length - 1)}
            className="px-3 py-1 text-sm bg-red-900/30 text-red-400 rounded hover:bg-red-900/50 transition-colors"
          >
            - Column
          </button>
        )}
      </div>
    </div>
  );
}

