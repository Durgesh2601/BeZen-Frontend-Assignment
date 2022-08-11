const express = require("express");
const app = express();
const cors = require("cors");
const notesController = require("./Controllers/notes.controller");
app.use(cors());
app.use(express.json());

app.use("/", notesController);

module.exports = app;
