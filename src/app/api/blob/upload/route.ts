// app/api/blob/upload/route.ts

import { NextResponse } from "next/server";
import { BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob";
import { getSessionUser } from "@/components/util/auth";
import { v4 as uuidv4 } from "uuid";

export const runtime = "nodejs";

export async function POST(req: Request) {
    const user = await getSessionUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const formData = await req.formData();
    const file = formData.get("audio") as File;

    if (!file) {
        return NextResponse.json({ error: "No audio file provided" }, { status: 400 });
    }

    const account = process.env.AZURE_STORAGE_ACCOUNT!;
    const accountKey = process.env.AZURE_STORAGE_KEY!;
    const containerName = process.env.AZURE_CONTAINER_NAME!;
    const blobName = `${user}/${uuidv4()}.mp3`;

    const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
    const blobServiceClient = new BlobServiceClient(
        `https://${account}.blob.core.windows.net`,
        sharedKeyCredential
    );

    const containerClient = blobServiceClient.getContainerClient(containerName);
    const blockBlobClient = containerClient.getBlockBlobClient(blobName);

    const buffer = Buffer.from(await file.arrayBuffer());

    await blockBlobClient.uploadData(buffer, {
        blobHTTPHeaders: { blobContentType: "audio/mpeg" },
    });

    return NextResponse.json({ blobName });
}


