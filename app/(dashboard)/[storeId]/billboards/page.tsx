import prismadb from '@/lib/prismaDB';
import moment from 'moment';

import { BillboardColumn } from '@/components/billboard/columns';
import BillboarsDisplay from '@/components/billboard/main';

const Billboards = async ({ params }: { params: { storeId: string } }) => {
  const billboards = await prismadb.billboard.findMany({
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

  const formatedBillboards: BillboardColumn[] = billboards.map((item) => ({
    id: item.id,
    imageUrl: item.imageUrl,
    label: item.label,
    updateAt: dateFormater(item.updateAt),
  }));

  return (
    <div className="flex flex-col">
      <div className="flex-1 p-8">
        <BillboarsDisplay billboards={formatedBillboards} />
      </div>
    </div>
  );
};

export default Billboards;
