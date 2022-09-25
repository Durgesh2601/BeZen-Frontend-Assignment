const mongoose = require("mongoose");

const notesShcema = new mongoose.Schema(
  {
    title: { type: String, required: false },
    tagline: { type: String, required: false },
    body: { type: String, required: false },
    isPinned: { type: Boolean, required: false, default: false },
    img: { type: String, required: true },
    category: { type: String, required: false },
    description: { type: String, required: false },
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Notes", notesShcema);
