import React, { useState, useEffect } from 'react';
import { Link, useLocation, useSearchParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion'; // For lock animation
import axios from 'axios';

const ViewSnippet: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { encryptedData, title, createdAt, id: stateId } = location.state || {};
  const [password, setPassword] = useState('');
  const [decryptedMessage, setDecryptedMessage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isDecrypting, setIsDecrypting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [snippetData, setSnippetData] = useState<any>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  // Get ID from query params (from QR code) or state (from Home page)
  const id = searchParams.get('id') || stateId;

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const response = await axios.get(`${import.meta.env.VITE_BASE_URL}/api/snippets/${id}`);
        setSnippetData({
          encryptedData: response.data.encryptedData,
          title: response.data.title,
          createdAt: response.data.createdAt,
        });
      } catch {
        console.error('Error fetching snippet:');
        setError('Failed to load snippet details.');
      }
    };
    if (id && !snippetData) fetchSnippet();
  }, [id, snippetData]);

  const handleDecrypt = async () => {
    setIsDecrypting(true);
    setError(null);
    console.log('Attempting decryption with password:', password);

    try {
      const response = await axios.post(`${import.meta.env.VITE_BASE_URL}/api/decrypt`, { id, password });
      console.log('Decryption response:', response.data);
      if (response.data.success) {
        setDecryptedMessage(response.data.message);
      } else {
        setError(response.data.error || 'Decryption failed.');
      }
    } catch {
      console.error('Error decrypting snippet:');
      setError('Decryption failed. Invalid data or password.');
    } finally {
      setIsDecrypting(false);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    setError(null);
    
    try {
      const response = await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/snippets/${id}`);
      if (response.data.success) {
        // Navigate back to snippets list after successful deletion
        navigate('/snippets', { 
          state: { 
            notification: {
              type: 'success',
              message: 'Snippet deleted successfully'
            }
          }
        });
      } else {
        setError(response.data.error || 'Failed to delete snippet.');
        setIsDeleting(false);
      }
    } catch (error) {
      console.error('Error deleting snippet:', error);
      setError('Failed to delete snippet. Please try again.');
      setIsDeleting(false);
    }
  };

  // Use snippetData if fetched from QR code, otherwise use state
  const displayData = snippetData || { encryptedData, title, createdAt };

  // Lock animation variants
  const lockVariants = {
    locked: { rotate: 0, transition: { duration: 0.3 } },
    unlocking: { rotate: [0, 15, -15, 10, -10, 5, -5, 0], transition: { duration: 0.8 } },
    unlocked: { rotate: 0, scale: [1, 1.2, 1], transition: { duration: 0.5 } },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4">
      <div className="max-w-2xl mx-auto bg-white rounded-2xl shadow-xl p-8">
        <div className="border-b border-gray-200 pb-5 mb-6">
          <h2 className="text-2xl sm:text-3xl font-bold text-[#304FFE]">{displayData.title || 'Untitled Snippet'}</h2>
          {displayData.createdAt && (
            <p className="text-sm text-gray-500 mt-2 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              Created on {new Date(displayData.createdAt).toLocaleDateString()}
            </p>
          )}
        </div>

        {/* Lock Animation Container */}
        <div className="flex flex-col items-center justify-center mb-8">
          <div className="relative w-24 h-24 flex items-center justify-center mb-3">
            {/* Background Circle */}
            <motion.div 
              className="absolute w-24 h-24 bg-indigo-100 rounded-full"
              animate={decryptedMessage ? { scale: [1, 1.2, 1] } : { scale: 1 }}
              transition={{ duration: 0.5 }}
            />
            
            {/* Lock Icon */}
            <motion.svg
              className="h-12 w-12 text-[#0019A9] relative z-10"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              variants={lockVariants}
              animate={isDecrypting ? 'unlocking' : decryptedMessage ? 'unlocked' : 'locked'}
            >
              {decryptedMessage ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                />
              )}
            </motion.svg>
          </div>
          
          <p className="text-lg font-medium text-[#304FFE]">
            {isDecrypting ? 'Unlocking...' : decryptedMessage ? 'Message Unlocked!' : 'Secure Message'}
          </p>
          <p className="text-sm text-gray-500 mt-1">
            {decryptedMessage ? 'Your message has been decrypted' : 'Enter password to decrypt'}
          </p>
        </div>

        {/* Decryption Form */}
        {!decryptedMessage && (
          <div className="space-y-5">
            <div className="relative">
              <input
                type="password"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all shadow-sm"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute right-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 7a2 2 0 012 2m4 0a6 6 0 01-7.743 5.743L11 17H9v2H7v2H4a1 1 0 01-1-1v-2.586a1 1 0 01.293-.707l5.964-5.964A6 6 0 1121 9z" />
              </svg>
            </div>

            {error && (
              <div className="p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg animate-pulse">
                <div className="flex">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  {error}
                </div>
              </div>
            )}

            <button
              onClick={handleDecrypt}
              disabled={isDecrypting}
              className={`w-full py-3 rounded-lg text-white font-medium shadow-md transition-all duration-300 ${
                isDecrypting 
                  ? 'bg-indigo-400 cursor-not-allowed' 
                  : 'bg-[#0019A9] hover:bg-[#031577] transform hover:-translate-y-1'
              }`}
            >
              {isDecrypting ? (
                <span className="flex items-center justify-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Decrypting...
                </span>
              ) : (
                <span className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 11V7a4 4 0 118 0m-4 8v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2z" />
                  </svg>
                  Unlock Message
                </span>
              )}
            </button>
          </div>
        )}

        {/* Decrypted Message */}
        {decryptedMessage && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200 shadow-inner"
          >
            <div className="flex items-center mb-3">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <h3 className="font-bold text-lg text-green-800">Decrypted Message:</h3>
            </div>
            <div className="bg-white p-4 rounded-lg shadow-sm break-words">
              <p className="text-gray-800 whitespace-pre-wrap">{decryptedMessage}</p>
            </div>
          </motion.div>
        )}

        {/* Action Buttons */}
        <div className="mt-6 flex flex-col sm:flex-row gap-3">
          <Link to="/snippets" className="flex-1">
            <button className="w-full py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-lg font-medium shadow-md transition-all duration-300 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Snippets
            </button>
          </Link>
          
          {/* Delete Button */}
          <button 
            onClick={() => setShowDeleteConfirm(true)}
            className="flex-1 py-3 bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium shadow-md transition-all duration-300 flex items-center justify-center"
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Delete
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl"
          >
            <div className="text-center mb-6">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900">Delete Snippet</h3>
              <p className="text-sm text-gray-500 mt-2">
                Are you sure you want to delete this snippet? This action cannot be undone.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2 px-4 bg-gray-200 hover:bg-gray-300 text-gray-800 rounded font-medium transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className={`flex-1 py-2 px-4 rounded font-medium text-white ${
                  isDeleting ? 'bg-red-400' : 'bg-red-600 hover:bg-red-700'
                } transition-colors duration-200 flex items-center justify-center`}
              >
                {isDeleting ? (
                  <>
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Deleting...
                  </>
                ) : (
                  'Yes, Delete'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default ViewSnippet;