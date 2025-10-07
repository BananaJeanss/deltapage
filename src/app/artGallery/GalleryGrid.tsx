"use client";

import { openArtLightbox, type LightboxData } from "./artLightbox";

export type GalleryPost = LightboxData & { id: string };

export default function GalleryGrid({ posts }: { posts: GalleryPost[] }) {
  return (
    <div className="flex flex-wrap flex-row gap-4 pt-4">
      {posts.map((post) => (
        <div key={post.id} className="cursor-pointer group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={post.contentUrl}
            alt={post.title || "Artwork"}
            className="w-64 h-64 object-cover rounded shadow-sm transition group-hover:opacity-85 group-active:scale-[0.98]"
            onClick={() =>
              openArtLightbox({
                contentUrl: post.contentUrl,
                title: post.title,
                description: post.description,
                artistLink: post.artistLink,
                artistHandle: post.artistHandle,
              })
            }
          />
        </div>
      ))}
    </div>
  );
}
