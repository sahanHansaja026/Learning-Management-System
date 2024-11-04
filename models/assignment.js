const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const postSchema = new Schema({
  card_id: {
    type: String,
    required: true,
  },
  assignment_name: {
    type: String,
  },
  assignment: {
    type: String,
  },
  note_name: {
    type: String,
  },
  note: {
    type: String,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  video_name: {
    type: String,
  },
  video: {
    type: String,
  },
  quiz_id: {
    type: String,
  },
  quiz_name: {
    type: String,
  },
  description: {
    type: String,
  },
  CMS_id: {
    type: String,
  },
  CMS_name: {
    type: String,
  },
});

module.exports = mongoose.model("Assignment_details", postSchema);
