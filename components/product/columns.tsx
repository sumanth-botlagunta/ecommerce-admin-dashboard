'use client';

import { ColumnDef } from '@tanstack/react-table';

import { CellAction } from '@/components/product/cell-action';

export type ProductColumn = {
  id: string;
  name: string;
  price: string;
  isFeatured: boolean;
  isArchived: boolean;
  category: string;
  size: string;
  color: string;
  updateAt: string;
};

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'price',
    header: 'Price',
  },
  {
    accessorKey: 'category',
    header: 'Category',
  },
  {
    accessorKey: 'size',
    header: 'Size',
  },
  {
    accessorKey: 'color',
    header: 'Color',
  },
  {
    accessorKey: 'isFeatured',
    header: 'Featured',
    cell: ({ row }) => (row.original.isFeatured ? 'Yes' : 'No'),
  },
  {
    accessorKey: 'isArchived',
    header: 'Archived',
    cell: ({ row }) => (row.original.isArchived ? 'Yes' : 'No'),
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
