"use client";

import { FormEvent, useState } from "react";
import { createSupabaseBrowserClient } from "@/lib/supabase";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  async function signIn(event: FormEvent) {
    event.preventDefault();
    const supabase = createSupabaseBrowserClient();
    const { error } = await supabase.auth.signInWithOtp({ email });
    setMessage(error ? error.message : "Check your email for a login link.");
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-slate-100 p-4">
      <form onSubmit={signIn} className="w-full max-w-md space-y-4 rounded-lg border bg-white p-6 shadow-sm">
        <h1 className="text-xl font-semibold">Field Cost Tracker Login</h1>
        <p className="text-sm text-slate-600">Use your company email for passwordless sign-in.</p>
        <div>
          <label htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            placeholder="name@company.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            required
          />
        </div>
        <button className="w-full rounded-md bg-brand px-4 py-2 font-medium text-white" type="submit">
          Send Magic Link
        </button>
        {message ? <p className="text-sm text-slate-600">{message}</p> : null}
      </form>
    </main>
  );
}
