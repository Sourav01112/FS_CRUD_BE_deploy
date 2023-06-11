const mongoose = require("mongoose");
require("dotenv").config();

// local
// const connection = mongoose.connect("mongodb://localhost:27017/fs-NotesApp");

// atlas
const connection = mongoose.connect(process.env.DATABASE);

module.exports = { connection };
