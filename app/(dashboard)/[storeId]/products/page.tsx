import prismadb from '@/lib/prismaDB';
import moment from 'moment';

import ProductDisplay from '@/components/product/main';
import { ProductColumn } from '@/components/product/columns';

const Products = async ({ params }: { params: { storeId: string } }) => {
  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      category: true,
      size: true,
      color: true,
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

  const formatedProducts: ProductColumn[] = products.map((item) => ({
    id: item.id,
    name: item.name,
    price: item.price,
    isFeatured: item.isFeatured,
    category: item.category.name,
    size: item.size.name,
    color: item.color.name,
    updateAt: dateFormater(item.updateAt),
  }));

  return (
    <div className="flex flex-col">
      <div className="flex-1 p-8">
        <ProductDisplay products={formatedProducts} />
      </div>
    </div>
  );
};

export default Products;
