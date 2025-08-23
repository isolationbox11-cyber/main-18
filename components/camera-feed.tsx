'use client';
import { useEffect, useRef, useState } from 'react';

export function CameraFeed() {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let videoEl: HTMLVideoElement | null = null;   // <-- capture the ref value once

    async function startCam() {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment" },
          audio: false,
        });
        videoEl = videoRef.current;                 // store the current element
        if (videoEl) videoEl.srcObject = stream;
      } catch (e: any) {
        setError(e?.message ?? "Cannot access camera");
      }
    }

    startCam();

    // cleanup – use the saved reference; it won’t change after the effect runs
    return () => {
      if (videoEl?.srcObject) {
        const tracks = (videoEl.srcObject as MediaStream).getTracks();
        tracks.forEach((t) => t.stop());
      }
    };
  }, []); // empty deps – we only need to run once on mount

  if (error) return <p className="text-red-400">{error}</p>;
  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden shadow-lg">
      <video ref={videoRef} autoPlay muted playsInline className="w-full h-full object-cover" />
    </div>
  );
}
