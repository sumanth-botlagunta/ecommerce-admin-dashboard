'use client';
import { PlusCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { SizeColumn, columns } from '@/components/size/columns';
import { DataTable } from '@/components/ui/data-table';
import { ApiList } from '../ui/api-list';
import React from 'react';

const SizeDisplay = ({ sizes }: { sizes: SizeColumn[] }) => {
  const router = useRouter();
  const params = useParams();
  return (
    <div className="w-full mx-auto">
      <div className="flex justify-between">
        <Heading title="Sizes" description="Manage sizes for your store" />
        <Button onClick={() => router.push(`/${params.storeId}/sizes/new`)}>
          Add New
          <PlusCircle className="w-4 h-4 ml-2" />
        </Button>
      </div>
      <Separator className="mt-2" />
      <DataTable columns={columns} data={sizes} searchKey="name" />
      <Heading title="API" description="API Calls for Sizes" />
      <Separator />
      <ApiList entityIdName="sizeId" entityName="sizes" />
    </div>
  );
};

export default SizeDisplay;
