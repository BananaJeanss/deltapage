"use server";

import { PrismaClient } from "../../../generated/prisma";

const prisma = new PrismaClient();

export async function submitArtwork(formData: FormData) {
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const contentUrl = formData.get("contentUrl") as string;
  const artistLink = formData.get("artistLink") as string;
  const artistHandle = formData.get("artistHandle") as string;

  console.log("Submitting artwork:", { title, description, contentUrl, artistLink, artistHandle });

  try {
    const post = await prisma.artGalleryPost.create({
      data: {
        title: title || null,
        description: description || null,
        contentUrl,
        artistLink,
        artistHandle,
        reviewState: "pending",
      },
    });
    console.log("Successfully created post:", post.id);
    return { success: true, post };
  } catch (error) {
    console.error("Error submitting artwork:", error);
    return { success: false, error: "Failed to submit artwork" };
  }
}