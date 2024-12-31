'use client'

const AudioPlayer = ({src}:{src:string})=>{

    return (
        <audio style={{width: '100%'}} controls>
            <source src={src} type="audio/mp3"/>
            Your browser does not support the audio element.
        </audio>
    )
}

export default AudioPlayer