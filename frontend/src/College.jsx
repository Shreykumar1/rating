import { useState, useEffect } from 'react'
import './App.css'

function App() {
  const [college, setCollege] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('http://localhost:3000/api/colleges')
      .then(response => response.json())
      .then(data => {
        setCollege(data[0])
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])
  console.log(college);
  

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!college) return <div>No college data found</div>

  return (
    <div className="college-page">
      <h1>{college.collegeName}</h1>
      
      <div className="location-info">
        <h2>Location</h2>
        <p>{college.location.city}, {college.location.state}, {college.location.country}</p>
      </div>

      <div className="ratings-section">
        <h2>Ratings</h2>
        <div className="ratings-grid">
          <div>Academic Quality: {college.ratings.academicQuality}</div>
          <div>Campus Life: {college.ratings.campusLife}</div>
          <div>Facilities: {college.ratings.facilities}</div>
          <div>Faculty Quality: {college.ratings.facultyQuality}</div>
          <div>Job Placement: {college.ratings.jobPlacement}</div>
        </div>
        <div className="overall-rating">
          <h3>Overall Rating: {college.overallRating}</h3>
        </div>
      </div>

      <div className="statistics-section">
        <h2>Statistics</h2>
        <div className="stats-grid">
          <div>Student Count: {college.statistics.studentCount.toLocaleString()}</div>
          <div>Acceptance Rate: {college.statistics.acceptanceRate}%</div>
          <div>Average Tuition: ${college.statistics.averageTuition.toLocaleString()}</div>
        </div>
      </div>

      <div className="reviews-section">
        <h2>Reviews</h2>
        {college.reviews.map(review => (
          <div key={review._id} className="review">
            <p>{review.comment}</p>
            <small>Date: {new Date(review.date).toLocaleDateString()}</small>
          </div>
        ))}
      </div>
    </div>
  )
}

export default App
