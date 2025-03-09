import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { username, password } = body;

        if (!username || !password) {
            return NextResponse.json(
                { error: "Username and password are required" },
                { status: 400 }
            );
        }

        // Find user by username
        const user = await prisma.user.findUnique({
            where: { username }
        });

        if (!user) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) {
            return NextResponse.json(
                { error: "Invalid credentials" },
                { status: 401 }
            );
        }

        // Generate JWT token
        const token = jwt.sign(
            { 
                userId: user.id,
                username: user.username,
                role: user.role 
            },
            process.env.JWT_SECRET || 'your-secret-key',
            { expiresIn: '24h' }
        );

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json({
            success: true,
            message: "Login successful",
            user: userWithoutPassword,
            token
        });

    } catch (error) {
        console.error("Login error:", error);
        return NextResponse.json(
            { 
                success: false,
                error: "Login failed" 
            },
            { status: 500 }
        );
    }
}
