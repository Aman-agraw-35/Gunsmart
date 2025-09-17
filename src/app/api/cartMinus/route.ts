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
      
      let indexingMinus: any;      
      if(reqBody.minus){
      userInDatabase.idProduct.forEach((element: any, index: any) => {
        if (element == reqBody.minus) {
          indexingMinus = index;
        }
      });
      if (userInDatabase.Quantity[indexingMinus] == 1) {
        await User.findByIdAndUpdate(decoded.id,
          {
            $unset: {
              [`idProduct.${indexingMinus}`]: 1,
              [`Quantity.${indexingMinus}`]: 1,
            },
          }
        );
        await User.findByIdAndUpdate(
          decoded.id,
          {
            $pull: { idProduct: null, Quantity: null },
          }
        );
      }else{
      await User.findByIdAndUpdate(
        decoded.id,
        { $set: { [`Quantity.${indexingMinus}`]: +userInDatabase.Quantity[indexingMinus] - 1 } }
      );
    }
      return NextResponse.json({
        message: "we subtracted Quantity",
      });
      }

      let indexingRemove: any;
      if(reqBody.remove){
        userInDatabase.idProduct.forEach((element: any, index: any) => {
          if (element == reqBody.remove) {
            indexingRemove = index;
          }
        });
          await User.findOneAndUpdate({ username: "Aman Agrawal" },
            {
              $unset: {
                [`idProduct.${indexingRemove}`]: 1,
                [`Quantity.${indexingRemove}`]: 1,
              },
            }
          );
          await User.findOneAndUpdate(
            { username: "Aman Agrawal" },
            {
              $pull: { idProduct: null, Quantity: null },
            }
          )
      
        return NextResponse.json({
          message: "we subtracted Quantity",
        });
        }
      
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}