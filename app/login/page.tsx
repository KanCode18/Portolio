'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const AUTH_KEY = 'kanishk-portfolio-auth';
const USERNAME = 'kanishk';
const PASSWORD = 'PortfolioLogin!23';

export default function LoginPage() {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.localStorage.getItem(AUTH_KEY) === 'true') {
      router.replace('/admin');
    }
  }, [router]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (username.trim() === USERNAME && password === PASSWORD) {
      window.localStorage.setItem(AUTH_KEY, 'true');
      router.push('/admin');
      return;
    }
    setError('Invalid credentials.');
  };

  return (
    <main className="min-h-screen bg-[var(--bg)] px-6 py-20 text-[var(--text)] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-xl rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-10 shadow-[var(--shadow)]">
        <p className="text-sm uppercase tracking-[0.35em] text-[var(--accent)]">Hidden access</p>
        <h1 className="mt-4 text-4xl font-heading font-semibold">Secure admin login</h1>
        <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
          Enter the secret credentials to update the CV and sync the portfolio projects directly from the editor.
        </p>

        <form className="mt-10 space-y-6" onSubmit={handleSubmit}>
          <label className="block text-sm font-medium text-[var(--muted)]">
            Username
            <input
              className="mt-3 w-full rounded-3xl border border-white/10 bg-[#0d0d0d] px-4 py-3 text-[var(--text)] outline-none transition focus:border-[var(--accent)]"
              value={username}
              onChange={(event) => setUsername(event.target.value)}
              autoComplete="username"
            />
          </label>
          <label className="block text-sm font-medium text-[var(--muted)]">
            Password
            <input
              type="password"
              className="mt-3 w-full rounded-3xl border border-white/10 bg-[#0d0d0d] px-4 py-3 text-[var(--text)] outline-none transition focus:border-[var(--accent)]"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="current-password"
            />
          </label>
          {error ? <p className="text-sm text-red-400">{error}</p> : null}
          <button
            type="submit"
            className="inline-flex w-full items-center justify-center rounded-full bg-[var(--accent)] px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-opacity-90"
          >
            Unlock editor
          </button>
        </form>
      </div>
    </main>
  );
}
