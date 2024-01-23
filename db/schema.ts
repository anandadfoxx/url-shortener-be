import { Schema } from "mongoose";

export const userSchema = new Schema({
  createdDate: Date,
  updatedDate: Date,
  email: {
    type: String,
    unique: true
  },
  password: String,
  role: Number,
  isVerified: Boolean,
  verifyPayload: String
});

export const urlShortSchema = new Schema({
  createdDate: Date,
  updatedDate: Date,
  author: String,
  short_uri: {
    type: String,
    unique: true
  },
  long_uri: {
    type: String,
    unique: true
  }
});