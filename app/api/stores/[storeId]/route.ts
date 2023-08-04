import prismadb from '@/lib/prismaDB';
import { auth } from '@clerk/nextjs';
import { NextResponse } from 'next/server';

export async function PATCH(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }
    const body = await req.json();
    const { name } = body;
    if (!name) {
      return new NextResponse('Name is required', { status: 400 });
    }
    if (!params.storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }
    const store = await prismadb.store.update({
      where: {
        id: params.storeId,
      },
      data: {
        name,
      },
    });
    if (!store) {
      return new NextResponse('Store not found', { status: 404 });
    }
    return NextResponse.json(store);
  } catch (e) {
    console.log('[PATCH /api/stores/[storeId]] error: ', e);
    return new NextResponse('Internal Error', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  { params }: { params: { storeId: string } }
) {
  try {
    const { userId } = auth();
    if (!userId) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    if (!params.storeId) {
      return new NextResponse('Store ID is required', { status: 400 });
    }
    const store = await prismadb.store.deleteMany({
      where: {
        id: params.storeId,
        userId,
      },
    });
    if (!store) {
      return new NextResponse('Store not found', { status: 404 });
    }
    return NextResponse.json(store);
  } catch (e) {
    console.log('[PATCH /api/stores/[storeId]] error: ', e);
    return new NextResponse('Internal Error', { status: 500 });
  }
}
