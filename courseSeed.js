"use strict";

const mongoose = require("mongoose");
const Course = require("./models/course");

mongoose.Promise = global.Promise;
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://localhost/recipe_db",
  { useNewUrlParser: true }
);

var courses = [
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
      () => new Promise(resolve => {
        createCourse(next, resolve);
      })
    );
  },
  Course.remove({})
    .exec()
    .then(() => {
      console.log("Course data is empty!");
    })
);