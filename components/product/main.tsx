'use client';
import { PlusCircle } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';

import { Button } from '@/components/ui/button';
import Heading from '@/components/ui/heading';
import { Separator } from '@/components/ui/separator';
import { ProductColumn, columns } from '@/components/product/columns';
import { DataTable } from '@/components/ui/data-table';
import { ApiList } from '../ui/api-list';

const ProductDisplay = ({ products }: { products: ProductColumn[] }) => {
  const router = useRouter();
  const params = useParams();
  return (
    <>
      <div className="flex justify-between">
        <Heading
          title="Products"
          description="Manage products for your store"
        />
        <Button onClick={() => router.push(`/${params.storeId}/products/new`)}>
          Add New
          <PlusCircle className="w-4 h-4 ml-2" />
        </Button>
      </div>
      <Separator className="mt-2" />
      <DataTable columns={columns} data={products} searchKey="name" />
      <Heading title="API" description="API Calls for Products" />
      <Separator />
      <ApiList entityIdName="productId" entityName="products" />
    </>
  );
};

export default ProductDisplay;
