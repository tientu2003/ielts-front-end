import React, {useRef, useEffect } from 'react';

interface AudioRecorderProps {
  onRecordingComplete: (audioBlob: Blob) => void;
  isRecording: boolean;
  recordingTime: number;
}

const AudioRecorder: React.FC<AudioRecorderProps> = ({
                                                       onRecordingComplete,
                                                       isRecording,
                                                       recordingTime,
                                                     }) => {
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);

  useEffect(() => {
    let stream: MediaStream | null = null;

    const startRecording = async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mediaRecorder = new MediaRecorder(stream);
        mediaRecorderRef.current = mediaRecorder;
        chunksRef.current = [];

        mediaRecorder.ondataavailable = (e) => {
          if (e.data.size > 0) {
            chunksRef.current.push(e.data);
          }
        };

        mediaRecorder.onstop = () => {
          const audioBlob = new Blob(chunksRef.current, { type: 'audio/mpeg' });
          onRecordingComplete(audioBlob);
        };

        mediaRecorder.start();

        // Stop recording after the specified time
        setTimeout(() => {
          if (mediaRecorder.state === 'recording') {
            mediaRecorder.stop();
            stream?.getTracks().forEach(track => track.stop());
          }
        }, recordingTime * 1000);
      } catch (error) {
        console.error('Error accessing microphone:', error);
      }
    };

    if (isRecording) {
      startRecording().then(r => console.log(r));
    }

    return () => {
      if (mediaRecorderRef.current?.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
      stream?.getTracks().forEach(track => track.stop());
    };
  }, [isRecording, recordingTime, onRecordingComplete]);

  return null;
};

export default AudioRecorder;