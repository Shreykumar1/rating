import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

function CollegePage() {
  const { id } = useParams()
  const [college, setCollege] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch(`http://localhost:3000/api/colleges/${id}`)
      .then(response => response.json())
      .then(data => {
        setCollege(data);
        console.log(data);
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [id])

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>
  if (!college) return <div>College not found</div>

  return (
    <div className="college-page">
      <h1>{college.collegeName}</h1>
      
      <div className="college-details">
        <h2>Location</h2>
        <p>{college.location?.city}, {college.location?.state}, {college.location?.country}</p>

        <h2>Ratings & Analytics</h2>
        <div className="ratings-grid">
          <div className="rating-item">
            <h3>Overall Rating</h3>
            <p className="rating-value">{college.overallRating?.toFixed(1)}/5.0</p>
          </div>
          
          <div className="rating-breakdown">
            <h3>Detailed Ratings</h3>
            <ul>
              <li>Academic Quality: {college.ratings?.academicQuality}/5</li>
              <li>Campus Life: {college.ratings?.campusLife}/5</li>
              <li>Facilities: {college.ratings?.facilities}/5</li>
              <li>Faculty Quality: {college.ratings?.facultyQuality}/5</li>
              <li>Job Placement: {college.ratings?.jobPlacement}/5</li>
            </ul>
          </div>

          <div className="statistics">
            <h3>Key Statistics</h3>
            <ul>
              <li>Student Count: {college.statistics?.studentCount?.toLocaleString()}</li>
              <li>Acceptance Rate: {college.statistics?.acceptanceRate}%</li>
              <li>Average Tuition: ${college.statistics?.averageTuition?.toLocaleString()}/year</li>
            </ul>
          </div>
        </div>

        <div className="reviews-section">
          <h2>Reviews</h2>
          {college.reviews?.map(review => (
            <div key={review._id} className="review-card">
              <p>{review.comment}</p>
              <small>Date: {new Date(review.date).toLocaleDateString()}</small>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CollegePage 