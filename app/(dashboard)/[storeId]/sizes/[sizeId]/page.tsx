import { SizeForm } from '@/components/size/size-form';
import prismadb from '@/lib/prismaDB';

const SizeSetup = async ({
  params,
}: {
  params: { sizeId: string; storeId: string };
}) => {
  const size = await prismadb.size.findUnique({
    where: { id: params.sizeId },
  });

  return (
    <div className="flex flex-col">
      <div className="flex-1 p-8">
        <SizeForm initialData={size} />
      </div>
    </div>
  );
};

export default SizeSetup;
