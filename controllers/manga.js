// const manga = require("../models/manga");
const Manga = require("../models/manga")

const addManga = (req, res) => {
  res.render("pages/addManga");
};

const createManga = async (req, res) => {
  try {
    if (req.user) {
      req.body.createdBy = req.user.name;
    }
    await Manga.create(req.body);
    req.session.pendingMessage = "The entry was created.";
    console.log(req.body);
    res.redirect("/manga");
  } catch (err) {
    if (err.name === "ValidationError") {
      res.locals.message = Object.values(err.errors)
        .map((item) => item.message)
        .join(", ");
    } else {
      res.locals.message = "Something went wrong.";
    }
    res.render("pages/addManga");
  }
};

const deleteManga = async (req, res) => {
  try {
    const manga = await Manga.findByIdAndDelete(req.params.id, req.body);
    console.log("Your entry was deleted");
    req.session.pendingMessage = "The entry was deleted";
    res.redirect("/manga");
  } catch (err) {
    if (err.name === "ValidationError") {
      res.locals.message = Object.values(err.errors)
        .map((item) => item.message)
        .join(", ");
    } else {
      res.locals.message = "Something went wrong.";
    }

    res.redirect("/manga");
  }
};

const editManga = async (req, res) => {
  try {
    const manga = await Manga.findById(req.params.id);
    req.session.pendingMessage = "Your entry was edited";
    console.log(manga);
    res.render("pages/editManga", { manga });
  } catch (err) {
    req.session.pendingMessage = "Something went wrong";
    res.redirect("/manga");
  }
};



const updateManga = async (req, res) => {
  mangas = false;
  try {
    let messages = [];
    if (req.session.messages) {
      messages = req.session.messages;
      req.session.messages = [];
    }
    if (req.user.name) {
      mangas = await Manga.findById(req.params.id);
      await Manga.findByIdAndUpdate(req.params.id, req.body, {
        runValidators: true,
      });
    }
    mangas = await Manga.findById(req.params.id);
    await Manga.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
    });
    console.log(manga);
    req.session.pendingMessage = "Your entry was updated.";
    res.redirect("/manga");
  } catch (err) {
    if (err.name === "ValidationError") {
      res.locals.message = Object.values(err.errors)
        .map((item) => item.message)
        .join(", ");
    } else {
      res.locals.message = "User logged out.";
    }
    if (manga) {
      res.render("pages/editManga", { manga });
    } else {
      req.session.pendingMessage = "Something went wrong. Try again";
      res.redirect("/manga");
    }
  }
};

const getManga = async (req, res) => {
  try {
  
    if (req.user.name) {
      const mangas = await Manga.find();
      res.render("pages/manga", { mangas, messages: [] });
    }
    const mangas = await Manga.find({ createdBy: req.user.name });

    if (mangas) {
      res.render("pages/manga", { mangas, messages: [] });
    }
  } catch (err) {
    res.render("pages/manga", { mangas: [] });
  }
};





module.exports = {
  addManga,
  updateManga,
  deleteManga,
  getManga,
  createManga,
  editManga,
};