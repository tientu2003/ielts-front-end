import { NextResponse } from "next/server";
import { BlobServiceClient, StorageSharedKeyCredential } from "@azure/storage-blob";
import { getSessionUser } from "@/components/util/auth";

export const runtime = "nodejs";

export async function GET(req: Request) {
    try {
        const user = await getSessionUser();
        if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

        // Get the blobUrl from query parameters
        const { searchParams } = new URL(req.url);
        const blobName = searchParams.get('blobUrl');

        if (!blobName) {
            return NextResponse.json({ error: "No blob name provided" }, { status: 400 });
        }

        // Initialize Azure Storage client
        const account = process.env.AZURE_STORAGE_ACCOUNT!;
        const accountKey = process.env.AZURE_STORAGE_KEY!;
        const containerName = process.env.AZURE_CONTAINER_NAME!;

        const sharedKeyCredential = new StorageSharedKeyCredential(account, accountKey);
        const blobServiceClient = new BlobServiceClient(
            `https://${account}.blob.core.windows.net`,
            sharedKeyCredential
        );

        const containerClient = blobServiceClient.getContainerClient(containerName);
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);

        // Download the blob
        const downloadResponse = await blockBlobClient.download();

        if (!downloadResponse.readableStreamBody) {
            return NextResponse.json({ error: 'Could not download audio' }, { status: 404 });
        }

        // Convert stream to buffer
        const chunks: Uint8Array[] = [];
        for await (const chunk of downloadResponse.readableStreamBody) {
            chunks.push(Buffer.from(chunk).valueOf());
        }
        const buffer = Buffer.concat(chunks);

        // Return the audio data with appropriate headers
        return new NextResponse(buffer, {
            headers: {
                'Content-Type': 'audio/mpeg',
                'Content-Length': buffer.length.toString(),
                'Cache-Control': 'no-cache'
            },
        });

    } catch (error) {
        console.error('Error downloading audio:', error);
        return NextResponse.json({ error: 'Failed to download audio' }, { status: 500 });
    }
}