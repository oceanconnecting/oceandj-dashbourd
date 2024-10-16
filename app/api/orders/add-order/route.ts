import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { OrderSchema } from "@/schemas/order";

const generateRandomReference = async (length = 4): Promise<string> => {
  const characters = '0123456789';
  let reference: string;
  
  while (true) {
    reference = 'REF-' + Array.from({ length }, () => characters.charAt(Math.floor(Math.random() * characters.length))).join('');

    const existingOrder = await db.order.findUnique({
      where: { reference },
    });

    if (!existingOrder) break;
  }

  return reference;
};


export const POST = async (req: Request) => {
  try {
    const body = await req.json();
    const { name, phone, email, address, products } = OrderSchema.parse(body);

    const productIds = products.map((product) => product.id);
    const productDetails = await db.product.findMany({
      where: { id: { in: productIds } },
    });

    if (productDetails.length !== products.length) {
      throw new Error('One or more products not found');
    }

    const orderItems = products.map((product) => {
      const productInfo = productDetails.find((p) => p.id === product.id);
      if (!productInfo) throw new Error(`Product with id ${product.id} not found`);

      return {
        productId: productInfo.id,
        title: productInfo.title,
        price: productInfo.price,
        discount: productInfo.discount ?? 0,
        quantity: product.quantity,
      };
    });

    const reference = await generateRandomReference();

    const newOrder = await db.order.create({
      data: {
        reference,
        name,
        phone,
        email,
        address,
        status: "Waiting",
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    });

    return NextResponse.json({
      success: true,
      order: newOrder,
    });
  } catch (error) {
    console.error('Error creating order:', error);

    const errorMessage = error instanceof Error ? error.message : 'Failed to create order';
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
};
