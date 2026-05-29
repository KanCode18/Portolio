'use client';

import {
  type ChangeEvent,
  type CSSProperties,
  type FormEvent,
  type MouseEvent as ReactMouseEvent,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import portfolio from './data/portfolio.json';
import ArcReactor from './components/arc-reactor';

type ProjectCard = {
  title: string;
  description: string;
  stack: string[];
  highlight: string;
  link: string;
  type: string;
  fallbackImage?: string;
};

type ThemeMode = 'dark' | 'light';

const navLinks = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Projects', href: '#projects' },
  { label: 'Contact', href: '#contact' },
];

const { profile, skills, experience, projects, stats } = portfolio;

// Skill categories for the new skills display
const skillCategories = [
  {
    label: 'Frontend',
    icon: '◈',
    items: ['React.js', 'Next.js', 'TypeScript', 'JavaScript (ES6+)', 'Tailwind CSS', 'GSAP'],
  },
  {
    label: 'UI & Design',
    icon: '◇',
    items: ['Material UI', 'ShadCN', 'Responsive UI/UX', 'Design Systems', 'Web Performance'],
  },
  {
    label: 'State & Data',
    icon: '◉',
    items: ['Redux', 'Redux Toolkit', 'Context API', 'REST APIs', 'Strapi CMS'],
  },
  {
    label: 'Tooling',
    icon: '◎',
    items: ['Git', 'GitHub', 'Docker', 'Postman', 'Jira', 'Agile / Scrum'],
  },
];

function normalizeProjectUrl(link: string) {
  if (!link || link === '#') return null;
  try {
    return new URL(link).toString();
  } catch {
    try {
      return new URL(`https://${link}`).toString();
    } catch {
      return null;
    }
  }
}

function Icon({ name }: { name: 'github' | 'linkedin' | 'phone' | 'mail' | 'sun' | 'moon' | 'spark' | 'external' }) {
  const common = 'h-5 w-5';

  switch (name) {
    case 'github':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={common}>
          <path
            fill="currentColor"
            d="M12 2C6.48 2 2 6.58 2 12.26c0 4.53 2.87 8.37 6.84 9.72.5.1.68-.22.68-.49 0-.24-.01-.88-.01-1.73-2.78.62-3.37-1.37-3.37-1.37-.45-1.17-1.11-1.48-1.11-1.48-.91-.64.07-.63.07-.63 1.01.08 1.54 1.07 1.54 1.07.9 1.58 2.36 1.13 2.94.86.09-.67.35-1.13.64-1.39-2.22-.26-4.56-1.14-4.56-5.08 0-1.12.39-2.04 1.03-2.76-.1-.26-.45-1.3.1-2.72 0 0 .84-.28 2.75 1.05A9.35 9.35 0 0 1 12 6.9c.85 0 1.71.12 2.51.34 1.91-1.33 2.75-1.05 2.75-1.05.55 1.42.2 2.46.1 2.72.64.72 1.03 1.64 1.03 2.76 0 3.95-2.34 4.82-4.57 5.08.36.32.68.94.68 1.9 0 1.37-.01 2.48-.01 2.82 0 .28.18.6.69.5A10.1 10.1 0 0 0 22 12.26C22 6.58 17.52 2 12 2Z"
          />
        </svg>
      );
    case 'linkedin':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={common}>
          <path
            fill="currentColor"
            d="M5.34 3.72A2.63 2.63 0 1 1 .08 3.7a2.63 2.63 0 0 1 5.26.02ZM.55 8.02h4.32V22H.55V8.02Zm7.03 0h4.14v1.91h.06c.58-1.1 1.99-2.26 4.1-2.26 4.38 0 5.19 2.89 5.19 6.64V22h-4.32v-6.82c0-1.63-.03-3.72-2.27-3.72-2.27 0-2.62 1.77-2.62 3.6V22H7.58V8.02Z"
          />
        </svg>
      );
    case 'phone':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={common}>
          <path
            fill="currentColor"
            d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 .95-.27 11.72 11.72 0 0 0 3.68.6 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1c0 1.23.2 2.42.6 3.68a1 1 0 0 1-.26.95l-2.22 2.16Z"
          />
        </svg>
      );
    case 'mail':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={common}>
          <path fill="currentColor" d="M4 5h16a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2Zm8 7.4L4.9 7H4v.7l8 6.1 8-6.1V7h-.9L12 12.4Z" />
        </svg>
      );
    case 'sun':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={common}>
          <path fill="currentColor" d="M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10Zm0-15 1.1 3h-2.2L12 2Zm0 20-1.1-3h2.2L12 22ZM2 12l3-1.1v2.2L2 12Zm20 0-3 1.1v-2.2l3 1.1ZM4.22 4.22l2.9 1.34-1.56 1.56-1.34-2.9Zm15.56 15.56-2.9-1.34 1.56-1.56 1.34 2.9Zm0-15.56-1.34 2.9-1.56-1.56 2.9-1.34ZM4.22 19.78l1.34-2.9 1.56 1.56-2.9 1.34Z" />
        </svg>
      );
    case 'moon':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={common}>
          <path fill="currentColor" d="M20.3 15.7A8.8 8.8 0 0 1 8.3 3.7 9.7 9.7 0 1 0 20.3 15.7Z" />
        </svg>
      );
    case 'external':
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={common}>
          <path fill="currentColor" d="M14 3h7v7h-2V6.41l-9.3 9.3-1.4-1.42 9.29-9.29H14V3ZM5 5h6v2H7v10h10v-4h2v6H5V5Z" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 24 24" aria-hidden="true" className={common}>
          <path fill="currentColor" d="m12 2 1.72 6.28L20 10l-6.28 1.72L12 18l-1.72-6.28L4 10l6.28-1.72L12 2Zm7 12 .86 3.14L23 18l-3.14.86L19 22l-.86-3.14L15 18l3.14-.86L19 14ZM5 13l.7 2.3L8 16l-2.3.7L5 19l-.7-2.3L2 16l2.3-.7L5 13Z" />
        </svg>
      );
  }
}

