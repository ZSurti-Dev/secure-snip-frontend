import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

interface Snippet {
  _id: string;
  title: string;
  encryptedData: string;
  createdAt?: string;
}

const Home: React.FC = () => {
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const response = await axios.get<Snippet[]>(`${import.meta.env.VITE_BASE_URL}/api/snippets`);
        setSnippets(response.data);
      } catch (err: any) {
        console.error('Error fetching snippets:', err.message);
        setError('Failed to load snippets. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    fetchSnippets();
  }, []);

  const handleDelete = async (id: string) => {
    setDeleteLoading(id);
    try {
      await axios.delete(`${import.meta.env.VITE_BASE_URL}/api/snippets/${id}`);
      setSnippets(snippets.filter((snippet) => snippet._id !== id));
      setError(null);
    } catch (err: any) {
      console.error('Error deleting snippet:', err.message);
      setError('Failed to delete snippet. Please try again.');
    } finally {
      setDeleteLoading(null);
    }
  };

  const filteredSnippets = snippets.filter(snippet => 
    snippet.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-8 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-2xl shadow-xl p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#304FFE]">
                Your Secure Snippets
              </h2>
              <p className="text-gray-500 mt-1">Manage your encrypted messages</p>
            </div>
            <Link to="/create">
              <button className="hidden sm:flex items-center bg-[#304FFE] hover:bg-[#0323D5] text-white px-4 py-2 rounded-lg font-medium shadow-md transition-all duration-300 transform hover:-translate-y-1">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                New Snippet
              </button>
            </Link>
          </div>
          
          <div className="mb-6">
            <div className="relative">
              <input
                type="text"
                placeholder="Search snippets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors shadow-sm"
              />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-12">
              <div className="w-16 h-16 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
              <p className="mt-4 text-indigo-700 font-medium">Loading your snippets...</p>
            </div>
          ) : error ? (
            <div className="p-6 bg-red-50 border-l-4 border-red-500 text-red-700 rounded-lg">
              <div className="flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p>{error}</p>
              </div>
            </div>
          ) : filteredSnippets.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              {searchTerm ? (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-gray-400 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-700">No matching snippets found</h3>
                  <p className="mt-2 text-gray-500">Try a different search term</p>
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 text-indigo-300 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  <h3 className="text-xl font-medium text-gray-700">No snippets yet</h3>
                  <p className="mt-2 text-gray-500">Create your first secure snippet</p>
                  <Link to="/create">
                    <button className="mt-6 bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 text-white px-6 py-3 rounded-lg font-medium shadow-md transition-all duration-300">
                      Create New Snippet
                    </button>
                  </Link>
                </>
              )}
            </div>
          ) : (
            <div className="space-y-4">
              {filteredSnippets.map((snippet) => (
                <div 
                  key={snippet._id} 
                  className="bg-gradient-to-r from-gray-50 to-gray-100 rounded-xl p-5 border border-gray-200 shadow-sm hover:shadow-md transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row justify-between">
                    <div className="mb-3 sm:mb-0">
                      <h3 className="text-lg font-semibold text-gray-800">{snippet.title}</h3>
                      {snippet.createdAt && (
                        <p className="text-sm text-gray-500 flex items-center mt-1">
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                          </svg>
                          {new Date(snippet.createdAt!).toLocaleDateString()}
                        </p>
                      )}
                    </div>
                    <Link
                      to={`/view/${snippet._id}`} // Updated to match /view/:id route
                      state={{ encryptedData: snippet.encryptedData, title: snippet.title, createdAt: snippet.createdAt, id: snippet._id }}
                      className="inline-block"
                      >
                      <button className="bg-[#304FFE] hover:bg-[#0323D5] text-white px-5 py-3 rounded-lg font-medium shadow-sm transition-all duration-300 w-full sm:w-auto flex items-center justify-center min-w-[90px]">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        View
                      </button>
                    </Link>
                      <button
                        onClick={() => handleDelete(snippet._id)}
                        disabled={deleteLoading === snippet._id}
                        className={`bg-red-500 hover:bg-red-600 text-white px-5 py-3 rounded-lg font-medium shadow-sm transition-all duration-300 w-full sm:w-auto flex items-center justify-center min-w-[0px] ${
                          deleteLoading === snippet._id ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                      >
                        {deleteLoading === snippet._id ? (
                          <>
                            <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                            </svg>
                            Deleting...
                          </>
                        ) : (
                          <>
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            Delete
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Floating Action Button for Mobile */}
      <Link to="/create">
        <button className="fixed right-6 bottom-6 w-16 h-16 bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 text-white rounded-full shadow-lg flex items-center justify-center transition-all duration-300 transform hover:scale-110 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:hidden">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
        </button>
      </Link>
    </div>
  );
};

export default Home;