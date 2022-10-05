require('dotenv').config();
const express = require('express');
require("express-async-errors");

const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const morgan = require('morgan');

const passport_init = require("./passport/passport_init");

const app = express();


const MongoDBStore = require("connect-mongodb-session")(session);


const url = process.env.MONGO_URI;
const store = new MongoDBStore({
  uri: url,
  collection: "Sessions",
});
store.on("error", function (error) {
  console.log(error);
});


//db
const connectDB = require("./db/connect");

const page_router = require("./routes/page_routes");
const gamesRoute = require("./routes/games");

const { authMiddleware, setCurrentUser } = require('./middleware/auth');
const errorHandlerMiddleware = require("./middleware/error-handler");
const notFoundMiddleware = require("./middleware/not-found");

// log requests
app.use(morgan('tiny'));

app.set("view engine", "ejs");

app.use(
    session({
      secret: process.env.SESSION_SECRET,
      resave: false,
      saveUninitialized: true,
      store: store,
    })
  );

const cors = require('cors');
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimiter = require('express-rate-limit')

passport_init();
app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));

app.use(setCurrentUser);
app.use("/", page_router);
app.use("/games", authMiddleware, gamesRoute);


app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);


app.set('trust proxy', 1);
app.use(rateLimiter({
  windowsMs: 15 * 60 * 1000, //15 minutes
  max: 100, //limit each IP to 100 requests per  window
}));

app.use(express.json());  
app.use(cors());
app.use(helmet({ crossOriginEmbedderPolicy: false, originAgentCluster: true }));
app.use(
  helmet.contentSecurityPolicy({
    useDefaults: true,
    directives: {
      "img-src": ["'self'", "https: data: blob:"],
    },
  })
);

app.use(xss());
app.use(bodyParser());

app.use(express.urlencoded({extended:true}))




const port = process.env.PORT || 8001;

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
  