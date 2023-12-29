import { NextRequest, NextResponse } from "next/server";
import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";

let reqBody: any;
connect();

export async function POST(request: NextRequest) {
  try {
    reqBody = await request.json();

    let userInDatabase = await User.findOne({ username: "Aman Agrawal" });

    if (!userInDatabase) {
      return NextResponse.json({ error: "User does not exist" }, { status: 400 });
    }

    let count = 0;
    let indexing: any;

    userInDatabase.idProduct.forEach((element: any, index: any) => {
      if (element == reqBody) {
        indexing = index;
        count++;
      }
    });

    if (count === 0) {
      await User.findOneAndUpdate(
        { username: "Aman Agrawal" },
        { $push: { idProduct: reqBody, Quantity: 1 } }
      );

      return NextResponse.json({
        message: "Data not found in the database idProduct array. So we added it",
      });
    }

    if (count !== 0) {
      await User.findOneAndUpdate(
        { username: "Aman Agrawal" },
        { $set: { [`Quantity.${indexing}`]: +userInDatabase.Quantity[indexing] + 1 } }
      );

      return NextResponse.json({
        message: "Data found in the database idProduct array. So we added Quantity",
      });
    }
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function GET(request: NextRequest){
    try{
        const userFromDatabase = await User.findOne({ username: "Aman Agrawal" });
        return  NextResponse.json({ message: "Data received successfully" ,
          Quantity  : userFromDatabase.Quantity,
          idProduct : userFromDatabase.idProduct 
    });
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}