const express = require("express");
const router = express.Router();
const Notes = require("../Models/notes.model");

router.post("/", async (req, res) => {
  const { title, img, tagline, body, dateCreated, category } = req.body;
  if (!title) {
    return res.status(422).send({ error: "Please add a title" });
  }
  if (!img) {
    return res.status(422).send({ error: "Please add a image" });
  }
  try {
    const notes = await Notes.create({
      title: req.body.title,
      tagline: req.body.tagline,
      body: req.body.body,
      isPinned: req.body.isPinned,
      img: req.body.img,
      category: req.body.category,
    });
    return res.status(201).send(notes);
  } catch (error) {
    return res.status(500).send(error.message);
  }
});
// get all the notes with pagination or without pagination---->
router.get("/", async (req, res) => {
  try {
    const page = +req.query.page;
    const size = +req.query.size;
    const skip = (page - 1) * size;
    const sort = req.query.sortBy;
    const category = req.query.category;
    if (page && size) {
      let notes = {};
      if (sort && sort === "asc") {
        notes = await Notes.find()
          .skip(skip)
          .limit(size)
          .sort("createdAt")
          .lean()
          .exec();
        return res.status(200).send(notes);
      }
      notes = await Notes.find()
        .skip(skip)
        .limit(size)
        .sort("-createdAt")
        .lean()
        .exec();
      return res.status(200).send(notes);
    }
    if (category) {
      const filterCategories = category.split(",");
      const notes = await Notes.find({ category: filterCategories })
        .sort("-createdAt")
        .lean()
        .exec();
      return res.status(200).send(notes);
    }
    const notes = await Notes.find().sort("-createdAt").lean().exec();
    return res.status(200).send(notes);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
});

// get all categories ---->
router.get("/categories", async (req, res) => {
  try {
    const notes = await Notes.find();
    const allCategories = [...new Set(notes.map((item) => item.category))];
    return res.status(200).send(allCategories);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
});
//get a note by ID --->
router.get("/:id", async (req, res) => {
  try {
    const note = await Notes.findById(req.params.id).lean();
    return res.status(200).send(note);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
});

//edit a note------->
router.put("/edit/:id", async (req, res) => {
  try {
    await Notes.findOneAndUpdate(
      { _id: req.params.id },
      {
        title: req.body.title,
        tagline: req.body.tagline,
        body: req.body.body,
        isPinned: req.body.isPinned,
        category: req.body.category,
        description: req.body.description
      },
      { new: true }
    ).then((notes) => {
      if (!notes) {
        return res.status(404).send();
      }
      return res.status(200).send(notes);
    });
    return res.status(200).send(updated_note);
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
});

// delete a note --->
router.delete("/delete/:id", async (req, res) => {
  try {
    await Notes.deleteOne({ _id: req.params.id }).then((notes) => {
      if (!notes) {
        return res.status(404).send();
      }
      return res.status(200).send(notes);
    });
  } catch (err) {
    console.log(err);
    return res.status(500).send(err.message);
  }
});

//pin a note ---->
router.patch("/pin/:id", async (req, res) => {
  try {
    const _id = req.params.id;
    await Notes.findByIdAndUpdate(_id, req.body, { new: true }).then(
      (updatedNote) => {
        if (!updatedNote) {
          return res.status(404).send();
        }
        return res.status(200).send(updatedNote);
      }
    );
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
});

module.exports = router;
