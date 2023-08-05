'use client';
import { PlusCircle } from 'lucide-react';
import { Button } from '../ui/button';
import Heading from '../ui/heading';
import { Separator } from '../ui/separator';
import { useParams, useRouter } from 'next/navigation';
import axios from 'axios';
import { Billboard } from '@prisma/client';

const BillboarsDisplay = ({ billboards }: { billboards: Billboard[] }) => {
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
      {billboards.map((item, i) => (
        <div key={i} className="flex text-sm font-bold">
          {item.id} --- {item.label} --- {item.imageUrl} --- {i + 1}
        </div>
      ))}
    </>
  );
};

export default BillboarsDisplay;
