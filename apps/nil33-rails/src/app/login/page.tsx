"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const callbackUrl = params.get("callbackUrl") ?? "/nil33";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);
    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    setLoading(false);
    if (res?.error) {
      setError("Invalid email or password.");
    } else {
      router.push(callbackUrl);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface px-4">
      <div className="w-full max-w-sm">
        {/* Logo mark */}
        <div className="mb-8 text-center">
          <span className="font-mono text-2xl font-bold tracking-tighter text-rails-green">
            NIL<span className="text-rails-text">33</span>
          </span>
          <p className="mt-1 text-sm text-rails-text-dim">Institutional Rails</p>
        </div>

        <div className="card">
          <h1 className="mb-6 text-lg font-semibold text-rails-text">Sign in</h1>

          {error && (
            <div className="mb-4 rounded-lg border border-rails-red/30 bg-rails-red/10 px-3 py-2 text-sm text-rails-red">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-rails-text-dim">
                Email
              </label>
              <input
                type="email"
                className="input"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="admin@nil33.dev"
                required
                autoComplete="email"
              />
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-rails-text-dim">
                Password
              </label>
              <input
                type="password"
                className="input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                autoComplete="current-password"
              />
            </div>

            <button type="submit" className="btn-primary mt-2 justify-center" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
            </button>
          </form>
        </div>

        <p className="mt-6 text-center text-xs text-rails-text-dim">
          NIL33 Rails v0.1 — Institutional use only.
        </p>
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center bg-surface px-4">
        <span className="text-sm text-rails-text-dim">Loading…</span>
      </div>
    }>
      <LoginForm />
    </Suspense>
  );
}
