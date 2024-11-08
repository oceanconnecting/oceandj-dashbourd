/* eslint-disable prefer-const */
import { NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { OrderSchema } from "@/schemas/order";
import { sendEmail } from "@/utils/mail.utils";

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

// Stock update function
const updateStock = async (orderItems: { productId: string; quantity: number }[]) => {
  try {
    // Loop through the order items and reduce stock only if the status is "delivered" or "waiting"
    for (let item of orderItems) {
      const product = await db.product.findUnique({
        where: { id: item.productId },
      });

      if (!product) {
        throw new Error(`Product with id ${item.productId} not found`);
      }

      // Ensure there is enough stock
      if (product.stock >= item.quantity) {
        product.stock -= item.quantity;
        await db.product.update({
          where: { id: product.id },
          data: { stock: product.stock },
        });
      } else {
        throw new Error(`Not enough stock for product: ${product.title}`);
      }
    }
  } catch (error) {
    console.error('Error updating stock:', error);
    throw error; // Re-throw the error to handle it in the main try-catch block
  }
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

    // Create the order
    const newOrder = await db.order.create({
      data: {
        reference,
        name,
        phone,
        email,
        address,
        status: "Waiting", // Set initial status to "Waiting"
        items: {
          create: orderItems,
        },
      },
      include: {
        items: true,
      },
    });

    // Update stock after the order is created (only if status is "waiting" or "delivered")
    if (newOrder.status === 'Waiting' || newOrder.status === 'Delivered') {
      await updateStock(orderItems);
    }

    const sender = {
      name: "Test",
      address: "test@gmail.com",
    };

    const receipients = [
      {
        name: name ?? '',
        address: email ?? '',
      },
      {
        name: process.env.DJSTAGE_NAME ?? '',
        address: process.env.DJSTAGE_MAIL ?? '',
      },
    ]

    const htmlMessage = `
      <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">
        <div style="max-width: 600px; background-color: #ffffff; margin: auto; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
          <h2 style="text-align: center; color: #333333;">Order Confirmation</h2>
          <p style="font-size: 16px; color: #333333;">Hi ${name},</p>
          <p style="font-size: 16px; color: #333333;">Thank you for your purchase! We've received your order and it's now being processed. Below are the details:</p>
          <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
            <thead>
              <tr style="background-color: #f4f4f4;">
                <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Product</th>
                <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Quantity</th>
                <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Price</th>
              </tr>
            </thead>
            <tbody>
              ${orderItems.map(item => `
                <tr>
                  <td style="padding: 10px; border: 1px solid #ddd;">${item.title}</td>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">${item.quantity}</td>
                  <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">$${item.price}</td>
                </tr>
              `).join('')}
            </tbody>
            <tfoot>
              <tr>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: left;" colspan="2"><strong>Total:</strong></td>
                <td style="padding: 10px; border: 1px solid #ddd; text-align: right;"><strong>$${orderItems.reduce((total, item) => total + item.price * item.quantity, 0)}</strong></td>
              </tr>
            </tfoot>
          </table>
          <p style="font-size: 16px; color: #333333; margin-top: 20px;">You can track your order and view your order details <a href="#" style="color: #1e90ff; text-decoration: none;">here</a>.</p>
          <p style="font-size: 16px; color: #333333;">Thank you for shopping with us!</p>
          <p style="font-size: 16px; color: #333333;">Best regards,<br>The DJ Stage Team</p>
        </div>
      </body>
    `;

    await sendEmail({
      sender,
      receipients,
      subject: "Order Confirmation",
      message: htmlMessage,
      isHtml: true,
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
