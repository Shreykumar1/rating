import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authService } from '../services/authService';

function UserProfile() {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReviews = async () => {
        console.log(user);
      try {
        const response = await fetch(`http://localhost:3000/api/users/${user.user._id}`);
        const data = await response.json();
        setUserData(data.data);
        console.log("data",data);
      } catch (err) {
        setError('Failed to fetch reviews');
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [user]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  console.log("userData",userData);

  return (
    <div className="user-profile">
      <h1>{userData.name}'s Profile</h1>
      <h2>Email: {userData.email}</h2>
      <h2>Your Reviews</h2>
      {userData.reviews.length === 0 ? (
        <p>No reviews available.</p>
      ) : (
        <ul>
          {userData.reviews.map(review => (
            <li key={review._id}>
              <p>{review.comment}</p>
              <small>Date: {new Date(review.date).toLocaleDateString()}</small>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default UserProfile; 