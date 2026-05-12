'use client';

import { useEffect, useRef, useState } from 'react';
import portfolio from './data/portfolio.json';

type ProjectCard = {
  title: string;
  description: string;
  stack: string[];
  highlight: string;
  link: string;
  type: string;
  fallbackImage?: string;
};

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];
const { profile, skills, experience, projects, stats } = portfolio;

function normalizeProjectUrl(link: string) {
  if (!link || link === '#') return null;
  try {
    const url = new URL(link);
    return link;
  } catch {
    try {
      const url = new URL(`https://${link}`);
      return url.toString();
    } catch {
      return null;
    }
  }
}

function ProjectPreview({ project }: { project: ProjectCard }) {
  const [blocked, setBlocked] = useState(false);
  const previewUrl = normalizeProjectUrl(project.link);

  if (project.fallbackImage) {
    return (
      <div className="relative aspect-[16/10] overflow-hidden bg-[#0d0d0d]">
        <img
          src={project.fallbackImage}
          alt={`${project.title} preview`}
          className="h-full w-full object-cover"
          loading="lazy"
        />
        <div className="absolute inset-x-0 bottom-0 flex items-end bg-gradient-to-t from-black/90 via-black/35 to-transparent p-5">
          <div className="rounded-2xl border border-white/10 bg-black/45 px-4 py-3 text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
            {project.type}
          </div>
        </div>
      </div>
    );
  }

  if (!previewUrl || blocked) {
    return (
      <div className="aspect-[16/10] bg-[linear-gradient(135deg,#0b1120_0%,#111827_55%,#0f172a_100%)]">
        <div className="absolute inset-0 flex items-end p-6">
          <div className="rounded-2xl border border-white/10 bg-black/30 px-4 py-3 text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
            {project.type}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative aspect-[16/10] overflow-hidden bg-[#0d0d0d]">
      <iframe
        title={`${project.title} homepage preview`}
        src={previewUrl}
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        onError={() => setBlocked(true)}
        className="pointer-events-none absolute left-0 top-0 h-[250%] w-[250%] origin-top-left scale-[0.4] border-0 bg-white"
      />
      <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 bg-gradient-to-t from-black/90 via-black/40 to-transparent p-5">
        <div className="rounded-2xl border border-white/10 bg-black/45 px-4 py-3 text-xs uppercase tracking-[0.3em] text-[var(--muted)]">
          {project.type}
        </div>
        {blocked ? <span className="text-xs text-[var(--muted)]">Preview blocked</span> : null}
      </div>
    </div>
  );
}

export default function Home() {
  const [loading, setLoading] = useState(true);
  const [typedText, setTypedText] = useState('');
  const [copied, setCopied] = useState(false);
  const [statCounts, setStatCounts] = useState<number[]>([0, 0, 0, 0]);
  const cursorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = window.setTimeout(() => setLoading(false), 900);
    return () => window.clearTimeout(timer);
  }, []);

  useEffect(() => {
    const text = 'Frontend Developer';
    if (typedText.length < text.length) {
      const timer = window.setTimeout(() => setTypedText(text.slice(0, typedText.length + 1)), 80);
      return () => window.clearTimeout(timer);
    }
  }, [typedText]);

  useEffect(() => {
    const elements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('visible');
          }
        });
      },
      { threshold: 0.2 }
    );

    elements.forEach((el) => observer.observe(el));
    return () => elements.forEach((el) => observer.unobserve(el));
  }, []);

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (cursorRef.current) {
        cursorRef.current.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`;
      }
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  useEffect(() => {
    const section = document.querySelector('#achievements');
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          const durations = [25, 40, 30, 200];
          durations.forEach((target, index) => {
            let value = 0;
            const interval = window.setInterval(() => {
              value += Math.max(1, Math.ceil(target / 18));
              if (value >= target) {
                value = target;
                window.clearInterval(interval);
              }
              setStatCounts((current) => {
                const next = [...current];
                next[index] = value;
                return next;
              });
            }, 40);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  return (
    <main className="relative min-h-screen overflow-hidden bg-[var(--bg)] text-[var(--text)]">
      <div ref={cursorRef} className="cursor-dot" />

      {loading ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-[var(--bg)] text-[var(--text)]">
          <div className="space-y-6 rounded-3xl border border-white/10 bg-[rgba(15,15,15,0.95)] p-10 text-center shadow-glow">
            <div className="mx-auto h-20 w-20 rounded-full border border-[var(--accent)]/20 bg-[rgba(37,99,235,0.1)]">
              <div className="relative top-4 h-12 w-12 animate-spin rounded-full border-4 border-[var(--accent)] border-t-transparent" />
            </div>
            <p className="text-sm uppercase tracking-[0.35em] text-[var(--accent)]">Loading portfolio</p>
            <p className="text-xl font-semibold">Setting the stage for a high-end frontend story.</p>
          </div>
        </div>
      ) : null}

      <header className="sticky top-0 z-40 border-b border-white/10 bg-[rgba(10,10,10,0.85)] backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4 text-sm text-[var(--muted)] sm:px-8">
          <div className="font-heading text-base uppercase tracking-[0.3em] text-[var(--text)]">KANISHK</div>
          <nav className="flex items-center gap-6">
            {navLinks.map((item) => (
              <a key={item.href} href={item.href} className="nav-link transition-colors duration-200 hover:text-[var(--text)]">
                {item.label}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <section id="hero" className="relative min-h-[calc(100vh-72px)] overflow-hidden px-6 py-16 sm:px-8 lg:px-10">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(37,99,235,0.16),transparent_20%),radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.08),transparent_25%),repeating-linear-gradient(0deg,transparent,transparent_1px,rgba(255,255,255,0.02)1px,rgba(255,255,255,0.02)4px)]" />
        <div className="relative mx-auto flex max-w-6xl flex-col justify-center gap-10 py-16">
          <div className="max-w-4xl space-y-8">
            <p className="font-heading text-xs uppercase tracking-[0.35em] text-[var(--accent)]">Frontend Developer</p>
            <h1 className="font-heading text-[clamp(3.5rem,7vw,6.2rem)] leading-[0.88] tracking-[-0.05em] text-[var(--text)]">
              KANISHK CHHABRA
            </h1>
            <div className="space-y-4">
              <div className="flex items-center gap-3 text-3xl font-medium text-[var(--text)] sm:text-4xl">
                <span className="font-heading text-[var(--accent)]">{typedText}</span>
                <span className="h-6 w-0.5 animate-pulse rounded-full bg-[var(--accent)]" />
              </div>
              <p className="max-w-3xl text-lg leading-8 text-[var(--muted)] sm:text-xl">{profile.heroLine}</p>
            </div>
            <div className="flex flex-col gap-4 sm:flex-row">
              <a href="#projects" className="inline-flex items-center justify-center rounded-full border border-[var(--accent)] bg-[var(--accent)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-black transition hover:bg-opacity-90">
                View Work
              </a>
              {profile.resumeHref ? (
                <a href={profile.resumeHref} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-full border border-[var(--accent)] px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text)] transition hover:bg-white/5">
                  View Resume
                </a>
              ) : null}
            </div>
          </div>
        </div>
      </section>

      <section id="about" className="reveal px-6 pb-16 sm:px-8 lg:px-10">
        <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1.25fr_0.9fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-[var(--accent)]">About</p>
            <h2 className="mt-4 text-3xl font-heading font-semibold text-[var(--text)] sm:text-4xl">Senior-style frontend craftsmanship with clarity and control.</h2>
            <p className="mt-6 max-w-3xl text-base leading-8 text-[var(--muted)] sm:text-lg">
              {profile.summary}
            </p>
          </div>
          <aside className="rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-8 shadow-[var(--shadow)]">
            <p className="text-sm uppercase tracking-[0.35em] text-[var(--accent)]">Core stack</p>
            <div className="mt-8 grid gap-3 sm:grid-cols-2">
              {skills.map((skill) => (
                <span key={skill} className="inline-flex rounded-full border border-[var(--border)] bg-[rgba(255,255,255,0.03)] px-4 py-3 text-sm text-[var(--text)]">
                  {skill}
                </span>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section id="experience" className="reveal border-t border-white/10 px-6 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <p className="text-sm uppercase tracking-[0.35em] text-[var(--accent)]">Experience</p>
          <h2 className="mt-4 text-3xl font-heading font-semibold text-[var(--text)] sm:text-4xl">A timeline of impact and growth.</h2>
          <div className="mt-12 space-y-10 border-l border-slate-700/60 pl-8">
            {experience.map((item) => (
              <div key={`${item.company}-${item.role}`} className="relative reveal rounded-3xl border border-white/10 bg-[var(--surface2)] p-6 shadow-[var(--shadow)] sm:p-8">
                <span className="absolute left-0 top-8 h-4 w-4 -translate-x-1/2 rounded-full bg-[var(--accent)] ring-4 ring-[rgba(37,99,235,0.15)]" />
                <div className="flex flex-col gap-3">
                  <div className="flex flex-wrap items-center gap-3 text-sm text-[var(--muted)]">
                    <span className="font-heading text-[var(--accent)]">{item.role}</span>
                    <span className="text-[var(--muted)]">@ {item.company}</span>
                  </div>
                  <p className="text-sm uppercase tracking-[0.25em] text-[var(--muted)]">{item.dates}</p>
                  <ul className="mt-4 space-y-3 text-sm leading-7 text-[var(--text)]">
                    {item.bullets.map((bullet) => (
                      <li key={bullet} className="ml-4 list-disc text-[var(--muted)]">{bullet}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section id="projects" className="reveal px-6 pb-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="text-sm uppercase tracking-[0.35em] text-[var(--accent)]">Projects</p>
              <h2 className="mt-4 text-3xl font-heading font-semibold text-[var(--text)] sm:text-4xl">Built for product-grade clarity.</h2>
            </div>
            <p className="max-w-2xl text-sm leading-7 text-[var(--muted)]">
              Project data is committed in the portfolio JSON file, so every visitor sees the same published content.
            </p>
          </div>

          <div className="mt-12 grid gap-5 sm:grid-cols-2 xl:grid-cols-3">
            {projects.map((project) => (
              <article key={project.title} className="group overflow-hidden rounded-[1.75rem] border border-white/10 bg-[var(--surface)] shadow-[var(--shadow)] transition duration-300 hover:-translate-y-1.5 hover:border-[var(--accent)]">
                <div className="relative overflow-hidden bg-slate-950">
                  <div className="transition duration-500 group-hover:scale-[1.03]">
                    <ProjectPreview project={project} />
                  </div>
                </div>
                <div className="space-y-4 p-6">
                  <h3 className="text-xl font-semibold text-[var(--text)]">{project.title}</h3>
                  <p className="text-sm leading-7 text-[var(--muted)]">{project.description}</p>
                  <div className="flex flex-wrap gap-2">
                    {project.stack.map((tag) => (
                      <span key={tag} className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[0.72rem] uppercase tracking-[0.25em] text-[var(--muted)]">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <p className="text-sm leading-6 text-[var(--text)]">{project.highlight}</p>
                  <a href={project.link} target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--accent)] transition hover:text-white">
                    View project
                    <span aria-hidden="true">→</span>
                  </a>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section id="achievements" className="reveal border-y border-white/10 bg-[var(--surface)] px-6 py-16 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl">
          <div className="grid gap-6 md:grid-cols-4">
            {stats.map((item, index) => {
              const value = Math.min(statCounts[index] || 0, item.value);
              return (
                <div key={item.label} className="rounded-[1.5rem] border border-white/10 bg-[#0e0e0e] p-8 text-center shadow-[var(--shadow)]">
                  <p className="text-4xl font-heading font-semibold text-[var(--accent)] sm:text-5xl">
                    {item.suffix === 'K+' ? `${value}${value < item.value ? '' : 'K+'}` : `${value}${item.suffix}`}
                  </p>
                  <p className="mt-4 text-sm leading-7 text-[var(--muted)]">{item.label}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section id="contact" className="reveal px-6 pb-20 sm:px-8 lg:px-10">
        <div className="mx-auto max-w-6xl rounded-[2rem] border border-[var(--border)] bg-[var(--surface)] p-10 shadow-[var(--shadow)]">
          <div className="flex flex-col items-start gap-8 lg:flex-row lg:items-center lg:justify-between">
            <div className="space-y-4">
              <p className="text-sm uppercase tracking-[0.35em] text-[var(--accent)]">Contact</p>
              <h2 className="text-3xl font-heading font-semibold text-[var(--text)] sm:text-4xl">Let's build something.</h2>
            </div>
            <div className="flex flex-wrap gap-4">
              <button
                type="button"
                onClick={handleCopyEmail}
                className="rounded-full border border-[var(--accent)] bg-transparent px-6 py-3 text-sm font-semibold uppercase tracking-[0.2em] text-[var(--text)] transition hover:bg-[rgba(37,99,235,0.08)]"
              >
                {copied ? 'Email copied' : profile.email}
              </button>
            </div>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-3 lg:grid-cols-4">
            <a href={profile.github} target="_blank" rel="noreferrer" className="group inline-flex h-16 w-full items-center justify-center rounded-3xl border border-white/10 bg-black/20 transition hover:border-[var(--accent)] hover:bg-[rgba(37,99,235,0.08)]">
              <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-[var(--text)] transition group-hover:text-[var(--accent)]" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 2C6.48 2 2 6.48 2 12c0 4.42 2.87 8.16 6.84 9.49.5.09.68-.22.68-.48 0-.24-.01-.87-.01-1.71-2.78.6-3.37-1.34-3.37-1.34-.45-1.14-1.11-1.44-1.11-1.44-.91-.62.07-.61.07-.61 1.01.07 1.54 1.04 1.54 1.04.9 1.54 2.36 1.1 2.94.84.09-.66.35-1.1.64-1.35-2.22-.25-4.56-1.11-4.56-4.95 0-1.09.39-1.99 1.03-2.69-.1-.25-.45-1.27.1-2.65 0 0 .84-.27 2.75 1.02A9.58 9.58 0 0112 6.8c.85.004 1.71.11 2.51.32 1.91-1.29 2.75-1.02 2.75-1.02.55 1.38.2 2.4.1 2.65.64.7 1.03 1.6 1.03 2.69 0 3.85-2.34 4.7-4.57 4.95.36.31.68.92.68 1.85 0 1.34-.01 2.42-.01 2.75 0 .27.18.58.69.48A10.003 10.003 0 0022 12c0-5.52-4.48-10-10-10z" fill="currentColor" />
              </svg>
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="group inline-flex h-16 w-full items-center justify-center rounded-3xl border border-white/10 bg-black/20 transition hover:border-[var(--accent)] hover:bg-[rgba(37,99,235,0.08)]">
              <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-[var(--text)] transition group-hover:text-[var(--accent)]" xmlns="http://www.w3.org/2000/svg">
                <path d="M4.98 3.5C4.98 4.88 3.94 6 2.66 6 1.34 6 .3 4.88.3 3.5.3 2.12 1.34 1 2.66 1c1.28 0 2.32 1.12 2.32 2.5zm.04 4.5H2.62V23h2.4V8zm7.5 0h-2.4V23h2.4v-7.2c0-3.86 4.92-4.17 4.92 0V23h2.4V14.9c0-7.04-7.56-6.78-7.56 0V8z" fill="currentColor"/>
              </svg>
            </a>
            <a href={`tel:${profile.phone}`} className="group inline-flex h-16 w-full items-center justify-center rounded-3xl border border-white/10 bg-black/20 transition hover:border-[var(--accent)] hover:bg-[rgba(37,99,235,0.08)]">
              <svg viewBox="0 0 24 24" fill="none" className="h-6 w-6 text-[var(--text)] transition group-hover:text-[var(--accent)]" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" clipRule="evenodd" d="M6.62 10.79a15.07 15.07 0 006.59 6.59l2.2-2.2a1 1 0 01.95-.27 11.72 11.72 0 003.68.6 1 1 0 011 1V20a1 1 0 01-1 1A17 17 0 013 4a1 1 0 011-1h3.5a1 1 0 011 1c0 1.23.2 2.42.6 3.68a1 1 0 01-.26.95l-2.22 2.16z" fill="currentColor"/>
              </svg>
            </a>
          </div>
        </div>
      </section>

      <footer className="border-t border-white/10 px-6 py-8 text-sm text-[var(--muted)] sm:px-8 lg:px-10">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <span>© 2026 Kanishk Chhabra</span>
          <span>Built with React + Tailwind</span>
        </div>
      </footer>
    </main>
  );
}
