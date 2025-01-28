import { useState, useEffect } from 'react';
import { collegeService } from '../services/collegeService';
import { useAuth } from '../context/AuthContext';
function RatingPage() {
  const { user } = useAuth();
  const userId = user.user._id;
  const [colleges, setColleges] = useState([]);
  const [selectedCollege, setSelectedCollege] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const initialRatingState = {
    academicQuality: 5,
    campusLife: 5,
    facilities: 5,
    facultyQuality: 5,
    jobPlacement: 5,
    comment: ''
  };

  const [ratingData, setRatingData] = useState(initialRatingState);
  const [submitStatus, setSubmitStatus] = useState({ loading: false, error: null });

  useEffect(() => {
    fetchColleges();
  }, []);

  const fetchColleges = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/colleges');
      const data = await response.json();
      setColleges(data);
      setLoading(false);
    } catch (err) {
      setError('Failed to fetch colleges');
      setLoading(false);
    }
  };

  const handleRatingChange = (e) => {
    const { name, value } = e.target;
    setRatingData(prev => ({
      ...prev,
      [name]: name === 'comment' ? value : Number(value)
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedCollege) {
      setSubmitStatus({ loading: false, error: 'Please select a college' });
      return;
    }

    setSubmitStatus({ loading: true, error: null });

    try {
      // setRatingData({...ratingData, userId: user.user._id});
      console.log("user",userId);
      console.log("ratingData",ratingData);
      await collegeService.addRating(selectedCollege._id, {...ratingData, userId: userId});
      const avgRating = (ratingData.academicQuality + ratingData.campusLife + ratingData.facilities + ratingData.facultyQuality + ratingData.jobPlacement) / 5;
      
      // New code to update user reviews
      await fetch(`http://localhost:3000/api/users/${userId}/reviews`, { // Assuming userId is available
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: userId, // Pass the userId
          comment: ratingData.comment,
          rating: avgRating // Assuming you want to use academicQuality as the rating
        }),
      });

      setRatingData(initialRatingState);
      setSelectedCollege(null);
      setSubmitStatus({ loading: false, error: null });
      alert('Rating added successfully!');
    } catch (error) {
      setSubmitStatus({ loading: false, error: error.message });
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <>
    <div className="rating-page">
      <h1>Rate a College</h1>
      
      {!selectedCollege ? (
        <div className="college-grid">
          {colleges.map(college => (
            <div 
              key={college._id} 
              className="college-card"
              onClick={() => setSelectedCollege(college)}
            >
              <h3>{college.collegeName}</h3>
              <button>Rate This College</button>
            </div>
          ))}
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="rating-form">
          <div className="form-section">
            <h2>{selectedCollege.collegeName}</h2>
            <button type="button" onClick={() => setSelectedCollege(null)}>
              Back to Colleges
            </button>
          </div>

          <div className="form-section">
            <h2>Ratings</h2>
            {Object.entries(ratingData).map(([key, value]) => {
              if (key === 'comment') return null;
              return (
                <div className="form-group" key={key}>
                  <label>{key.replace(/([A-Z])/g, ' $1').trim()}:</label>
                  <input
                    type="number"
                    name={key}
                    value={value}
                    onChange={handleRatingChange}
                    min="1"
                    max="5"
                    step="0.1"
                    required
                  />
                </div>
              );
            })}
          </div>

          <div className="form-section">
            <h2>Review</h2>
            <div className="form-group">
              <label>Comment:</label>
              <textarea
                name="comment"
                value={ratingData.comment}
                onChange={handleRatingChange}
                required
              />
            </div>
          </div>

          {submitStatus.error && (
            <div className="error-message">Error: {submitStatus.error}</div>
          )}

          <button type="submit" disabled={submitStatus.loading}>
            {submitStatus.loading ? 'Submitting...' : 'Submit Rating'}
          </button>
        </form>
      )}
    </div>
      </>
  );
}

export default RatingPage; 