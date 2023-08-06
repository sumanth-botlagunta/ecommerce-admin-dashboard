import prismadb from '@/lib/prismaDB';
import { auth } from '@clerk/nextjs';
import { Category } from '@prisma/client';
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

    const categories = await prismadb.category.findMany({
      where: {
        storeId: params.storeId,
      },
    });

    return NextResponse.json(categories);
  } catch (error) {
    console.log('[GET /api/storeId/categories] error: ', error);
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

    const body: Category = await req.json();
    const { name, billboardId } = body;

    if (!name) return new NextResponse('name required', { status: 400 });
    if (!billboardId)
      return new NextResponse('billboardId required', { status: 400 });

    const storeByUserId = await prismadb.store.findFirst({
      where: {
        userId,
        id: params.storeId,
      },
    });
    if (!storeByUserId)
      return new NextResponse('invalid storeId for user', { status: 400 });

    const billboard = await prismadb.billboard.findUnique({
      where: {
        id: billboardId,
      },
    });
    if (!billboard)
      return new NextResponse('invalid billboardId for user', { status: 400 });

    const category = await prismadb.category.create({
      data: {
        storeId: storeByUserId.id,
        billboardId: billboard.id,
        name: name,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log('[POST /api/storeId/categories] error: ', error);
    return new NextResponse('Something went wrong', { status: 500 });
  }
}
