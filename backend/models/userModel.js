const mongoose = require('mongoose');
const validator = require('validator');

// schema
const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'User Name is required'],
    minLength: [3, "Name must contain at least 3 characters!"],
    maxLength: [30, "Name must not exceed 30 characters!"]
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    validate: [validator.isEmail, "Please provide a valid email"]
  },
  phone: {
    type: Number,
    required: [true, 'Phone number is required'],
  },
  avatar: {
    public_id: {
      type: String
    },
    url: {
      type: String,
    }
  },
  education: {
    type: String,
    required: [true, "Education is required"]
  },
  role: {
    type: String,
    required: true,
    enum: ["reader", "author","Reader","Author"]
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minLength: [6, "Password must contain at least 6 characters"],

  },
  createdOn: {
    type: Date,
    default: Date.now,
  }
}, { timestamps: true })

// export
module.exports = mongoose.model("User", userSchema);
