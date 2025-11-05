const CvPreviewModal = ({ preview, onClose }) => {
  if (!preview) return null;

  const handleClose = () => {
    try {
      if (preview.url) URL.revokeObjectURL(preview.url);
    } catch (e) {
      // ignore
    }
    if (typeof onClose === 'function') onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-4xl h-[80vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-xl font-semibold text-gray-800">{preview.name}</h3>
          <div className="space-x-2">
            <a
              href={preview.url}
              download={`CV_${preview.name.replace(/\s+/g, '_')}.pdf`}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg text-white bg-red-600 hover:bg-red-700"
            >
              Download
            </a>
            <button
              onClick={handleClose}
              className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-gray-300 hover:bg-gray-50"
            >
              Close
            </button>
          </div>
        </div>
        <div className="flex-1 min-h-0 bg-gray-100 rounded-lg relative overflow-hidden">
          <iframe
            src={preview.url}
            className="w-full h-full rounded-lg"
            title="CV Preview"
            onError={(e) => {
              console.error('Failed to load PDF preview:', e);
              try {
                const a = document.createElement('a');
                a.href = preview.url;
                a.download = `CV_${preview.name.replace(/\s+/g, '_')}.pdf`;
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
              } catch (err) {
                console.error('Fallback download failed', err);
              }
              handleClose();
            }}
          />
        </div>
      </div>
    </div>
  );
};

export default CvPreviewModal;
