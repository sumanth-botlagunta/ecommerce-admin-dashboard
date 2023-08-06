'use client';

import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';

import { CellAction } from '@/components/category/cell-action';

export type CategoryColumn = {
  id: string;
  name: string;
  updateAt: string;
  billboardLabel: string;
};

export const columns: ColumnDef<CategoryColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'billboardLabel',
    header: 'Billboard',
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
