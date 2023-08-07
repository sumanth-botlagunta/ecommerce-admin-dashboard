import prismadb from '@/lib/prismaDB';
import { auth } from '@clerk/nextjs';
import { Size } from '@prisma/client';
import { NextResponse } from 'next/server';


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

    const body: Size = await req.json();
    const { name, value } = body;

    if (!name) return new NextResponse('name required', { status: 400 });
    if (!value) return new NextResponse('value required', { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        userId,
        id: params.storeId,
      },
    });
    if (!storeByUserId)
      return new NextResponse('invalid storeId for user', { status: 400 });

    const size = await prismadb.size.create({
      data: {
        storeId: storeByUserId.id,
        name,
        value,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log('[POST /api/storeId/sizes] error: ', error);
    return new NextResponse('Something went wrong', { status: 500 });
  }
}
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

    const sizes = await prismadb.size.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(sizes);
  } catch (error) {
    console.log('[GET /api/storeId/sizes] error: ', error);
    return new NextResponse('Something went wrong', { status: 500 });
  }
}
