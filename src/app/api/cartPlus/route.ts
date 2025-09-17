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

        // Verify token and get user ID
        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { id: string };
        reqBody = await request.json();
        
        let userInDatabase = await User.findById(decoded.id);
        if (!userInDatabase) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }
      
      let indexing: any;
      userInDatabase.idProduct.forEach((element: any, index: any) => {
        if (element == reqBody.plus) {
          indexing = index;
        }
      })

      await User.findByIdAndUpdate(
        decoded.id,
        { $set: { [`Quantity.${indexing}`]: +userInDatabase.Quantity[indexing] + 1 } }
      );

      return NextResponse.json({
        message: "we subtracted Quantity",
      });

    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}