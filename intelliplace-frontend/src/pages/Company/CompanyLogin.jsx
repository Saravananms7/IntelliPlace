import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Building2, ArrowLeft } from 'lucide-react';
import { login } from '../../utils/auth';
import Navbar from '../../components/Navbar';

const CompanyLogin = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(formData.email, formData.password, 'company');
      setLoading(false);

      if (result.success) {
        navigate('/company/dashboard');
      } else {
        setError(result.message || 'Invalid credentials. Please try again.');
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
          className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-md border border-white/20 my-auto"
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
              <Building2 className="w-6 h-6 md:w-8 md:h-8 text-white" />
            </div>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-1 md:mb-2">Company Login</h2>
            <p className="text-sm md:text-base text-white/80">Welcome back! Please login to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4 md:space-y-5">
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
                  className="w-full pl-9 md:pl-10 pr-4 py-2 md:py-3 bg-white/10 border border-white/20 rounded-lg text-sm md:text-base text-white placeholder-white/50 focus:ring-2 focus:ring-white/50 focus:border-transparent outline-none transition"
                  placeholder="Enter your email"
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
                  className="w-full pl-9 md:pl-10 pr-4 py-2 md:py-3 bg-white/10 border border-white/20 rounded-lg text-sm md:text-base text-white placeholder-white/50 focus:ring-2 focus:ring-white/50 focus:border-transparent outline-none transition"
                  placeholder="Enter your password"
                  required
                />
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
              className="w-full bg-gradient-to-r from-red-600 to-red-700 text-white py-2 md:py-3 rounded-lg text-sm md:text-base font-medium hover:from-red-700 hover:to-red-800 transition-all transform hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Logging in...' : 'Login'}
            </button>

            <div className="text-center text-white/80 text-xs md:text-sm">
              Don't have an account?{' '}
              <Link
                to="/company/register"
                className="text-white font-medium hover:underline"
              >
                Register here
              </Link>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};

export default CompanyLogin;

