import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { prisma } from "@/utils/prisma";

export async function POST(req) {
  const { userId, code } = await req.json();

  try {
    const findUserAndCode = await prisma.verificationCode.findFirst({
      where: {
        userId,
        code,
      },
    });
    if (findUserAndCode) {
      const updateUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          verified: true,
        },
      });
      return NextResponse.json({ message: "User verified" });
    }
    return NextResponse.json({ errorMessage: "User not found" }, { status: 404 });
  } catch (error) {
    console.log(error);
  }
}
