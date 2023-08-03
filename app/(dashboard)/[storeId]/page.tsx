import prismadb from '@/lib/prismaDB';
import React from 'react';

interface DashboardPageProps {
  params: { storeId: string };
}
const DashboardPage: React.FC<DashboardPageProps> = async ({ params }) => {
  const store = await prismadb.store.findUnique({
    where: { id: params.storeId },
  });
  return (
    <div>
      <h1 className="text-green-800">{store?.name}</h1>
    </div>
  );
};

export default DashboardPage;
