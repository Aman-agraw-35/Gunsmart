import { NextRequest, NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connect } from "@/dbconfig/dbconfig";
import User from "@/models/userModel";

connect();

export async function GET(request: NextRequest) {
    try {
        const token = request.cookies.get("token")?.value || "";
        
        if (!token) {
            return NextResponse.json({
                message: "No token found",
                success: false
            });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY!) as { id: string };
        const user = await User.findById(decoded.id).select("-password");

        if (!user) {
            return NextResponse.json({
                message: "User not found",
                success: false
            });
        }

        return NextResponse.json({
            message: "User found",
            success: true,
            user: {
                username: user.username,
                email: user.email,
                id: user._id
            }
        });

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 401 });
    }
}