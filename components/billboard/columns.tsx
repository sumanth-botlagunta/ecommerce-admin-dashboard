'use client';

import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';

import { CellAction } from '@/components/billboard/cell-action';

export type BillboardColumn = {
  id: string;
  label: string;
  updateAt: string;
  imageUrl: string;
};

export const columns: ColumnDef<BillboardColumn>[] = [
  {
    accessorKey: 'label',
    header: 'Label',
  },
  {
    accessorKey: 'updateAt',
    header: 'Last modified',
  },
  {
    id: 'images',
    header: 'Image',
    cell: ({ row }) => {
      const billboard = row.original;
      return (
        <div className=" my-2">
          <Image
            src={billboard.imageUrl}
            alt="image Url"
            width={30}
            height={30}
          />
        </div>
      );
    },
  },
  {
    id: 'actions',
    cell: ({ row }) => {
      return <CellAction data={row.original} />;
    },
  },
];
