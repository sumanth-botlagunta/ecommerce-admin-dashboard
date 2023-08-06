import { ColorForm } from '@/components/color/color-form';
import prismadb from '@/lib/prismaDB';

const ColorSetup = async ({
  params,
}: {
  params: { colorId: string; storeId: string };
}) => {
  const color = await prismadb.color.findUnique({
    where: { id: params.colorId },
  });

  return (
    <div className="flex flex-col">
      <div className="flex-1 p-8">
        <ColorForm initialData={color} />
      </div>
    </div>
  );
};

export default ColorSetup;
