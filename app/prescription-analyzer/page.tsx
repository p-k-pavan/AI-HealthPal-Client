'use client';

import axios from 'axios';
import { useState, useRef } from 'react';
import { UploadCloud, Loader2, CheckCircle2 } from 'lucide-react';

interface PrescriptionResult {
  text: string;
  medicineNames: string[];
}

const PrescriptionUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [result, setResult] = useState<PrescriptionResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('prescription', file);

    try {
      const response = await axios.post<PrescriptionResult>(
        'http://localhost:5000/api/prescription/upload',
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
        }
      );
      setResult(response.data);
    } catch (error) {
      console.error('Upload error:', error);
      alert('Error processing prescription. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      setFile(files[0]);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Prescription Scanner</h1>
            <p className="text-gray-600">Upload your prescription to extract medicine information</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-all cursor-pointer ${
                isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
              }`}
              onClick={() => fileInputRef.current?.click()}
              onDragEnter={(e) => {
                e.preventDefault();
                setIsDragging(true);
              }}
              onDragOver={(e) => e.preventDefault()}
              onDragLeave={(e) => {
                e.preventDefault();
                setIsDragging(false);
              }}
              onDrop={handleDrop}
            >
              <div className="flex flex-col items-center justify-center space-y-3">
                <UploadCloud className={`h-12 w-12 ${isDragging ? 'text-blue-500' : 'text-gray-400'}`} />
                <p className="text-sm text-gray-600">
                  <span className="font-semibold text-blue-600 hover:text-blue-500">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs text-gray-500">PNG, JPG, or PDF (max. 5MB)</p>
                {file && (
                  <div className="flex items-center mt-2 text-sm text-gray-600">
                    <CheckCircle2 className="h-4 w-4 text-green-500 mr-1" />
                    {file.name}
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,.pdf"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="hidden"
                  id="file-upload"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading || !file}
              className={`w-full flex justify-center items-center py-3 px-4 rounded-md shadow-sm text-sm font-medium text-white ${
                loading || !file
                  ? 'bg-blue-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500'
              }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin h-5 w-5 mr-2" />
                  Processing...
                </>
              ) : (
                'Extract Medicines'
              )}
            </button>
          </form>

          {result && (
            <div className="mt-8 space-y-6">
              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Extracted Text</h3>
                <div className="bg-white p-4 rounded border border-gray-200">
                  <p className="whitespace-pre-wrap text-gray-700">{result.text}</p>
                </div>
              </div>

              <div className="bg-gray-50 p-6 rounded-lg">
                <h3 className="text-lg font-medium text-gray-900 mb-3">Identified Medicines</h3>
                <ul className="space-y-2">
                  {result.medicineNames.map((med, i) => (
                    <li key={i} className="flex items-start">
                      <span className="flex items-center justify-center h-6 w-6 rounded-full bg-blue-100 text-blue-800 mr-3">
                        {i + 1}
                      </span>
                      <span className="text-gray-700">{med}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PrescriptionUpload;
