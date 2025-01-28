import { useState } from 'react';
import { collegeService } from '../services/collegeService';
import { useAuth } from '../context/AuthContext';
import './AddCollege.css';

function AddCollege() {
  const { user } = useAuth(); 
  const initialFormState = {
    collegeName: '',
    location: {
      city: '',
      state: '',
      country: ''
    },
    ratings: {  
      academicQuality: 5,
      campusLife: 5,
      facilities: 5,
      facultyQuality: 5,
      jobPlacement: 5
    },
    statistics: {
      studentCount: '',
      acceptanceRate: '',
      averageTuition: ''
    },
    reviews: [{
      userId: user.user._id,
      comment: ''
    }]
  };

  const [formData, setFormData] = useState(initialFormState);
  const [submitStatus, setSubmitStatus] = useState({ loading: false, error: null });

  const handleLocationChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      location: {
        ...prev.location,
        [name]: value
      }
    }));
  };

  const handleRatingChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      ratings: {
        ...prev.ratings,
        [name]: Number(value)
      }
    }));
  };

  const handleStatisticsChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      statistics: {
        ...prev.statistics,
        [name]: Number(value)
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitStatus({ loading: true, error: null });

    try {
      await collegeService.createCollege(formData);
      setFormData(initialFormState);
      setSubmitStatus({ loading: false, error: null });
      alert('College added successfully!');
    } catch (error) {
      setSubmitStatus({ loading: false, error: error.message });
    }
  };

  return (
    <div className="rating-page dark-theme">
      <h1>Add New College</h1>
      
      <form onSubmit={handleSubmit} className="college-form">
        <div className="form-section">
          <h2>Basic Information</h2>
          <div className="form-group">
            <label>College Name:</label>
            <input
              type="text"
              className="input-large"
              value={formData.collegeName}
              onChange={(e) => setFormData(prev => ({ ...prev, collegeName: e.target.value }))}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Location</h2>
          <div className="form-group">
            <label>City:</label>
            <input
              type="text"
              name="city"
              className="input-large"
              value={formData.location.city}
              onChange={handleLocationChange}
              required
            />
          </div>
          <div className="form-group">
            <label>State:</label>
            <input
              type="text"
              name="state"
              className="input-large"
              value={formData.location.state}
              onChange={handleLocationChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Country:</label>
            <input
              type="text"
              name="country"
              className="input-large"
              value={formData.location.country}
              onChange={handleLocationChange}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Ratings</h2>
          {Object.entries(formData.ratings).map(([key, value]) => (
            <div className="form-group" key={key}>
              <label>{key.replace(/([A-Z])/g, ' $1').trim()}:</label>
              <input
                type="range"
                name={key}
                value={value}
                onChange={handleRatingChange}
                min="1"
                max="5"
                step="0.1"
                className="rating-slider"
                required
              />
              <span>{value}</span>
            </div>
          ))}
        </div>

        <div className="form-section">
          <h2>Statistics</h2>
          <div className="form-group">
            <label>Student Count:</label>
            <input
              type="number"
              name="studentCount"
              value={formData.statistics.studentCount}
              onChange={handleStatisticsChange}
              required
            />
          </div>
          <div className="form-group">
            <label>Acceptance Rate (%):</label>
            <input
              type="number"
              name="acceptanceRate"
              value={formData.statistics.acceptanceRate}
              onChange={handleStatisticsChange}
              step="0.1"
              required
            />
          </div>
          <div className="form-group">
            <label>Average Tuition ($):</label>
            <input
              type="number"
              name="averageTuition"
              value={formData.statistics.averageTuition}
              onChange={handleStatisticsChange}
              required
            />
          </div>
        </div>

        <div className="form-section">
          <h2>Review</h2>
          <div className="form-group">
            <label>Comment:</label>
            <textarea
              value={formData.reviews[0].comment}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                reviews: [{ ...prev.reviews[0], comment: e.target.value }]
              }))}
              required
            />
          </div>
        </div>

        {submitStatus.error && (
          <div className="error-message">Error: {submitStatus.error}</div>
        )}

        <button type="submit" disabled={submitStatus.loading}>
          {submitStatus.loading ? 'Submitting...' : 'Add College'}
        </button>
      </form>
    </div>
  );
}

export default AddCollege; 