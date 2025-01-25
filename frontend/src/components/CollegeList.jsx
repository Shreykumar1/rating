import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

function CollegeList() {
  const navigate = useNavigate()
  const [colleges, setColleges] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('http://localhost:3000/api/colleges')
      .then(response => response.json())
      .then(data => {
        setColleges(data)
        setLoading(false)
      })
      .catch(err => {
        setError(err.message)
        setLoading(false)
      })
  }, [])

  const handleCollegeClick = (collegeId) => {
    navigate(`/colleges/${collegeId}`)
  }

  if (loading) return <div>Loading...</div>
  if (error) return <div>Error: {error}</div>

  return (
    <div className="colleges-list">
      <h1>Colleges</h1>
      {colleges.map(college => (
        <div 
          key={college._id} 
          className="college-card"
          onClick={() => handleCollegeClick(college._id)}
          style={{ cursor: 'pointer' }}
        >
          <h2>{college.collegeName}</h2>
          <p>{college.location?.city}, {college.location?.state}</p>
          <p>Overall Rating: {college.overallRating}</p>
        </div>
      ))}
    </div>
  )
}

export default CollegeList 