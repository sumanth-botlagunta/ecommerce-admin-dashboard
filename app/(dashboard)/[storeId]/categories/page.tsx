import prismadb from '@/lib/prismaDB';
import moment from 'moment';

import CategoryDisplay from '@/components/category/main';
import { CategoryColumn } from '@/components/category/columns';

const Categories = async ({ params }: { params: { storeId: string } }) => {
  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      billboard: true,
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

  const formatedCategories: CategoryColumn[] = categories.map((item) => ({
    id: item.id,
    name: item.name,
    billboardLabel: item.billboard.label,
    updateAt: dateFormater(item.updateAt),
  }));

  return (
    <div className="flex flex-col">
      <div className="flex-1 p-8">
        <CategoryDisplay categories={formatedCategories} />
      </div>
    </div>
  );
};

export default Categories;
