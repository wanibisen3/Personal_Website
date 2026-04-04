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
  Terminal,
  Linkedin
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
    <div className="min-h-screen bg-[#FFF9F6] text-slate-800 font-sans selection:bg-[#FADBD8] relative overflow-hidden">
      {/* Animated Background Blobs */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-[#D97B66]/20 mix-blend-multiply filter blur-[100px] animate-blob" />
        <div className="absolute top-[10%] right-[-10%] w-[40%] h-[50%] rounded-full bg-blue-400/20 mix-blend-multiply filter blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] rounded-full bg-rose-400/10 mix-blend-multiply filter blur-[100px] animate-blob animation-delay-4000" />
      </div>

      {/* Header */}
      <header className="max-w-5xl mx-auto px-5 md:px-8 pt-16 md:pt-24 pb-8 md:pb-12 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-12 md:gap-8">
          <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="inline-flex items-start md:items-center gap-2 px-4 py-2 md:py-1.5 rounded-2xl md:rounded-full bg-[#FADBD8]/30 border border-[#D97B66]/20 text-[#D97B66] text-sm font-semibold tracking-wide">
            <Terminal size={14} className="shrink-0 mt-0.5 md:mt-0" />
            <span>INSEAD x Wharton MBA | Product Strategy | Computer Science Foundation</span>
          </div>
          <div className="flex flex-wrap items-center gap-4 md:gap-6 mt-4 mb-6">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight text-slate-900 leading-none">
              Wani <span className="text-[#D97B66]">Bisen</span>
            </h1>
            <a 
              href="https://www.linkedin.com/in/wanibisen/"
              target="_blank"
              rel="noopener noreferrer"
              className="p-3 md:p-4 rounded-full bg-[#0A66C2]/10 hover:bg-[#0A66C2]/20 border border-[#0A66C2]/20 text-[#0A66C2] transition-all shadow-sm hover:shadow-md mt-1 md:mt-2"
              title="LinkedIn Profile"
            >
              <Linkedin size={32} className="md:w-10 md:h-10 lg:w-12 lg:h-12" strokeWidth={2} />
            </a>
          </div>
            <p className="text-xl md:text-2xl text-slate-500 max-w-2xl leading-relaxed font-medium">
              Building scalable products at the intersection of deep technology and business strategy. I turn complex architectures into measurable outcomes and market-leading user experiences.
            </p>
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, rotate: -2 }}
            animate={{ opacity: 1, scale: 1, rotate: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="md:w-2/5 flex justify-center md:justify-end shrink-0 md:translate-x-6 lg:translate-x-12"
          >
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-[#FADBD8] to-blue-200 rounded-[2.5rem] transform rotate-3 scale-105 opacity-50 blur-xl animate-pulse" />
              <img 
                src="/profile.jpg" 
                alt="Wani Bisen" 
                className="w-72 h-80 md:w-80 md:h-[420px] object-cover rounded-[2.5rem] shadow-2xl border-4 border-white relative z-10"
              />
            </div>
          </motion.div>
        </div>
      </header>
      
      <main className="max-w-5xl mx-auto px-5 md:px-8 pb-16 pt-0 relative z-10">
        
        {/* Projects Section - NOW FIRST */}
        <section id="projects" className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-2xl bg-[#FADBD8]/30 border border-[#D97B66]/20 shadow-sm">
              <Code className="text-[#D97B66]" size={28} />
            </div>
            <h2 className="text-4xl font-black text-slate-900">Product Portfolio</h2>
          </div>

          <div className="grid md:grid-cols-2 gap-6 md:gap-8">
            {projects.map((proj, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ y: -8 }}
                className="p-6 md:p-10 rounded-2xl md:rounded-3xl bg-white border border-[#FADBD8]/50 shadow-xl shadow-[#D97B66]/5 hover:border-[#D97B66]/30 transition-all group relative overflow-hidden flex flex-col"
              >
                <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:opacity-20 transition-opacity pointer-events-none">
                  <Code size={80} className="text-[#D97B66]" />
                </div>
                <div className="flex justify-between items-start mb-6 md:mb-8 relative z-10">
                  <h3 className="text-xl md:text-2xl font-bold text-slate-900 group-hover:text-[#D97B66] transition-colors pr-4">
                    {proj.title}
                  </h3>
                  {proj.link ? (
                    <a 
                      href={proj.link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-[#FADBD8]/50 text-slate-600 hover:text-[#D97B66] transition-all font-bold text-sm shrink-0 border border-transparent hover:border-[#D97B66]/20 relative z-10"
                    >
                      <span className="hidden sm:inline tracking-wide">View Project</span>
                      <ExternalLink size={18} strokeWidth={2.5} />
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

        {/* My Approach Section - NOW SECOND */}
        <section id="approach" className="mb-16">
          <div className="mb-8">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">How I Build Products</h2>
            <p className="text-xl text-slate-500 font-medium mt-4">Core principles driving my product leadership.</p>
          </div>
          <div className="grid md:grid-cols-2 gap-4 md:gap-6">
            <div className="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-white border border-[#FADBD8]/50 shadow-sm hover:shadow-xl hover:shadow-[#D97B66]/5 transition-all">
              <h3 className="text-xl font-bold text-slate-900 mb-2 md:mb-3 tracking-tight">Outcomes over features</h3>
              <p className="text-slate-500 leading-relaxed text-sm md:text-base">Technology alone isn't a product. AI systems only succeed when they natively solve defined business problems and integrate into real workflows.</p>
            </div>
            <div className="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-white border border-[#FADBD8]/50 shadow-sm hover:shadow-xl hover:shadow-[#D97B66]/5 transition-all">
              <h3 className="text-xl font-bold text-slate-900 mb-2 md:mb-3 tracking-tight">Bridging the chasm</h3>
              <p className="text-slate-500 leading-relaxed text-sm md:text-base">I translate raw technical constraints into clear go-to-market strategies, enabling executive leadership to make informed technology investments.</p>
            </div>
            <div className="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-white border border-[#FADBD8]/50 shadow-sm hover:shadow-xl hover:shadow-[#D97B66]/5 transition-all">
              <h3 className="text-xl font-bold text-slate-900 mb-2 md:mb-3 tracking-tight">Designing for scale</h3>
              <p className="text-slate-500 leading-relaxed text-sm md:text-base">Rooted in a computer science foundation, I prioritize system architecture and data integrity equally alongside the front-end user experience.</p>
            </div>
            <div className="p-6 md:p-8 rounded-2xl md:rounded-3xl bg-white border border-[#FADBD8]/50 shadow-sm hover:shadow-xl hover:shadow-[#D97B66]/5 transition-all">
              <h3 className="text-xl font-bold text-slate-900 mb-2 md:mb-3 tracking-tight">Navigating ambiguity</h3>
              <p className="text-slate-500 leading-relaxed text-sm md:text-base">Shaping emerging technologies into market-ready products requires structured, systematic thinking—honed through executing massive 0-to-1 product launches.</p>
            </div>
          </div>
        </section>

        {/* Experience Section */}
        <section id="experience" className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-3 rounded-2xl bg-[#FADBD8]/30 border border-[#D97B66]/20 shadow-sm">
              <Briefcase className="text-[#D97B66]" size={28} />
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Leadership & Experience</h2>
          </div>
          
          <div className="space-y-12">
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
        <section id="contact" className="pt-8 md:pt-12">
          <div className="p-6 md:p-14 rounded-[2rem] md:rounded-[3rem] bg-white border border-[#FADBD8]/50 shadow-2xl shadow-[#D97B66]/10 relative overflow-hidden">
            <div className="absolute top-0 right-0 w-64 h-64 bg-[#FADBD8]/10 rounded-full -mr-32 -mt-32 opacity-50 pointer-events-none" />
            <div className="max-w-xl relative z-10">
              <div className="mb-8 block">
                <div className="p-3 inline-flex rounded-2xl bg-[#FADBD8]/30 border border-[#D97B66]/20 shadow-sm mb-6">
                  <Mail className="text-[#D97B66]" size={32} />
                </div>
                <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight leading-tight">Looking to build or scale products? Let's connect.</h2>
              </div>
              <p className="text-xl text-slate-500 mb-12 font-medium">
                Drop me a message below.
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
      <footer className="max-w-5xl mx-auto px-5 md:px-8 py-12 md:py-16 border-t border-[#FADBD8]/50 text-center text-slate-400 text-sm font-medium relative z-10">
        <p className="max-w-xs mx-auto md:max-w-full leading-relaxed">© {new Date().getFullYear()} Wani Bisen. Built with Node.js, Supabase, and Resend.</p>
      </footer>
    </div>
  );
}

