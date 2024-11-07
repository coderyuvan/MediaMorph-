import { v2 as cloudinary } from "cloudinary";
import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";

cloudinary.config({
    cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});
interface CloudinaryUploadResult {
    public_id: string;
    [key: string]: any
}

export async function POST(request: NextRequest) {
    const { userId } = await auth()

    if (!userId) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }
    //upload anything on cloudinary  sever
    try {
        const formData = await request.formData()
        const file = formData.get('file') as File | null
        if (!file) {
            return NextResponse.json({ error: "No file uploaded" }, { status: 400 })
        }
        // uplaod anything anywhere
        const bytes = await file.arrayBuffer()
        const buffer = Buffer.from(bytes)
        const result = await new Promise<CloudinaryUploadResult>(
            (resolve, reject) => {
                const uploadStream = cloudinary.uploader.upload_stream(
                    { folder: "mediaMorph Images" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result as CloudinaryUploadResult);
                    }
                )
                uploadStream.end(buffer)
            }
        )
        return NextResponse.json(
            {
                publicId: result.public_id
            },
            {
                status: 200
            }
        )

    } catch (error) {
        return NextResponse.json({ error: "Upload image failed" }, { status: 500 })
    }
}