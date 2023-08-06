'use client';

import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from '@/components/color/cell-action';

export type ColorColumn = {
  id: string;
  name: string;
  value: string;
  updateAt: string;
};

export const columns: ColumnDef<ColorColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'value',
    header: 'Color',
    cell: ({ row }) => (
      <div
        className="w-9 h-9 rounded-full border-2 border-black"
        style={{ backgroundColor: row.original.value }}
      ></div>
    ),
  },
  {
    accessorKey: 'updateAt',
    header: 'Last modified',
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return <CellAction data={row.original} />;
    },
  },
];
