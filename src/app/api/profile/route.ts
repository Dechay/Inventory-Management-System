import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import jwt from 'jsonwebtoken';

async function getUserIdFromToken(request: Request) {
  try {
    const authHeader = request.headers.get('Authorization');
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new Error('No token found');
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: number };
    return decoded.userId;
  } catch (error) {
    console.error('Token error:', error);
    throw new Error('Authentication failed');
  }
}

export async function GET(request: Request) {
  try {
    // Get username from query parameter
    const { searchParams } = new URL(request.url);
    const username = searchParams.get('username');

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { username },
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        role: true,
        profilePicture: true
      },
    });

    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      ...user,
      profilePicture: user.profilePicture || "/images/profile/user-1.jpg"
    });
  } catch (error) {
    console.error('Profile fetch error:', error);
    return NextResponse.json(
      { error: "Failed to fetch profile" },
      { status: 500 }
    );
  }
}

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { username, ...updateData } = body;

    if (!username) {
      return NextResponse.json(
        { error: "Username is required" },
        { status: 400 }
      );
    }

    const updatedUser = await prisma.user.update({
      where: { username },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        username: true,
        role: true,
        profilePicture: true
      },
    });

    return NextResponse.json({
      ...updatedUser,
      profilePicture: updatedUser.profilePicture || "/images/profile/user-1.jpg"
    });
  } catch (error) {
    console.error('Profile update error:', error);
    return NextResponse.json(
      { error: "Failed to update profile" },
      { status: 500 }
    );
  }
}