import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext.jsx';

function AdminPanel() {
  const [users, setUsers] = useState([]);
  const [colleges, setColleges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeTab, setActiveTab] = useState('users');
  const { user } = useAuth();

  useEffect(() => {
    fetchData();
  }, [activeTab]);

  const fetchData = async () => {
    setLoading(true);
    try {
      if (activeTab === 'users') {
        const response = await fetch('http://localhost:3000/api/admin/users', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        const data = await response.json();
        setUsers(data);
      } else {
        const response = await fetch('http://localhost:3000/api/admin/colleges', {
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        const data = await response.json();
        setColleges(data);
      }
    } catch (err) {
      setError('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (userId) => {
    if (window.confirm('Are you sure you want to delete this user?')) {
      try {
        await fetch(`http://localhost:3000/api/admin/users/${userId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        setUsers(users.filter(user => user._id !== userId));
      } catch (err) {
        setError('Failed to delete user');
      }
    }
  };

  const handleDeleteCollege = async (collegeId) => {
    if (window.confirm('Are you sure you want to delete this college?')) {
      try {
        await fetch(`http://localhost:3000/api/admin/colleges/${collegeId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${user.token}`
          }
        });
        setColleges(colleges.filter(college => college._id !== collegeId));
      } catch (err) {
        setError('Failed to delete college');
      }
    }
  };

  if (!user?.isAdmin) {
    return <div>Access Denied</div>;
  }

  return (
    <div className="admin-panel">
      <h1>Admin Dashboard</h1>
      
      {error && <div className="error-message">{error}</div>}
      
      <div className="admin-tabs">
        <button 
          className={`tab-button ${activeTab === 'users' ? 'active' : ''}`}
          onClick={() => setActiveTab('users')}
        >
          Users
        </button>
        <button 
          className={`tab-button ${activeTab === 'colleges' ? 'active' : ''}`}
          onClick={() => setActiveTab('colleges')}
        >
          Colleges
        </button>
      </div>

      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className="admin-content">
          {activeTab === 'users' ? (
            <div className="users-list">
              <h2>Users Management</h2>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.isAdmin ? 'Admin' : 'User'}</td>
                      <td>
                        <button 
                          className="delete-button"
                          onClick={() => handleDeleteUser(user._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="colleges-list">
              <h2>Colleges Management</h2>
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>College Name</th>
                    <th>Location</th>
                    <th>Rating</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {colleges.map(college => (
                    <tr key={college._id}>
                      <td>{college.collegeName}</td>
                      <td>{college.location.city}, {college.location.state}</td>
                      <td>{college.overallRating?.toFixed(1)}</td>
                      <td>
                        <button 
                          className="delete-button"
                          onClick={() => handleDeleteCollege(college._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default AdminPanel; 