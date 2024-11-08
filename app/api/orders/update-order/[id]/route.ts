import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { z } from 'zod';

const StatusSchema = z.enum(['Waiting', 'Cancelled', 'Delivered']).optional();

const OrderItemSchema = z.object({
  action: z.enum(['add', 'delete', 'update']),
  orderItemId: z.number().optional(),  // Used for delete or update
  productId: z.number().optional(),    // Used for add or update
  quantity: z.number().optional(),     // Used for add or update
});

const UpdateOrderSchema = z.object({
  status: StatusSchema,
  orderItems: z.array(OrderItemSchema).optional(),
});

// Function to update stock
const updateStock = async (orderItems: { productId: number; quantity: number }[], action: 'add' | 'delete' | 'update') => {
  try {
    for (const item of orderItems) {
      const product = await db.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new Error(`Product with id ${item.productId} not found`);
      }

      if (action === 'add') {
        if (product.stock < item.quantity) {
          throw new Error(`Not enough stock for product: ${product.title}`);
        }
        // Reduce stock when product is added
        await db.product.update({
          where: { id: item.productId },
          data: { stock: product.stock - item.quantity },
        });
      } else if (action === 'delete') {
        // Increase stock when item is deleted
        await db.product.update({
          where: { id: item.productId },
          data: { stock: product.stock + item.quantity },
        });
      } else if (action === 'update') {
        // If the quantity changes, adjust stock accordingly
        const currentOrderItem = await db.orderItem.findUnique({
          where: { id: item.orderItemId },
        });

        if (!currentOrderItem) {
          throw new Error(`Order item with id ${item.orderItemId} not found`);
        }

        const quantityDifference = item.quantity - currentOrderItem.quantity;

        // Update stock based on quantity difference
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
  } catch (error) {
    console.error('Error updating stock:', error);
    throw error;
  }
};

export const PUT = async (req: Request, { params }: { params: { id: number } }) => {
  try {
    const { id } = params;
    const { status, orderItems } = await req.json();

    // Validate the input data using schema
    UpdateOrderSchema.parse({ status, orderItems });

    const existingOrder = await db.order.findUnique({
      where: { id: Number(id) },
      include: { items: true }, // Include the related orderItems
    });

    if (!existingOrder) {
      return NextResponse.json(
        { success: false, message: 'Order not found' },
        { status: 404 }
      );
    }

    let updatedOrder = existingOrder;

    // If status is provided, update the order's status
    if (status) {
      updatedOrder = await db.order.update({
        where: { id: Number(id) },
        data: { status },
        include: { items: true }, // Include the related orderItems
      });

      // Update stock based on status change
      if (status === 'Waiting' || status === 'Delivered') {
        await updateStock(existingOrder.items, 'update'); // Update stock based on current quantities
      } else if (status === 'Cancelled') {
        await updateStock(existingOrder.items, 'delete'); // Revert stock if canceled
      }
    }

    // Handle orderItems changes (add, delete, or update)
    if (orderItems && orderItems.length > 0) {
      for (const item of orderItems) {
        if (item.action === 'add' && item.productId && item.quantity) {
          // Fetch product details for title and price
          const product = await db.product.findUnique({
            where: { id: item.productId },
            select: { title: true, price: true },
          });

          if (!product) {
            return NextResponse.json(
              { success: false, message: 'Product not found' },
              { status: 404 }
            );
          }

          // Create new OrderItem
          await db.orderItem.create({
            data: {
              orderId: Number(id),
              productId: item.productId,
              quantity: item.quantity,
              title: product.title,
              price: product.price,
            },
          });

          // Update stock after adding an item
          await updateStock([{ productId: item.productId, quantity: item.quantity }], 'add');
        } else if (item.action === 'delete' && item.orderItemId) {
          // Delete existing OrderItem
          const orderItem = await db.orderItem.findUnique({
            where: { id: item.orderItemId },
          });

          if (!orderItem) {
            return NextResponse.json(
              { success: false, message: 'Order item not found' },
              { status: 404 }
            );
          }

          // Delete the order item
          await db.orderItem.delete({
            where: { id: item.orderItemId },
          });

          // Revert stock when deleting an item
          await updateStock([{ productId: orderItem.productId, quantity: orderItem.quantity }], 'delete');
        } else if (item.action === 'update' && item.orderItemId && item.quantity) {
          // Fetch the orderItem to check if it exists
          const existingItem = await db.orderItem.findUnique({
            where: { id: item.orderItemId },
          });

          if (!existingItem) {
            return NextResponse.json(
              { success: false, message: 'Order item not found' },
              { status: 404 }
            );
          }

          // If a productId is provided, fetch the new product details
          let updatedProduct = undefined;
          if (item.productId) {
            updatedProduct = await db.product.findUnique({
              where: { id: item.productId },
              select: { title: true, price: true },
            });

            if (!updatedProduct) {
              return NextResponse.json(
                { success: false, message: 'Product not found' },
                { status: 404 }
              );
            }
          }

          // Update the OrderItem with the new quantity, product details if updated, etc.
          await db.orderItem.update({
            where: { id: item.orderItemId },
            data: {
              quantity: item.quantity,
              productId: item.productId || existingItem.productId,
              title: updatedProduct ? updatedProduct.title : existingItem.title,
              price: updatedProduct ? updatedProduct.price : existingItem.price,
            },
          });

          // Update stock after order item quantity update
          await updateStock(
            [{ productId: existingItem.productId, quantity: existingItem.quantity }],
            'delete' // Revert stock for the previous quantity
          );
          await updateStock(
            [{ productId: item.productId || existingItem.productId, quantity: item.quantity }],
            'add' // Add stock for the new quantity
          );
        }
      }
    }

    return NextResponse.json({
      success: true,
      order: updatedOrder,
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
