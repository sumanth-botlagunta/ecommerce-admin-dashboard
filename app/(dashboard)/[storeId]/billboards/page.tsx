import BillboarsDisplay from '@/components/billboard/main';
import prismadb from '@/lib/prismaDB';

const Billboards = async ({ params }: { params: { storeId: string } }) => {
  const billboards = await prismadb.billboard.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      createAt: 'desc',
    },
  });

  return (
    <div className="flex flex-col">
      <div className="flex-1 p-8">
        <BillboarsDisplay billboards={billboards} />
      </div>
    </div>
  );
};

export default Billboards;
