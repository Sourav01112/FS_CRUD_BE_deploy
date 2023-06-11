const express = require("express");
const notesRouter = express.Router();
const { NotesModel } = require("../model/notes.model");
const bcrypt = require("bcrypt");
const { authMiddleware } = require("../middlewares/auth.middleware");

notesRouter.use(authMiddleware);

// POST
notesRouter.post("/create", async (req, res) => {
  try {
    const newNote = new NotesModel(req.body);
    await newNote.save();
    res
      .status(200)
      .json({ msg: "New Note has been created", newNote: req.body });
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

// GET
notesRouter.get("/", async (req, res) => {
  try {
    const existingNotes = await NotesModel.find({ userID: req.body.userID });
    //only get those notes which has userID matching req.body.userID
    res.status(200).json(existingNotes);
  } catch (err) {
    res.status(400).json({ err: err.message });
  }
});

// PATCH
notesRouter.patch("/update/:note_ID", async (req, res) => {
  // userID in the user doc === userID in the note doc
  // then only, I will update
  const { note_ID } = req.params;
  const userIDinUserDoc = req.body.userID;
  try {
    const note = await NotesModel.findOne({ _id: note_ID });
    // console.log("@Note Document from MongoDB", note);
    const userIDinNoteDoc = note.userID;
    if (userIDinUserDoc === userIDinNoteDoc) {
      /*  console.log("UserID in User Doc:",userIDinUserDoc,
        "\n","UserID in the Note Doc:",userIDinNoteDoc); */
      await NotesModel.findByIdAndUpdate({ _id: note_ID }, req.body);
      res.json({ msg: `${note.title} : has been updated!` });
    } else {
      /*  console.log("UserID in User Doc:",userIDinUserDoc,
        "\n","UserID in the Note Doc:",userIDinNoteDoc); */
      res.json({ msg: "Not Authorized!" });
    }
  } catch (err) {
    res.json({ error: err.message });
  }
});

// DELETE
notesRouter.delete("/delete/:note_ID", async (req, res) => {
  // userID in the user doc === userID in the note doc
  // then only, I will Delete
  const { note_ID } = req.params;
  const userIDinUserDoc = req.body.userID;
  try {
    const note = await NotesModel.findOne({ _id: note_ID });
    const userIDinNoteDoc = note.userID;
    if (userIDinUserDoc === userIDinNoteDoc) {
      await NotesModel.findByIdAndDelete({ _id: note_ID }, req.body);
      res.json({ msg: `${note.title} : has been deleted!` });
    } else {
      res.json({ msg: "Not Authorized!" });
    }
  } catch (err) {
    res.json({ error: err.message });
  }
});

module.exports = { notesRouter };
