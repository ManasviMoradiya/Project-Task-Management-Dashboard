import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiLogOut, FiGrid } from 'react-icons/fi';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow-sm">
      {/* Container with max width and padding */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Flex container for logo and user section */}
        <div className="flex justify-between h-16 items-center">

          {/* LEFT SIDE: Logo and Brand */}
          {/* Link navigates to dashboard without page reload */}
          <Link to="/dashboard" className="flex items-center space-x-2">
            <FiGrid className="h-8 w-8 text-blue-600" />
            <span className="text-xl font-bold text-gray-900">TaskBoard</span>
          </Link>

          {/* RIGHT SIDE: Welcome message and Logout */}
          <div className="flex items-center space-x-4">
           
            <span className="text-gray-600">Welcome, {user?.name}</span>

            {/* Logout button */}
            <button
              onClick={handleLogout}
              className="flex items-center space-x-1 text-gray-600 hover:text-red-600 transition-colors"
            >
              <FiLogOut className="h-5 w-5" />
              <span>Logout</span>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;

