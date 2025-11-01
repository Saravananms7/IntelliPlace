import { useState } from 'react';
import { motion } from 'framer-motion';
import { GraduationCap, Building2, Shield } from 'lucide-react';
import AdminLoginModal from '../components/AdminLoginModal';
import StudentLoginModal from '../components/StudentLoginModal';
import CompanyLoginModal from '../components/CompanyLoginModal';

const LandingPage = () => {
  const [adminModalOpen, setAdminModalOpen] = useState(false);
  const [studentModalOpen, setStudentModalOpen] = useState(false);
  const [companyModalOpen, setCompanyModalOpen] = useState(false);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
    hover: { scale: 1.05, y: -5 },
  };

  return (
    <div className="h-screen bg-gradient-to-br from-black via-gray-900 to-black relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-red-500 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-red-600 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-700 rounded-full mix-blend-multiply filter blur-xl opacity-10 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 h-full flex flex-col items-center justify-center px-4 py-4 md:py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-4 md:mb-8"
        >
          <motion.div
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
            className="inline-block mb-2 md:mb-4"
          >
            <GraduationCap className="w-12 h-12 md:w-20 md:h-20 text-white mx-auto" />
          </motion.div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-white mb-2 md:mb-4">
            IntelliPlace
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-white/90 max-w-2xl mx-auto">
            Redefining Campus Placements
          </p>
          <p className="text-sm md:text-base lg:text-lg text-white/80 mt-2 md:mt-4 max-w-xl mx-auto">
            Connect students with companies through an intelligent placement platform
          </p>
        </motion.div>

        {/* Action Cards */}
        <div className="grid md:grid-cols-3 gap-4 md:gap-6 max-w-5xl w-full">
          {/* Student Card */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.2 }}
            whileHover="hover"
            className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 lg:p-8 border border-white/20 shadow-xl cursor-pointer"
            onClick={() => setStudentModalOpen(true)}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center mb-2 md:mb-3 lg:mb-4">
                <GraduationCap className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">Student</h2>
              <p className="text-xs md:text-sm text-white/80 mb-3 md:mb-4 lg:mb-6">
                Access your profile, browse opportunities, and manage applications
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setStudentModalOpen(true);
                }}
                className="w-full bg-red-600 text-white hover:bg-red-700 py-2 md:py-3 px-3 md:px-6 rounded-lg text-sm md:text-base font-medium transition-all"
              >
                Login
              </button>
            </div>
          </motion.div>

          {/* Company Card */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.4 }}
            whileHover="hover"
            className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 lg:p-8 border border-white/20 shadow-xl cursor-pointer"
            onClick={() => setCompanyModalOpen(true)}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center mb-2 md:mb-3 lg:mb-4">
                <Building2 className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">Company</h2>
              <p className="text-xs md:text-sm text-white/80 mb-3 md:mb-4 lg:mb-6">
                Post jobs, manage applications, and connect with talented students
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setCompanyModalOpen(true);
                }}
                className="w-full bg-red-600 text-white hover:bg-red-700 py-2 md:py-3 px-3 md:px-6 rounded-lg text-sm md:text-base font-medium transition-all"
              >
                Login
              </button>
            </div>
          </motion.div>

          {/* Admin Card */}
          <motion.div
            variants={cardVariants}
            initial="hidden"
            animate="visible"
            transition={{ delay: 0.6 }}
            whileHover="hover"
            className="bg-white/10 backdrop-blur-md rounded-2xl p-4 md:p-6 lg:p-8 border border-white/20 shadow-xl cursor-pointer"
            onClick={() => setAdminModalOpen(true)}
          >
            <div className="flex flex-col items-center text-center">
              <div className="w-12 h-12 md:w-14 md:h-14 lg:w-16 lg:h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-full flex items-center justify-center mb-2 md:mb-3 lg:mb-4">
                <Shield className="w-6 h-6 md:w-7 md:h-7 lg:w-8 lg:h-8 text-white" />
              </div>
              <h2 className="text-xl md:text-2xl font-bold text-white mb-1 md:mb-2">Admin</h2>
              <p className="text-xs md:text-sm text-white/80 mb-3 md:mb-4 lg:mb-6">
                Manage the platform, users, and oversee the placement process
              </p>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setAdminModalOpen(true);
                }}
                className="w-full bg-red-600 text-white hover:bg-red-700 py-2 md:py-3 px-3 md:px-6 rounded-lg text-sm md:text-base font-medium transition-all"
              >
                Login
              </button>
            </div>
          </motion.div>
        </div>
      </div>

      <AdminLoginModal
        isOpen={adminModalOpen}
        onClose={() => setAdminModalOpen(false)}
      />
      <StudentLoginModal
        isOpen={studentModalOpen}
        onClose={() => setStudentModalOpen(false)}
      />
      <CompanyLoginModal
        isOpen={companyModalOpen}
        onClose={() => setCompanyModalOpen(false)}
      />
    </div>
  );
};

export default LandingPage;

