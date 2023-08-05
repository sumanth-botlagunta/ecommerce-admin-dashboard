import prismadb from '@/lib/prismaDB';
import { auth } from '@clerk/nextjs';
import { Billboard } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: { storeId: string };
  }
) {
  try {
    if (!params.storeId) {
      return new NextResponse('StoreId required', { status: 400 });
    }

    const billboards = await prismadb.billboard.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(billboards);
  } catch (error) {
    console.log('[GET /api/storeId/billboards] error: ', error);
    return new NextResponse('Something went wrong', { status: 500 });
  }
}

export async function POST(
  req: Request,
  {
    params,
  }: {
    params: { storeId: string };
  }
) {
  try {
    const { userId } = auth();
    if (!userId) return new NextResponse('not authenticated', { status: 403 });

    if (!params.storeId)
      return new NextResponse('StoreId required', { status: 400 });

    const body: Billboard = await req.json();
    const { label, imageUrl } = body;

    if (!label) return new NextResponse('label required', { status: 400 });
    if (!imageUrl)
      return new NextResponse('imageUrl required', { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        userId,
        id: params.storeId,
      },
    });

    if (!storeByUserId)
      return new NextResponse('invalid storeId for user', { status: 400 });

    const billboard = await prismadb.billboard.create({
      data: {
        storeId: storeByUserId.id,
        imageUrl,
        label,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log('[POST /api/storeId/billboards] error: ', error);
    return new NextResponse('Something went wrong', { status: 500 });
  }
}

