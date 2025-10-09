import { PrismaClient } from "../../../generated/prisma";
import GalleryGrid from "./GalleryGrid";
import { unstable_noStore } from "next/cache";

const prisma = new PrismaClient();

export default async function ServeGallery() {
  unstable_noStore();
  // fetch only approved posts
  const posts = await prisma.artGalleryPost.findMany({
    where: { reviewState: "approved" },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      title: true,
      description: true,
      contentUrl: true,
      artistLink: true,
      artistHandle: true,
    },
  });

  const mapped = posts.map(p => ({ ...p, id: String(p.id) }));
  return <GalleryGrid posts={mapped} />;
}
