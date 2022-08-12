const mongoose = require("mongoose");

const notesShcema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    tagline: { type: String, required: false },
    body: { type: String, required: false },
    isPinned: {type: Boolean, required: false, default: false}
  },
  { timestamps: true, versionKey: false }
);

module.exports = mongoose.model("Notes", notesShcema);
