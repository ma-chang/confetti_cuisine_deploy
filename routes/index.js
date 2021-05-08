"use strict";

const router = require('express').Router();
const errorRoutes = require('./errorRoutes');
const userRoutes = require('./userRoutes');
const subscriberRoutes = require('./subscriberRoutes');
const courseRoutes = require('./courseRoutes');
const homeRoutes = require('./homeRoutes');
const apiRoutes = require('./apiRoutes');

router.use("/api", apiRoutes);
router.use("/users", userRoutes);
router.use("/courses", courseRoutes);
router.use("/subscribers", subscriberRoutes);
router.use("/", homeRoutes);
// errorは最後
router.use("/", errorRoutes);

module.exports = router;