import prismadb from '@/lib/prismaDB';
import moment from 'moment';

import SizeDisplay from '@/components/size/main';
import { SizeColumn } from '@/components/size/columns';

const Sizes = async ({ params }: { params: { storeId: string } }) => {
  const sizes = await prismadb.size.findMany({
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

  const formatedSizes: SizeColumn[] = sizes.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    updateAt: dateFormater(item.updateAt),
  }));

  return (
    <div className="flex flex-col w-screen">
      <div className="flex-1 p-8 w-full mx-auto">
        <SizeDisplay sizes={formatedSizes} />
      </div>
    </div>
  );
};

export default Sizes;
