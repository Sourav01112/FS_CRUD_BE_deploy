const express = require("express");
const app = express();
const connection = require("./db");
const { userRouter } = require("./controllers/user.routes");
const { notesRouter } = require("./controllers/notes.routes");
const cors = require("cors");
app.use(express.json());
require("dotenv").config();

// to avoid CORS error because origin of BE is localhost:4500 and FE is localhost:3000
app.use(cors());

// Router Middleware
app.use("/users", userRouter);
app.use("/notes", notesRouter);

//Server
app.listen(process.env.PORT, async () => {
  try {
    await connection;
    console.log("server is running with MongoDB(atlas)!");
  } catch (error) {
    console.log("something went wrong with Server");
  }
});
