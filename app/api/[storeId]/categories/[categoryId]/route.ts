import prismadb from '@/lib/prismaDB';
import { auth } from '@clerk/nextjs';
import { Category } from '@prisma/client';
import { NextResponse } from 'next/server';

export async function GET(
  req: Request,
  {
    params,
  }: {
    params: { categoryId: string };
  }
) {
  try {
    if (!params.categoryId) {
      return new NextResponse('categoryId required', { status: 400 });
    }

    const category = await prismadb.category.findUnique({
      where: {
        id: params.categoryId,
      },
      include: {
        billboard: true,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log('[GET /api/storeId/categories/categoryId] error: ', error);
    return new NextResponse('Something went wrong', { status: 500 });
  }
}

export async function PATCH(
  req: Request,
  {
    params,
  }: {
    params: { categoryId: string; storeId: string };
  }
) {
  try {
    if (!params.categoryId) {
      return new NextResponse('billboardId required', { status: 400 });
    }

    const { userId } = auth();
    if (!userId) return new NextResponse('not authenticated', { status: 403 });

    if (!params.storeId)
      return new NextResponse('StoreId required', { status: 400 });

    const body: Category = await req.json();
    const { name, billboardId } = body;

    if (!name) return new NextResponse('label required', { status: 400 });
    if (!billboardId)
      return new NextResponse('imageUrl required', { status: 400 });

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

    const category = await prismadb.category.update({
      where: {
        id: params.categoryId,
      },
      data: {
        name,
        billboardId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log('[PATCH /api/storeId/categories/categoryId] error: ', error);
    return new NextResponse('Something went wrong', { status: 500 });
  }
}

export async function DELETE(
  req: Request,
  {
    params,
  }: {
    params: { categoryId: string; storeId: string };
  }
) {
  try {
    if (!params.categoryId) {
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

    const category = await prismadb.category.delete({
      where: {
        id: params.categoryId,
      },
    });

    return NextResponse.json(category);
  } catch (error) {
    console.log('[DELETE /api/storeId/categories/categoryId] error: ', error);
    return new NextResponse('Something went wrong', { status: 500 });
  }
}
