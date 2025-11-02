import { useState, useEffect } from 'react';
import { FileCheck, Download, Mail, Phone } from 'lucide-react';

const ApplicationsList = ({ jobId, onClose }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      setError(null);
      try {
        const res = await fetch(`http://localhost:5000/api/jobs/${jobId}/applicants`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        const json = await res.json();
        if (res.ok) {
          setApplications(json.data.applications || []);
        } else {
          setError(json.message || 'Failed to fetch applications');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (jobId) fetchApplications();
  }, [jobId]);

  const downloadCV = (application) => {
    if (!application.cvBase64) {
      alert('No CV available for this applicant');
      return;
    }

    // Convert base64 to blob and create download link
    const binary = atob(application.cvBase64);
    const array = new Uint8Array(binary.length);
    for (let i = 0; i < binary.length; i++) {
      array[i] = binary.charCodeAt(i);
    }
    const blob = new Blob([array], { type: 'application/pdf' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `CV_${application.student.name.replace(/\\s+/g, '_')}.pdf`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full max-h-[90vh] overflow-hidden">
        <div className="p-6 border-b">
          <div className="flex justify-between items-center">
            <h2 className="text-2xl font-semibold text-gray-800">Applications</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700">×</button>
          </div>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-120px)]">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-600">Loading applications...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-600">{error}</p>
            </div>
          ) : applications.length === 0 ? (
            <div className="text-center py-12">
              <FileCheck className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No applications yet</p>
            </div>
          ) : (
            <div className="space-y-6">
              {applications.map((app) => (
                <div key={app.id} className="border rounded-lg p-4">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-800">{app.student.name}</h3>
                      <div className="mt-1 space-y-1">
                        <p className="text-sm text-gray-600 flex items-center gap-2">
                          <Mail className="w-4 h-4" />
                          <a href={`mailto:${app.student.email}`} className="hover:text-red-600">{app.student.email}</a>
                        </p>
                        {app.student.phone && (
                          <p className="text-sm text-gray-600 flex items-center gap-2">
                            <Phone className="w-4 h-4" />
                            <a href={`tel:${app.student.phone}`} className="hover:text-red-600">{app.student.phone}</a>
                          </p>
                        )}
                      </div>
                      <div className="mt-2 grid grid-cols-2 gap-4">
                        <div>
                          <p className="text-sm text-gray-600">CGPA</p>
                          <p className="font-medium">{app.student.cgpa || 'Not provided'}</p>
                        </div>
                        <div>
                          <p className="text-sm text-gray-600">Backlog</p>
                          <p className="font-medium">{app.student.backlog !== null ? app.student.backlog : 'Not provided'}</p>
                        </div>
                      </div>
                    </div>
                    <div>
                      <button
                        onClick={() => downloadCV(app)}
                        disabled={!app.cvBase64}
                        className={`flex items-center gap-2 px-4 py-2 rounded ${
                          app.cvBase64
                            ? 'bg-red-600 text-white hover:bg-red-700'
                            : 'bg-gray-100 text-gray-400 cursor-not-allowed'
                        }`}
                      >
                        <Download className="w-4 h-4" />
                        {app.cvBase64 ? 'Download CV' : 'No CV'}
                      </button>
                    </div>
                  </div>
                  <div className="mt-4">
                    <p className="text-sm text-gray-600">Applied {new Date(app.createdAt).toLocaleString()}</p>
                    <p className="text-sm font-medium text-gray-800 mt-1">Status: {app.status}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ApplicationsList;