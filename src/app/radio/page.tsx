"use client";

import { useState, useEffect, useRef } from "react";
import { Play, Pause } from "lucide-react";

const RADIO_BACKEND_URL = (process.env.NEXT_PUBLIC_RADIO_BACKEND_URL || "https://tsradio.bnajns.hackclub.app/").replace(/\/?$/, '/');

// this expects the radio to use https://github.com/BananaJeanss/tsradio
export default function RadioPage() {
  const [songInfo, setSongInfo] = useState({
    title: "Unknown",
    artist: "Unknown",
    album: "Unknown",
    length: 0,
    genre: "Unknown",
  });
  const [coverUrl, setCoverUrl] = useState(
    `${RADIO_BACKEND_URL}albumcover}`
  );

  useEffect(() => {
    function getMetadata() {
      fetch(`${RADIO_BACKEND_URL}metadata`)
        .then((res) => res.json())
        .then((data) => {
          setSongInfo(data);
          console.log(data);
        });
    }

    getMetadata();

    const interval = setInterval(() => {
      getMetadata();
    }, 10000);

    return () => clearInterval(interval);
  }, []);

  useEffect(() => {
    setCoverUrl(`${RADIO_BACKEND_URL}albumcover?${Date.now()}`);
  }, [songInfo.title]);

  useEffect(() => {
    if('mediaSession' in navigator) {
      navigator.mediaSession.metadata = new MediaMetadata({
        title: songInfo.title,
        artist: songInfo.artist,
        album: songInfo.album,
        artwork: [
          { src: coverUrl, sizes: '512x512', type: 'image/png' }
        ]
      });
    }
  }, [songInfo, coverUrl]);

  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
    } else {
      audio.play();
    }
    setIsPlaying(!isPlaying);
  };

  const humanReadableLength = (length: number) => {
    const minutes = Math.floor(length / 60);
    const seconds = Math.floor(length % 60);
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };
  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] p-4">
      <h1>Radio</h1>
      <audio
        ref={audioRef}
        id="radio-player"
        src={`${RADIO_BACKEND_URL}stream`}
        autoPlay
        controls={false}
      />

      <div
        className="flex items-center gap-4 mt-2 border-white border-4 bg-black p-4"
        style={{ fontFamily: `var(--deltafont)` }}
      >
        <button
          onClick={togglePlay}
          className="p-3 bg-white/10 hover:bg-white/20 rounded-full transition"
        >
          {isPlaying ? <Pause size={24} /> : <Play size={24} />}
        </button>
        <div className="flex flex-col">
          <span>{songInfo.title}</span>
          <span className="text-sm text-white/50">{songInfo.artist}</span>
        </div>
        { /* eslint-disable-next-line @next/next/no-img-element */ }
        <img
          src={coverUrl}
          alt="Album Cover"
          className="w-16 h-16 object-cover"
        />
      </div>
      <details className="mt-4 text-sm text-white/50">
        <summary className="cursor-pointer">Metadata</summary>
        <div className="mt-2">
          <p>Song Name: {songInfo.title}</p>
          <p>Artist: {songInfo.artist}</p>
          <p>Album: {songInfo.album}</p>
          <p>Length: {humanReadableLength(songInfo.length)}</p>
          <p>Backend/Source URL: <a href={RADIO_BACKEND_URL}>{RADIO_BACKEND_URL}</a></p>
        </div>
      </details>
    </div>
  );
}
