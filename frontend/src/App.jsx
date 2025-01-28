import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom'
import { AuthProvider, useAuth } from './context/AuthContext.jsx'
import Login from './components/Login.jsx'
import CollegeList from './components/CollegeList.jsx'
import CollegePage from './components/CollegePage.jsx'
import RatingPage from './components/RatingPage.jsx'
import AdminPanel from './components/AdminPanel.jsx'
import Register from './components/Register.jsx'
import UserProfile from './components/UserProfile.jsx'
import './App.css'
import AddCollege from './components/AddCollege.jsx'

// Protected Route component
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();
  
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (!user) {
    return <Navigate to="/login" />;
  }

  if (adminOnly && !user.isAdmin) {
    return <Navigate to="/colleges" />;
  }

  return children;
};

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navigation">
      <ul>
        <li><Link className="nav-link" to="/colleges">Colleges</Link></li>
        <li><Link className="nav-link" to="/rating">Rate College</Link></li>
        <li><Link className="nav-link" to="/login">Login</Link></li>
        {user && user.user.isAdmin && (
          <li><Link className="nav-link" to="/admin">Add College</Link></li>
        )}
        {user && (
          <>
            <li>
              <Link to="/profile">
              <button 
                className="profile-button" 
              >
                {user ? user.user.name : 'Guest'}
              </button>
              </Link>
            </li>
            <li><button onClick={logout}>Logout</button></li>
          </>
        )}
      </ul>
    </nav>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app">
          <Navbar />
          <main className="main-content">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route 
                path="/colleges" 
                element={<ProtectedRoute><CollegeList /></ProtectedRoute>} 
              />
              <Route 
                path="/admin" 
                element={<ProtectedRoute ><AddCollege /></ProtectedRoute>} 
              />
              <Route 
                path="/rating" 
                element={<ProtectedRoute><RatingPage /></ProtectedRoute>} 
              />
              <Route path="/profile" element={<ProtectedRoute><UserProfile /></ProtectedRoute>} />
              <Route path="/" element={<Navigate to="/colleges" />} />
              <Route path="/colleges/:id" element={<ProtectedRoute><CollegePage /></ProtectedRoute>} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  )
}

export default App
