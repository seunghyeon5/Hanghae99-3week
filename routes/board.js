const express = require("express");
const Article = require("../schemas/article");
const router = express.Router();
const jwt = require("jsonwebtoken");
const User = require("../schemas/user");
const authMiddleware = require("../middlewares/auth-middleware");
const Joi = require("joi");

const postUsersSchema = Joi.object({
  nickname: Joi.string()
    .min(3)
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required(),
  password: Joi.string().min(4).required(),
  repeat_password: Joi.ref("password"),
});

router.post("/users", async (req, res) => {
  try {
    const { nickname, password, repeat_password } =
      await postUsersSchema.validateAsync(req.body);

    if (password !== repeat_password) {
      res.status(400).send({
        errorMesssage: "패스워드가 패스워드 확인란과 동일하지 않습니다.",
      });
      return;
    }
    const existUsers = await User.find({
      $or: [{ nickname }],
    });

    if (existUsers.length) {
      // 이미 있는경우 에러메세지 추가
      return res
        .status(400)
        .json({ success: false, errorMesssage: "이미 있는 데이터입니다." });
    }

    const user = new User({ username, password });
    await user.save();

    res.status(201).send({});
  } catch (error) {
    res.status(400).send({
      errorMesssage: "요청한 데이터 형식이 올바르지 않습니다.",
    });
  }
});

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

    const user = await User.findOne({ nickname, password });

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
router.get("/board", authMiddleware, async (req, res) => {
  // 게시글 목록조회
  const { Date } = req.query;
  const article = await Article.find({ Date }).sort({ Date: -1 }); // 내림차순

  res.status(200).json(article);
});

router.post("/board", authMiddleware, async (req, res) => {
  //게시글 작성
  const { title, name, Password, content, Date, articleId } = req.body;
  const article = await Article.find({ articleId });
  if (article.length) {
    // 이미 있는경우 에러메세지 추가
    return res
      .status(400)
      .json({ success: false, errorMesssage: "이미 있는 데이터입니다." });
  }
  const createdArticle = await Article.create({
    title,
    name,
    Password,
    content,
    Date,
    articleId,
  });

  res.status(201).json({ article: createdArticle });
});

router.get("/board/:articleId", authMiddleware, async (req, res) => {
  // 게시글 조회
  const { articleId } = req.params;
  const [detail] = await Article.find({ articleId: Number(articleId) }); //작성자아이디를 넘버를 이용해서 게시글 조회

  res.status(200).json({
    detail,
  });
});

router.put("/board/:articleId/update", authMiddleware, async (req, res) => {
  //게시글 수정
  const { articleId } = req.params;
  const { Password, title, content, name } = req.body;
  const updateArticle = await Article.find({ articleId: Number(articleId) });
  if (Password === updateArticle[0].Password) {
    // 돌려서 비밀번호 같은 경우 업데이트
    await Article.updateOne(
      { articleId: Number(articleId) },
      { $set: { title, content, name } }
    );
  }

  res.status(201).json({ success: true });
});

router.delete("/board/:articleId/delete", authMiddleware, async (req, res) => {
  //게시글 삭제
  const { articleId } = req.params;
  const { Password, title, content, name } = req.body;
  const deleteArticle = await Article.find({ articleId: Number(articleId) }); // 돌려서 비밀번호 같은경우 삭제
  if (Password === deleteArticle[0].Password) {
    await Article.deleteOne({ articleId: Number(articleId) });
  }

  res.status(200).json({ success: true });
});

module.exports = router;
