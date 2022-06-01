const express = require("express");
const router = express.Router();
const { Article } = require("../models");
const authMiddleware = require("../middlewares/auth-middleware");

router.get("/board", authMiddleware, async (req, res) => {
  // 게시글 목록조회
  const { Date } = req.query;
  const article = await Article.findAll({ Date }).sort({ Date: -1 }); // 내림차순

  res.status(200).json(article);
});

router.post("/board", authMiddleware, async (req, res) => {
  //게시글 작성
  const { title, name, Password, content, Date, articleId } = req.body;
  const article = await Article.findAll({ articleId });
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
  const [detail] = await Article.findAll({ articleId: Number(articleId) }); //작성자아이디를 넘버를 이용해서 게시글 조회

  res.status(200).json({
    detail,
  });
});

router.put("/board/:articleId/update", authMiddleware, async (req, res) => {
  //게시글 수정
  const { articleId } = req.params;
  const { Password, title, content, name } = req.body;
  const updateArticle = await Article.findAll({ articleId: Number(articleId) });
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
  const deleteArticle = await Article.findAll({ articleId: Number(articleId) }); // 돌려서 비밀번호 같은경우 삭제
  if (Password === deleteArticle[0].Password) {
    await Article.destroy({ articleId: Number(articleId) });
  }

  res.status(200).json({ success: true });
});

module.exports = router;
