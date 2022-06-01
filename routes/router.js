const express = require("express");
const router = express.Router();

const router_users = require("./users");
const router_boards = require("./board");
const router_signup = require("./signup");
const router_login = require("./login");

router.use("/users", router_users);
router.use("/posts", router_boards);
router.use("/signup", router_signup);
router.use("/login", router_login);

module.exports = router;