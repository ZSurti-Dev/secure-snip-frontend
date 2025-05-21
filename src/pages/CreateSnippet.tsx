import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CreateSnippet: React.FC = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [tags, setTags] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [qrData, setQrData] = useState<string | null>(null);
  const [snippetId, setSnippetId] = useState<string | null>(null); // Store snippet ID
  const [copied, setCopied] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
  console.log('VITE_BASE_URL:', import.meta.env.VITE_BASE_URL);
  e.preventDefault();
  setLoading(true);
  setError(null);
  setSuccess(null);
  setCopied(false);

  if (password.length < 5) {
    setError('Password must be at least 5 characters long.');
    setLoading(false);
    return;
  }

  if (!title.trim()) {
    setError('Title is required.');
    setLoading(false);
    return;
  }

  try {
    const tagArray = tags.split(',').map((tag) => tag.trim()).filter((tag) => tag);
    console.log('Sending request to:', `${import.meta.env.VITE_BASE_URL}/api/snippets`);
    console.log('Request payload:', { title, message, password, tags: tagArray.join(',') });
    const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/snippets`, { 
      title,
      message, 
      password, 
      tags: tagArray.join(',')
    });
    console.log('Response from backend:', response.data);
    console.log('Snippet ID received:', response.data.id); // Log the ID to verify
    if (response.data.success) {
      setQrData(response.data.encryptedData);
      setSnippetId(response.data.id);
      setSuccess('QR Code generated successfully!');
    } else {
      setError('Unexpected response from server. Please check the server logs.');
    }
  } catch (err: any) {
    console.error('Error creating snippet:', err);
    console.error('Error details:', err.response ? err.response.data : err.message);
    const errorMessage = err.response?.data?.error || err.message || 'Failed to create snippet. Please check the server logs.';
    setError(errorMessage);
  } finally {
    setLoading(false);
  }
};

  const handleConfirm = () => {
    setTitle('');
    setMessage('');
    setPassword('');
    setTags('');
    navigate('/qr-details', { state: { qrData, title, id: snippetId } }); // Pass the snippet ID
  };

  const handleCopyPassword = async () => {
    try {
      await navigator.clipboard.writeText(password);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy password:', err);
      setError('Failed to copy password. Please copy it manually.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <h2 className="text-2xl sm:text-3xl font-bold text-[#304FFE] mb-6">Create Secure Snippet</h2>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Title</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Give your snippet a name"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Message</label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Enter your secure message"
              rows={5}
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Password</label>
            <input
              type="password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create a strong password (min 5 characters)"
            />
          </div>
          
          <div>
            <label className="block text-gray-700 mb-2 font-medium">Tags</label>
            <input
              type="text"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
              placeholder="Work, Personal, Private (comma-separated)"
            />
          </div>
          
          <div className="pt-4">
            <button
              type="submit"
              className="bg-[#0323D5] hover:bg-[#0019A9] text-white px-6 py-3 w-full rounded-lg font-medium shadow-md transform transition-all hover:-translate-y-1 duration-300 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <span className="w-6 h-6 border-4 border-t-indigo-200 border-indigo-100 rounded-full animate-spin mr-2"></span>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Generate QR Code
                </>
              )}
            </button>
            
            <Link to="/snippets">
              <button className="mt-4 bg-gray-600 hover:bg-gray-700 text-white px-6 py-3 w-full rounded-lg font-medium shadow-md transition-all duration-300">
                Back to Snippets
              </button>
            </Link>
          </div>
        </form>

        {error && (
          <div className="mt-6 p-4 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg animate-pulse">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
            <button onClick={() => setError(null)} className="mt-2 text-indigo-600 hover:text-indigo-800 font-medium">
              Try Again
            </button>
          </div>
        )}

        {success && (
          <div className="mt-6 p-6 bg-green-50 text-green-800 rounded-lg border-l-4 border-green-500 flex flex-col items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-green-500 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-bold mb-3">{success}</h3>
            
            <div className="p-4 bg-white rounded-lg shadow-inner w-full mb-4">
              <p className="text-gray-700 font-medium">Password: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{password}</span></p>
              <button
                onClick={handleCopyPassword}
                className="mt-3 bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-all duration-300 flex items-center justify-center mx-auto"
              >
                {copied ? (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                      <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm9.707 5.707a1 1 0 00-1.414-1.414L9 12.586l-1.293-1.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                    Password Copied!
                  </>
                ) : (
                  <>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                    Copy Password
                  </>
                )}
              </button>
            </div>
            
            <button
              onClick={handleConfirm}
              className="bg-gradient-to-r from-emerald-500 to-green-600 hover:from-emerald-600 hover:to-green-700 text-white px-6 py-3 w-full rounded-lg font-medium shadow-md transition-all duration-300"
            >
              Continue to QR Code
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateSnippet;