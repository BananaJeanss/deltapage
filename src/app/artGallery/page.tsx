"use client";

import { PrismaClient } from "../../../generated/prisma";
import SubmitArtwork from "@/components/artSubmit";

const prisma = new PrismaClient();

export default async function ArtGallery() {

  // Fetch only approved posts
  const posts = await prisma.artGalleryPost.findMany({
    where: { reviewState: "approved" },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="flex flex-col items-center">
      <h1>Art Gallery</h1>
      <SubmitArtwork />
      <p>
        Submit your own artwork via{" "}
        <span className="text-blue-500 cursor-pointer">this form</span>
      </p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {posts.map((post) => (
          <div key={post.id} className="border rounded p-4">
            <img
              src={post.contentUrl}
              alt={post.title || "Artwork"}
              className="w-full h-auto"
            />
            {post.title && <h3 className="mt-2">{post.title}</h3>}
            {post.description && (
              <p className="text-sm text-gray-600">{post.description}</p>
            )}
            <a
              href={post.artistLink}
              target="_blank"
              className="text-blue-500 text-sm"
            >
              by {post.artistHandle}
            </a>
          </div>
        )) ? (
          <p>No approved posts available.</p>
        ) : null}
      </div>
    </div>
  );
}
