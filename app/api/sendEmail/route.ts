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
    <div style="font-family: 'Arial', sans-serif; background-color: #f9fafb; padding: 20px; max-width: 600px; margin: 0 auto;">
      <div style="background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
        <h2 style="font-size: 24px; font-weight: bold; color: #1f2937;">Welcome, ${clientName}!</h2>
        <p style="font-size: 16px; color: #4b5563;">We are excited to have you on board. Below is a confirmation of your registration.</p>
        <div style="margin-top: 10px;">
          <div style="display: flex; flex-direction: column;">
            <div style="display: flex; flex-direction: column;">
              <p style=""><span style="font-size: 14px; color: #6b7280;">Full Name : </span>${clientName}</p>
            </div>
            <div style="display: flex; flex-direction: column;">
              <p style=""><span style="font-size: 14px; color: #6b7280;">Email : </span>${clientEmail}</p>
            </div>
          </div>
        </div>
        <p style="margin-top: 10px; font-size: 14px; color: #9ca3af;">Thank you for joining us!</p>
      </div>
    </div>
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
