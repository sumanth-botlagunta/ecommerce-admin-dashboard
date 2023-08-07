'use client';

import { ColumnDef } from '@tanstack/react-table';

export type OrderColumn = {
  id: string;
  name: string;
  phone: string;
  address: string;
  isPaid: boolean;
  totalPrice: string;
  products: string;
  createdAt: string;
};

export const columns: ColumnDef<OrderColumn>[] = [
  {
    accessorKey: 'products',
    header: 'Products',
  },
  {
    id: 'contact',
    header: 'Contact',
    cell: ({ row }) => (
      <div>
        <div>{row.original.name}</div>
        <div>{row.original.phone}</div>
        <div>{row.original.address}</div>
      </div>
    ),
  },
  {
    accessorKey: 'totalPrice',
    header: 'Total price',
  },
  {
    accessorKey: 'isPaid',
    header: 'Paid',
  },
];
