/* eslint-disable @typescript-eslint/no-unused-vars */
import { db } from "@/lib/db";
import { UserSchema } from "@/schemas";
import { hash } from "bcrypt";
import { NextResponse } from 'next/server'; 


export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = UserSchema.parse(body);
    const existingUserByEmail = await db.user.findUnique({
      where: { email: email }
    });
    if(existingUserByEmail) {
      return NextResponse.json({ user: null, message: "Email already exist"}, { status: 409 })
    }
    const hashPassword = await hash(password, 14)
    const newUser = await db.user.create({
      data: {
        email,
        password: hashPassword
      }
    });
    const { password: newUserPassword, ...rest } = newUser;
    return NextResponse.json({ user: rest, message: "User Created"}, { status: 201})
  } catch (error) {
    return NextResponse.json({ message: "Something went wrong!"}, { status: 500 } )
  }
}
