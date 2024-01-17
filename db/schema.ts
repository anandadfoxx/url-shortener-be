import { Schema } from "mongoose";

export const userSchema = new Schema({
  createdDate: Date,
  updatedDate: Date,
  email: {
    type: String,
    unique: true
  },
  password: String,
  role: Number
});

export const urlShortSchema = new Schema({
  createdDate: Date,
  updatedDate: Date,
  author: String,
  short_uri: String,
  long_uri: String
});