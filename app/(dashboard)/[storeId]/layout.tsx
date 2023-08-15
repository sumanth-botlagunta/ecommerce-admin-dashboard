import { redirect } from 'next/navigation';
import React from 'react';

import Navbar from '@/components/navbar';
import prismadb from '@/lib/prismaDB';

export default async function DashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { storeId: string };
}) {
  const store = await prismadb.store.findFirst({
    where: { id: params.storeId },
  });

  if (!store) redirect('/');

  return (
    <div>
      <Navbar />
      <div className="mt-10">{children}</div>
    </div>
  );
}
