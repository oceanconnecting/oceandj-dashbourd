import { sendEmail } from "@/utils/mail.utils";

export async function POST(request: Request) {
  const { clientName, clientEmail } = await request.json();

  const sender = {
    name: "Test",
    address: "test@gmail.com",
  };

  const receipients = [
    {
      name: clientName,
      address: clientEmail,
    },
    {
      name: process.env.DJSTAGE_NAME,
      address: process.env.DJSTAGE_MAIL,
    },
  ];

  const htmlMessage = `
    <body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 20px;">

        <div style="max-width: 600px; background-color: #ffffff; margin: auto; padding: 20px; border-radius: 10px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);">
            <h2 style="text-align: center; color: #333333;">Order Confirmation</h2>
            
            <p style="font-size: 16px; color: #333333;">Hi ${clientName},</p>
            <p style="font-size: 16px; color: #333333;">Thank you for your purchase! We're excited to let you know that we've received your order and it's now being processed. Below are the details:</p>

            <table style="width: 100%; margin-top: 20px; border-collapse: collapse;">
                <thead>
                    <tr style="background-color: #f4f4f4;">
                        <th style="padding: 10px; border: 1px solid #ddd; text-align: left;">Product</th>
                        <th style="padding: 10px; border: 1px solid #ddd; text-align: center;">Quantity</th>
                        <th style="padding: 10px; border: 1px solid #ddd; text-align: right;">Price</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;">[Product Name 1]</td>
                        <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">[1]</td>
                        <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">$[Price 1]</td>
                    </tr>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd;">[Product Name 2]</td>
                        <td style="padding: 10px; border: 1px solid #ddd; text-align: center;">[2]</td>
                        <td style="padding: 10px; border: 1px solid #ddd; text-align: right;">$[Price 2]</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td style="padding: 10px; border: 1px solid #ddd; text-align: left;" colspan="2"><strong>Total:</strong></td>
                        <td style="padding: 10px; border: 1px solid #ddd; text-align: right;"><strong>$[Total]</strong></td>
                    </tr>
                </tfoot>
            </table>

            <p style="font-size: 16px; color: #333333; margin-top: 20px;">You can track your order and view your order details <a href="#" style="color: #1e90ff; text-decoration: none;">here</a>.</p>
            
            <p style="font-size: 16px; color: #333333;">Thank you for shopping with us!</p>

            <p style="font-size: 16px; color: #333333;">Best regards,<br>The [Store Name] Team</p>
        </div>
        
    </body>
  `;

  try {
    const result = await sendEmail({
      sender,
      receipients,
      subject: "Welcome to our website!",
      message: htmlMessage,
      isHtml: true,
    });

    return new Response(
      JSON.stringify({
        accepted: result.accepted,
        success: true,
      }),
      { status: 200 }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({
        success: false,
        message: "Error",
        error,
      }),
      { status: 500 }
    );
  }
}
