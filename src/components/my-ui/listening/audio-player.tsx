'use client'

import React from "react";

const AudioPlayer = ({src}: { src: string }) => {
    const handlePlay = (e: React.SyntheticEvent<HTMLAudioElement>) => {
        const allAudios = document.getElementsByTagName('audio');
        for (let audio of allAudios) {
            if (audio !== e.currentTarget) {
                audio.pause();
                audio.currentTime = 0;
            }
        }
    };

    return (
        <audio
            style={{width: '100%'}}
            controls
            onPlay={handlePlay}
        >
            <source src={src} type="audio/mp3"/>
            Your browser does not support the audio element.
        </audio>
    )
}

export default AudioPlayer