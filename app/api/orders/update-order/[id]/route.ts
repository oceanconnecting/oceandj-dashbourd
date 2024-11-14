/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const StatusSchema = z.enum(['Waiting', 'Cancelled', 'Delivered']).optional();

const OrderItemSchema = z.object({
  action: z.enum(['add', 'delete', 'update']),
  orderItemId: z.number().optional(),
  productId: z.string().optional(), 
  quantity: z.number().optional(),     
});

const UpdateOrderSchema = z.object({
  status: StatusSchema,
  orderItems: z.array(OrderItemSchema).optional(),
});

// Function to update stock
const updateStock = async (
  orderItems: { orderItemId?: number; productId: string; quantity: number }[], 
  action: 'add' | 'delete' | 'update'
) => {
  for (const item of orderItems) {
    const product = await db.product.findUnique({ where: { id: item.productId } });

    if (!product) {
      throw new Error(`Product with id ${item.productId} not found`);
    }

    if (action === 'add') {
      if (product.stock < item.quantity) {
        throw new Error(`Not enough stock for product: ${product.title}`);
      }
      await db.product.update({
        where: { id: item.productId },
        data: { stock: product.stock - item.quantity },
      });
    } else if (action === 'delete') {
      await db.product.update({
        where: { id: item.productId },
        data: { stock: product.stock + item.quantity },
      });
    } else if (action === 'update') {
      const currentOrderItem = await db.orderItem.findUnique({ where: { id: item.orderItemId } });

      if (!currentOrderItem) {
        throw new Error(`Order item with id ${item.orderItemId} not found`);
      }

      const quantityDifference = item.quantity - currentOrderItem.quantity;
      if (quantityDifference > 0) {
        if (product.stock < quantityDifference) {
          throw new Error(`Not enough stock for product: ${product.title}`);
        }
        await db.product.update({
          where: { id: item.productId },
          data: { stock: product.stock - quantityDifference },
        });
      } else if (quantityDifference < 0) {
        await db.product.update({
          where: { id: item.productId },
          data: { stock: product.stock + Math.abs(quantityDifference) },
        });
      }
    }
  }
};

export const PUT = async (req: Request, { params }: { params: { id: string } }) => {
  const { id } = params;
  const { status, orderItems } = await req.json();

  try {
    UpdateOrderSchema.parse({ status, orderItems });

    const existingOrder = await db.order.findUnique({
      where: { id: id },
      include: { items: true },
    });

    if (!existingOrder) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    const updateTransaction = await db.$transaction(async (db) => {
      let updatedOrder = existingOrder;

      if (status) {
        updatedOrder = await db.order.update({
          where: { id: id },
          data: { status },
          include: { items: true },
        });

        if (status === 'Waiting' || status === 'Delivered') {
          await updateStock(existingOrder.items, 'update');
        } else if (status === 'Cancelled') {
          await updateStock(existingOrder.items, 'delete');
        }
      }

      if (orderItems && orderItems.length > 0) {
        for (const item of orderItems) {
          if (item.action === 'add' && item.productId && item.quantity) {
            const product = await db.product.findUnique({
              where: { id: item.productId },
              select: { title: true, price: true },
            });

            if (!product) {
              throw new Error('Product not found');
            }

            await db.orderItem.create({
              data: {
                orderId: id,
                productId: item.productId,
                quantity: item.quantity,
                title: product.title,
                price: product.price,
              },
            });

            await updateStock([{ productId: item.productId, quantity: item.quantity }], 'add');
          } else if (item.action === 'delete' && item.orderItemId) {
            const orderItem = await db.orderItem.findUnique({
              where: { id: item.orderItemId },
            });

            if (!orderItem) {
              throw new Error('Order item not found');
            }

            await db.orderItem.delete({ where: { id: item.orderItemId } });

            await updateStock([{ productId: orderItem.productId, quantity: orderItem.quantity }], 'delete');
          } else if (item.action === 'update' && item.orderItemId && item.quantity) {
            const existingItem = await db.orderItem.findUnique({
              where: { id: item.orderItemId },
            });

            if (!existingItem) {
              throw new Error('Order item not found');
            }

            let updatedProduct;
            if (item.productId) {
              updatedProduct = await db.product.findUnique({
                where: { id: item.productId },
                select: { title: true, price: true },
              });

              if (!updatedProduct) {
                throw new Error('Product not found');
              }
            }

            await db.orderItem.update({
              where: { id: item.orderItemId },
              data: {
                quantity: item.quantity,
                productId: item.productId || existingItem.productId,
                title: updatedProduct ? updatedProduct.title : existingItem.title,
                price: updatedProduct ? updatedProduct.price : existingItem.price,
              },
            });

            await updateStock(
              [{ productId: existingItem.productId, quantity: existingItem.quantity }],
              'delete'
            );
            await updateStock(
              [{ productId: item.productId || existingItem.productId, quantity: item.quantity }],
              'add'
            );
          }
        }
      }

      return updatedOrder;
    });

    return NextResponse.json({
      success: true,
      order: updateTransaction,
    });
  } catch (error) {
    console.error('Error updating order:', error);
    const errorMessage = error instanceof Error ? error.message : 'Failed to update order';
    return NextResponse.json(
      { success: false, message: errorMessage },
      { status: 500 }
    );
  }
};
