'use client';
import { PlusCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { ColorColumn, columns } from '@/components/color/columns';
import { DataTable } from '@/components/ui/data-table';
import { ApiList } from '../ui/api-list';

const ColorDisplay = ({ colors }: { colors: ColorColumn[] }) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex justify-between">
        <Heading title="Colors" description="Manage colors for your store" />
        <Button onClick={() => router.push(`/${params.storeId}/colors/new`)}>
          Add New
          <PlusCircle className="w-4 h-4 ml-2" />
        </Button>
      </div>
      <Separator className="mt-2" />
      <DataTable columns={columns} data={colors} searchKey="name" />
      <Heading title="API" description="API Calls for Colors" />
      <Separator />
      <ApiList entityIdName="colorId" entityName="colors" />
    </>
  );
};

export default ColorDisplay;
