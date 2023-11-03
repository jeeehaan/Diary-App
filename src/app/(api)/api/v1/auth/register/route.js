import { prisma } from "@/utils/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { customAlphabet, nanoid } from "nanoid";
import { resend } from "@/utils/resend";

export async function POST(req) {
  const { firstName, lastName, username, email, password } = await req.json();

  try {
    // Create hashed password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user to database
    const createUser = await prisma.user.create({
      data: {
        firstName,
        lastName,
        username,
        email,
        password: hashedPassword,
      },
    });

    // If user created successfully, create verification code
    if (createUser) {
      const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyz1234567890", 6);
      const generatedCode = nanoid(4);
      const generateCode = await prisma.verificationCode.create({
        data: {
          userId: createUser.id,
          code: generatedCode,
        },
      });
      const sendEmail = await resend.emails.send({
        from: "Diary App <jessyhanif@gmail.com>",
        to: createUser.email,
        subject: "Verification Code - Diary App",
        html: `<p>Your verfication code is ${generateCode}</p>`,
      });
      console.log(sendEmail);
    }

    return NextResponse.json({ data: createUser, message: "user created succesfully" }, { status: 201 });
  } catch (error) {
    console.log(error);
    return NextResponse.json({ errorMessage: "something went wrong. Please try again later" }, { status: 500 });
  }
}
