import React, { useEffect, useRef, useState } from "react";
import ChatWidget from "./components/ChatWidget.jsx";
import Reveal from "./components/Reveal.jsx";
import StickyWhatsApp from "./components/StickyWhatsApp.jsx";
import ContactForm from "./components/ContactForm.jsx";
import { useReveal } from "./hooks/useReveal.js";

const NAV_LINKS = [
  { href: "#about", label: "About" },
  { href: "#skills", label: "Skills" },
  { href: "#projects", label: "Projects" },
  { href: "#process", label: "Process" },
  { href: "#testimonials", label: "Testimonials" },
];

const ROLES = ["Full-Stack Developer", "UI/UX Designer", "Web Designer", "Graphic Designer"];
const NAV_OFFSET = 84;

const prefersReducedMotion = () =>
  typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function smoothScrollTo(id) {
  const target = document.querySelector(id);
  if (!target) return;
  const top = target.getBoundingClientRect().top + window.scrollY - NAV_OFFSET;
  window.scrollTo({ top, behavior: prefersReducedMotion() ? "auto" : "smooth" });
}

/* ---------------- Scroll progress bar ---------------- */
function ScrollProgress() {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const h = document.documentElement;
      const scrollableHeight = h.scrollHeight - h.clientHeight;
      setWidth(scrollableHeight > 0 ? (h.scrollTop / scrollableHeight) * 100 : 0);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <div
      role="progressbar"
      aria-valuenow={Math.round(width)}
      aria-valuemin={0}
      aria-valuemax={100}
      className="fixed top-0 left-0 h-[2px] bg-grad-primary z-[60] transition-all duration-75"
      style={{ width: `${width}%` }}
    />
  );
}

/* ---------------- Navbar ---------------- */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close mobile navigation on Escape key
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };
    if (menuOpen) {
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [menuOpen]);

  const go = (href) => (e) => {
    e.preventDefault();
    setMenuOpen(false);
    smoothScrollTo(href);
  };

  return (
    <header className="fixed top-0 inset-x-0 z-50 transition-all duration-300">
      <nav
        aria-label="Main Navigation"
        className={`max-w-6xl mx-auto flex items-center justify-between px-6 lg:px-8 transition-all duration-300 ${
          scrolled ? "navbar-scrolled py-3.5" : "py-5"
        }`}
      >
        <a href="#home" onClick={go("#home")} className="flex items-center gap-2.5 group">
          <span className="grid place-items-center w-9 h-9 rounded-xl bg-grad-primary text-ink font-display font-bold text-sm shadow-glow-teal group-hover:scale-105 transition-transform duration-300">
            RSN
          </span>
          <span className="font-display font-semibold tracking-tight text-fg hidden sm:block">
            Raja Salman Nadeem
          </span>
        </a>

        <ul className="hidden md:flex items-center gap-8 text-sm text-fg-dim">
          {NAV_LINKS.map((link) => (
            <li key={link.href}>
              <a href={link.href} onClick={go(link.href)} className="nav-link">
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="#contact"
          onClick={go("#contact")}
          className="hidden md:inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2.5 text-sm font-medium text-fg hover:border-brand-teal/60 hover:text-brand-teal hover:shadow-glow-teal transition-all duration-300"
        >
          Let's talk
        </a>

        <button
          aria-label="Toggle menu"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((v) => !v)}
          className="md:hidden grid place-items-center w-10 h-10 rounded-lg border border-white/10 text-fg focus:outline-none focus:ring-2 focus:ring-brand-teal"
        >
          {menuOpen ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.8"><path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" /></svg>
          )}
        </button>
      </nav>

      {menuOpen && (
        <div className="md:hidden bg-surface/95 backdrop-blur border-t border-white/8">
          <ul className="flex flex-col px-6 py-4 gap-4 text-sm text-fg-dim">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <a href={link.href} onClick={go(link.href)} className="block py-1 hover:text-brand-teal transition-colors">
                  {link.label}
                </a>
              </li>
            ))}
            <li>
              <a href="#contact" onClick={go("#contact")} className="block py-1 text-brand-teal">
                Let's talk →
              </a>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}

