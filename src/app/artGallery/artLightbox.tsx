"use client";

import { X } from "lucide-react";

export type LightboxData = {
  contentUrl: string;
  title: string | null;
  description: string | null;
  artistLink: string | null;
  artistHandle: string | null;
};

export function openArtLightbox(data: LightboxData) {
  const box = document.getElementById("artLightbox");
  if (!box) return;
  const img = document.getElementById("lightboxImage") as HTMLImageElement | null;
  const titleEl = document.getElementById("lightboxTitle");
  const descEl = document.getElementById("lightboxDescription");
  const artistEl = document.getElementById("artistLink") as HTMLAnchorElement | null;

  if (img) {
    img.src = data.contentUrl;
    img.alt = data.title || "Artwork";
  }
  if (titleEl) titleEl.textContent = data.title || "Untitled";
  if (descEl) descEl.textContent = data.description || "";
  if (artistEl) {
    if (data.artistLink) {
      artistEl.href = data.artistLink;
      artistEl.textContent = data.artistHandle ? `by ${data.artistHandle}` : "Artist";
      artistEl.style.display = "";
    } else {
      artistEl.style.display = "none";
    }
  }
  // show
  box.style.display = "flex";
  // prevent body scroll
  document.body.style.overflow = "hidden";
  // move focus for accessibility
  (box as HTMLElement).focus();
}

export default function ArtLightbox() {
  // close helper
  function close() {
    const lb = document.getElementById("artLightbox");
    if (lb) lb.style.display = "none";
    document.body.style.overflow = "";
  }

  // attach escape key listener once
  if (typeof window !== "undefined" && !window.__artLightboxEsc) {
    window.__artLightboxEsc = true;
    window.addEventListener("keydown", (e) => {
      if (e.key === "Escape") {
        const lb = document.getElementById("artLightbox");
        if (lb && lb.style.display !== "none") close();
      }
    });
  }

  return (
    <div
      id="artLightbox"
      role="dialog"
      aria-modal="true"
      aria-labelledby="lightboxTitle"
      aria-describedby="lightboxDescription"
      tabIndex={-1}
      onClick={(e) => {
        if (e.target === e.currentTarget) close();
      }}
      className="hidden bg-black/70 w-screen h-screen top-0 left-0 fixed items-center justify-center flex-col z-[100] overflow-hidden p-4"
    >
      <button
        aria-label="Close"
        className="absolute top-3 right-4 text-white hover:text-red-400 focus:outline-none"
        onClick={close}
      >
        <X size={24} className="cursor-pointer"/>
      </button>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        id="lightboxImage"
        src="null"
        alt="Expanded artwork"
        className="max-h-[70vh] max-w-[90vw] object-contain rounded shadow-lg"
      />
      <div className="mt-4 text-center text-white space-y-2 max-w-[80ch]">
        <h2 id="lightboxTitle" className="font-semibold text-lg">title</h2>
        <p id="lightboxDescription" className="text-sm opacity-90">description</p>
        <a
          id="artistLink"
          href=""
          target="_blank"
          rel="noopener noreferrer"
          className="underline text-sm hover:text-cyan-300"
        >
          by @handle
        </a>
      </div>
    </div>
  );
}

declare global {
  interface Window {
    __artLightboxEsc?: boolean;
  }
}