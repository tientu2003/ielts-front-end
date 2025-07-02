// components/UploadForm.tsx
export async function uploadAudioFile(audioBlob: Blob): Promise<string> {
    try {
        // Validate the blob
        if (!audioBlob || audioBlob.size === 0) {
            throw new Error("Invalid or empty audio blob");
        }

        const form = new FormData();

        // Create a proper File object from the Blob
        const audioFile = new File([audioBlob], "audio.mp3", {
            type: "audio/mpeg"
        });

        form.append("audio", audioFile);

        const res = await fetch("/api/blob/upload", {
            method: "POST",
            body: form,
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || `HTTP ${res.status}: ${res.statusText}`);
        }

        const data = await res.json();

        if (!data.blobName) {
            throw new Error("No blob name returned from server");
        }

        return data.blobName;
    } catch (error) {
        console.error("Upload failed:", error);
        throw error; // Re-throw to be handled by the calling component
    }
}