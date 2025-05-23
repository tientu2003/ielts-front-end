// components/UploadForm.tsx
export async function uploadAudioFile(audioBlob: Blob) {
    const form = new FormData();
    form.append("audio", audioBlob, "audio.mp3");

    const res = await fetch("/api/blob/upload", {
        method: "POST",
        body: form,
    });

    const data = await res.json();
    return data.blobName;
}
