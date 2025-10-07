"use client";

import React, { useState, Suspense } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const error = params.get("error");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    try {
      const res = await signIn("credentials", {
        username,
        password,
        redirect: false,
      });
      if (!res || res.error) {
        return;
      }
      router.push("/");
    } catch (err) {
      console.error("Login failed", err);
    } finally {
      setSubmitting(false);
    }
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

export default function LoginPage() {
  return (
    <Suspense
      fallback={
        <div className="flex flex-col items-center gap-6 w-full max-w-sm">
          <h1>Login</h1>
          <p className="text-sm text-gray-500">Loading...</p>
        </div>
      }
    >
      <LoginForm />
    </Suspense>
  );
}