import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        const { name, username, email, password } = body;

        // Validate required fields
        if (!name || !username || !email || !password) {
            return NextResponse.json(
                { 
                    success: false,
                    error: "All fields are required" 
                },
                { status: 400 }
            );
        }

        // Check if email or username already exists
        const existingUser = await prisma.user.findFirst({
            where: {
                OR: [
                    { email },
                    { username }
                ]
            }
        });

        if (existingUser) {
            return NextResponse.json(
                { 
                    success: false,
                    error: existingUser.email === email 
                        ? "Email already exists" 
                        : "Username already exists" 
                },
                { status: 400 }
            );
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user
        const user = await prisma.user.create({
            data: {
                name,
                username,
                email,
                password: hashedPassword,
                role: "USER"  // Default role
            },
        });

        // Remove password from response
        const { password: _, ...userWithoutPassword } = user;

        return NextResponse.json(
            {
                success: true,
                message: "User registered successfully",
                user: userWithoutPassword
            },
            { 
                status: 201,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    } catch (error: any) {
        console.error("Registration error:", error);

        // Handle Prisma specific errors
        if (error.code === 'P2002') {
            return NextResponse.json(
                { 
                    success: false,
                    error: "Username or email already exists" 
                },
                { status: 400 }
            );
        }

        // Generic error response
        return NextResponse.json(
            { 
                success: false,
                error: "Failed to register user" 
            },
            { 
                status: 500,
                headers: {
                    'Content-Type': 'application/json'
                }
            }
        );
    }
}