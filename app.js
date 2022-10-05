require('dotenv').config();
const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const passport = require('passport');
const session = require('express-session');
const morgan = require('morgan');

//db
const connectDB = require("./db/connect");

// log requests
app.use(morgan('tiny'));


const cors = require('cors');
const helmet = require("helmet");
const xss = require("xss-clean");
const rateLimiter = require('express-rate-limit')

app.use(passport.initialize());
app.use(passport.session());
app.use(express.urlencoded({ extended: false }));


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
  