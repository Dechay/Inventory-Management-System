import { NextResponse } from "next/server";
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import prisma from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file uploaded" },
        { status: 400 }
      );
    }

    const uploadDir = join(process.cwd(), 'public', 'uploads');
    await mkdir(uploadDir, { recursive: true });

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const timestamp = Date.now();
    const extension = file.name.split('.').pop();
    const filename = `profile-${timestamp}.${extension}`;
    const filepath = join(uploadDir, filename);
    const fileUrl = `/uploads/${filename}`;

    // Save file first
    await writeFile(filepath, buffer);

    try {
      // Then update database
      const userId = 1; // Replace with actual user ID
      await prisma.user.update({
        where: { id: userId },
        data: {
          profilePicture: fileUrl
        }
      });

      return NextResponse.json({
        url: fileUrl,
        message: "Profile picture updated successfully"
      });
    } catch (dbError) {
      console.error('Database error:', dbError);
      // Still return the URL since file was uploaded
      return NextResponse.json({
        url: fileUrl,
        message: "File uploaded but database update failed"
      });
    }
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: "Failed to upload file" },
      { status: 500 }
    );
  }
}