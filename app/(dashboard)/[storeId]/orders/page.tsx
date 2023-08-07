import moment from 'moment';
import { formatter } from '@/lib/utils';

import { OrderColumn } from '@/components/order/columns';
import { OrderClient } from '@/components/order/main';
import prismadb from '@/lib/prismaDB';

const OrdersPage = async ({ params }: { params: { storeId: string } }) => {
  const orders = await prismadb.order.findMany({
    where: {
      storeId: params.storeId,
    },
    include: {
      orderItems: {
        include: {
          product: true,
        },
      },
    },
    orderBy: {
      createAt: 'desc',
    },
  });

  const dateFormater = (date: Date) => {
    const myMoment = moment(date);
    const formattedDate = myMoment.format('MMMM Do YYYY');

    return formattedDate;
  };

  const formattedOrders: OrderColumn[] = orders.map((item) => ({
    id: item.id,
    name: item.name,
    phone: item.phone,
    address: item.address,
    products: item.orderItems
      .map((orderItem) => orderItem.product.name)
      .join(', '),
    totalPrice: formatter.format(
      item.orderItems.reduce((total, item) => {
        return total + Number(item.product.price);
      }, 0)
    ),
    isPaid: item.isPaid,
    createdAt: dateFormater(item.createAt),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <OrderClient data={formattedOrders} />
      </div>
    </div>
  );
};

export default OrdersPage;
