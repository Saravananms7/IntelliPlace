import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Building2, Phone, Globe, ArrowLeft } from 'lucide-react';
import { register } from '../../utils/auth';
import Navbar from '../../components/Navbar';

const CompanyRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    companyName: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    website: '',
    industry: '',
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
      const result = await register(formData, 'company');
      setLoading(false);

      if (result.success) {
        navigate('/company/dashboard');
      } else {
        setError(result.message || 'Registration failed. Please try again.');
      }
    } catch (error) {
      setLoading(false);
      setError('An error occurred. Please try again.');
    }
  };

  return (
    <div className="h-screen bg-gradient-to-br from-black via-gray-900 to-black flex flex-col">
      <Navbar />
      <div className="flex-1 flex items-center justify-center px-4 py-2">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-5 md:p-7 w-full max-w-4xl border border-white/20 -mt-12 md:-mt-16"
        >
          <Link
            to="/"
            className="inline-flex items-center text-white/80 hover:text-white mb-3 md:mb-4 transition-colors text-sm md:text-base"
          >
            <ArrowLeft className="w-4 h-4 md:w-5 md:h-5 mr-2" />
            Back to Home
          </Link>

          <div className="text-center mb-3 md:mb-4 -mt-2 md:-mt-3">
            <div className="inline-flex items-center justify-center w-9 h-9 md:w-12 md:h-12 bg-gradient-to-br from-red-600 to-red-700 rounded-full mb-2">
              <Building2 className="w-5 h-5 md:w-6 md:h-6 text-white" />
            </div>
            <h2 className="text-xl md:text-2xl font-bold text-white mb-1">
              Company Registration
            </h2>
            <p className="text-xs md:text-sm text-white/80">
              Create your company account
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-3 md:space-y-4">
            <div className="grid md:grid-cols-2 gap-3 md:gap-4">
              <div>
                <label className="block text-xs md:text-sm font-medium text-white/90 mb-1">
                  Company Name
                </label>
                <div className="relative">
                  <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4 md:w-5 md:h-5" />
                  <input
                    type="text"
                    value={formData.companyName}
                    onChange={(e) =>
                      setFormData({ ...formData, companyName: e.target.value })
                    }
                    className="w-full pl-9 md:pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-white/50 focus:ring-2 focus:ring-white/50 focus:border-transparent outline-none transition"
                    placeholder="Enter company name"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-white/90 mb-1">
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
                    placeholder="Enter company email"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-white/90 mb-1">
                  Industry
                </label>
                <input
                  type="text"
                  value={formData.industry}
                  onChange={(e) =>
                    setFormData({ ...formData, industry: e.target.value })
                  }
                  className="w-full px-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-white/50 focus:ring-2 focus:ring-white/50 focus:border-transparent outline-none transition"
                  placeholder="Enter industry"
                  required
                />
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-white/90 mb-1">
                  Website
                </label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4 md:w-5 md:h-5" />
                  <input
                    type="url"
                    value={formData.website}
                    onChange={(e) =>
                      setFormData({ ...formData, website: e.target.value })
                    }
                    className="w-full pl-9 md:pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-white/50 focus:ring-2 focus:ring-white/50 focus:border-transparent outline-none transition"
                    placeholder="https://example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-white/90 mb-1">
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
                    placeholder="Enter phone number"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-white/90 mb-1">
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
                    placeholder="Enter password"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs md:text-sm font-medium text-white/90 mb-1">
                  Confirm Password
                </label>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-white/60 w-4 h-4 md:w-5 md:h-5" />
                  <input
                    type="password"
                    value={formData.confirmPassword}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        confirmPassword: e.target.value,
                      })
                    }
                    className="w-full pl-9 md:pl-10 pr-4 py-2 bg-white/10 border border-white/20 rounded-lg text-sm text-white placeholder-white/50 focus:ring-2 focus:ring-white/50 focus:border-transparent outline-none transition"
                    placeholder="Confirm password"
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
                to="/company/login"
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

export default CompanyRegister;
