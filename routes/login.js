const express = require("express");
const { Op } = require("sequelize")
const Joi = require("joi");
const jwt = require("jsonwebtoken");
const { User } = require("../models");
const router = express.Router();

const postAuthSchema = Joi.object({
    nickname: Joi.string()
      .min(3)
      .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
      .required(),
    password: Joi.string().min(4).required(),
  });
  
  router.post("/auth", async (req, res) => {
    try {
      const { nickname, password } = await postAuthSchema.validateAsync(req.body);
  
      const user = await User.findOne({ where: {nickname, password} });
  
      if (!user) {
        res.status(400).send({
          errorMesssage: "닉네임또는 패스워드가 잘못됐습니다.",
        });
        return;
      }
  
      const token = jwt.sign({ userId: user.userId }, "4week-secret-key");
      res.send({
        token,
      });
    } catch (error) {
      res.status(400).send({
        errorMesssage: "요청한 데이터 형식이 올바르지 않습니다.",
      });
    }
  });

  module.exports = router;