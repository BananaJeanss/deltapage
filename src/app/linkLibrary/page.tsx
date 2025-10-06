"use client";

import React from "react";

import { Links } from "./library.json";
import { link } from "fs";

interface Link {
  category: string;
  title: string;
  description: string;
  link: string;
}

export default function LinkLibrary() {
  const categorizedLinks: { [key: string]: Link[] } = {};

  // categorize
  Links.forEach((link) => {
    if (!categorizedLinks[link.category]) {
      categorizedLinks[link.category] = [];
    }
    categorizedLinks[link.category].push(link);
  });
  return (
    <div>
      <h1>Library of Links</h1>
      <div className="flex flex-wrap gap-4">
        {Object.keys(categorizedLinks).map((category) => (
          <div key={category} className="w-full">
            <h2>{category}</h2>
            <ul className="list-disc ml-6">
              {categorizedLinks[category].map((link, index) => (
                <li key={index}>
                  <a
                    href={link.link}
                    className="text-blue-500 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.title}
                  </a>
                  <p className="text-sm text-gray-500">{link.description}</p>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
