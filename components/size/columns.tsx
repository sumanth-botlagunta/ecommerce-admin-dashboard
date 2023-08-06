import { ColumnDef } from '@tanstack/react-table';
import { CellAction } from '@/components/size/cell-action';

export type SizeColumn = {
  id: string;
  name: string;
  value: string;
  updateAt: string;
};

export const columns: ColumnDef<SizeColumn>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
  },
  {
    accessorKey: 'value',
    header: 'Value',
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
