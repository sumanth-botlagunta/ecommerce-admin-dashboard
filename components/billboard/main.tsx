'use client';
import { PlusCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { BillboardColumn, columns } from '@/components/billboard/columns';
import { DataTable } from '@/components/ui/data-table';
import { ApiList } from '../ui/api-list';

const BillboarsDisplay = ({
  billboards,
}: {
  billboards: BillboardColumn[];
}) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex justify-between">
        <Heading
          title="Billboards"
          description="Manage billboards for you store"
        />
        <Button
          onClick={() => router.push(`/${params.storeId}/billboards/new`)}
        >
          Add New
          <PlusCircle className="w-4 h-4 ml-2" />
        </Button>
      </div>
      <Separator className="mt-2" />
      <DataTable columns={columns} data={billboards} searchKey="label" />
      <Heading title="API" description="API Calls for Billboards" />
      <Separator />
      <ApiList entityIdName="billboardId" entityName="billboards" />
    </>
  );
};

export default BillboarsDisplay;
