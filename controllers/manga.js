const manga = require("../models/manga");

const addManga = (req, res) => {
  res.render("pages/addManga");
};

const createManga = async (req, res) => {
  try {
    if (req.user) {
      req.body.createdBy = req.user.name;
    }
    await manga.create(req.body);
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
    const manga = await manga.findByIdAndDelete(req.params.id, req.body);
    console.log("book was deleted");
    req.session.pendingMessage = "Your entry was deleted.";
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
    const manga = await manga.findById(req.params.id);
    req.session.pendingMessage = "Your entry was edited";
    console.log(manga);
    res.render("pages/edit_manga", { manga });
  } catch (err) {
    req.session.pendingMessage = "Something went wrong";
    res.redirect("/manga");
  }
};

const updateManga = async (req, res) => {
 
  manga = false;
  try {
    let messages = [];
    if (req.session.messages) {
      messages = req.session.messages;
      req.session.messages = [];
    }
    if (req.user.isAdmin) {
      manga = await manga.findById(req.params.id);
      await manga.findByIdAndUpdate(req.params.id, req.body, {
        runValidators: true,
      });
    }
    manga = await manga.findById(req.params.id);
    await manga.findByIdAndUpdate(req.params.id, req.body, {
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
      res.locals.message = "User was logged out.";
    }
    if (manga) {
      res.render("pages/edit_manga", { manga });
    } else {
      req.session.pendingMessage = "Something went wrong. Try again";
      res.redirect("/manga");
    }
  }
};

const getManga = async (req, res) => {
  try {
    if (req.user.isAdmin) {
      const manga = await manga.find();
      res.render("pages/manga", { manga, messages: [] });
    }
    const Manga = await manga.find({ createdBy: req.user.name });

    if (Manga) {
      res.render("pages/manga", { manga, messages: [] });
    }
  } catch (err) {
    res.render("pages/manga", { manga: [] });
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