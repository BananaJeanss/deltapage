"use client";

import React from "react";

import { Links } from "./library.json";

interface Link {
  category: string;
  title: string;
  description: string;
  link: string;
}

export default function LinkLibrary() {
  const UncategorizedLinks: { [key: string]: Link[] } = {};

  // categorize
  Object.entries(Links).forEach(([category, links]) => {
    UncategorizedLinks[category] = links;
  });

  // sort categories alphabetically
  const categorizedLinks = Object.keys(UncategorizedLinks).sort();

  return (
    <div className="p-4">
      <h1>Library of Links</h1>
      <div className="flex flex-col gap-8 sm:flex-row">
        <div className="flex flex-wrap gap-4">
          {categorizedLinks.map((category) => (
            <div key={category} className="w-full">
              <h2 id={category}>{category}</h2>
              <ul className="list-disc ml-6">
                {UncategorizedLinks[category].map((link, index) => (
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
        <div className="flex flex-col gap-4 order-first md:order-2">
          <h2>Table of Contents</h2>
          <ul className="list-disc ml-6">
            {categorizedLinks.map((category) => (
              <li key={category}>
                <a
                  href={`#${category}`}
                  className="text-blue-500 hover:underline"
                >
                  {category}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
