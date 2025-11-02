import { useState } from 'react';

const CompanyPostJob = ({ onCreated }) => {
  const [form, setForm] = useState({ title: '', description: '', type: 'FULL_TIME', location: '', salary: '', requiredSkills: '', minCgpa: '', allowBacklog: false });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm(prev => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    try {
      const token = localStorage.getItem('token');
      const body = {
        ...form,
        requiredSkills: form.requiredSkills.split(',').map(s => s.trim()),
      };
      const res = await fetch('http://localhost:5000/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify(body)
      });
      const data = await res.json();
      if (res.ok) {
        setMessage({ type: 'success', text: 'Job created successfully' });
        setForm({ title: '', description: '', type: 'FULL_TIME', location: '', salary: '', requiredSkills: '', minCgpa: '', allowBacklog: false });
        onCreated && onCreated();
      } else {
        setMessage({ type: 'error', text: data.message || 'Failed to create job' });
      }
    } catch (err) {
      setMessage({ type: 'error', text: err.message });
    } finally { setLoading(false); }
  }

  return (
    <div className="p-4 border rounded-md">
      <h3 className="font-semibold mb-2">Post New Job</h3>
      {message && <p className={`mb-2 ${message.type === 'success' ? 'text-green-600' : 'text-red-600'}`}>{message.text}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-2">
        <input name="title" value={form.title} onChange={handleChange} placeholder="Job title" required className="p-2 border rounded" />
        <textarea name="description" value={form.description} onChange={handleChange} placeholder="Job description" required className="p-2 border rounded" />
        <input name="location" value={form.location} onChange={handleChange} placeholder="Location" className="p-2 border rounded" />
        <input name="salary" value={form.salary} onChange={handleChange} placeholder="Salary" className="p-2 border rounded" />
        <input name="requiredSkills" value={form.requiredSkills} onChange={handleChange} placeholder="Required skills (comma separated)" className="p-2 border rounded" />
        <input name="minCgpa" value={form.minCgpa} onChange={handleChange} placeholder="Minimum CGPA (optional)" className="p-2 border rounded" />
        <label className="flex items-center gap-2"><input type="checkbox" name="allowBacklog" checked={form.allowBacklog} onChange={handleChange} />Allow backlog</label>
        <div className="flex items-center gap-2">
          <button type="submit" className="px-4 py-2 bg-red-600 text-white rounded" disabled={loading}>{loading ? 'Posting...' : 'Post Job'}</button>
        </div>
      </form>
    </div>
  );
}

export default CompanyPostJob;