function ProjectPreview({ project }: { project: ProjectCard }) {
  const [blocked, setBlocked] = useState(false);
  const previewUrl = normalizeProjectUrl(project.link);

  if (project.fallbackImage) {
    return (
      <div className="project-preview">
        <img src={project.fallbackImage} alt={`${project.title} preview`} className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        <div className="project-preview-label">{project.type}</div>
      </div>
    );
  }

  if (!previewUrl || blocked) {
    return (
      <div className="project-preview project-preview-fallback">
        <div className="holo-map" />
        <div className="project-preview-label">{project.type}</div>
      </div>
    );
  }

  return (
    <div className="project-preview project-preview-fallback">
      <iframe
        title={`${project.title} homepage preview`}
        src={previewUrl}
        loading="lazy"
        sandbox="allow-scripts allow-same-origin allow-popups allow-forms"
        onError={() => setBlocked(true)}
        className="project-preview-frame pointer-events-none absolute left-0 top-0 border-0 bg-white"
      />
      <div className="project-preview-label">{project.type}</div>
    </div>
  );
}

export default function Home() {
  const [theme, setTheme] = useState<ThemeMode>('dark');
  const [typedText, setTypedText] = useState('');
  const [copied, setCopied] = useState(false);
  const [sent, setSent] = useState(false);
  const [pulseMode, setPulseMode] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [statCounts, setStatCounts] = useState<number[]>([0, 0, 0, 0, 0, 0]);
  const [contact, setContact] = useState({ name: '', email: '', message: '' });
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cursorDotRef = useRef<HTMLDivElement>(null);
  const cursorRingRef = useRef<HTMLDivElement>(null);
  const heroRef = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const savedTheme = window.localStorage.getItem('theme');
    if (savedTheme === 'light') setTheme('light');
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('light-theme', theme === 'light');
    window.localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    const text = 'AI-focused frontend builder';
    if (typedText.length < text.length) {
      const timer = window.setTimeout(() => setTypedText(text.slice(0, typedText.length + 1)), 72);
      return () => window.clearTimeout(timer);
    }
  }, [typedText]);

  useEffect(() => {
    const elements = document.querySelectorAll('.reveal');
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) entry.target.classList.add('visible');
        });
      },
      { threshold: 0.18 }
    );
    elements.forEach((element) => observer.observe(element));
    return () => elements.forEach((element) => observer.unobserve(element));
  }, []);

  useEffect(() => {
    const handleMove = (event: globalThis.MouseEvent) => {
      cursorDotRef.current?.style.setProperty('--cursor-x', `${event.clientX}px`);
      cursorDotRef.current?.style.setProperty('--cursor-y', `${event.clientY}px`);
      cursorRingRef.current?.style.setProperty('--cursor-x', `${event.clientX}px`);
      cursorRingRef.current?.style.setProperty('--cursor-y', `${event.clientY}px`);
    };
    window.addEventListener('mousemove', handleMove);
    return () => window.removeEventListener('mousemove', handleMove);
  }, []);

  useEffect(() => {
    const hero = heroRef.current ?? document.getElementById('hero');
    if (!hero) return;

    const reactor = hero.querySelector('.arc-reactor') as HTMLElement | null;
    let idleRaf = 0;
    let lastMove = performance.now();

    const setVars = (x: number, y: number, intensity: number) => {
      if (!reactor) return;
      reactor.style.setProperty('--arc-tilt-x', `${x}deg`);
      reactor.style.setProperty('--arc-tilt-y', `${y}deg`);
      reactor.style.setProperty('--arc-intensity', `${intensity}`);
    };

    const handlePointer = (ev: PointerEvent) => {
      const rect = hero.getBoundingClientRect();
      const px = (ev.clientX - rect.left) / rect.width - 0.5;
      const py = (ev.clientY - rect.top) / rect.height - 0.5;
      const tiltX = (-py * 10).toFixed(2);
      const tiltY = (px * 10).toFixed(2);
      const intensity = Math.min(1.6, Math.hypot(px, py) * 1.8 + 0.2).toFixed(3);
      setVars(Number(tiltX), Number(tiltY), Number(intensity));
      lastMove = performance.now();
      if (Number(intensity) > 1.0 && reactor) {
        reactor.classList.add('arc-scan');
        window.setTimeout(() => reactor.classList.remove('arc-scan'), 700);
      }
    };

    hero.addEventListener('pointermove', handlePointer);

    let lastScan = performance.now();
    let nextScan = 4200 + Math.random() * 5300;

    const triggerScan = () => {
      if (!reactor) return;
      reactor.classList.add('arc-scan');
      const sparks = Array.from(reactor.querySelectorAll('.arc-sparks span')) as HTMLElement[];
      sparks.forEach((s) => {
        const angle = Math.random() * Math.PI * 2;
        const r = 42 + Math.random() * 76;
        s.style.setProperty('--sx', `${Math.cos(angle) * r}px`);
        s.style.setProperty('--sy', `${Math.sin(angle) * r}px`);
      });
      window.setTimeout(() => reactor.classList.remove('arc-scan'), 900);
      lastScan = performance.now();
      nextScan = 4200 + Math.random() * 5300;
    };

    const idleLoop = () => {
      const t = performance.now() * 0.001;
      if (performance.now() - lastMove > 800) {
        const ix = Math.sin(t * 0.9) * 2.2;
        const iy = Math.cos(t * 1.1) * 2.6;
        const intensity = 0.18 + (Math.sin(t * 0.7) + 1) * 0.06;
        setVars(ix, iy, Number(intensity.toFixed(3)));
      }
      if (performance.now() - lastScan > nextScan) triggerScan();
      idleRaf = window.requestAnimationFrame(idleLoop);
    };

    idleRaf = window.requestAnimationFrame(idleLoop);

    return () => {
      hero.removeEventListener('pointermove', handlePointer);
      window.cancelAnimationFrame(idleRaf);
    };
  }, [pulseMode]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 760) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const section = document.querySelector('#achievements');
    if (!section) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          stats.forEach((item, index) => {
            let current = 0;
            const interval = window.setInterval(() => {
              current += Math.max(1, Math.ceil(item.value / 22));
              if (current >= item.value) {
                current = item.value;
                window.clearInterval(interval);
              }
              setStatCounts((prev) => {
                const next = [...prev];
                next[index] = current;
                return next;
              });
            }, 36);
          });
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  const toggleTheme = () => setTheme((current) => (current === 'dark' ? 'light' : 'dark'));

  const triggerArc = () => {
    setPulseMode(true);
    window.setTimeout(() => setPulseMode(false), 1600);
  };

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(profile.email);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1600);
    } catch {
      setCopied(false);
    }
  };

  const handleContactChange = (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = event.target;
    setContact((current) => ({ ...current, [name]: value }));
  };

  const handleContactSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;
    const formData = new FormData(form);
    try {
      const res = await fetch('/api/contact', { method: 'POST', body: formData });
      if (res.ok) {
        setSent(true);
      } else {
        console.error('send failed', await res.text());
        setSent(false);
        alert('Failed to send message.');
      }
    } catch (err) {
      console.error(err);
      alert('Error sending message');
    }
    window.setTimeout(() => setSent(false), 2600);
  };

  const handleTilt = (event: ReactMouseEvent<HTMLElement>) => {
    const card = event.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width - 0.5) * 16;
    const y = ((event.clientY - rect.top) / rect.height - 0.5) * -16;
    card.style.setProperty('--tilt-x', `${y}deg`);
    card.style.setProperty('--tilt-y', `${x}deg`);
  };

  const resetTilt = (event: ReactMouseEvent<HTMLElement>) => {
    event.currentTarget.style.setProperty('--tilt-x', '0deg');
    event.currentTarget.style.setProperty('--tilt-y', '0deg');
  };

  return (
    <main className={`site-shell ${theme === 'light' ? 'light-theme' : ''} ${pulseMode ? 'reactor-pulse' : ''}`}>
      <div ref={cursorRingRef} className="cursor-halo" aria-hidden="true" />
      <div ref={cursorDotRef} className="cursor-dot" aria-hidden="true" />

      <header className={`top-nav ${scrolled ? 'top-nav-scrolled' : ''}`}>
        <span className="nav-brand">KC</span>
        <nav className="nav-track" aria-label="Primary navigation">
          {navLinks.map((item) => (
            <a key={item.href} href={item.href} className="nav-link">
              {item.label}
            </a>
          ))}
        </nav>
        <button
          type="button"
          className="mobile-menu-button"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle navigation menu"
          aria-expanded={mobileMenuOpen}
        >
          <span />
          <span />
          <span />
        </button>
      </header>

      {mobileMenuOpen && (
        <nav className="mobile-drawer" aria-label="Mobile navigation">
          {navLinks.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="mobile-nav-link"
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}

      {/* ── HERO ── */}
      <section id="hero" ref={heroRef} className="hero-section section-shell">
        <div className="holo-background" aria-hidden="true" />
        <div className="hero-grid">
          <div className="hero-copy">
            <p className="eyebrow">Frontend Developer · Delhi, India</p>
            <h1>{profile.name}</h1>
            <div className="hero-tagline">
              <span>{typedText}</span>
              <i aria-hidden="true" />
            </div>
            <p className="hero-desc">{profile.heroLine}</p>
            <div className="hero-ai-note">
              <p>I build interfaces that feel fast, intentional, and alive. Currently working on wealth management platforms that handle portfolios worth ₹100 Cr+.</p>
              <p>Outside work I’ve been exploring how AI fits into the design and engineering workflow. Faster prototyping, smarter iteration, less time on the boring parts.</p>
            </div>
            <div className="hero-actions">
              <a href="#projects" className="primary-action">
                See my work
              </a>
              {profile.resumeHref ? (
                <a href={profile.resumeHref} target="_blank" rel="noreferrer" className="secondary-action">
                  View résumé
                </a>
              ) : null}
            </div>
          </div>

          <div className="hero-panel holo-card">
            <button type="button" className="arc-trigger" onClick={triggerArc} aria-label="Activate arc reactor pulse">
              <ArcReactor active={pulseMode} />
            </button>
            <div className="reactor-readouts">
              <span>UX systems: stable</span>
              <span>React systems: online</span>
              <span>Performance budget: clean</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── ABOUT ── */}
      <section id="about" className="reveal section-shell">
        <div className="section-heading">
          <p className="eyebrow">About</p>
          <h2>Three years of shipping and still raising the bar.</h2>
        </div>
        <div className="about-grid">
          <article className="holo-card large-card">
            <p>
              I’m a frontend developer who genuinely cares about the craft. Clean component architecture, tight performance budgets, UIs that don’t just work but feel right. I’ve spent the last three years building production systems in the wealth and fintech space, working across React, Next.js, and TypeScript on codebases where real money moves every day.
            </p>
            <p className="about-second">
              I think the best frontend work sits right at the intersection of engineering rigour and design sensibility. Whether I’m refactoring a 200K-line codebase or shipping something new from scratch, I try to bring the same level of care to both.
            </p>
            <div className="signal-strip">
              <span>{profile.location}</span>
              <span>SDE-1 · Pantelwar</span>
              <span>3+ years</span>
              <span>Open to opportunities</span>
            </div>
          </article>

          {/* ── SKILLS PANEL — categories replace bars ── */}
          <aside className="holo-card skills-panel">
            <p className="eyebrow">Tech I work with</p>
            <div className="skill-categories">
              {skillCategories.map((cat) => (
                <div key={cat.label} className="skill-category">
                  <div className="skill-cat-header">
                    <span className="skill-cat-icon" aria-hidden="true">{cat.icon}</span>
                    <span className="skill-cat-label">{cat.label}</span>
                  </div>
                  <div className="skill-tag-row">
                    {cat.items.map((item) => (
                      <span key={item} className="skill-tag">{item}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      {/* ── EXPERIENCE ── */}
      <section id="experience" className="reveal section-shell">
        <div className="section-heading">
          <p className="eyebrow">Experience</p>
          <h2>Built in production. Not just side projects.</h2>
        </div>
        <div className="timeline">
          {experience.map((item, index) => (
            <article key={`${item.company}-${item.role}`} className="timeline-node reveal" style={{ transitionDelay: `${index * 90}ms` }}>
              <div className="node-marker" aria-hidden="true" />
              <div className="holo-card">
                <div className="timeline-topline">
                  <span>{item.role}</span>
                  <span>{item.dates}</span>
                </div>
                <h3>{item.company}</h3>
                <ul>
                  {item.bullets.map((bullet) => (
                    <li key={bullet}>{bullet}</li>
                  ))}
                </ul>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── PROJECTS ── */}
      <section id="projects" className="reveal section-shell">
        <div className="section-heading split-heading">
          <div>
            <p className="eyebrow">Projects</p>
            <h2>Products I’ve shaped end to end.</h2>
          </div>
          <p>Wealth management, retail investing, analytics, and commerce. Built for real users with real stakes.</p>
        </div>
        <div className="project-grid">
          {projects.map((project) => (
            <article key={project.title} className="project-card holo-card" onMouseMove={handleTilt} onMouseLeave={resetTilt}>
              <ProjectPreview project={project} />
              <div className="project-body">
                <div className="project-kicker">
                  <span>{project.type}</span>
                  <Icon name="spark" />
                </div>
                <h3>{project.title}</h3>
                <p>{project.description}</p>
                <div className="tag-row">
                  {project.stack.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                <p className="impact-line">{project.highlight}</p>
                <a href={project.link} target="_blank" rel="noreferrer" className="project-link">
                  View project <Icon name="external" />
                </a>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ── STATS ── */}
      <section id="achievements" className="reveal section-shell stats-band">
        <div className="stat-grid">
          {stats.map((item, index) => {
            const value = Math.min(statCounts[index] || 0, item.value);
            return (
              <div key={item.label} className="stat-core holo-card">
                <span className="stat-ring" style={{ '--stat-level': `${(value / item.value) * 100}%` } as CSSProperties} />
                <p>{item.suffix === 'K+' ? `${value}${value < item.value ? '' : 'K+'}` : `${value}${item.suffix}`}</p>
                <span>{item.label}</span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="reveal section-shell contact-section">
        <div className="section-heading">
          <p className="eyebrow">Contact</p>
          <h2>Let’s build something worth shipping.</h2>
        </div>
        <div className="contact-layout">
          <p className="contact-intro">
            I’m open to the right opportunity. That could be a product-focused frontend role, a team working on something genuinely interesting, or a freelance project worth putting real effort into. Drop a line and let’s talk.
          </p>
          <div className="contact-pills-grid">
            <button type="button" onClick={handleCopyEmail} className="contact-pill">
              <Icon name="mail" />
              <span>{copied ? 'Copied to clipboard ✓' : profile.email}</span>
            </button>
            <a href={profile.github} target="_blank" rel="noreferrer" className="contact-pill">
              <Icon name="github" />
              <span>GitHub</span>
            </a>
            <a href={profile.linkedin} target="_blank" rel="noreferrer" className="contact-pill">
              <Icon name="linkedin" />
              <span>LinkedIn</span>
            </a>
            <a href={`tel:${profile.phone}`} className="contact-pill">
              <Icon name="phone" />
              <span>{profile.phone}</span>
            </a>
          </div>
        </div>
      </section>

      <footer className="site-footer">
        <span>© 2026 {profile.name}</span>
        <span>Built with Next.js + Tailwind</span>
      </footer>
    </main>
  );
}