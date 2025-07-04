
import { NextResponse } from "next/server";
import { BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob";
import { getSessionUser } from "@/components/util/auth";
import { v4 as uuidv4 } from "uuid";

export const runtime = "nodejs";

export async function POST(req: Request) {
    try {
        const user = await getSessionUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        const formData = await req.formData();
        const file = formData.get("audio") as File;

        // Enhanced file validation
        if (!file) {
            return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
        }

        if (!(file instanceof File)) {
            return NextResponse.json({ error: "Invalid file format" }, { status: 400 });
        }

        if (file.size === 0) {
            return NextResponse.json({ error: "Empty file provided" }, { status: 400 });
        }

        // Validate environment variables
        const account = process.env.AZURE_STORAGE_ACCOUNT;
        const accountKey = process.env.AZURE_STORAGE_KEY;
        const containerName = process.env.AZURE_CONTAINER_NAME;

        if (!account || !accountKey || !containerName) {
            console.error("Missing Azure storage configuration");
            return NextResponse.json({ error: "Storage configuration error" }, { status: 500 });
        }

        const blobName = `${user}/${uuidv4()}.mp3`;

        const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
        const blobServiceClient = new BlobServiceClient(
            `https://${account}.blob.core.windows.net`,
            sharedKeyCredential
        );

        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        // Safe arrayBuffer handling with validation
        let arrayBuffer: ArrayBuffer;
        try {
            arrayBuffer = await file.arrayBuffer();
        } catch (error) {
            console.error("Failed to read file arrayBuffer:", error);
            return NextResponse.json({ error: "Failed to read file data" }, { status: 400 });
        }

        if (!arrayBuffer || arrayBuffer.byteLength === 0) {
            return NextResponse.json({ error: "Empty or invalid file data" }, { status: 400 });
        }

        const buffer = Buffer.from(arrayBuffer);

        await blockBlobClient.uploadData(buffer, {
            blobHTTPHeaders: { blobContentType: "audio/mpeg" },
        });

        return NextResponse.json({ blobName });

    } catch (error) {
        console.error("Blob upload error:", error);
        return NextResponse.json({
            error: "Failed to upload file",
            details: error instanceof Error ? error.message : "Unknown error"
        }, { status: 500 });
    }
}