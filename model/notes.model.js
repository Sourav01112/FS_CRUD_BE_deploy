const mongoose = require("mongoose");

const noteSchema = mongoose.Schema(
  {
    title: String,
    description: String,
    userName: String,
    userID: String,
    category: String,
  },
  {
    versionKey: false,
  }
);

// constructor
const NotesModel = mongoose.model("note", noteSchema);

module.exports = { NotesModel };
