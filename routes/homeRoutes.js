"use strict";

const router = require("express").Router();
const homeController = require("../controllers/homeController");

router.get("/chat", homeController.chat);
router.get("/", homeController.index);

module.exports = router;