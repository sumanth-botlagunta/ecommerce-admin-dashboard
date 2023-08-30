import Stripe from 'stripe';
import { headers } from 'next/headers';
import { NextResponse } from 'next/server';
import Cors from 'micro-cors';

const cors = Cors({
  allowMethods: ['POST', 'HEAD'],
});

import { stripe } from '@/lib/stripe';
import prismadb from '@/lib/prismaDB';

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const signature = headers().get('Stripe-Signature') as string;

    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET! as string
    );

    const session = event.data.object as Stripe.Checkout.Session;
    const address = session?.customer_details?.address;

    const addressComponents = [
      address?.line1,
      address?.line2,
      address?.city,
      address?.state,
      address?.postal_code,
      address?.country,
    ];

    const addressString = addressComponents
      .filter((c) => c !== null)
      .join(', ');

    if (event.type === 'checkout.session.completed') {
      await prismadb.order.update({
        where: {
          id: session?.metadata?.orderId,
        },
        data: {
          isPaid: true,
          address: addressString,
          phone: session?.customer_details?.phone || '',
        },
        include: {
          orderItems: true,
        },
      });
    }

    return NextResponse.json({ result: event, ok: true });
  } catch (error: any) {
    console.error(error);
    return NextResponse.json(
      {
        message: 'something went wrong',
        ok: false,
      },
      { status: 500 }
    );
  }
}

