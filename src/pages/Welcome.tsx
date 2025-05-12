import {Link} from 'react-router-dom';
import Logo from '../assets/images/NewColor.png'

const Welcome: React.FC =  () => {
    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-indigo-50 to-blue-100 p-6">
            <div className="text-center bg-white rounded-2xl shadow-xl p-8 max-w-md w-full transform transition-all hover:scale-105 duration-300">
                <img 
                    src={Logo} 
                    alt="Logo" 
                    className="md:w-64 w-48 h-auto mx-auto mb-6 drop-shadow-md" 
                />
                <h2 className="md:text-4xl text-3xl font-bold text-[#304FFE] mb-3">
                    Welcome to SecureSnip
                </h2>
                <p className="mb-8 text-gray-600 font-medium md:text-xl">
                    Send secure messages with confidence.
                </p>
                <Link to="/snippets">
                    <button className="bg-gradient-to-r from-indigo-600 to-blue-700 hover:from-indigo-700 hover:to-blue-800 text-white px-8 py-3 w-full rounded-lg text-lg font-medium shadow-md transform transition-all hover:-translate-y-1 duration-300">
                        Get Started
                    </button>
                </Link>
                {/* <p className="mt-6 text-sm text-gray-500">Your security is our priority</p> */}
            </div>
        </div>
    );
};

export default Welcome;