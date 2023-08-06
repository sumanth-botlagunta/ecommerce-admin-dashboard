import prismadb from '@/lib/prismaDB';
import moment from 'moment';

import ColorDisplay from '@/components/color/main';
import { ColorColumn } from '@/components/color/columns';

const Colors = async ({ params }: { params: { storeId: string } }) => {
  const colors = await prismadb.color.findMany({
    where: {
      storeId: params.storeId,
    },
    orderBy: {
      updateAt: 'desc',
    },
  });

  const dateFormater = (date: Date) => {
    const myMoment = moment(date);
    const formattedDate = myMoment.format('MMMM Do YYYY');

    return formattedDate;
  };

  const formatedColors: ColorColumn[] = colors.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    updateAt: dateFormater(item.updateAt),
  }));

  return (
    <div className="flex flex-col">
      <div className="flex-1 p-8">
        <ColorDisplay colors={formatedColors} />
      </div>
    </div>
  );
};

export default Colors;
