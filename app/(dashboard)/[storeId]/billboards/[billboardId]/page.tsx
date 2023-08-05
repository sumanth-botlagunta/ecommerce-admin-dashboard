import { BillboardForm } from '@/components/billboard/billboard-form';
import prismadb from '@/lib/prismaDB';

const BillboardSetup = async ({
  params,
}: {
  params: { billboardId: string };
}) => {
  const billboard = await prismadb.billboard.findUnique({
    where: { id: params.billboardId },
  });
  return (
    <div className="flex flex-col">
      <div className="flex-1 p-8">
        <BillboardForm initialData={billboard} />
      </div>
    </div>
  );
};

export default BillboardSetup;
