"use client";

import { useState } from "react";
import { submitArtwork } from "@/app/actions/artGallery";

export default function SubmitArtwork() {
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSubmitting(true);

    const formData = new FormData(e.currentTarget);
    const result = await submitArtwork(formData);

    if (result.success) {
      alert("Artwork submitted for review!");
      e.currentTarget.reset();
    } else {
      alert("Failed to submit artwork");
    }

    setSubmitting(false);
  }

  return (
    <div id="submitForm" className="absolute bg-black/50 w-screen h-screen top-0 left-0 flex items-center justify-center z-100">
      <div className="bg-gray-950 border border-[#c7e3f2] p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Submit Artwork</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="title">
              Title
            </label>
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="text"
              id="title"
              name="title"
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1"
              htmlFor="description"
            >
              Description
            </label>
            <textarea
              className="w-full p-2 border border-gray-300 rounded"
              id="description"
              name="description"
            ></textarea>
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1 cursor-help"
              htmlFor="image"
              title="Enter the direct URL to your image file (example: https://pbs.twimg.com/media/G2qZdR9W4AATqrR?format=jpg&name=small)"
            >
              Raw Content Url 🛈
            </label>
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="text"
              id="image"
              name="contentUrl"
              required
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1 cursor-help"
              htmlFor="artist"
              title="The link to the artist's profile. (Twitter/X, Youtube, Reddit, etc.)"
            >
              Artist Link 🛈
            </label>
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="text"
              id="artist"
              name="artistLink"
              required
            />
          </div>
          <div>
            <label
              className="block text-sm font-medium mb-1 cursor-help"
              htmlFor="artist"
              title="Handle to display the artist's link as."
            >
              Artist Handle 🛈
            </label>
            <input
              className="w-full p-2 border border-gray-300 rounded"
              type="text"
              id="artistHandle"
              name="artistHandle"
              required
            />
          </div>
          <button
            className="w-full bg-blue-500 text-white p-2 rounded transition hover:bg-blue-600 disabled:opacity-50 cursor-pointer"
            type="submit"
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit"}
          </button>
        </form>
      </div>
    </div>
  );
}
