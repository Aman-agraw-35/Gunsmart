import { NextRequest ,NextResponse } from "next/server"
import axios from "axios";
import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";

var reqBody:any ;

connect()

export async function POST(request: NextRequest){
    try {
       reqBody = await request.json() 
       console.log(reqBody)
  
       const user = await User.findOneAndUpdate({ _id :"658de35d481ca2b3a45d051b"},
       { $push: { idProduct : reqBody , Quantity : 1 } })
       if(!user){
           return NextResponse.json({error: "User does not exist"}, {status: 400})
       }
       console.log("user exists");
        
        return NextResponse.json({ message: "Data received successfully" , data: reqBody
     });
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}