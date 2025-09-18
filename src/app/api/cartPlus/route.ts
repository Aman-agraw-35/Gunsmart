import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";
import jwt from "jsonwebtoken";

connect();

export async function POST(request: NextRequest) {
  try {
    const token = request.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Please login first" }, { status: 401 });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { id: string };
    const reqBody = await request.json();

    if (!reqBody?.plus) {
      return NextResponse.json({ error: "Item ID is required" }, { status: 400 });
    }

    const amount = Number(reqBody.amount ?? 1);
    if (!Number.isFinite(amount) || amount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }

    const userInDatabase = await User.findById(decoded.id);
    if (!userInDatabase) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!Array.isArray(userInDatabase.idProduct)) userInDatabase.idProduct = [];
    if (!Array.isArray(userInDatabase.Quantity)) userInDatabase.Quantity = [];

    const plusIdStr = String(reqBody.plus);
    const index = userInDatabase.idProduct.findIndex((el: any) => String(el) === plusIdStr);

    if (index === -1) {
      await User.findByIdAndUpdate(
        decoded.id,
        { $push: { idProduct: plusIdStr, Quantity: amount } },
        { new: true }
      );

      return NextResponse.json({ message: "Item added to cart", success: true });
    }

    const currentQty = Number(userInDatabase.Quantity[index] ?? 0);
    await User.findByIdAndUpdate(
      decoded.id,
      { $set: { [`Quantity.${index}`]: currentQty + amount } },
      { new: true }
    );

    return NextResponse.json({ message: "Item quantity increased", success: true });
  } catch (error: any) {
    console.error("cartPlus error:", error);
    return NextResponse.json({ error: error.message || "Internal server error" }, { status: 500 });
  }
}