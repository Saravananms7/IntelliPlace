import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  Building2,
  Briefcase,
  Users,
  FileCheck,
  TrendingUp,
  Plus,
} from 'lucide-react';
import Navbar from '../../components/Navbar';
import { getCurrentUser } from '../../utils/auth';
import CompanyPostJob from '../../components/CompanyPostJob';

const CompanyDashboard = () => {
  const navigate = useNavigate();
  const user = getCurrentUser();
  const [stats, setStats] = useState([
    { label: 'Jobs Posted', value: '0', icon: Briefcase, color: 'from-red-500 to-red-600' },
    { label: 'Applications', value: '0', icon: FileCheck, color: 'from-red-600 to-red-700' },
    { label: 'Interviews', value: '0', icon: Users, color: 'from-green-500 to-green-600' },
    { label: 'Hired', value: '0', icon: TrendingUp, color: 'from-orange-500 to-orange-600' }
  ]);

  useEffect(() => {
    if (!user || user.userType !== 'company') {
      navigate('/company/login');
      return;
    }

    const fetchStats = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/dashboard/company/stats/${user.id}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        });
        
        if (!response.ok) throw new Error('Failed to fetch stats');
        
        const data = await response.json();
        
        setStats([
          { label: 'Jobs Posted', value: data.data.jobsPosted.toString(), icon: Briefcase, color: 'from-red-500 to-red-600' },
          { label: 'Applications', value: data.data.totalApplications.toString(), icon: FileCheck, color: 'from-red-600 to-red-700' },
          { label: 'Interviews', value: data.data.totalInterviews.toString(), icon: Users, color: 'from-green-500 to-green-600' },
          { label: 'Hired', value: data.data.totalHired.toString(), icon: TrendingUp, color: 'from-orange-500 to-orange-600' }
        ]);
      } catch (error) {
        console.error('Failed to fetch company stats:', error);
      }
    };

    fetchStats();
  }, [user, navigate]);

  // Fetch recent jobs posted by this company
  const [jobs, setJobs] = useState([]);
  const [jobsLoading, setJobsLoading] = useState(false);

  const fetchJobs = async () => {
    if (!user) return;
    setJobsLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/jobs?limit=10`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      const json = await res.json();
      if (res.ok && json.data && Array.isArray(json.data.jobs)) {
        // Filter jobs belonging to this company
        const myJobs = json.data.jobs.filter(j => j.company && j.company.id === user.id);
        setJobs(myJobs);
      } else {
        setJobs([]);
      }
    } catch (err) {
      console.error('Failed to fetch jobs for company:', err);
      setJobs([]);
    } finally {
      setJobsLoading(false);
    }
  };

  // fetch jobs when component mounts and when user changes
  useEffect(() => { fetchJobs(); }, [user]);

  if (!user || user.userType !== 'company') {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-gradient-to-br from-red-500 to-red-700 rounded-full flex items-center justify-center">
              <Building2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                Welcome, {user.companyName || user.name || user.username}!
              </h1>
              <p className="text-gray-600">Company Dashboard</p>
            </div>
          </div>
        </motion.div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {stats.map((stat, index) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
              className="bg-white rounded-xl shadow-lg p-6 border border-gray-200"
            >
              <div className="flex items-center justify-between mb-4">
                <div className={`w-12 h-12 bg-gradient-to-br ${stat.color} rounded-lg flex items-center justify-center`}>
                  <stat.icon className="w-6 h-6 text-white" />
                </div>
              </div>
              <h3 className="text-3xl font-bold text-gray-800 mb-1">{stat.value}</h3>
              <p className="text-gray-600 text-sm">{stat.label}</p>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl shadow-lg p-8 border border-gray-200"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Quick Actions</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <CompanyPostJob />
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-red-600 hover:bg-red-50 transition-all text-left group">
              <FileCheck className="w-8 h-8 text-gray-400 group-hover:text-red-600 mb-2" />
              <h3 className="font-semibold text-gray-800">View Applications</h3>
              <p className="text-sm text-gray-600">Review candidate applications</p>
            </button>
            <button className="p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-green-500 hover:bg-green-50 transition-all text-left group">
              <Users className="w-8 h-8 text-gray-400 group-hover:text-green-500 mb-2" />
              <h3 className="font-semibold text-gray-800">Manage Interviews</h3>
              <p className="text-sm text-gray-600">Schedule and manage interviews</p>
            </button>
          </div>
        </motion.div>

        {/* Recent Jobs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-white rounded-xl shadow-lg p-8 border border-gray-200 mt-6"
        >
          <h2 className="text-2xl font-bold text-gray-800 mb-6">Recent Job Postings</h2>
          <div className="text-center py-12">
            <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No job postings yet</p>
            <button className="mt-4 px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Post Your First Job
            </button>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default CompanyDashboard;

