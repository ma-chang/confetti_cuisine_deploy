"use strict";

const mongoose = require("mongoose");
const User = require("./models/user");

mongoose.Promise = global.Promise;
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost:27017/confetti_cuisine",
  { useNewUrlParser: true, useFindAndModify: false }
);

var users = [
  {
    name: {
      first: "Jon",
      last: "Wexler"
    },
    email: "jon@jonwexler.com",
    zipCode: 10016,
    password: "12345"
  },
  {
    name: {
      first: "Chef",
      last: "Eggplant"
    },
    email: "eggplant@recipeapp.com",
    zipCode: 20331,
    password: "12345"
  },
  {
    name: {
      first: "Professor",
      last: "Souffle"
    },
    email: "souffle@recipeapp.com",
    zipCode: 19103,
    password: "12345"
  }
];

let registerUser = (u, resolve) => {
  User.register(
    {
      name: {
        first: u.name.first,
        last: u.name.last
      },
      email: u.email,
      zipCode: u.zipCode,
      password: u.password,
    },
    u.password,
    (error, user) => {
      console.log(`USER created: ${user.fullName}`);
      resolve(user);
    }
  );
};

users
  .reduce(
    (promiseChain, next) => {
      return promiseChain.then(
        () =>
          new Promise(resolve => {
            registerUser(next, resolve);
          })
      );
    },
    User.remove({})
      .exec()
      .then(() => {
        console.log("User data is empty!");
      })
  )
  .then(r => {
    console.log(JSON.stringify(r));
    mongoose.connection.close();
  })
  .catch(error => {
    console.log(`ERROR: ${error}`);
  });