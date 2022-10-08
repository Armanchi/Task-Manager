require('dotenv').config();
const express = require('express');
require("express-async-errors");
const session = require('express-session');
const passport = require('passport');


const MongoDBStore = require("connect-mongodb-session")(session);
const passport_init = require("./passport/passport_init");

//db
const connectDB = require("./db/connect");


const page_router = require("./routes/page_routes");
const mangaRoute = require("./routes/manga");

const { authMiddleware, setCurrentUser } = require('./middleware/auth');
const errorHandlerMiddleware = require("./middleware/error-handler");
const notFoundMiddleware = require("./middleware/not-found");


const url = process.env.MONGO_URI;
const store = new MongoDBStore({
  uri: url,
  collection: "Sessions",
});
store.on("error", function (error) {
  console.log(error);
});

const app = express();

app.set("view engine", "ejs");

app.use(express.static(__dirname + '/public'));

app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      store: store,
    })
  );

passport_init();
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));


app.use(setCurrentUser);
app.use("/", page_router);
app.use("/manga", authMiddleware, mangaRoute);


app.use(express.json());  


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);



const port = process.env.PORT || 5000;

const start = async () => {
    try {
      await connectDB(process.env.MONGO_URI);
      app.listen(port, () =>
        console.log(`Server is listening on port ${port}...`)
      );
    } catch (error) {
      console.log(error);
    }
  };
  
  start();