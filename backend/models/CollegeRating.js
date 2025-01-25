const mongoose = require('mongoose');

const collegeRatingSchema = new mongoose.Schema({
  collegeName: {
    type: String,
    required: true,
    trim: true
  },
  location: {
    city: {
      type: String,
      required: true
    },
    state: {
      type: String,
      required: true
    },
    country: {
      type: String,
      required: true
    }
  },
  ratings: {
    academicQuality: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    campusLife: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    facilities: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    facultyQuality: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    },
    jobPlacement: {
      type: Number,
      required: true,
      min: 1,
      max: 5
    }
  },
  overallRating: {
    type: Number,
    min: 1,
    max: 5,
    default: function() {
      const r = this.ratings;
      return (
        (r.academicQuality + r.campusLife + r.facilities + r.facultyQuality + r.jobPlacement) / 5
      );
    }
  },
  reviews: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    },
    comment: {
      type: String,
      trim: true
    },
    date: {
      type: Date,
      default: Date.now
    }
  }],
  statistics: {
    studentCount: {
      type: Number,
      default: 0
    },
    acceptanceRate: {
      type: Number,
      min: 0,
      max: 100
    },
    averageTuition: {
      type: Number,
      min: 0
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt timestamp before saving
collegeRatingSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('CollegeRating', collegeRatingSchema); 