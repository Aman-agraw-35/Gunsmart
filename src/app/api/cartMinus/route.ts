import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";
import jwt from "jsonwebtoken";
let reqBody: any;
connect();

export async function POST(request: NextRequest){
    try {
        const token = request.cookies.get("token")?.value;
    
        if (!token) {
            return NextResponse.json({ error: "Please login first" }, { status: 401 });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { id: string };
        const reqBody = await request.json();

        const userInDatabase = await User.findById(decoded.id);
        if (!userInDatabase) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (!Array.isArray(userInDatabase.idProduct)) userInDatabase.idProduct = [];
        if (!Array.isArray(userInDatabase.Quantity)) userInDatabase.Quantity = [];

        if (reqBody.minus) {
          const minusIdStr = String(reqBody.minus);
          const amount = Number(reqBody.amount ?? 1);
          if (!Number.isFinite(amount) || amount <= 0) {
            return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
          }

          const index = userInDatabase.idProduct.findIndex((el: any) => String(el) === minusIdStr);
          if (index === -1) {
            return NextResponse.json({ error: "Item not found in cart" }, { status: 404 });
          }

          const currentQty = Number(userInDatabase.Quantity[index] ?? 0);
          if (currentQty <= amount) {
            await User.findByIdAndUpdate(
              decoded.id,
              { $pull: { idProduct: minusIdStr, Quantity: { $in: [userInDatabase.Quantity[index]] } } },
              { new: true }
            );
            return NextResponse.json({ message: "Item removed from cart", success: true });
          }

          await User.findByIdAndUpdate(
            decoded.id,
            { $set: { [`Quantity.${index}`]: currentQty - amount } },
            { new: true }
          );

          return NextResponse.json({ message: "Item quantity decreased", success: true });
        }

        if (reqBody.remove) {
          const removeIdStr = String(reqBody.remove);
          const index = userInDatabase.idProduct.findIndex((el: any) => String(el) === removeIdStr);
          if (index === -1) {
            return NextResponse.json({ error: "Item not found in cart" }, { status: 404 });
          }

          await User.findByIdAndUpdate(
            decoded.id,
            { $pull: { idProduct: removeIdStr, Quantity: { $in: [userInDatabase.Quantity[index]] } } },
            { new: true }
          );

          return NextResponse.json({ message: "Item removed from cart", success: true });
        }
      
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}