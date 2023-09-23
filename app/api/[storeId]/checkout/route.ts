import Stripe from 'stripe';

import { stripe } from '@/lib/stripe';
import prismadb from '@/lib/prismaDB';
import { NextResponse } from 'next/server';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

export async function OPTIONS() {
  return NextResponse.json({}, { headers: corsHeaders });
}

export async function POST(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  const { productIds } = await req.json();
  if (!productIds || productIds.length === 0) {
    return new NextResponse('Product ids are required', { status: 400 });
  }

  const products = await prismadb.product.findMany({
    where: {
      id: {
        in: productIds,
      },
    },
    include: {
      images: true,
    },
  });
  const line_items: Stripe.Checkout.SessionCreateParams.LineItem[] = [];

  products.forEach(async (product) => {
    const dollarPrice = Math.floor(product.price.toNumber() * 100);
    const exchangeRates = await fetch(
      `https://api.exchangeratesapi.io/v1/latest?access_key=${process.env.EXCHANGE_RATES_API_KEY}&from=USD&to=INR&amount=${dollarPrice}`
    );
    const exchangeRatesData = await exchangeRates.json();
    const inrPrice = exchangeRatesData?.result || dollarPrice * 90;
    line_items.push({
      quantity: 1,
      price_data: {
        currency: 'INR',
        product_data: {
          name: product.name,
          images: [product.images[0].url],
        },
        unit_amount: inrPrice,
      },
    });
  });

  const order = await prismadb.order.create({
    data: {
      storeId: params.storeId,
      isPaid: false,
      orderItems: {
        create: productIds.map((productId: string) => ({
          product: {
            connect: {
              id: productId,
            },
          },
        })),
      },
    },
  });

  const session = await stripe.checkout.sessions.create({
    line_items,
    mode: 'payment',
    billing_address_collection: 'required',
    phone_number_collection: {
      enabled: true,
    },
    success_url: `${process.env.FRONTEND_STORE_URL}/cart?success=1`,
    cancel_url: `${process.env.FRONTEND_STORE_URL}/cart?canceled=1`,
    metadata: {
      orderId: order.id,
    },
  });

  return NextResponse.json(
    { url: session.url },
    {
      headers: corsHeaders,
    }
  );
}
