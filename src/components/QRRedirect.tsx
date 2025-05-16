import React, { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';

const QRRedirect: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const id = searchParams.get('id');

  useEffect(() => {
    if (id) {
      // Redirect to the ViewSnippet component with the ID parameter
      navigate(`/view`, { 
        state: { id }, 
        replace: true 
      });
    }
  }, [id, navigate]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 py-12 px-4 flex items-center justify-center">
      <div className="bg-white rounded-2xl shadow-xl p-8 max-w-md w-full text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500 mx-auto mb-4"></div>
        <p className="text-gray-600">Redirecting to your snippet...</p>
      </div>
    </div>
  );
};

export default QRRedirect;