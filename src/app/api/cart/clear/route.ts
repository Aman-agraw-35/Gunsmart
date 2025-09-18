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
    
    const user = await User.findById(decoded.id);
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    await User.findByIdAndUpdate(decoded.id, {
      $set: {
        idProduct: [],
        Quantity: []
      }
    }, { new: true });

    return NextResponse.json({ success: true });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}