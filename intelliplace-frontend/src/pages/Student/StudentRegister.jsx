import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, GraduationCap, ArrowLeft, Eye, EyeOff, BookOpen, Target, Zap, CheckCircle } from 'lucide-react';
import { register } from '../../utils/auth';

const StudentRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    rollNumber: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    if (formData.password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);

    try {
      const result = await register(formData, 'student');
      setLoading(false);

      if (result.success) {
        navigate('/student/dashboard');
      } else {
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setLoading(false);
      setError('An error occurred. Please try again.');
    }
  };

  const passwordRequirements = [
    { text: "At least 6 characters", met: formData.password.length >= 6 },
    { text: "Passwords match", met: formData.password === formData.confirmPassword && formData.confirmPassword !== '' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 overflow-hidden flex flex-col">
      
      {/* Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-20 -right-20 w-72 h-72 bg-blue-500/10 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-20 -left-20 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-500/5 rounded-full blur-3xl"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:64px_64px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,black,transparent)]"></div>
      </div>

      <div className="flex-1 flex items-center justify-center px-4 py-3 relative z-10">
        <div className="w-full max-w-5xl mx-auto">
          {/* Back Button */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4"
          >
            <Link
              to="/"
              className="inline-flex items-center text-white/80 hover:text-white transition-all duration-300 group text-sm font-medium"
            >
              <ArrowLeft className="w-4 h-4 mr-2 group-hover:-translate-x-1 transition-transform" />
              Back to Home
            </Link>
          </motion.div>

          <div className="grid lg:grid-cols-12 gap-10 items-start">
            {/* Left Side - Features (Hidden on mobile) */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-5 hidden lg:block"
            >
              <div className="space-y-10">
                <div>
                  <motion.h1 
                    className="text-5xl font-bold text-white mb-3"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                  >
                    Start Your{' '}
                    <span className="bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                      Career Journey
                    </span>
                  </motion.h1>
                  <motion.p 
                    className="text-base text-gray-300 mb-5"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    Join thousands of students who found their dream jobs through IntelliPlace
                  </motion.p>
                </div>

                {/* Feature Cards */}
                <div className="space-y-4">
                  {[
                    { icon: BookOpen, text: "Track Applications", desc: "Monitor all your job applications in one place" },
                    { icon: Target, text: "Smart Matching", desc: "Get matched with perfect job opportunities" },
                    { icon: Zap, text: "Quick Apply", desc: "Apply to jobs with just one click" }
                  ].map((feature, index) => {
                    const Icon = feature.icon;
                    return (
                      <motion.div
                        key={feature.text}
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.4 + index * 0.1 }}
                        className="flex items-start space-x-3 p-4 rounded-xl bg-white/5 backdrop-blur-sm border border-white/10 hover:border-blue-500/30 transition-all duration-300"
                      >
                        <div className="flex-shrink-0 w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center">
                          <Icon className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <h3 className="text-sm font-semibold text-white mb-1">{feature.text}</h3>
                          <p className="text-gray-400 text-xs">{feature.desc}</p>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>

                {/* Stats */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  className="grid grid-cols-3 gap-4 pt-4 border-t border-gray-700/50"
                >
                  <div className="text-center">
                    <div className="text-xl font-bold text-white mb-1">95%</div>
                    <div className="text-xs text-gray-400">Placement Rate</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-white mb-1">500+</div>
                    <div className="text-xs text-gray-400">Companies</div>
                  </div>
                  <div className="text-center">
                    <div className="text-xl font-bold text-white mb-1">10K+</div>
                    <div className="text-xs text-gray-400">Students</div>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Right Side - Registration Form */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="lg:col-span-7"
            >
              <div className="relative">
                {/* Card Glow Effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-2xl blur-xl opacity-20"></div>
                
                <div className="relative bg-gray-800/60 backdrop-blur-xl rounded-2xl shadow-2xl p-6 border border-white/10">
                  {/* Header */}
                  <div className="text-center mb-6">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ 
                        delay: 0.2,
                        type: "spring",
                        stiffness: 200
                      }}
                      className="inline-flex items-center justify-center mb-3"
                    >
                      <div className="relative">
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-xl blur-md opacity-60"></div>
                        <div className="relative bg-gradient-to-br from-blue-600 to-cyan-600 p-3 rounded-xl border border-blue-400/30 shadow-lg">
                          <GraduationCap className="w-6 h-6 text-white" />
                        </div>
                      </div>
                    </motion.div>

                    <motion.h2 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.3 }}
                      className="text-2xl font-bold text-white mb-2"
                    >
                      Student Registration
                    </motion.h2>
                    
                    <motion.p 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.4 }}
                      className="text-gray-300 text-sm"
                    >
                      Create your account and start your career journey
                    </motion.p>
                  </div>

                  {/* Form */}
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid md:grid-cols-2 gap-4">
                      {/* Name Field */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.5 }}
                      >
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Full Name
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <User className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                            className="block w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 text-sm"
                            placeholder="John Doe"
                            required
                          />
                        </div>
                      </motion.div>

                      {/* Email Field */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.55 }}
                      >
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Email Address
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Mail className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="email"
                            value={formData.email}
                            onChange={(e) =>
                              setFormData({ ...formData, email: e.target.value })
                            }
                            className="block w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 text-sm"
                            placeholder="student@university.edu"
                            required
                          />
                        </div>
                      </motion.div>

                      {/* Roll Number Field */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.6 }}
                      >
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Roll Number
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <GraduationCap className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="text"
                            value={formData.rollNumber}
                            onChange={(e) =>
                              setFormData({ ...formData, rollNumber: e.target.value })
                            }
                            className="block w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 text-sm"
                            placeholder="2024CS001"
                            required
                          />
                        </div>
                      </motion.div>

                      {/* Phone Field */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.65 }}
                      >
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Phone Number
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Phone className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type="tel"
                            value={formData.phone}
                            onChange={(e) =>
                              setFormData({ ...formData, phone: e.target.value })
                            }
                            className="block w-full pl-10 pr-4 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 text-sm"
                            placeholder="+1 (555) 123-4567"
                            required
                          />
                        </div>
                      </motion.div>

                      {/* Password Field */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.7 }}
                      >
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={(e) =>
                              setFormData({ ...formData, password: e.target.value })
                            }
                            className="block w-full pl-10 pr-10 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 text-sm"
                            placeholder="Enter your password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors"
                          >
                            {showPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </motion.div>

                      {/* Confirm Password Field */}
                      <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.75 }}
                      >
                        <label className="block text-sm font-medium text-gray-200 mb-2">
                          Confirm Password
                        </label>
                        <div className="relative">
                          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Lock className="h-4 w-4 text-gray-400" />
                          </div>
                          <input
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={(e) =>
                              setFormData({ ...formData, confirmPassword: e.target.value })
                            }
                            className="block w-full pl-10 pr-10 py-3 bg-gray-700/50 border border-gray-600/50 rounded-lg text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all duration-300 text-sm"
                            placeholder="Confirm your password"
                            required
                          />
                          <button
                            type="button"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors"
                          >
                            {showConfirmPassword ? (
                              <EyeOff className="h-4 w-4" />
                            ) : (
                              <Eye className="h-4 w-4" />
                            )}
                          </button>
                        </div>
                      </motion.div>
                    </div>

                    {/* Password Requirements */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.8 }}
                      className="bg-gray-700/30 rounded-lg p-3"
                    >
                      <h4 className="text-sm font-medium text-gray-200 mb-2">Password Requirements</h4>
                      <div className="space-y-1">
                        {passwordRequirements.map((req, index) => (
                          <div key={index} className="flex items-center text-sm">
                            <CheckCircle 
                              className={`w-4 h-4 mr-2 ${
                                req.met ? 'text-green-400' : 'text-gray-500'
                              }`} 
                            />
                            <span className={req.met ? 'text-green-400' : 'text-gray-400'}>
                              {req.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Error Message */}
                    {error && (
                      <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="bg-red-500/20 border border-red-400/30 text-red-100 px-3 py-2 rounded-lg text-sm flex items-center"
                      >
                        <div className="w-2 h-2 bg-red-400 rounded-full mr-2"></div>
                        {error}
                      </motion.div>
                    )}

                    {/* Register Button */}
                    <motion.button
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.9 }}
                      type="submit"
                      disabled={loading}
                      whileHover={{ scale: loading ? 1 : 1.02 }}
                      whileTap={{ scale: loading ? 1 : 0.98 }}
                      className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 text-white py-3 px-6 rounded-lg font-semibold shadow-lg hover:shadow-blue-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-2 text-sm"
                    >
                      {loading ? (
                        <>
                          <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                          Creating Account...
                        </>
                      ) : (
                        <>
                          <User className="w-4 h-4" />
                          Create Account
                        </>
                      )}
                    </motion.button>

                    {/* Login Link */}
                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 1 }}
                      className="text-center pt-3 border-t border-gray-700/50"
                    >
                      <p className="text-gray-400 text-sm">
                        Already have an account?{' '}
                        <Link
                          to="/student/login"
                          className="text-cyan-400 font-medium hover:text-cyan-300 transition-colors duration-300 hover:underline"
                        >
                          Sign in here
                        </Link>
                      </p>
                    </motion.div>
                  </form>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentRegister;