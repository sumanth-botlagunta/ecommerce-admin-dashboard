import prismadb from '@/lib/prismaDB';
import { auth } from '@clerk/nextjs';
import { Billboard } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: { billboardId: string };
  }
) {
  try {
    if (!params.billboardId) {
      return new NextResponse('billboardId required', { status: 400 });
    }

    const billboard = await prismadb.billboard.findUnique({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log('[GET /api/storeId/billboards/[billboardId]] error: ', error);
    return new NextResponse('Something went wrong', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: { billboardId: string; storeId: string };
  }
) {
  try {
    if (!params.billboardId) {
      return new NextResponse('billboardId required', { status: 400 });
    }

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

    const billboard = await prismadb.billboard.update({
      where: {
        id: params.billboardId,
      },
      data: {
        label,
        imageUrl,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log('[GET /api/storeId/billboards/[billboardId]] error: ', error);
    return new NextResponse('Something went wrong', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: { billboardId: string; storeId: string };
  }
) {
  try {
    if (!params.billboardId) {
      return new NextResponse('billboardId required', { status: 400 });
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

    const billboard = await prismadb.billboard.delete({
      where: {
        id: params.billboardId,
      },
    });

    return NextResponse.json(billboard);
  } catch (error) {
    console.log('[GET /api/storeId/billboards/[billboardId]] error: ', error);
    return new NextResponse('Something went wrong', { status: 500 });
  }
}
