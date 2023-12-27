import { NextRequest ,NextResponse } from "next/server"
import axios from "axios";
import User from "@/models/userModel";
import { connect } from "@/dbconfig/dbconfig";
connect()
export async function GET(request: NextRequest){
    try{
        User.
        return NextResponse.json({ message: "Data received successfully" , data: reqBody
    });
    } catch (error: any) {
        return NextResponse.json({error: error.message}, {status: 500})
    }
}