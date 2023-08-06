import prismadb from '@/lib/prismaDB';
import { auth } from '@clerk/nextjs';
import { Color } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: { colorId: string };
  }
) {
  try {
    if (!params.colorId) {
      return new NextResponse('colorId required', { status: 400 });
    }

    const color = await prismadb.color.findUnique({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log('[GET /api/storeId/colors/colorId] error: ', error);
    return new NextResponse('Something went wrong', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: { colorId: string; storeId: string };
  }
) {
  try {
    if (!params.colorId) {
      return new NextResponse('colorId required', { status: 400 });
    }

    const { userId } = auth();
    if (!userId) return new NextResponse('not authenticated', { status: 403 });

    if (!params.storeId)
      return new NextResponse('StoreId required', { status: 400 });

    const body: Color = await req.json();
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

    const color = await prismadb.color.update({
      where: {
        id: params.colorId,
      },
      data: {
        name,
        value,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log('[PATCH /api/storeId/colors/colorId] error: ', error);
    return new NextResponse('Something went wrong', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: { colorId: string; storeId: string };
  }
) {
  try {
    if (!params.colorId) {
      return new NextResponse('colorId required', { status: 400 });
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

    const color = await prismadb.color.delete({
      where: {
        id: params.colorId,
      },
    });

    return NextResponse.json(color);
  } catch (error) {
    console.log('[DELETE /api/storeId/colors/colorId] error: ', error);
    return new NextResponse('Something went wrong', { status: 500 });
  }
}
