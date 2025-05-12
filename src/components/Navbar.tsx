import { useState } from 'react';
import { Link } from 'react-router-dom';
import Logo from '../assets/images/NewColor.png';

const Navbar: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 py-2 md:py-4 sm:px-6 lg:px-8">
        <div className="flex justify-evenly items-center">
          {/* Logo and brand */}
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0">
              <img src={Logo} alt="SecureSnip Logo" className="h-10 md:h-20 w-auto" />
            </Link>
          </div>

          {/* Desktop navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/snippets" className="text-[#304FFE] hover:bg-blue-50 text-lg md:text-xl font-bold px-3 py-2 rounded-md">
              Home
            </Link>
            <Link to="/create" className="text-[#304FFE] hover:bg-blue-50 text-lg md:text-xl px-3 py-2 rounded-md font-bold">
              New Snippet
            </Link>
            <Link to = "/help" className="text-[#304FFE] hover:bg-blue-50 text-lg md:text-xl px-3 py-2 rounded-md font-bold" >
              Help
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button 
              onClick={toggleMenu}
              className="text-gray-500 hover:text-[#0323D5] focus:outline-none focus:ring-2 focus:ring-inset focus:ring-[#0C4AD3]"
            >
              <span className="sr-only">Open main menu</span>
              {/* Three dot menu icon */}
              <svg className="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <circle cx="5" cy="12" r="1" fill="currentColor" />
                <circle cx="12" cy="12" r="1" fill="currentColor" />
                <circle cx="19" cy="12" r="1" fill="currentColor" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white shadow-lg rounded-b-lg">
            <Link 
              to="/snippets" 
              className="block px-3 py-2 rounded-md text-base font-bold text-[#0323D5] hover:bg-blue-50"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/create" 
              className="block px-3 py-2 rounded-md text-base font-bold text-[#0323D5] hover:bg-blue-50"
              onClick={() => setIsMenuOpen(false)}
            >
              New Snippet
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;