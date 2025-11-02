import { useEffect, useState } from 'react';

const JobList = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applyState, setApplyState] = useState({ skills: '', cgpa: '', backlog: '', cv: null });
  const [message, setMessage] = useState(null);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/jobs');
      const json = await res.json();
      if (res.ok) setJobs(json.data.jobs || []);
    } catch (err) {
      console.error(err);
    } finally { setLoading(false); }
  }

  useEffect(() => { fetchJobs(); }, []);

  const openApply = (job) => {
    setSelectedJob(job);
    setApplyState({ skills: '', cgpa: '', backlog: '', cv: null });
    setMessage(null);
  }

  const handleApplyChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'cv') setApplyState(s => ({ ...s, cv: files[0] }));
    else setApplyState(s => ({ ...s, [name]: value }));
  }

  const submitApplication = async (e) => {
    e.preventDefault();
    if (!selectedJob) return;
    setMessage(null);
    const token = localStorage.getItem('token');
    const form = new FormData();
    if (applyState.cv) form.append('cv', applyState.cv);
    if (applyState.skills) form.append('skills', applyState.skills);
    if (applyState.cgpa) form.append('cgpa', applyState.cgpa);
    if (applyState.backlog) form.append('backlog', applyState.backlog);

    try {
      const res = await fetch(`http://localhost:5000/api/jobs/${selectedJob.id}/apply`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: form
      });
      const json = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: 'Applied successfully' });
        setSelectedJob(null);
      } else {
        setMessage({ type: 'error', text: json.message || 'Failed to apply' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    }
  }

  return (
    <div className="mt-6">
      <h2 className="text-xl font-semibold mb-4">Browse Jobs</h2>
      {loading ? <p>Loading jobs...</p> : (
        <div className="grid md:grid-cols-2 gap-4">
          {jobs.map(job => (
            <div key={job.id} className="p-4 border rounded">
              <h3 className="font-semibold">{job.title}</h3>
              <p className="text-sm text-gray-600">{job.company.companyName} • {job.location || 'Remote'}</p>
              <p className="mt-2 text-gray-700">{job.description}</p>
              <div className="mt-3 flex gap-2">
                <button onClick={() => openApply(job)} className="px-3 py-1 bg-red-600 text-white rounded">Apply</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {selectedJob && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center">
          <div className="bg-white p-6 rounded max-w-lg w-full">
            <h3 className="text-lg font-semibold mb-2">Apply to {selectedJob.title}</h3>
            {message && <p className={`${message.type === 'success' ? 'text-green-600' : 'text-red-600'} mb-2`}>{message.text}</p>}
            <form onSubmit={submitApplication} className="grid gap-2">
              <input name="skills" value={applyState.skills} onChange={handleApplyChange} placeholder="Skills (comma separated)" className="p-2 border rounded" />
              <input name="cgpa" value={applyState.cgpa} onChange={handleApplyChange} placeholder="CGPA" className="p-2 border rounded" />
              <input name="backlog" value={applyState.backlog} onChange={handleApplyChange} placeholder="Backlog count" className="p-2 border rounded" />
              <input type="file" name="cv" accept="application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document" onChange={handleApplyChange} />
              <div className="flex gap-2 mt-2">
                <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded">Submit Application</button>
                <button type="button" onClick={() => setSelectedJob(null)} className="px-4 py-2 border rounded">Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

export default JobList;
