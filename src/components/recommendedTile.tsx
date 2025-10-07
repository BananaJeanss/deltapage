"use client";

import Image from "next/image";
import Link from "next/link";

interface RecommendedTileProps {
  image: string;
  title: string;
  description: string;
  urllink: string;
}

export default function RecommendedTile({
  image,
  title,
  description,
  urllink,
}: RecommendedTileProps) {
  return (
    <div className="border rounded-md p-4 w-64 h-75 flex ">
      <Link href={urllink} className="rec-tile flex flex-col items-center">
        <div className="flex-1 flex items-center justify-center">
          <Image
            src={image}
            alt={title}
            width={256}
            height={256}
            className="object-contain max-h-40"
          />
        </div>
        <div className="text-center">
          <h3>{title}</h3>
          <p className="text-sm font-light text-gray-500">{description}</p>
        </div>
      </Link>
    </div>
  );
}
