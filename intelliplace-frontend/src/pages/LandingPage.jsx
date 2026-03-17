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
            <motion.span variants={fadeUpText} className="block text-7xl md:text-9xl lg:text-[11rem] text-transparent bg-clip-text bg-gradient-to-b from-white via-blue-100 to-gray-400 drop-shadow-[0_0_20px_rgba(255,255,255,0.2)]">
              Intelliplace
            </motion.span>
            <motion.span variants={fadeUpText} className="block text-5xl md:text-7xl lg:text-[5.5rem] text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-indigo-400 to-purple-400">
              Hire the best talent.
            </motion.span>
            <motion.span variants={fadeUpText} className="block text-4xl md:text-6xl lg:text-[4.5rem] text-transparent bg-clip-text bg-gradient-to-r from-fuchsia-400 via-pink-400 to-rose-400 pb-4">
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

export default LandingPage;