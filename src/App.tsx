/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Send, CheckCircle2, AlertCircle, ExternalLink, ChevronRight } from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────────────────── */

interface Experience {
  company: string;
  role: string;
  period: string;
  highlights: string[];
  transition?: boolean;
  statHighlight?: string;
}

interface Project {
  title: string;
  description: string;
  status: string;
  tags: string[];
  link?: string;
  featured?: boolean;
  problem?: string;
  approach?: string;
  outcome?: string;
}

/* ─── Shared style helpers ───────────────────────────────────────────────── */

const S = {
  sectionLabel: {
    fontSize: "0.72rem",
    fontWeight: 600,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    color: "var(--accent)",
    marginBottom: "1rem",
  },
  sectionTitle: {
    fontFamily: "var(--serif)",
    fontSize: "clamp(2rem, 4vw, 3rem)",
    lineHeight: 1.1,
    color: "var(--ink)",
    letterSpacing: "-0.02em",
    marginBottom: "1rem",
  },
};

/* ─── Nav ────────────────────────────────────────────────────────────────── */

function Nav() {
  return (
    <nav style={{
      position: "fixed", top: 0, left: 0, right: 0, zIndex: 100,
      background: "color-mix(in oklch, var(--bg) 85%, transparent)",
      backdropFilter: "blur(16px)",
      borderBottom: "1px solid var(--rule)",
    }}>
      <div className="app-container" style={{
        height: 60,
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}>
        <a href="#top" style={{ fontFamily: "var(--serif)", fontSize: "1.05rem", color: "var(--ink)", textDecoration: "none", fontWeight: 500 }}>
          Wani Bisen
        </a>
        <div style={{ display: "flex", alignItems: "center", gap: "0.15rem" }}>
          {[{ label: "Work", href: "#work" }, { label: "Experience", href: "#experience" }].map(item => (
            <a key={item.href} href={item.href} style={{
              fontSize: "0.85rem", fontWeight: 500, color: "var(--ink-mid)",
              textDecoration: "none", padding: "0.4rem 0.7rem", borderRadius: 99,
              transition: "background 0.15s, color 0.15s",
            }}
              onMouseEnter={e => { (e.target as HTMLElement).style.background = "var(--accent-bg)"; (e.target as HTMLElement).style.color = "var(--accent)"; }}
              onMouseLeave={e => { (e.target as HTMLElement).style.background = "transparent"; (e.target as HTMLElement).style.color = "var(--ink-mid)"; }}
              className="nav-link"
            >
              {item.label}
            </a>
          ))}
          <a href="#contact" style={{
            fontSize: "0.85rem", fontWeight: 600, color: "var(--bg)",
            textDecoration: "none", padding: "0.4rem 1rem", borderRadius: 8,
            background: "var(--ink)", marginLeft: "0.4rem", transition: "background 0.15s",
          }}
            onMouseEnter={e => { (e.target as HTMLElement).style.background = "var(--accent)"; }}
            onMouseLeave={e => { (e.target as HTMLElement).style.background = "var(--ink)"; }}
          >
            Let's talk
          </a>
        </div>
      </div>
      <style>{`
        @media (max-width: 480px) {
          .nav-link { display: none; }
        }
      `}</style>
    </nav>
  );
}

/* ─── Hero ───────────────────────────────────────────────────────────────── */

function Hero() {
  return (
    <section id="top" className="hero-grid" style={{ overflow: "hidden", position: "relative", zIndex: 1 }}>
      {/* Text column */}
      <div style={{
        padding: "clamp(3rem, 10vh, 6rem) var(--pad)",
        display: "flex", flexDirection: "column", justifyContent: "center",
      }}
        className="hero-text-container"
      >
        <motion.h1
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
          style={{
            fontFamily: "var(--serif)",
            fontSize: "clamp(2.5rem, 5vw, 4.8rem)",
            lineHeight: 1.05, color: "var(--ink)", letterSpacing: "-0.02em",
            marginBottom: "1.5rem",
          }}
          className="text-balance"
        >
          Deep tech.<br />
          <em style={{ fontStyle: "italic", color: "var(--accent)" }}>Sharp strategy.</em><br />
          Outcomes that ship.
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
          style={{ fontSize: "clamp(1rem, 1.2vw, 1.15rem)", color: "var(--ink-mid)", maxWidth: 520, lineHeight: 1.7, marginBottom: "2.5rem" }}
        >
          I'm Wani Bisen — a product leader who{" "}
          <strong style={{ color: "var(--ink)", fontWeight: 600 }}>builds at the frontier of AI, data systems, and business strategy</strong>.
          {" "}I speak fluent engineer and fluent executive. INSEAD &amp; Wharton MBA, CS foundation, 8 years across global tech companies.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
          style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem" }}
        >
          <a href="#work" style={btnPrimary}>See my work →</a>
          <a href="mailto:wanibisen3@gmail.com" style={btnGhost}>wanibisen3@gmail.com</a>
          <a href="https://www.linkedin.com/in/wanibisen/" target="_blank" rel="noopener noreferrer" style={btnGhost}>LinkedIn ↗</a>
        </motion.div>
      </div>

      {/* Photo column */}
      <div style={{
        position: "relative", overflow: "hidden",
        background: "var(--rule)", paddingTop: 0,
        display: "flex", alignItems: "stretch",
      }}
        className="hero-image-container"
      >
        <img
          src="/wani-photo.png"
          alt="Wani Bisen"
          style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: "center 8%", display: "block", filter: "grayscale(8%)" }}
        />
        <div style={{
          position: "absolute", bottom: "1.5rem", left: "1.5rem", right: "1.5rem",
          background: "rgba(0,0,0,0.2)", backdropFilter: "blur(4px)", padding: "0.6rem 1rem", borderRadius: 8,
          border: "1px solid rgba(255,255,255,0.1)",
        }}>
          <p style={{
            fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.08em", textTransform: "uppercase",
            color: "#fff", margin: 0,
          }}>
            Wani Bisen &nbsp;·&nbsp; PM, AI &amp; LLMs
          </p>
        </div>
      </div>

      <style>{`
        .hero-grid { display: flex; flex-direction: column; min-height: 90vh; }
        .hero-image-container { min-height: 45vh; }
        @media (min-width: 720px) {
          .hero-grid { flex-direction: row; align-items: stretch; }
          .hero-text-container { flex: 1.2; padding-left: calc(max((100vw - 1120px) / 2, var(--pad))); }
          .hero-image-container { flex: 1; min-height: auto; }
        }
      `}</style>
    </section>
  );
}

