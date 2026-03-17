import { useState, useRef, useEffect } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import {
  FileSearch,
  Code2,
  Video,
  Users,
  ShieldCheck,
  GraduationCap,
  Building2,
  UserCog,
  ArrowRight,
  Mail,
  Phone,
  Github,
  Linkedin,
  ChevronRight,
  Sparkles
} from "lucide-react";

import AdminLoginModal from "../components/AdminLoginModal";
import StudentLoginModal from "../components/StudentLoginModal";
import CompanyLoginModal from "../components/CompanyLoginModal";

const fadeUpText = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const LandingPage = () => {
  const [adminOpen, setAdminOpen] = useState(false);
  const [studentOpen, setStudentOpen] = useState(false);
  const [companyOpen, setCompanyOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  const homeRef = useRef(null);
  const loginRef = useRef(null);
  const processRef = useRef(null);

  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 1000], [0, 200]);
  const y2 = useTransform(scrollY, [0, 1000], [0, -200]);
  const opacity = useTransform(scrollY, [0, 500], [1, 0]);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollTo = (ref) => {
    ref.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="min-h-screen bg-[#030305] text-white selection:bg-indigo-500/30 font-sans overflow-x-hidden">

      {/* Background Orbs & Image */}
      <div className="fixed inset-0 z-0 pointer-events-none overflow-hidden bg-[#030305]">
        {/* Dynamic Background Image */}
        <div 
          className="absolute inset-0 opacity-40 mix-blend-screen"
          style={{ 
            backgroundImage: "url('/landing_bg.png')", 
            backgroundSize: 'cover', 
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
          }} 
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#030305]/80 to-[#030305] z-0" />
        
        <motion.div
          style={{ y: y1 }}
          className="absolute top-[-20%] left-[-10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/20 blur-[140px]"
        />
        <motion.div
          style={{ y: y2 }}
          className="absolute bottom-[-20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-purple-600/20 blur-[140px]"
        />
        <div className="absolute top-[40%] left-[50%] translate-x-[-50%] w-[60vw] h-[60vw] rounded-full bg-blue-600/10 blur-[150px]" />
      </div>

      {/* ================= NAVBAR ================= */}
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className={`fixed top-4 left-1/2 -translate-x-1/2 w-[95%] max-w-5xl z-50 transition-all duration-300 rounded-2xl ${scrolled
          ? "bg-white/5 backdrop-blur-xl border border-white/10 shadow-2xl py-3 px-6"
          : "bg-transparent py-4 px-6 border border-transparent"
          }`}
      >
        <div className="flex items-center justify-between">
          <div
            className="flex items-center gap-2 cursor-pointer group"
            onClick={() => scrollTo(homeRef)}
          >

            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 ">
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-8">
            {["Home", "Process", "Login"].map((item) => (
              <button
                key={item}
                onClick={() => {
                  if (item === "Home") scrollTo(homeRef);
                  if (item === "Process") scrollTo(processRef);
                  if (item === "Login") scrollTo(loginRef);
                }}
                className="text-sm font-medium text-gray-400 hover:text-white transition-colors relative group"
              >
                {item}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 rounded-full transition-all group-hover:w-full" />
              </button>
            ))}
          </nav>

          <button
            onClick={() => scrollTo(loginRef)}
            className="hidden md:flex items-center gap-2 text-sm font-semibold px-5 py-2 rounded-full bg-white text-black hover:bg-gray-200 transition-colors shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_30px_rgba(255,255,255,0.4)]"
          >
            Get Started <ArrowRight size={16} />
          </button>
        </div>
      </motion.header>

      {/* ================= HERO ================= */}
      <section
        ref={homeRef}
        className="relative min-h-screen flex flex-col items-center justify-center px-6 pt-20 z-10"
      >
        <motion.div
          style={{ opacity }}
          className="text-center w-full mx-auto flex flex-col items-center justify-center p-4"
        >

          <motion.h1
            initial="hidden"
            animate="visible"
            variants={staggerContainer}
            className="font-extrabold tracking-tighter leading-[1.05] mb-10 text-center flex flex-col gap-2 md:gap-4 relative z-10"
          >
            <motion.span variants={fadeUpText} className="block text-6xl md:text-8xl lg:text-[8rem] text-transparent bg-clip-text bg-gradient-to-b from-white via-blue-100 to-gray-400 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              Intelliplace
            </motion.span>
            <motion.span variants={fadeUpText} className="block text-4xl md:text-6xl lg:text-[4rem] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400">
              Hire the best talent.
            </motion.span>
            <motion.span variants={fadeUpText} className="block text-3xl md:text-5xl lg:text-[3.5rem] text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-pink-400 to-rose-400 pb-4">
              Faster and smarter.
            </motion.span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-lg md:text-2xl text-gray-400 max-w-3xl mb-12 font-light leading-relaxed text-center"
          >
            IntelliPlace automates CV screening, coding rounds, virtual GDs,
            and interviews. A unified platform built for modern institutions.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center gap-4"
          >
            <button
              onClick={() => scrollTo(loginRef)}
              className="px-8 py-4 rounded-full bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold text-lg flex items-center gap-2 hover:scale-105 transition-transform shadow-[0_0_30px_rgba(99,102,241,0.4)] hover:shadow-[0_0_50px_rgba(99,102,241,0.6)]"
            >
              Start Hiring Now <ArrowRight size={20} />
            </button>
            <button
              onClick={() => scrollTo(processRef)}
              className="px-8 py-4 rounded-full border border-white/10 bg-white/5 backdrop-blur-md text-white font-semibold text-lg flex items-center gap-2 hover:bg-white/10 transition-colors"
            >
              See how it works
            </button>
          </motion.div>
        </motion.div>

{/* Coding Platform Mockup */}
        <MockupCarousel />
      </section>

      {/* ================= PROCESS/PIPELINE ================= */}
      <section ref={processRef} className="py-32 px-6 relative z-10">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={fadeUpText}
            className="text-center mb-20"
          >
            <h2 className="text-sm font-bold tracking-widest text-indigo-400 uppercase mb-3">Workflow</h2>
            <h3 className="text-4xl md:text-5xl font-bold">End-to-End Recruitment</h3>
            <p className="mt-4 text-gray-400 max-w-2xl mx-auto text-lg">
              Seamlessly manage the entire hiring lifecycle from a single dashboard.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              { icon: FileSearch, title: "Automated Screening", desc: "AI-powered resume parsing and intelligent candidate shortlisting based on job criteria.", color: "from-blue-500/20 to-cyan-500/20", border: "group-hover:border-blue-500/50" },
              { icon: Code2, title: "Aptitude & Coding", desc: "Secure online evaluations with built-in IDE, execution environment, and plagiarism limits.", color: "from-indigo-500/20 to-purple-500/20", border: "group-hover:border-indigo-500/50" },
              { icon: Users, title: "Virtual Group Discussions", desc: "Host seamless remote group discussions with automated candidate invitations.", color: "from-fuchsia-500/20 to-pink-500/20", border: "group-hover:border-fuchsia-500/50" },
              { icon: Video, title: "Live Interviews", desc: "Integrated video interviews with shared code spaces and collaborative whiteboards.", color: "from-emerald-500/20 to-teal-500/20", border: "group-hover:border-emerald-500/50" },
              { icon: ShieldCheck, title: "Fair Selection", desc: "Data-driven insights and transparent scoring ensures unbiased final selections.", color: "from-amber-500/20 to-orange-500/20", border: "group-hover:border-amber-500/50" }
            ].map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className={`group relative p-8 rounded-3xl bg-white/[0.02] border border-white/5 backdrop-blur-sm transition-all duration-500 hover:bg-white/[0.04] ${step.border} overflow-hidden`}
                >
                  <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 bg-gradient-to-br ${step.color} transition-opacity duration-500 blur-xl`} />
                  <div className="relative z-10">
                    <div className="mb-6 w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-xl">
                      <Icon className="w-7 h-7 text-white" />
                    </div>
                    <h4 className="text-xl font-semibold mb-3">{step.title}</h4>
                    <p className="text-gray-400 leading-relaxed text-sm">{step.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ================= LOGIN/ROLES ================= */}
      <section ref={loginRef} className="py-32 px-6 relative z-10 bg-black/50 border-t border-white/5">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={fadeUpText}
            className="text-center mb-20"
          >
            <h2 className="text-sm font-bold tracking-widest text-purple-400 uppercase mb-3">Access Portal</h2>
            <h3 className="text-4xl md:text-5xl font-bold">Choose Your Role</h3>
            <p className="mt-4 text-gray-400 max-w-xl mx-auto text-lg">
              Secure logins for every stakeholder in the recruitment process.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            <RoleCard
              icon={GraduationCap}
              title="Student"
              desc="Take tests, participate in virtual GDs, attend interviews, and monitor your application progress."
              onClick={() => setStudentOpen(true)}
              accent="indigo"
              delay={0.1}
            />
            <RoleCard
              icon={Building2}
              title="Company"
              desc="Post jobs, create assessments, evaluate candidates, and manage your campus hiring drives."
              onClick={() => setCompanyOpen(true)}
              accent="fuchsia"
              delay={0.2}
            />
            <RoleCard
              icon={UserCog}
              title="Admin"
              desc="Oversee the platform, manage institutional workflows, and access detailed placement analytics."
              onClick={() => setAdminOpen(true)}
              accent="emerald"
              delay={0.3}
            />
          </div>
        </div>
      </section>

      {/* ================= FOOTER ================= */}
      <footer className="relative z-10 bg-[#020202] border-t border-white/5 pt-20 pb-10 px-6">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12 text-gray-400 mb-16">
          <div className="col-span-1 md:col-span-1">
            <div className="flex items-center gap-2 mb-6">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <Sparkles size={16} className="text-white" />
              </div>
              <h4 className="text-white font-bold text-xl tracking-tight">IntelliPlace</h4>
            </div>
            <p className="text-sm leading-relaxed mb-6">
              Empowering institutions and companies with next-generation automated campus recruitment tools.
            </p>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Platform</h4>
            <ul className="space-y-4 text-sm">
              {["AI Screening", "Aptitude Tests", "Coding Ground", "Virtual GDs", "Interviews"].map(item => (
                <li key={item} className="hover:text-indigo-400 transition-colors cursor-pointer">{item}</li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Contact</h4>
            <ul className="space-y-4 text-sm">
              <li>
                <a href="mailto:intelliplacecsb@gmail.com" className="flex items-center gap-3 hover:text-white transition-colors group">
                  <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                    <Mail size={16} />
                  </div>
                  intelliplacecsb@gmail.com
                </a>
              </li>
              <li>
                <a href="tel:+919645256211" className="flex items-center gap-3 hover:text-white transition-colors group">
                  <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                    <Phone size={16} />
                  </div>
                  +91 96452 56211
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-white font-semibold mb-6">Connect</h4>
            <div className="flex flex-col gap-4 text-sm">
              <a href="https://github.com/Rashisha14/IntelliPlace" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors group">
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                  <Github size={18} />
                </div>
                v1.0.0 Open Source
              </a>
              <a href="https://www.linkedin.com/in/mohammed-rashidm/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 hover:text-white transition-colors group">
                <div className="p-2 rounded-lg bg-white/5 group-hover:bg-white/10 transition-colors">
                  <Linkedin size={18} />
                </div>
                Creator
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between pt-8 border-t border-white/5 text-xs text-gray-500">
          <p>© 2025 IntelliPlace. All rights reserved.</p>
          <div className="flex gap-6 mt-4 md:mt-0">
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
          </div>
        </div>
      </footer>

      {/* ================= MODALS ================= */}
      <AdminLoginModal isOpen={adminOpen} onClose={() => setAdminOpen(false)} />
      <StudentLoginModal isOpen={studentOpen} onClose={() => setStudentOpen(false)} />
      <CompanyLoginModal isOpen={companyOpen} onClose={() => setCompanyOpen(false)} />

    </div>
  );
};

const RoleCard = ({ icon: Icon, title, desc, onClick, accent, delay }) => {
  const accentColors = {
    indigo: "from-indigo-500 to-blue-500 border-indigo-500/50 shadow-indigo-500/20",
    fuchsia: "from-fuchsia-500 to-purple-500 border-fuchsia-500/50 shadow-fuchsia-500/20",
    emerald: "from-emerald-500 to-teal-500 border-emerald-500/50 shadow-emerald-500/20"
  };

  const glowColors = {
    indigo: "bg-indigo-500/20",
    fuchsia: "bg-fuchsia-500/20",
    emerald: "bg-emerald-500/20"
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.6 }}
      whileHover={{ y: -10 }}
      className="group relative h-full"
    >
      <div className={`absolute -inset-0.5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl ${glowColors[accent]}`} />
      <div className="relative h-full flex flex-col p-8 rounded-3xl bg-[#0a0a0c] border border-white/10 group-hover:border-white/20 overflow-hidden transition-colors duration-500">
        <div className="mb-8 w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center group-hover:scale-110 transition-transform duration-500 relative overflow-hidden">
          <div className={`absolute inset-0 opacity-0 group-hover:opacity-20 bg-gradient-to-br ${accentColors[accent].split(' ').slice(0, 2).join(' ')}`} />
          <Icon className="w-8 h-8 text-white relative z-10" />
        </div>

        <h4 className="text-2xl font-bold mb-3">{title}</h4>
        <p className="text-gray-400 mb-8 flex-1 leading-relaxed">{desc}</p>

        <button
          onClick={onClick}
          className="w-full py-4 rounded-xl bg-white/5 border border-white/10 text-white font-semibold flex items-center justify-center gap-2 group-hover:bg-white group-hover:text-black transition-all duration-300"
        >
          Login to Portal <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
        </button>
      </div>
    </motion.div>
  );
};

const MockupCarousel = () => {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveIndex((current) => (current + 1) % 3);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  const mockups = [
    {
      id: 0,
      title: "Aptitude Quiz",
      content: (
        <div className="flex flex-col h-[400px] md:h-[500px] p-8 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-64 h-64 bg-fuchsia-600/10 blur-[100px] rounded-full" />
            <div className="flex justify-between items-center mb-8">
              <div>
                <h3 className="text-2xl font-bold text-white mb-2">Quantitative Aptitude</h3>
                <p className="text-gray-400 text-sm">Question 4 of 20</p>
              </div>
              <div className="text-right">
                <div className="text-xl font-mono text-fuchsia-400 font-bold">14:59</div>
                <p className="text-gray-500 text-xs uppercase tracking-wider mt-1">Time Remaining</p>
              </div>
            </div>
            
            <div className="flex-1">
              <div className="bg-white/5 border border-white/10 rounded-2xl p-6 mb-8 backdrop-blur-md">
                <p className="text-lg text-white/90 leading-relaxed font-medium">A train running at the speed of 60 km/hr crosses a pole in 9 seconds. What is the length of the train?</p>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {['120 metres', '150 metres', '180 metres', '210 metres'].map((lbl, i) => (
                  <div key={i} className={`p-4 rounded-xl border flex items-center gap-4 cursor-pointer transition-all ${i === 1 ? 'bg-fuchsia-500/20 border-fuchsia-500 shadow-[0_0_15px_rgba(217,70,239,0.3)]' : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20'}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${i === 1 ? 'bg-fuchsia-500 text-white' : 'bg-white/10 text-white/50'}`}>
                      {String.fromCharCode(65 + i)}
                    </div>
                    <span className={`font-medium ${i === 1 ? 'text-white' : 'text-gray-300'}`}>{lbl}</span>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="flex justify-between items-center mt-auto pt-4 border-t border-white/10">
              <button className="px-6 py-2 rounded-lg bg-white/5 text-gray-400 hover:text-white hover:bg-white/10 transition-colors font-medium text-sm">Previous</button>
              <button className="px-6 py-2 rounded-lg bg-fuchsia-500 text-white hover:bg-fuchsia-600 transition-colors font-medium text-sm shadow-[0_0_20px_rgba(217,70,239,0.4)]">Next Question</button>
            </div>
        </div>
      )
    },
    {
      id: 1,
      title: "Coding Assessment",
      content: (
        <div className="flex flex-col h-[400px] md:h-[500px] font-mono text-sm">
          {/* Editor Header */}
          <div className="flex justify-between items-center px-4 py-3 border-b border-white/10 bg-[#060608]/90 overflow-x-auto">
            <div className="flex items-center gap-6">
              <div className="flex gap-2 min-w-fit">
                <div className="w-3 h-3 rounded-full bg-red-400/80 hover:bg-red-400 transition-colors" />
                <div className="w-3 h-3 rounded-full bg-amber-400/80 hover:bg-amber-400 transition-colors" />
                <div className="w-3 h-3 rounded-full bg-green-400/80 hover:bg-green-400 transition-colors" />
              </div>
              <div className="flex gap-4 min-w-fit">
                <span className="text-white/90 border-b-2 border-indigo-500 pb-[10px] -mb-[12px] flex items-center gap-2">
                  <Code2 size={14} className="text-indigo-400" />
                  CandidateAssessment.js
                </span>
              </div>
            </div>
            <div className="hidden md:flex items-center gap-3">
              <div className="bg-indigo-500/20 text-indigo-300 px-3 py-1 rounded-full text-xs font-semibold flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" /> Live Session Active
              </div>
              <button className="bg-gradient-to-r from-indigo-500 to-purple-500 text-white px-4 py-1.5 rounded-md text-xs font-bold hover:shadow-lg hover:shadow-indigo-500/20 transition-all">Run Tests</button>
            </div>
          </div>
          
          {/* Editor Body */}
          <div className="flex flex-1 overflow-hidden">
            {/* Line Numbers */}
            <div className="w-12 bg-[#060608]/50 border-r border-white/5 flex flex-col items-center py-4 text-white/20 select-none text-xs hidden sm:flex">
              {[...Array(15)].map((_, i) => <div key={i} className="py-[3px]">{i + 1}</div>)}
            </div>
            
            {/* Code Area */}
            <div className="flex-1 p-4 bg-transparent overflow-hidden relative text-[13px] md:text-sm">
              <pre className="text-white/80 leading-[1.8] font-mono whitespace-pre-wrap">
<span className="text-pink-400">import</span> {'{'} <span className="text-yellow-200">useState</span>, <span className="text-yellow-200">useEffect</span> {'}'} <span className="text-pink-400">from</span> <span className="text-green-300">'react'</span>;<br/>
<span className="text-pink-400">import</span> {'{'} <span className="text-yellow-200">analyzeTalent</span>, <span className="text-yellow-200">scheduleInterview</span> {'}'} <span className="text-pink-400">from</span> <span className="text-green-300">'@intelliplace/core'</span>;<br/>
<br/>
<span className="text-pink-400">const</span> <span className="text-blue-300">IntelliPlaceAssesment</span> <span className="text-pink-400">=</span> () <span className="text-pink-400">{"=>"}</span> {'{'}<br/>
{'  '}<span className="text-pink-400">const</span> [score, setScore] <span className="text-pink-400">=</span> <span className="text-blue-200">useState</span>(<span className="text-orange-300">100</span>);<br/>
<br/>
{'  '}<span className="text-blue-200">useEffect</span>(() <span className="text-pink-400">{"=>"}</span> {'{'}<br/>
{'    '}<span className="text-gray-400 italic">// AI Copilot: Start screening candidate automatically...</span><br/>
{'    '}<span className="text-blue-200">analyzeTalent</span>().<span className="text-blue-200">then</span>(result <span className="text-pink-400">{"=>"}</span> {'{'}<br/>
{'      '}<span className="text-pink-400">if</span> (result.<span className="text-blue-100">percentile</span> <span className="text-pink-400">{">="}</span> <span className="text-orange-300">99</span>) {'{'}<br/>
{'        '}console.<span className="text-blue-200">log</span>(<span className="text-green-300">"Top 1% Talent Found! 🚀"</span>);<br/>
{'        '}<span className="text-blue-200">scheduleInterview</span>(result.<span className="text-blue-100">candidateId</span>);<br/>
{'      '}&#125;<br/>
{'    '}&#125;);<br/>
{'  '}&#125;, []);<br/>
              </pre>
              
              {/* Floating Elements (Test Suite Result) */}
              <div 
                className="absolute right-6 top-6 w-64 md:w-72 bg-black/60 backdrop-blur-xl border border-white/10 rounded-xl p-4 shadow-2xl z-10 hidden md:block"
              >
                <div className="flex items-center justify-between mb-3 border-b border-white/10 pb-3">
                   <span className="text-xs text-white/60 font-semibold uppercase tracking-wider flex items-center gap-2"><ShieldCheck size={14} className="text-indigo-400" /> Test Suite</span>
                   <span className="text-[10px] text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full font-bold uppercase tracking-wider border border-emerald-400/20">All Passing</span>
                </div>
                <div className="space-y-3">
                  <div className="flex items-center gap-3"><div className="rounded-full bg-emerald-400/20 p-1"><ShieldCheck size={12} className="text-emerald-400" /></div><span className="text-xs text-white/80 font-medium">Algorithm efficiency: <span className="text-emerald-400">O(1)</span></span></div>
                  <div className="flex items-center gap-3"><div className="rounded-full bg-emerald-400/20 p-1"><ShieldCheck size={12} className="text-emerald-400" /></div><span className="text-xs text-white/80 font-medium">Edge cases handled</span></div>
                  <div className="flex items-center gap-3"><div className="rounded-full bg-indigo-400/20 p-1"><Sparkles size={12} className="text-indigo-400" /></div><span className="text-xs text-white/80 font-medium">Global Rank: <span className="text-indigo-400 font-bold">#42</span></span></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    },
    {
      id: 2,
      title: "Live Virtual Interview",
      content: (
        <div className="flex flex-col h-[400px] md:h-[500px] p-0 relative overflow-hidden bg-black/50">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-900/20 to-teal-900/20" />
          
          <div className="flex-1 p-4 md:p-6 flex gap-4 md:gap-6 z-10 overflow-hidden">
            {/* Main Video (Candidate) */}
            <div className="flex-1 relative rounded-2xl overflow-hidden border border-white/10 bg-[#111]">
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=1288&auto=format&fit=crop')] bg-cover bg-center opacity-80 mix-blend-luminosity" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-white text-sm font-medium">Candidate (You)</span>
              </div>
            </div>
            
            {/* Sidebar View */}
            <div className="w-48 md:w-64 flex flex-col gap-4 md:gap-6">
              {/* Interviewer */}
              <div className="h-28 md:h-36 relative rounded-2xl overflow-hidden border border-white/10 bg-[#111] shrink-0">
                <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1560250097-0b93528c311a?q=80&w=1287&auto=format&fit=crop')] bg-cover bg-center opacity-80 mix-blend-luminosity" />
                <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-md px-2 py-1 rounded border border-white/10 flex items-center gap-2">
                  <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  <span className="text-white text-xs font-medium">Interviewer</span>
                </div>
              </div>
              
              {/* AI Copilot feedback */}
              <div className="flex-1 bg-white/5 rounded-2xl border border-white/10 p-3 md:p-4 flex flex-col min-h-0">
                <div className="flex items-center gap-2 mb-3 md:mb-4">
                  <Sparkles size={16} className="text-emerald-400" />
                  <span className="text-white font-semibold text-sm">AI Copilot</span>
                </div>
                
                <div className="space-y-3 flex-1 overflow-y-auto pr-2 min-h-0">
                  <div className="bg-emerald-500/10 border border-emerald-500/20 p-2 md:p-3 rounded-xl">
                    <p className="text-[10px] md:text-xs text-emerald-200 leading-relaxed font-medium">Confidence levels look great. The candidate correctly explained the time complexity of the algorithm.</p>
                  </div>
                  <div className="bg-white/5 border border-white/10 p-2 md:p-3 rounded-xl">
                    <p className="text-[10px] md:text-xs text-gray-300 leading-relaxed">Suggested follow-up: "How would you optimize this for larger datasets?"</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Controls */}
          <div className="h-16 shrink-0 border-t border-white/10 bg-black/40 backdrop-blur-xl flex items-center justify-center gap-6 z-10 w-full">
            <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"><div className="w-4 h-4 bg-white/80 rounded" /></button>
            <button className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center hover:bg-white/20 transition-colors"><div className="w-4 h-4 rounded-full border-2 border-white/80" /></button>
            <button className="w-12 h-12 rounded-full bg-red-500 flex items-center justify-center hover:bg-red-600 transition-colors shadow-[0_0_20px_rgba(239,68,68,0.4)]"><Phone className="rotate-[135deg] text-white" size={20} /></button>
          </div>
        </div>
      )
    }
  ];

  return (
    <motion.div
      initial={{ opacity: 0, y: 100 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1, delay: 0.8, ease: "easeOut" }}
      className="mt-20 w-full max-w-5xl relative perspective-[2000px] z-20 group"
    >
      {/* Decorative glow behind mockup */}
      <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/30 via-purple-500/30 to-fuchsia-500/30 blur-[100px] -z-10 group-hover:blur-[120px] transition-all duration-700" />
      
      <div className="absolute inset-0 bg-gradient-to-t from-[#030305] via-transparent to-transparent z-30 bottom-[-10%] top-[80%] pointer-events-none" />
      
      {/* Tab Selectors */}
      <div className="absolute -top-12 left-1/2 -translate-x-1/2 flex items-center gap-2 bg-black/50 backdrop-blur-xl border border-white/10 p-1 rounded-full z-40">
        {mockups.map((mockup, idx) => (
          <button
            key={mockup.id}
            onClick={() => setActiveIndex(idx)}
            className={`px-4 py-1.5 rounded-full text-xs font-semibold transition-all duration-300 ${
              activeIndex === idx 
                ? 'bg-white text-black shadow-lg' 
                : 'text-gray-400 hover:text-white hover:bg-white/10'
            }`}
          >
            {mockup.title}
          </button>
        ))}
      </div>

      <div className="relative rounded-2xl md:rounded-3xl border border-white/10 bg-[#0d0d12]/80 backdrop-blur-3xl overflow-hidden shadow-[0_20px_70px_-10px_rgba(99,102,241,0.3)] transition-transform duration-700 hover:scale-[1.02]">
        
        {/* Render Active Mockup with simple fade/slide transition */}
        <div className="relative w-full h-full">
          {mockups.map((mockup, idx) => (
            <div
              key={mockup.id}
              className={`transition-all duration-700 absolute inset-0 w-full h-full ${
                activeIndex === idx 
                  ? 'opacity-100 translate-x-0 pointer-events-auto z-10' 
                  : activeIndex > idx 
                    ? 'opacity-0 -translate-x-[20%] pointer-events-none -z-10'
                    : 'opacity-0 translate-x-[20%] pointer-events-none -z-10'
              }`}
            >
              {mockup.content}
            </div>
          ))}
        </div>
        
        {/* Keep the container height matched to the inner dynamic content */}
        <div className="invisible">
          {mockups[0].content}
        </div>
        
      </div>
    </motion.div>
  );
};

export default LandingPage;