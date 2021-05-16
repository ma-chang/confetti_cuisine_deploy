"use strict";

const mongoose = require("mongoose");
const Subscriber = require("./models/subscriber");
const User = require("./models/user");
const Course = require("./models/course");

mongoose.connect("mongodb://localhost/confetti_cuisine",);
mongoose.Connection;

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
  ],
  courses = [
    {
      title: "Tomato Workshop",
      description: "Learn to mash, and bash tomatoes red and ripe.",
      maxStudents: 100,
      cost: 21
    },
    {
      title: "Cookie Control",
      description: "Learn to make cookies that swwtness to a new level.",
      maxStudents: 100,
      cost: 25
    },
    {
      title: "Soup D'Jawn",
      description: "In this class you learn to make hot goodness on the ground.",
      maxStudents: 100,
      cost: 42
    }
  ];

let createCourse = (c, resolve) => {
  Course.create({
    title: c.title,
    description: c.description,
    maxStudents: c.maxStudents,
    cost: c.cost
  }).then(course => {
    console.log(`CREATED COURSE: ${course.title}`);
    resolve(course);
  });
};

courses.reduce(
  (promiseChain, next) => {
    return promiseChain.then(
      () =>
        new Promise(resolve => {
          createCourse(next, resolve);
        })
    );
  },
  // array.reduce(callback [, initialValue]) のためremoveが後
  Course.remove({})
    .exec()
    .then(() => {
      console.log("Course data is empty!");
    })
);

let createSubscriber = (s, resolve) => {
  Subscriber.create({
    name: s.name,
    email: s.email,
    zipCode: s.zipCode
  }).then(sub => {
    console.log(`CREATED SUBSCRIBER: ${sub.name}`);
    resolve(sub);
  });
};

users.reduce(
  (promiseChain, next) => {
    return promiseChain.then(
      () =>
        new Promise(resolve => {
          createSubscriber(next, resolve);
        })
    );
  },
  // array.reduce(callback [, initialValue]) のためremoveが後
  Subscriber.remove({})
    .exec()
    .then(() => {
      console.log("Subscriber data is empty!");
    })
);

let registerUser = (u, resolve) => {
  // register(user, password, cb) Convenience method to register a new user instance with a given password. (passport-local-mongoose)
  User.register(
    {
      name: {
        first: u.name.first,
        last: u.name.last,
      },
      email: u.email,
      zipCode: u.zipCode,
      password: u.password
    },
    u.password,
    (error, user) => {
      console.log(`CREATED USER: ${user.fullName}`);
      resolve(user);
    }
  );
};

users.reduce(
  (promiseChain, next) => {
    return promiseChain.then(
      () =>
        new Promise(resolve => {
          registerUser(next, resolve);
        })
    );
  },
  // array.reduce(callback [, initialValue]) のためremoveが後
  User.remove({})
    .exec()
    .then(() => {
      console.log("User data is empty!");
    })
);