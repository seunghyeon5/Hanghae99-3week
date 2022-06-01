const express = require("express");
const { Op } = require("sequelize")
const Joi = require("joi");
const { User } = require("../models");

const router = express.Router();

const postUsersSchema = Joi.object({
    nickname: Joi.string()
      .min(3)
      .pattern(new RegExp("^[a-zA-Z0-9]{3}$"))
      .required(),
    password: Joi.string().min(4).required(),
    repeat_password: Joi.ref("password"),
  });
  
  router.post("/users", async (req, res) => {
    try {
      const { nickname, password, repeat_password } = await postUsersSchema.validateAsync(req.body);
  
      if (password !== repeat_password) {
        res.status(400).send({
          errorMesssage: "패스워드가 패스워드 확인란과 동일하지 않습니다.",
        });
        return;
      }
      const existUsers = await User.findAll({
        where: {
          [Op.or]: [{nickname}],
        },
      });
  
      if (existUsers.length) {
        // 이미 있는경우 에러메세지 추가
        return res
          .status(400)
          .json({ success: false, errorMesssage: "이미 있는 데이터입니다." });
      }
  
      await User.create ({ username, password });
  
      res.status(201).send({});
    } catch (error) {
      res.status(400).send({
        errorMesssage: "요청한 데이터 형식이 올바르지 않습니다.",
      });
    }
  });

  module.exports = router;