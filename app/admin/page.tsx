'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import portfolio from '../data/portfolio.json';

const AUTH_KEY = 'kanishk-portfolio-auth';

export default function AdminPage() {
  const router = useRouter();
  const [allowed, setAllowed] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.localStorage.getItem(AUTH_KEY) !== 'true') {
      router.replace('/login');
      return;
    }
    setAllowed(true);
  }, [router]);

  const projectJson = useMemo(() => JSON.stringify(portfolio.projects, null, 2), []);

  const handleLogout = () => {
    window.localStorage.removeItem(AUTH_KEY);
    router.push('/login');
  };

  if (!allowed) {
    return null;
  }

  return (
    <main className="min-h-screen bg-[var(--bg)] px-6 py-16 text-[var(--text)] sm:px-8 lg:px-10">
      <div className="mx-auto max-w-5xl space-y-8">
        <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-10 shadow-[var(--shadow)]">
          <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-[var(--accent)]">Content source</p>
              <h1 className="mt-4 text-4xl font-heading font-semibold">Portfolio JSON workflow</h1>
              <p className="mt-4 max-w-3xl text-sm leading-7 text-[var(--muted)]">
                Public portfolio content is committed in <span className="text-[var(--text)]">app/data/portfolio.json</span>. To update from a resume, give the PDF to a coding agent, let it edit that JSON file, then commit and deploy.
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="inline-flex items-center justify-center rounded-full border border-[var(--accent)] bg-transparent px-5 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text)] transition hover:bg-[rgba(37,99,235,0.08)]"
            >
              Log out
            </button>
          </div>
        </section>

        <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-10 shadow-[var(--shadow)]">
          <h2 className="text-2xl font-semibold">Update checklist</h2>
          <ol className="mt-6 space-y-4 text-sm leading-7 text-[var(--muted)]">
            <li>1. Put the latest resume PDF in the chat or workspace.</li>
            <li>2. Ask the agent to update <span className="text-[var(--text)]">app/data/portfolio.json</span>.</li>
            <li>3. If you want a public resume button, add the PDF to <span className="text-[var(--text)]">public/</span> and set <span className="text-[var(--text)]">profile.resumeHref</span>.</li>
            <li>4. Run build, commit, and deploy.</li>
          </ol>
        </section>

        <section className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-10 shadow-[var(--shadow)]">
          <h2 className="text-2xl font-semibold">Current project data</h2>
          <pre className="mt-6 max-h-[28rem] overflow-auto rounded-[1.5rem] border border-white/10 bg-[#0d0d0d] p-6 text-xs leading-6 text-[var(--muted)]">
            {projectJson}
          </pre>
        </section>
      </div>
    </main>
  );
}
