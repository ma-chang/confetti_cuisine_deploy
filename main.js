'use strict';

const express = require('express');
const app = express();
const router = require("./routes/index");
const mongoose = require('mongoose');
const methodOverride = require('method-override');
const layouts = require('express-ejs-layouts');
const passport = require('passport');
const expressSession = require('express-session');
const cookieParser = require('cookie-parser');
const connectFlash = require('connect-flash');
const User = require('./models/user');
const morgan = require('morgan');

mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/confetti_cuisine",
  { useNewUrlParser: true , useFindAndModify: false }
);

mongoose.set("useCreateIndex", true);

app.set('view engine', 'ejs');
app.set('port', process.env.PORT || 3000);

app.use(
  express.urlencoded({
    extended: false
  })
);
app.use(morgan("combined"));
app.use(express.json());
app.use(layouts);
app.use(express.static('public'));

app.use(
  methodOverride("_method", {
    methods: ["POST", "GET"]
  })
);
app.use(cookieParser("secretCuisine987"));
app.use(
  expressSession({
    secret: "secretCuisine987",
    cookie: {
      maxAge: 4000000
    },
    resave: false,
    saveUninitialized: false
  })
);
app.use(connectFlash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
  res.locals.loggedIn = req.isAuthenticated();
  res.locals.currentUser = req.user;
  res.locals.flashMessages = req.flash();
  next();
});

app.use("/", router);

const server = app.listen(app.get('port'), () => {
  console.log(`Server running at http://localhost:${app.get("port")}`);
});
const io = require('socket.io')(server);
const chatController = require('./controllers/chatController')(io);