/* ---------------- Animated counter ---------------- */
function Counter({ target, suffix = "+" }) {
  const { ref, visible } = useReveal();
  const [value, setValue] = useState(0);

  useEffect(() => {
    if (!visible) return;
    if (prefersReducedMotion()) { setValue(target); return; }
    const duration = 1400;
    const start = performance.now();
    let frame;
    const step = (now) => {
      const p = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(eased * target));
      if (p < 1) frame = requestAnimationFrame(step);
    };
    frame = requestAnimationFrame(step);
    return () => cancelAnimationFrame(frame);
  }, [visible, target]);

  return (
    <span ref={ref} className="counter">
      {value}{suffix}
    </span>
  );
}

/* ---------------- Hero ---------------- */
function Hero() {
  const [typed, setTyped] = useState("");

  useEffect(() => {
    if (prefersReducedMotion()) { setTyped(ROLES[0]); return; }
    let roleIndex = 0, charIndex = 0, deleting = false, timeoutId;
    const TYPE_SPEED = 65, DELETE_SPEED = 35, HOLD = 1400;

    const tick = () => {
      const current = ROLES[roleIndex];
      if (!deleting) {
        charIndex++;
        setTyped(current.slice(0, charIndex));
        if (charIndex === current.length) { deleting = true; timeoutId = setTimeout(tick, HOLD); return; }
        timeoutId = setTimeout(tick, TYPE_SPEED);
      } else {
        charIndex--;
        setTyped(current.slice(0, charIndex));
        if (charIndex === 0) { deleting = false; roleIndex = (roleIndex + 1) % ROLES.length; }
        timeoutId = setTimeout(tick, DELETE_SPEED);
      }
    };
    tick();
    return () => clearTimeout(timeoutId);
  }, []);

  return (
    <section id="home" className="relative overflow-hidden pt-40 pb-28 lg:pt-48 lg:pb-36">
      <div className="glow-orb glow-orb--teal" aria-hidden="true" />
      <div className="glow-orb glow-orb--magenta" aria-hidden="true" />

      <div className="max-w-6xl mx-auto px-6 lg:px-8 grid lg:grid-cols-[1.15fr,0.85fr] gap-16 items-center">
        <Reveal type="up">
          <div className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-surface/60 px-4 py-1.5 text-xs text-fg-dim mb-7">
            <span className="relative flex w-2 h-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-brand-teal opacity-60" />
              <span className="relative inline-flex rounded-full w-2 h-2 bg-brand-teal" />
            </span>
            Available for freelance work
          </div>

          <p className="text-fg-dim text-base sm:text-lg mb-3">Full-stack development &amp; interface design</p>
          <h1 className="font-display font-semibold text-4xl sm:text-5xl lg:text-6xl leading-[1.08] tracking-tight">
            <span className="bg-grad-primary bg-clip-text text-transparent">Raja Salman Nadeem</span>
          </h1>

          <p className="mt-5 text-lg sm:text-xl text-fg-dim h-8">
            I work as a <span className="text-fg font-medium">{typed}</span>
            <span className="typed-cursor" aria-hidden="true">|</span>
          </p>

          <p className="mt-6 max-w-lg text-fg-dim leading-relaxed">
            I design and build fast, accessible products end-to-end — from Figma wireframes to production Django
            deployments. Recent work spans learning platforms, mobile apps, and brand systems.
          </p>

          <div className="mt-9 flex flex-wrap items-center gap-4">
            <a
              href="#projects"
              onClick={(e) => { e.preventDefault(); smoothScrollTo("#projects"); }}
              className="btn-magnetic inline-flex items-center gap-2 rounded-full bg-grad-primary text-ink font-semibold px-7 py-3.5 text-sm shadow-glow-teal hover:shadow-[0_0_55px_-6px_rgba(45,212,196,.6)] transition-all duration-300"
            >
              View my work
            </a>
            <a
              href="#contact"
              onClick={(e) => { e.preventDefault(); smoothScrollTo("#contact"); }}
              className="btn-magnetic inline-flex items-center gap-2 rounded-full border border-white/15 px-7 py-3.5 text-sm font-medium text-fg hover:border-brand-magenta/60 hover:text-brand-magenta hover:shadow-glow-magenta transition-all duration-300"
            >
              Start a project
            </a>
          </div>

          <div className="mt-12 grid grid-cols-3 max-w-sm gap-6 border-t border-white/8 pt-8">
            <div>
              <p className="font-display text-2xl font-semibold text-fg"><Counter target={4} /></p>
              <p className="text-xs text-fg-faint mt-1">Years experience</p>
            </div>
            <div>
              <p className="font-display text-2xl font-semibold text-fg"><Counter target={40} /></p>
              <p className="text-xs text-fg-faint mt-1">Projects delivered</p>
            </div>
            <div>
              <p className="font-display text-2xl font-semibold text-fg"><Counter target={30} /></p>
              <p className="text-xs text-fg-faint mt-1">Happy clients</p>
            </div>
          </div>
        </Reveal>

        <Reveal type="fade" delay={150} className="relative mx-auto w-full max-w-sm aspect-square">
          <div className="hero-ring absolute inset-0 rounded-full" aria-hidden="true" />
          <div className="absolute inset-[14%] rounded-full bg-surface border border-white/10 grid place-items-center overflow-hidden shadow-2xl">
            <span className="font-display text-6xl font-semibold bg-grad-accent bg-clip-text text-transparent">RSN</span>
          </div>
          <div className="float-badge float-badge--1 hidden sm:flex" style={{ top: "6%", left: "-8%" }}>React</div>
          <div className="float-badge float-badge--2 hidden sm:flex" style={{ bottom: "12%", left: "-10%" }}>Django</div>
          <div className="float-badge float-badge--3 hidden sm:flex" style={{ top: "38%", right: "-12%" }}>Figma</div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- About / Services ---------------- */
function ServiceCard({ icon, title, desc, span }) {
  return (
    <div className={`service-card ${span ? "sm:col-span-2" : ""}`}>
      <div className="service-icon" aria-hidden="true">{icon}</div>
      <h3 className="font-display font-semibold text-lg mt-4">{title}</h3>
      <p className="text-sm text-fg-dim mt-2 leading-relaxed">{desc}</p>
    </div>
  );
}

function About() {
  return (
    <section id="about" className="py-28 border-t border-white/6">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 grid lg:grid-cols-2 gap-14">
        <Reveal type="up">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">What I do</h2>
          <p className="mt-5 text-fg-dim leading-relaxed max-w-md">
            I'm a full-stack developer and designer focused on building complete products — not just screens or
            endpoints. Most projects start on a whiteboard, move through Figma, and end up as a Django or Flutter
            app running in production. I care about the parts users never see: load times, clean data models, and
            forms that actually work.
          </p>
          <p className="mt-4 text-fg-dim leading-relaxed max-w-md">
            Lately I've been building learning platforms, service-delivery apps, and the kind of small business
            tools that save someone an afternoon of spreadsheet work every week.
          </p>
          <a
            href="#contact"
            onClick={(e) => { e.preventDefault(); smoothScrollTo("#contact"); }}
            className="mt-8 inline-flex items-center gap-2 text-brand-teal text-sm font-medium link-underline"
          >
            Work with me
          </a>
        </Reveal>

        <Reveal type="up" delay={120} className="grid sm:grid-cols-2 gap-5">
          <ServiceCard
            span
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6"><path strokeLinecap="round" strokeLinejoin="round" d="M17.25 6.75L22.5 12l-5.25 5.25m-10.5 0L1.5 12l5.25-5.25m7.5-3l-4.5 16.5" /></svg>}
            title="Web Development"
            desc="Django and React applications built for speed, clean data models, and easy maintenance — from first commit to deployment."
          />
          <ServiceCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128 2.25 2.25 0 01-2.4 2.245 4.5 4.5 0 008.4-2.245c0-.399-.078-.78-.22-1.128zm0 0a15.998 15.998 0 003.388-1.62" /></svg>}
            title="UI/UX Design"
            desc="Interfaces designed in Figma with real content, then built to match — no gap between the mockup and the shipped product."
          />
          <ServiceCard
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6"><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.836l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75" /></svg>}
            title="E-commerce Solutions"
            desc="Storefronts, checkout flows, and inventory dashboards that hold up under real traffic and real orders."
          />
          <ServiceCard
            span
            icon={<svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.6"><path strokeLinecap="round" strokeLinejoin="round" d="M9.53 16.122a3 3 0 00-5.78 1.128M9.53 16.122L15 6.75" /></svg>}
            title="Brand Identity"
            desc="Logos, color systems, and type scales that carry through consistently from a business card to a full web app."
          />
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Skills ---------------- */
function SkillGroup({ label, color, items, delay }) {
  return (
    <Reveal type="up" delay={delay}>
      <h3 className="text-xs font-mono uppercase tracking-wider mb-4" style={{ color }}>{label}</h3>
      <ul className="flex flex-wrap gap-2.5">
        {items.map((item) => (
          <li key={item} className="skill-chip">{item}</li>
        ))}
      </ul>
    </Reveal>
  );
}

function Skills() {
  return (
    <section id="skills" className="py-28 border-t border-white/6 bg-surface/40">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <Reveal type="up"><h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">Tools &amp; technologies</h2></Reveal>
        <Reveal type="up" delay={80}><p className="mt-4 text-fg-dim max-w-lg">The stack I reach for most, grouped by where it fits in a project.</p></Reveal>

        <div className="mt-14 grid md:grid-cols-3 gap-10">
          <SkillGroup label="Frontend" color="#2dd4c4" delay={0} items={["React", "JavaScript", "Tailwind CSS", "HTML5 & CSS3"]} />
          <SkillGroup label="Backend" color="#22d3ee" delay={120} items={["Django", "Python", "PostgreSQL", "REST APIs"]} />
          <SkillGroup label="Design & tools" color="#e23fd1" delay={240} items={["Figma", "Adobe XD", "Git & GitHub", "Cloudinary"]} />
        </div>
      </div>
    </section>
  );
}

/* ---------------- Projects ---------------- */
function Project({ reverse, tag, tagColor, title, desc, previewLabel, previewGradient }) {
  return (
    <Reveal type="up" as="article" className="grid lg:grid-cols-2 gap-10 items-center">
      <div className={`project-frame ${reverse ? "order-1" : "order-2 lg:order-1"}`}>
        <div className="project-frame__bar"><span /><span /><span /></div>
        <div className={`project-frame__body ${previewGradient}`} role="img" aria-label={`${title} interface preview`}>
          <span className="font-display text-fg-faint">{previewLabel}</span>
        </div>
      </div>
      <div className={reverse ? "order-2" : "order-1 lg:order-2"}>
        <span className="text-xs font-mono uppercase tracking-wider" style={{ color: tagColor }}>{tag}</span>
        <h3 className="font-display text-2xl font-semibold mt-3">{title}</h3>
        <p className="mt-3 text-fg-dim leading-relaxed max-w-md">{desc}</p>
        <div className="mt-5 flex gap-5 text-sm">
          <a href="#" className="link-underline text-fg font-medium">Live site</a>
          <a href="#" className="link-underline text-fg-dim">Source code</a>
        </div>
      </div>
    </Reveal>
  );
}

function Projects() {
  return (
    <section id="projects" className="py-28 border-t border-white/6">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <Reveal type="up"><h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">Selected work</h2></Reveal>
        <Reveal type="up" delay={80}><p className="mt-4 text-fg-dim max-w-lg">A few recent builds — swap these for your own case studies and screenshots.</p></Reveal>

        <div className="mt-16 space-y-20">
          <Project
            reverse
            tag="Django · PWA · PostgreSQL" tagColor="#2dd4c4"
            title="EGC Learning Management System"
            desc="A multi-app Django platform at egccenter.site with offline-ready PWA support and a timer-based, auto-graded quiz engine, plus dedicated modules for fees, library, lectures, and attendance."
            previewLabel="LMS preview" previewGradient="bg-grad-primary/10"
          />
          <Project
            tag="Flutter · Dart · UI/UX" tagColor="#22d3ee"
            title="WaterLink"
            desc={'A water delivery app built around a navy-and-teal "Family of Blue" palette, with a swipeable onboarding flow and animated dot indicators for first-time users.'}
            previewLabel="App preview" previewGradient="bg-grad-accent/10"
          />
          <Project
            reverse
            tag="Design system" tagColor="#e23fd1"
            title="RSN Portfolio"
            desc="This site — a dark, animated single-page portfolio with scroll-triggered reveals, a live contact pipeline, and a component system built to be reused across future client sites."
            previewLabel="Site preview" previewGradient="bg-grad-primary/10"
          />
        </div>
      </div>
    </section>
  );
}

/* ---------------- Process ---------------- */
const PROCESS_STEPS = [
  { num: "01", title: "Discover", desc: "We map goals, users, and constraints before any design work starts." },
  { num: "02", title: "Design", desc: "Wireframes move to full Figma screens using real content, reviewed together." },
  { num: "03", title: "Develop", desc: "Build in short cycles with staging links so you see progress every week." },
  { num: "04", title: "Launch & support", desc: "Deploy, monitor, and stay on for fixes and iteration after launch." },
];

function Process() {
  return (
    <section id="process" className="py-28 border-t border-white/6 bg-surface/40">
      <div className="max-w-6xl mx-auto px-6 lg:px-8">
        <Reveal type="up"><h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">How a project runs</h2></Reveal>
        <Reveal type="up" delay={80}><p className="mt-4 text-fg-dim max-w-lg">Four stages, start to finish — no surprises in between.</p></Reveal>

        <div className="mt-16 grid sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
          <div className="hidden lg:block absolute top-6 left-[12%] right-[12%] h-px bg-white/8" />
          {PROCESS_STEPS.map((step, i) => (
            <Reveal key={step.num} type="up" delay={i * 100} className="relative">
              <span className="process-num">{step.num}</span>
              <h3 className="font-display font-semibold text-lg mt-5">{step.title}</h3>
              <p className="text-sm text-fg-dim mt-2 leading-relaxed">{step.desc}</p>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------- Testimonials ---------------- */
const TESTIMONIALS = [
  { quote: "RSN turned a rough set of notes into a working platform faster than we expected — and kept it easy for our own team to update afterward.", who: "Project collaborator · Education sector" },
  { quote: "Clear communication throughout, and the final build matched the designs almost pixel for pixel. Exactly the process we needed.", who: "Client · Small business" },
  { quote: "Good instincts on both the design and the technical side — rare to get both from one person.", who: "Client · App project" },
];

function Testimonials() {
  const [active, setActive] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setActive((i) => (i + 1) % TESTIMONIALS.length), 6000);
    return () => clearInterval(timerRef.current);
  }, []);

  const goTo = (i) => {
    setActive(i);
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => setActive((n) => (n + 1) % TESTIMONIALS.length), 6000);
  };

  return (
    <section id="testimonials" className="py-28 border-t border-white/6">
      <Reveal type="fade" className="max-w-3xl mx-auto px-6 lg:px-8 text-center">
        <svg className="w-8 h-8 mx-auto text-brand-teal/60" fill="currentColor" viewBox="0 0 32 32" aria-hidden="true">
          <path d="M9.352 4C4.456 7.456 1 13.12 1 19.36 1 24.416 4.352 28 8.976 28c4.288 0 7.36-3.36 7.36-7.36 0-3.696-2.576-6.416-6.032-6.416-.688 0-1.664.144-1.888.288.464-3.088 3.376-6.72 6.288-8.464L9.352 4z" />
        </svg>

        <div className="relative mt-8 min-h-[160px]">
          <blockquote aria-live="polite">
            <p className="text-xl sm:text-2xl font-display leading-snug text-fg">"{TESTIMONIALS[active].quote}"</p>
            <footer className="mt-6 text-sm text-fg-dim">{TESTIMONIALS[active].who}</footer>
          </blockquote>
        </div>

        <div className="flex items-center justify-center gap-2 mt-8">
          {TESTIMONIALS.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Show testimonial ${i + 1}`}
              className={`dot ${active === i ? "dot--active" : ""}`}
            />
          ))}
        </div>
      </Reveal>
    </section>
  );
}

/* ---------------- Contact ---------------- */
function Contact() {
  return (
    <section id="contact" className="py-28 border-t border-white/6 bg-surface/40">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 grid lg:grid-cols-[1fr,0.8fr] gap-14">
        <Reveal type="up">
          <h2 className="font-display text-3xl sm:text-4xl font-semibold tracking-tight">Start a project</h2>
          <p className="mt-4 text-fg-dim max-w-md">Tell me a bit about what you need — I reply within a day, usually sooner.</p>
          <ContactForm />
        </Reveal>

        <Reveal type="up" delay={120} className="space-y-6">
          <div className="contact-card">
            <p className="text-xs font-mono uppercase tracking-wider text-fg-faint">Email</p>
            <a href="mailto:hello@rsn.dev" className="mt-2 block text-fg font-medium link-underline">hello@rsn.dev</a>
          </div>
          <div className="contact-card">
            <p className="text-xs font-mono uppercase tracking-wider text-fg-faint">WhatsApp</p>
            <a href="https://wa.me/10000000000" target="_blank" rel="noopener noreferrer" className="mt-2 block text-fg font-medium link-underline">Chat directly</a>
          </div>
          <div className="contact-card">
            <p className="text-xs font-mono uppercase tracking-wider text-fg-faint">Elsewhere</p>
            <div className="mt-3 flex gap-4">
              <a href="#" className="social-icon" aria-label="GitHub">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true"><path d="M12 .5C5.65.5.5 5.65.5 12c0 5.09 3.29 9.4 7.86 10.93.57.1.78-.25.78-.55 0-.27-.01-1.16-.02-2.1-3.2.7-3.87-1.36-3.87-1.36-.53-1.34-1.29-1.7-1.29-1.7-1.05-.72.08-.71.08-.71 1.17.08 1.78 1.2 1.78 1.2 1.03 1.77 2.71 1.26 3.37.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.68 0-1.26.45-2.28 1.19-3.09-.12-.29-.52-1.46.11-3.04 0 0 .97-.31 3.18 1.18a11 11 0 015.79 0c2.2-1.49 3.17-1.18 3.17-1.18.64 1.58.24 2.75.12 3.04.74.81 1.19 1.83 1.19 3.09 0 4.41-2.69 5.39-5.25 5.67.41.36.78 1.06.78 2.14 0 1.55-.01 2.79-.01 3.17 0 .3.2.66.79.55A10.52 10.52 0 0023.5 12C23.5 5.65 18.35.5 12 .5z" /></svg>
              </a>
              <a href="#" className="social-icon" aria-label="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true"><path d="M20.45 20.45h-3.56v-5.58c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.14 1.45-2.14 2.94v5.68H9.34V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.38-1.85 3.61 0 4.28 2.38 4.28 5.47v6.27zM5.34 7.43a2.07 2.07 0 110-4.13 2.07 2.07 0 010 4.13zM7.12 20.45H3.56V9h3.56v11.45z" /></svg>
              </a>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

/* ---------------- Footer ---------------- */
function Footer() {
  return (
    <footer className="border-t border-white/6 py-10">
      <div className="max-w-6xl mx-auto px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-sm text-fg-faint">© {new Date().getFullYear()} Raja Salman Nadeem. All rights reserved.</p>
        <button
          onClick={() => window.scrollTo({ top: 0, behavior: prefersReducedMotion() ? "auto" : "smooth" })}
          className="text-sm text-fg-dim hover:text-brand-teal transition-colors duration-300 focus:outline-none focus:underline"
        >
          Back to top ↑
        </button>
      </div>
    </footer>
  );
}

/* ---------------- App ---------------- */
export default function App() {
  return (
    <div className="bg-ink text-fg font-sans antialiased selection:bg-brand-teal/30 min-h-screen">
      <ScrollProgress />
      <Navbar />
      <main>
        <Hero />
        <About />
        <Skills />
        <Projects />
        <Process />
        <Testimonials />
        <Contact />
      </main>
      <Footer />
      <StickyWhatsApp />
      <ChatWidget />
    </div>
  );
}