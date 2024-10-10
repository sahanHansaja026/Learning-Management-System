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
});

module.exports = mongoose.model("Assignment_details", postSchema);
