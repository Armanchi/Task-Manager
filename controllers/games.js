const games = require("../models/games");

const addGame = (req, res) => {
  res.render("pages/addGame");
};

const createGame = async (req, res) => {
  try {
    if (req.user) {
      req.body.createdBy = req.user.name;
    }
    await games.create(req.body);
    req.session.pendingMessage = "The Inquiry was created.";
    console.log(req.body);
    res.redirect("/games");
  } catch (err) {
    if (err.name === "ValidationError") {
      res.locals.message = Object.values(err.errors)
        .map((item) => item.message)
        .join(", ");
    } else {
      res.locals.message = "Something went wrong.";
    }
    res.render("pages/addGame");
  }
};

const deleteGame = async (req, res) => {
  try {
    const game = await games.findByIdAndDelete(req.params.id, req.body);
    console.log("question was deleted");
    req.session.pendingMessage = "The inquiry was deleted";
    res.redirect("/games");
  } catch (err) {
    if (err.name === "ValidationError") {
      res.locals.message = Object.values(err.errors)
        .map((item) => item.message)
        .join(", ");
    } else {
      res.locals.message = "Something went wrong.";
    }

    res.redirect("/games");
  }
};

const editGame = async (req, res) => {
  try {
    const game = await games.findById(req.params.id);
    req.session.pendingMessage = "The inquiry was edited";
    console.log(GamepadButton);
    res.render("pages/edit_game", { game });
  } catch (err) {
    req.session.pendingMessage = "Something went wrong";
    res.redirect("/games");
  }
};

const updateGame = async (req, res) => {
 
  game = false;
  try {
    let messages = [];
    if (req.session.messages) {
      messages = req.session.messages;
      req.session.messages = [];
    }
    if (req.user.isAdmin) {
      game = await games.findById(req.params.id);
      await games.findByIdAndUpdate(req.params.id, req.body, {
        runValidators: true,
      });
    }
    game = await games.findById(req.params.id);
    await games.findByIdAndUpdate(req.params.id, req.body, {
      runValidators: true,
    });
    console.log(query);
    req.session.pendingMessage = "The inquiry was updated.";
    res.redirect("/games");
  } catch (err) {
    if (err.name === "ValidationError") {
      res.locals.message = Object.values(err.errors)
        .map((item) => item.message)
        .join(", ");
    } else {
      res.locals.message = "User logged out.";
    }
    if (query) {
      res.render("pages/edit_game", { game });
    } else {
      req.session.pendingMessage = "Something went wrong. Try again";
      res.redirect("/games");
    }
  }
};

const getGames = async (req, res) => {
  try {
    if (req.user.isAdmin) {
      const game = await games.find();
      res.render("pages/games", { games, messages: [] });
    }
    const Games = await games.find({ createdBy: req.user.name });

    if (Games) {
      res.render("pages/games", { games, messages: [] });
    }
  } catch (err) {
    res.render("pages/games", { games: [] });
  }
};

module.exports = {
  addGame,
  updateGame,
  deleteGame,
  getGames,
  createGame,
  editGame,
};