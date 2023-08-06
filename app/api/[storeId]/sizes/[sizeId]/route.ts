import prismadb from '@/lib/prismaDB';
import { auth } from '@clerk/nextjs';
import { Size } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: { sizeId: string };
  }
) {
  try {
    if (!params.sizeId) {
      return new NextResponse('sizeId required', { status: 400 });
    }

    const size = await prismadb.size.findUnique({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log('[GET /api/storeId/sizes/sizeId] error: ', error);
    return new NextResponse('Something went wrong', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: { sizeId: string; storeId: string };
  }
) {
  try {
    if (!params.sizeId) {
      return new NextResponse('sizeId required', { status: 400 });
    }

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

    const size = await prismadb.size.update({
      where: {
        id: params.sizeId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log('[PATCH /api/storeId/sizes/sizeId] error: ', error);
    return new NextResponse('Something went wrong', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: { sizeId: string; storeId: string };
  }
) {
  try {
    if (!params.sizeId) {
      return new NextResponse('sizeId required', { status: 400 });
    }

    const { userId } = auth();
    if (!userId) return new NextResponse('not authenticated', { status: 403 });

    if (!params.storeId)
      return new NextResponse('StoreId required', { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        userId,
        id: params.storeId,
      },
    });

    if (!storeByUserId)
      return new NextResponse('invalid storeId for user', { status: 400 });

    const size = await prismadb.size.delete({
      where: {
        id: params.sizeId,
      },
    });

    return NextResponse.json(size);
  } catch (error) {
    console.log('[DELETE /api/storeId/sizes/sizeId] error: ', error);
    return new NextResponse('Something went wrong', { status: 500 });
  }
}
