const express = require("express")
const Joi = require("joi");

const router = express.Router();
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/users/me", authMiddleware, async(req, res) => { //조회
    const { user } = res.locals;
    res.send({
        user,
    });
})

module.exports = router;