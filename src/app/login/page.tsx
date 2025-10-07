"use client";

import React, { useState } from "react";
import { signIn } from "@/auth";
import { useRouter, useSearchParams } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const error = params.get("error");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const res = await signIn("credentials", {
      username,
      password,
      redirect: false,
    });
    setSubmitting(false);
    if (!res || res.error) {
      // stays on page; error handled below
      return;
    }
    router.push("/");
  }

  return (
    <div className="flex flex-col items-center gap-6 w-full max-w-sm">
      <h1>Login</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 w-full border p-6 rounded bg-white dark:bg-[#0b0b3b]"
      >
        <label className="flex flex-col gap-1">
          <span>Username</span>
            <input
              className="border rounded p-2 bg-white dark:bg-black"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
              required
            />
        </label>
        <label className="flex flex-col gap-1">
          <span>Password</span>
          <input
            className="border rounded p-2 bg-white dark:bg-black"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            autoComplete="current-password"
            required
          />
        </label>
        {error && (
          <p className="text-red-500 text-sm">
            Invalid credentials.
          </p>
        )}
        <button
          disabled={submitting}
          className="bg-gray-800 text-white p-2 rounded cursor-pointer disabled:opacity-50"
        >
          {submitting ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
}