/* ─── Button styles ──────────────────────────────────────────────────────── */

const btnBase: React.CSSProperties = {
  display: "inline-flex", alignItems: "center", gap: "0.5rem",
  fontFamily: "var(--sans)", fontSize: "0.9rem", fontWeight: 600,
  textDecoration: "none", padding: "0.75rem 1.5rem", borderRadius: 8,
  transition: "all 0.15s", cursor: "pointer", border: "none",
};
const btnPrimary: React.CSSProperties = { ...btnBase, background: "var(--ink)", color: "var(--bg)" };
const btnGhost: React.CSSProperties = { ...btnBase, background: "transparent", color: "var(--ink-mid)", border: "1px solid var(--rule)" };

/* ─── Credibility Strip ──────────────────────────────────────────────────── */

function CredStrip() {
  const companies = ["Fivetran", "ZS Associates", "Enprivacy", "INSEAD", "The Wharton School"];
  return (
    <div style={{ padding: "32px 0", borderTop: "1px solid var(--rule)", borderBottom: "1px solid var(--rule)", position: "relative", zIndex: 1 }}>
      <div className="app-container">
        <p style={{ fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--ink-soft)", marginBottom: "1.2rem" }}>
          Previously
        </p>
        <div style={{ display: "flex", alignItems: "center", gap: "clamp(1.5rem, 4vw, 2.5rem)", flexWrap: "wrap" }}>
          {companies.map((c, i) => (
            <React.Fragment key={c}>
              <span style={{ fontFamily: "var(--serif)", fontSize: "1.05rem", color: "var(--ink-soft)", opacity: 0.65 }}>{c}</span>
              {i < companies.length - 1 && <span style={{ width: 1, height: 20, background: "var(--rule)", flexShrink: 0 }} />}
            </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── Metrics ────────────────────────────────────────────────────────────── */

function Metrics() {
  const stats = [
    { num: "60", unit: "%", label: "Reduction in release cycle\ntime at ZS Associates" },
    { num: "10", unit: "+", label: "Engineers led across global\ncross-functional teams" },
    { num: "4",  unit: "",  label: "0-to-1 products shipped\nfrom concept to live users" },
  ];
  return (
    <section className="section-padding" style={{ position: "relative", zIndex: 1 }}>
      <div className="app-container">
        <p style={S.sectionLabel}>By the numbers</p>
        <h2 style={S.sectionTitle}>Impact that ships.</h2>
        <div className="metrics-grid" style={{ marginTop: "3rem" }}>
          {stats.map(s => (
            <div key={s.label} style={{ background: "#fff", padding: "2.5rem", textAlign: "center" }}>
              <div style={{ fontFamily: "var(--serif)", fontSize: "clamp(2.5rem, 4vw, 3.5rem)", lineHeight: 1, letterSpacing: "-0.03em", marginBottom: "0.4rem" }}>
                <span style={{ color: "var(--accent)" }}>{s.num}</span>{s.unit}
              </div>
              <div style={{ fontSize: "0.85rem", color: "var(--ink-mid)", fontWeight: 500, lineHeight: 1.4, whiteSpace: "pre-line" }}>{s.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Portfolio ──────────────────────────────────────────────────────────── */

function Portfolio({ projects }: { projects: Project[] }) {
  const featured = projects.find(p => p.featured);
  const rest = projects.filter(p => !p.featured);

  return (
    <section id="work" className="section-padding" style={{ position: "relative", zIndex: 1 }}>
      <div className="app-container">
        <p style={S.sectionLabel}>Selected work</p>
        <h2 style={S.sectionTitle}>Product portfolio.</h2>
        <p style={{ fontSize: "1.05rem", color: "var(--ink-mid)", maxWidth: 560, lineHeight: 1.65 }}>
          Four products built from scratch. Each one started with a structural problem — and ended with something that actually shipped.
        </p>

        {/* Featured project */}
        {featured && (
          <div style={{
            marginTop: "3rem", border: "1px solid var(--rule)", borderRadius: 16,
            overflow: "hidden", background: "#fff", position: "relative",
          }}>
            {featured.link && (
              <a href={featured.link} target="_blank" rel="noopener noreferrer" 
                style={{ ...btnGhost, fontSize: "0.82rem", padding: "0.5rem 1rem", position: "absolute", top: "1.5rem", right: "1.5rem", zIndex: 10 }}
              >
                View on GitHub ↗
              </a>
            )}
            <div style={{
              padding: "2.5rem 3rem", borderBottom: "1px solid var(--rule)",
              display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "2rem",
            }}>
              <div style={{ fontFamily: "var(--serif)", fontSize: "4rem", lineHeight: 1, color: "var(--rule)", fontStyle: "italic", flexShrink: 0, userSelect: "none" }}>01</div>
              <div style={{ flex: 1 }}>
                <p style={{ fontSize: "0.75rem", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase", color: "var(--accent)", marginBottom: "0.6rem" }}>AI Workflow Infrastructure</p>
                <h3 style={{ fontFamily: "var(--serif)", fontSize: "1.75rem", lineHeight: 1.2, color: "var(--ink)", letterSpacing: "-0.02em", marginBottom: "0.75rem" }}>{featured.title}</h3>
                <p style={{ fontSize: "1rem", color: "var(--ink-mid)", lineHeight: 1.65 }}>{featured.description}</p>
              </div>
            </div>
            <div className="featured-meta-grid">
              {[
                { heading: "The Problem", text: featured.problem },
                { heading: "My Approach", text: featured.approach },
                { heading: "The Outcome", text: featured.outcome },
              ].map((col, i) => (
                <div key={i} style={{
                  padding: "2rem 2.5rem",
                  borderRight: "1px solid var(--rule)",
                  borderBottom: "1px solid var(--rule)",
                }}>
                  <p style={{ fontSize: "0.7rem", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--ink-soft)", marginBottom: "0.75rem" }}>{col.heading}</p>
                  <p style={{ fontSize: "0.95rem", color: "var(--ink-mid)", lineHeight: 1.7 }}>{col.text}</p>
                </div>
              ))}
              <style>{`
                @media (min-width: 768px) {
                  .featured-meta-grid div:last-child { border-right: none; }
                  .featured-meta-grid div { border-bottom: none; }
                }
              `}</style>
            </div>
            <div style={{ padding: "1.5rem 3rem", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "1rem" }}>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                {featured.tags.map((tag, i) => (
                  <span key={i} style={{
                    fontSize: "0.75rem", fontWeight: 600, padding: "0.3rem 0.75rem", borderRadius: 99,
                    ...(i === 0
                      ? { color: "var(--accent)", background: "var(--accent-bg)", border: "1px solid oklch(88% 0.04 32)" }
                      : { color: "var(--ink-mid)", background: "oklch(94% 0.005 250)", border: "1px solid var(--rule)" }),
                  }}>
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Rest of projects */}
        <div className="portfolio-grid" style={{ marginTop: "1.5rem" }}>
          {rest.map((proj, idx) => (
            <a
              key={idx}
              href={proj.link || "#"}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                position: "relative",
                border: "1px solid var(--rule)",
                borderLeft: idx === 0 ? "3px solid var(--accent)" : "1px solid var(--rule)",
                borderRadius: 12, padding: "2rem", background: "#fff",
                textDecoration: "none", display: "flex", flexDirection: "column", gap: "0.75rem",
                transition: "border-color 0.15s, box-shadow 0.15s",
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div>
                  <p style={{ ...S.sectionLabel, fontSize: "0.65rem", marginBottom: "0.4rem" }}>
                    {String(idx + 2).padStart(2, "0")} — {idx === 0 ? "Decision Intelligence" : idx === 1 ? "Community Tool" : "Fintech Infrastructure"}
                  </p>
                  <h3 style={{ fontSize: "1.1rem", fontWeight: 600, color: "var(--ink)", letterSpacing: "-0.01em" }}>{proj.title}</h3>
                </div>
                <span className="project-arrow" style={{ fontSize: "1.2rem", color: "var(--ink)", lineHeight: 1 }}>↗</span>
              </div>
              <p style={{ fontSize: "0.95rem", color: "var(--ink-mid)", lineHeight: 1.65 }}>{proj.description}</p>
              <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap", marginTop: "0.5rem" }}>
                {(idx === 0 ? [{ accent: true, label: "Live product" }, ...proj.tags.map(t => ({ accent: false, label: t }))] : proj.tags.map(t => ({ accent: false, label: t }))).map((tag, i) => (
                  <span key={i} style={{
                    fontSize: "0.75rem", fontWeight: 600, padding: "0.3rem 0.75rem", borderRadius: 99,
                    ...(tag.accent
                      ? { color: "var(--accent)", background: "var(--accent-bg)", border: "1px solid oklch(88% 0.04 32)" }
                      : { color: "var(--ink-mid)", background: "oklch(94% 0.005 250)", border: "1px solid var(--rule)" }),
                  }}>
                    {tag.label}
                  </span>
                ))}
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Experience ─────────────────────────────────────────────────────────── */

function Experience({ experience }: { experience: Experience[] }) {
  return (
    <section id="experience" className="section-padding" style={{ position: "relative", zIndex: 1 }}>
      <div className="app-container">
        <p style={S.sectionLabel}>Career</p>
        <h2 style={S.sectionTitle}>8 years of building.</h2>
        <p style={{ fontSize: "1.1rem", color: "var(--ink-mid)", maxWidth: 560, lineHeight: 1.65 }}>
          From quality engineering to senior SDE to product leadership — a deliberate progression from technical depth to strategic breadth.
        </p>

        <div style={{ marginTop: "3rem" }}>
          {experience.map((exp, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="experience-grid"
              style={{
                padding: "2.5rem 0",
                borderTop: "1px solid var(--rule)",
                ...(idx === experience.length - 1 ? { borderBottom: "1px solid var(--rule)" } : {}),
              }}
            >
              <div style={{ paddingTop: "0.2rem" }}>
                <p style={{ fontSize: "0.85rem", fontWeight: 600, letterSpacing: "0.04em", color: "var(--ink-soft)", marginBottom: "0.4rem" }}>{exp.period}</p>
                <p style={{ fontSize: "0.95rem", fontWeight: 600, color: "var(--accent)" }}>{exp.company}</p>
              </div>
              <div>
                {exp.transition ? (
                  <p style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--ink)", marginBottom: "0.75rem", letterSpacing: "-0.01em" }}>
                    Senior Software Development Engineer{" "}
                    <span style={{ color: "var(--ink)", margin: "0 0.3rem" }}>→</span>
                    <span style={{ color: "var(--ink)" }}>Product Owner</span>
                  </p>
                ) : (
                  <p style={{ fontSize: "1.2rem", fontWeight: 600, color: "var(--ink)", marginBottom: "0.75rem", letterSpacing: "-0.01em" }}>{exp.role}</p>
                )}
                <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.6rem" }}>
                  {exp.highlights.map((h, i) => (
                    <li key={i} style={{ fontSize: "0.95rem", color: "var(--ink-mid)", lineHeight: 1.65, paddingLeft: "1.1rem", position: "relative" }}>
                      <span style={{ position: "absolute", left: 0, color: "var(--rule)", fontSize: "0.75rem", top: "0.25rem" }}>—</span>
                      {exp.statHighlight && h.startsWith(exp.statHighlight.split(" ")[0]) ? (
                        <span>
                          <strong style={{ color: "var(--ink)", fontWeight: 700 }}>{exp.statHighlight}</strong>
                          {h.slice(exp.statHighlight.length)}
                        </span>
                      ) : h}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─── Contact ────────────────────────────────────────────────────────────── */

function Contact() {
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  const handleContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("submitting");
    const data = Object.fromEntries(new FormData(e.currentTarget).entries());
    try {
      const res = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      setFormStatus(res.ok ? "success" : "error");
    } catch {
      setFormStatus("error");
    }
  };

  return (
    <div id="contact" style={{ background: "var(--bg-dark)", padding: "clamp(4rem, 10vh, 8rem) 0", position: "relative", zIndex: 1 }}>
      <div className="app-container contact-grid" style={{ padding: "0 var(--pad)" }}>
        <div>
          <h2 style={{
            fontFamily: "var(--serif)", fontSize: "clamp(2.5rem, 5vw, 4rem)", lineHeight: 1.1,
            color: "#fff", letterSpacing: "-0.03em", marginBottom: "1.5rem",
          }}>
            Building something<br />
            <em style={{ fontStyle: "italic", color: "var(--accent)" }}>hard to ship?</em>
          </h2>
          <p style={{ fontSize: "1.1rem", color: "oklch(70% 0.01 250)", lineHeight: 1.65, maxWidth: 480 }}>
            I work best on problems where technical complexity and strategic ambiguity collide. If you're building at that intersection — let's talk.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <a href="mailto:wanibisen3@gmail.com" style={{ ...btnBase, background: "#fff", color: "var(--ink)", fontSize: "1rem", padding: "1rem 2.5rem", justifyContent: "center" }}>
            Email me directly
          </a>
          <a href="https://www.linkedin.com/in/wanibisen/" target="_blank" rel="noopener noreferrer" style={{ ...btnBase, background: "transparent", color: "oklch(70% 0.01 250)", border: "1px solid oklch(30% 0.01 250)", fontSize: "0.9rem", padding: "0.8rem 2rem", justifyContent: "center" }}>
            Connect on LinkedIn ↗
          </a>
        </div>
      </div>
    </div>
  );
}

/* ─── Footer ─────────────────────────────────────────────────────────────── */

function Footer() {
  return (
    <footer style={{
      background: "var(--bg-dark)",
      borderTop: "1px solid oklch(22% 0.01 250)",
      padding: "2rem clamp(1.5rem, 5vw, 4rem)",
      position: "relative", zIndex: 1,
    }}>
      <div style={{ maxWidth: 1080, margin: "0 auto", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "1rem", flexWrap: "wrap" }}>
        <span style={{ fontFamily: "var(--serif)", fontStyle: "italic", fontSize: "0.95rem", color: "oklch(55% 0.01 250)" }}>Wani Bisen</span>
        <span style={{ fontSize: "0.78rem", color: "oklch(40% 0.01 250)" }}>Open to Senior PM, Head of Product roles</span>
      </div>
    </footer>
  );
}

/* ─── Loading spinner ────────────────────────────────────────────────────── */

function Loader() {
  return (
    <div style={{ minHeight: "100vh", background: "var(--bg)", display: "flex", alignItems: "center", justifyContent: "center" }}>
      <motion.div
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        style={{ width: 32, height: 32, border: "2px solid var(--accent)", borderTopColor: "transparent", borderRadius: "50%" }}
      />
    </div>
  );
}

/* ─── App ────────────────────────────────────────────────────────────────── */

export default function App() {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const [expRes, projRes] = await Promise.all([fetch("/api/experience"), fetch("/api/projects")]);
        setExperience(await expRes.json());
        setProjects(await projRes.json());
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  if (loading) return <Loader />;

  return (
    <div style={{ background: "var(--bg)", color: "var(--ink)", fontFamily: "var(--sans)", minHeight: "100vh" }}>
      <Nav />
      <Hero />
      <CredStrip />
      <Metrics />
      <hr style={{ border: "none", borderTop: "1px solid var(--rule)", margin: "0 var(--pad)", position: "relative", zIndex: 1 }} />
      <Portfolio projects={projects} />
      <hr style={{ border: "none", borderTop: "1px solid var(--rule)", margin: "0 var(--pad)", position: "relative", zIndex: 1 }} />
      <Experience experience={experience} />
      <Contact />
      <Footer />
    </div>
  );
}
