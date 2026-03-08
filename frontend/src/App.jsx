import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ProjectDetail from './pages/ProjectDetail';


const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  return user ? children : <Navigate to="/login" />;
};
const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }
  return user ? <Navigate to="/dashboard" /> : children;
};

function AppRoutes() {
  return (
    <Routes>
      {/* Root path redirects to dashboard */}
      <Route path="/" element={<Navigate to="/dashboard" />} />

      {/* Public routes - accessible when NOT logged in */}
      <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
      <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />

      {/* Private routes - require authentication */}
      {/* Note: Navbar is included inside PrivateRoute so it only shows when logged in */}
      <Route path="/dashboard" element={<PrivateRoute><Navbar /><Dashboard /></PrivateRoute>} />

      {/* Dynamic route with :id parameter */}
      {/* :id is replaced with actual project ID, accessible via useParams() */}
      <Route path="/projects/:id" element={<PrivateRoute><Navbar /><ProjectDetail /></PrivateRoute>} />
    </Routes>
  );
}

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-100">
          <AppRoutes />
          {/* Toast notifications appear in top-right, auto-close after 3 seconds */}
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;

