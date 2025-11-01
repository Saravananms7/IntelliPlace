import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, Phone, GraduationCap, ArrowLeft } from 'lucide-react';
import { register } from '../../utils/auth';
import Navbar from '../../components/Navbar';

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

  return (
    <div className="h-screen bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-4 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-4xl border border-white/20 my-auto max-h-full"
        >
          <Link
            to="/"
            className="inline-flex items-center text-white/80 hover:text-white mb-4 md:mb-6 transition-colors text-sm md:text-base"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            Back to Home
          </Link>

          <div className="text-center mb-4 md:mb-6">
            <div className="inline-flex items-center justify-center w-12 h-12 md:w-16 md:h-16 bg-gradient-to-br from-red-600 to-red-700 rounded-full mb-2 md:mb-4">
              <GraduationCap className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">Student Registration</h2>
            <p className="text-sm md:text-base text-white/80">Create your account to get started</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-white/90 mb-1 md:mb-2">
                  Full Name
                </label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4 md:w-5 md:h-5" />
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="w-full pl-9 md:pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-white/50 focus:ring-2 focus:ring-white/50 focus:border-transparent outline-none transition"
                    placeholder="Enter your full name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-white/90 mb-1 md:mb-2">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4 md:w-5 md:h-5" />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    className="w-full pl-9 md:pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-white/50 focus:ring-2 focus:ring-white/50 focus:border-transparent outline-none transition"
                    placeholder="Enter your email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-white/90 mb-1 md:mb-2">
                  Roll Number
                </label>
                <div className="relative">
                  <GraduationCap className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4 md:w-5 md:h-5" />
                  <input
                    type="text"
                    value={formData.rollNumber}
                    onChange={(e) =>
                      setFormData({ ...formData, rollNumber: e.target.value })
                    }
                    className="w-full pl-9 md:pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-white/50 focus:ring-2 focus:ring-white/50 focus:border-transparent outline-none transition"
                    placeholder="Enter your roll number"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-white/90 mb-1 md:mb-2">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4 md:w-5 md:h-5" />
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                    className="w-full pl-9 md:pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-white/50 focus:ring-2 focus:ring-white/50 focus:border-transparent outline-none transition"
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-white/90 mb-1 md:mb-2">
                  Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4 md:w-5 md:h-5" />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) =>
                      setFormData({ ...formData, password: e.target.value })
                    }
                    className="w-full pl-9 md:pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-white/50 focus:ring-2 focus:ring-white/50 focus:border-transparent outline-none transition"
                    placeholder="Enter your password"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-white/90 mb-1 md:mb-2">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4 md:w-5 md:h-5" />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({ ...formData, confirmPassword: e.target.value })
                    }
                    className="w-full pl-9 md:pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-white/50 focus:ring-2 focus:ring-white/50 focus:border-transparent outline-none transition"
                    placeholder="Confirm your password"
                    required
                  />
                </div>
              </div>
            </div>

            {error && (
              <div className="bg-red-500/20 border border-red-300/50 text-red-100 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-2 rounded-lg text-sm font-medium hover:from-red-700 hover:to-red-800 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Creating account...' : 'Register'}
            </button>

            <div className="text-center text-white/80 text-xs md:text-sm">
              Already have an account?{' '}
              <Link
                to="/student/login"
                className="text-white font-medium hover:underline"
              >
                Login here
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default StudentRegister;

