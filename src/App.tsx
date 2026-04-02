/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { 
  Briefcase, 
  Code, 
  Mail, 
  Send, 
  ChevronRight, 
  ExternalLink, 
  CheckCircle2,
  AlertCircle,
  Terminal
} from "lucide-react";

interface Experience {
  company: string;
  role: string;
  period: string;
  highlights: string[];
}

interface Project {
  title: string;
  description: string;
  status: string;
  tags: string[];
  link?: string;
}

export default function App() {
  const [experience, setExperience] = useState<Experience[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [formStatus, setFormStatus] = useState<"idle" | "submitting" | "success" | "error">("idle");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [expRes, projRes] = await Promise.all([
          fetch("/api/experience"),
          fetch("/api/projects")
        ]);
        setExperience(await expRes.json());
        setProjects(await projRes.json());
      } catch (err) {
        console.error("Failed to fetch data:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleContact = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormStatus("submitting");
    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (res.ok) setFormStatus("success");
      else setFormStatus("error");
    } catch (err) {
      setFormStatus("error");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div 
          animate={{ rotate: 360 }}
          transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
          className="w-8 h-8 border-2 border-[#D97B66] border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FFF9F6] text-slate-800 font-sans selection:bg-[#FADBD8]">
      {/* Header */}
      <header className="max-w-5xl mx-auto px-6 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#FADBD8]/30 border border-[#D97B66]/20 text-[#D97B66] text-sm font-semibold">
            <Terminal size={14} />
            <span>Product Leader in AI & Data | Ex-Fivetran SDE | INSEAD & Wharton MBA</span>
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tight text-slate-900">
            Wani <span className="text-[#D97B66]">Bisen</span>
          </h1>
          <p className="text-2xl text-slate-600 max-w-2xl leading-relaxed font-medium">
            I bridge technical depth with business strategy to build scalable, AI-driven products. Turning complex technologies into measurable outcomes and market-leading user experiences.
          </p>
        </motion.div>
      </header>

      <main className="max-w-5xl mx-auto px-6 space-y-40 pb-32">
        {/* Projects Section - NOW FIRST */}
        <section id="projects">
          <div className="flex items-center gap-3 mb-16">
            <div className="p-3 rounded-2xl bg-[#FADBD8]/30 border border-[#D97B66]/20 shadow-sm">
              <Code className="text-[#D97B66]" size={28} />
            </div>
            <h2 className="text-4xl font-black text-slate-900">Strategic Product Portfolio</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            {projects.map((proj, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -8 }}
                className="p-10 rounded-3xl bg-white border border-[#FADBD8]/50 shadow-xl shadow-[#D97B66]/5 hover:border-[#D97B66]/30 transition-all group relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity">
                  <Code size={80} className="text-[#D97B66]" />
                </div>
                <div className="flex justify-between items-start mb-8">
                  <h3 className="text-2xl font-bold text-slate-900 group-hover:text-[#D97B66] transition-colors">
                    {proj.title}
                  </h3>
                  {proj.link ? (
                    <a 
                      href={proj.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="p-2 rounded-full bg-slate-100 hover:bg-[#FADBD8]/30 text-slate-600 hover:text-[#D97B66] transition-all"
                    >
                      <ExternalLink size={20} />
                    </a>
                  ) : (
                    <ExternalLink size={20} className="text-slate-300" />
                  )}
                </div>
                <p className="text-slate-600 mb-10 leading-relaxed text-lg">
                  {proj.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  {proj.tags.map((tag, i) => (
                    <span key={i} className="px-4 py-1.5 rounded-full bg-[#FADBD8]/10 text-xs font-bold text-[#D97B66] border border-[#D97B66]/10">
                      {tag}
                    </span>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Experience Section - NOW SECOND */}
        <section id="experience">
          <div className="flex items-center gap-3 mb-16">
            <div className="p-3 rounded-2xl bg-[#FADBD8]/30 border border-[#D97B66]/20 shadow-sm">
              <Briefcase className="text-[#D97B66]" size={28} />
            </div>
            <h2 className="text-4xl font-black text-slate-900">Leadership & Career Trajectory</h2>
          </div>
          
          <div className="space-y-16">
            {experience.map((exp, idx) => (
              <motion.div 
                key={idx}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="relative pl-10 border-l-4 border-[#FADBD8]/50 group"
              >
                <div className="absolute -left-[14px] top-0 w-6 h-6 rounded-full bg-white border-4 border-[#FADBD8]/50 group-hover:border-[#D97B66]/50 transition-all shadow-sm" />
                <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                  <div>
                    <h3 className="text-2xl font-black text-slate-900">{exp.role}</h3>
                    <p className="text-[#D97B66] font-bold text-lg">{exp.company}</p>
                  </div>
                  <span className="text-sm font-bold text-slate-400 bg-slate-100 px-4 py-1.5 rounded-full mt-2 md:mt-0">
                    {exp.period}
                  </span>
                </div>
                <ul className="space-y-4">
                  {exp.highlights.map((h, i) => (
                    <li key={i} className="flex gap-4 text-slate-600 leading-relaxed text-lg">
                      <ChevronRight size={22} className="text-[#D97B66]/50 shrink-0 mt-1" />
                      <span>{h}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact Section */}
        <section id="contact" className="pt-12">
          <div className="p-16 rounded-[3rem] bg-white border border-[#FADBD8]/50 shadow-2xl shadow-[#D97B66]/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FADBD8]/10 rounded-full -mr-32 -mt-32 opacity-50" />
            <div className="max-w-xl relative">
              <div className="flex items-center gap-3 mb-8">
                <Mail className="text-[#D97B66]" size={28} />
                <h2 className="text-4xl font-black text-slate-900">Get in Touch</h2>
              </div>
              <p className="text-xl text-slate-600 mb-12 font-medium">
                Have a project in mind or want to discuss AI strategy? Drop me a message below.
              </p>

              <form onSubmit={handleContact} className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-500 ml-1">Name</label>
                    <input 
                      required
                      name="name"
                      type="text" 
                      className="w-full px-6 py-4 rounded-2xl bg-[#FADBD8]/5 border border-[#FADBD8]/20 focus:border-[#D97B66]/50 focus:ring-4 focus:ring-[#D97B66]/10 outline-none transition-all text-slate-900 font-medium"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-sm font-bold text-slate-500 ml-1">Email</label>
                    <input 
                      required
                      name="email"
                      type="email" 
                      className="w-full px-6 py-4 rounded-2xl bg-[#FADBD8]/5 border border-[#FADBD8]/20 focus:border-[#D97B66]/50 focus:ring-4 focus:ring-[#D97B66]/10 outline-none transition-all text-slate-900 font-medium"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                <div className="space-y-3">
                  <label className="text-sm font-bold text-slate-500 ml-1">Message</label>
                  <textarea 
                    required
                    name="message"
                    rows={4}
                    className="w-full px-6 py-4 rounded-2xl bg-[#FADBD8]/5 border border-[#FADBD8]/20 focus:border-[#D97B66]/50 focus:ring-4 focus:ring-[#D97B66]/10 outline-none transition-all text-slate-900 font-medium resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>
                
                <button 
                  disabled={formStatus === "submitting"}
                  className="w-full md:w-auto px-10 py-5 rounded-2xl bg-[#D97B66] hover:bg-[#C06552] text-white font-black text-lg flex items-center justify-center gap-3 transition-all shadow-lg shadow-[#D97B66]/30 disabled:opacity-50"
                >
                  {formStatus === "submitting" ? (
                    <motion.div 
                      animate={{ rotate: 360 }}
                      transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                      className="w-6 h-6 border-3 border-white border-t-transparent rounded-full"
                    />
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send size={20} />
                    </>
                  )}
                </button>

                <AnimatePresence>
                  {formStatus === "success" && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-3 text-green-700 bg-green-50 p-6 rounded-2xl border border-green-100 font-bold"
                    >
                      <CheckCircle2 size={24} />
                      <span>Message sent successfully! I'll get back to you soon.</span>
                    </motion.div>
                  )}
                  {formStatus === "error" && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0 }}
                      className="flex items-center gap-3 text-red-700 bg-red-50 p-6 rounded-2xl border border-red-100 font-bold"
                    >
                      <AlertCircle size={24} />
                      <span>Something went wrong. Please try again or email me directly.</span>
                    </motion.div>
                  )}
                </AnimatePresence>
              </form>
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="max-w-5xl mx-auto px-6 py-16 border-t border-[#FADBD8]/50 text-center text-slate-400 text-sm font-bold">
        <p>© {new Date().getFullYear()} Wani Bisen. Built with Node.js, Supabase, and Resend.</p>
      </footer>
    </div>
  );
}

