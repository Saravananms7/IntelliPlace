import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, Lock, User, Eye, EyeOff, Shield, Settings, Database } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { login } from '../utils/auth';

const AdminLoginModal = ({ isOpen, onClose }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const result = await login(username, password, 'admin');
      setLoading(false);

      if (result.success) {
        navigate('/admin/dashboard');
        onClose();
      } else {
        setError(result.message);
      }
    } catch (error) {
      setLoading(false);
      setError('An error occurred. Please try again.');
    }
  };

  const handleClose = () => {
    setUsername('admin');
    setPassword('admin123');
    setError('');
    setShowPassword(false);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 bg-black/60 backdrop-blur-md"
          onClick={handleClose}
        />
        
        {/* Modal */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0, y: 20 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.9, opacity: 0, y: 20 }}
          transition={{ 
            type: "spring",
            stiffness: 300,
            damping: 30
          }}
          className="relative w-full max-w-md"
        >
          {/* Background Glow Effect */}
          <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-3xl blur-xl opacity-20 -z-10"></div>
          
          <div className="relative bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-700/50 overflow-hidden">
            {/* Header */}
            <div className="relative p-6 border-b border-gray-700/50">
              <button
                onClick={handleClose}
                className="absolute top-4 right-4 p-2 text-gray-400 hover:text-white hover:bg-gray-800 rounded-xl transition-all duration-300"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.2, type: "spring" }}
                  className="inline-flex items-center justify-center mb-4"
                >
                  <div className="relative">
                    <div className="absolute inset-0 bg-gradient-to-r from-violet-500 to-purple-500 rounded-2xl blur-md opacity-60"></div>
                    <div className="relative bg-gradient-to-br from-violet-600 to-purple-600 p-3 rounded-2xl border border-violet-400/30">
                      <Shield className="w-7 h-7 text-white" />
                    </div>
                  </div>
                </motion.div>

                <motion.h2 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                  className="text-2xl font-bold text-white mb-2"
                >
                  Admin Access
                </motion.h2>
                
                <motion.p 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-400 text-sm"
                >
                  Secure administrative panel
                </motion.p>
              </div>
            </div>

            {/* Form */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-5">
                {/* Username Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.5 }}
                >
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <User className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      className="block w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all duration-300"
                      placeholder="Enter admin username"
                      required
                    />
                  </div>
                </motion.div>

                {/* Password Field */}
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                >
                  <label className="block text-sm font-medium text-gray-200 mb-2">
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <Lock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="block w-full pl-10 pr-12 py-3 bg-gray-800/50 border border-gray-600/50 rounded-xl text-white placeholder-gray-400 focus:ring-2 focus:ring-violet-500 focus:border-transparent outline-none transition-all duration-300"
                      placeholder="Enter admin password"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-300 transition-colors"
                    >
                      {showPassword ? (
                        <EyeOff className="h-5 w-5" />
                      ) : (
                        <Eye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </motion.div>

                {/* Error Message */}
                {error && (
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="bg-red-500/20 border border-red-400/30 text-red-100 px-4 py-3 rounded-xl text-sm flex items-center"
                  >
                    <div className="w-2 h-2 bg-red-400 rounded-full mr-3"></div>
                    {error}
                  </motion.div>
                )}

                {/* Login Button */}
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 }}
                  type="submit"
                  disabled={loading}
                  whileHover={{ scale: loading ? 1 : 1.02 }}
                  whileTap={{ scale: loading ? 1 : 0.98 }}
                  className="w-full bg-gradient-to-r from-violet-500 to-purple-500 text-white py-4 px-6 rounded-xl font-semibold shadow-lg hover:shadow-violet-500/25 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none flex items-center justify-center gap-3"
                >
                  {loading ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      Authenticating...
                    </>
                  ) : (
                    <>
                      <Shield className="w-5 h-5" />
                      Access Admin Panel
                    </>
                  )}
                </motion.button>
              </form>

              {/* Security Features */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.8 }}
                className="mt-6 pt-5 border-t border-gray-700/50"
              >
                <div className="grid grid-cols-2 gap-3 text-center">
                  <div className="flex flex-col items-center p-3 bg-gray-800/30 rounded-lg">
                    <Database className="w-4 h-4 text-violet-400 mb-1" />
                    <span className="text-xs text-gray-400">System Monitor</span>
                  </div>
                  <div className="flex flex-col items-center p-3 bg-gray-800/30 rounded-lg">
                    <Settings className="w-4 h-4 text-violet-400 mb-1" />
                    <span className="text-xs text-gray-400">Platform Control</span>
                  </div>
                </div>
              </motion.div>

              {/* Security Notice */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.9 }}
                className="mt-4 text-center"
              >
                <p className="text-gray-500 text-xs">
                  Restricted access - Authorized personnel only
                </p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AdminLoginModal;