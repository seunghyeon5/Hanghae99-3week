const express = require("express");
const app = express();
const jwt = require("jsonwebtoken");
const Joi = require("joi");

const connect = require("./models");
const Article = require("./models/article");
const User = require("./models/user");
const Comment = require("./models/comment");

const router = express.Router();
const authMiddleware = require("./middlewares/auth-Middleware");

const requestMiddleware = (req, res, next) => {
  console.log("Request Url:", req.originalUrl, " - ", new Date());
  next();
};

connect();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(requestMiddleware);
app.use("/api", router);

app.get("/users", (req, res) => {
  res.status(200).json({});
});

app.get("/article", (req, res) => {
  res.status(200).json({});
});

app.get("/", (req, res) => {
  res.send("Hello World");
});

const postUsersSchema = Joi.object({
  //회원가입 형식
  nickname: Joi.string().pattern(new RegExp("^[a-zA-Z0-9]{3,30}$")).required(),
  password: Joi.string().required(),
  repeat_password: Joi.string().required(),
});

router.post("/users", async (req, res) => {
  //회원가입
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

    const users = new User({ nickname, password });
    await users.save();

    res.status(201).send({});
  } catch (error) {
    res.status(400).send({
      errorMesssage: "요청한 데이터 형식이 올바르지 않습니다.",
    });
  }
});

const postAuthSchema = Joi.object({
  //로그인
  nickname: Joi.string()
    .min(3)
    .pattern(new RegExp("^[a-zA-Z0-9]{3,30}$"))
    .required(),
  password: Joi.string().min(4).required(),
});

router.post("/auth", async (req, res) => {
  try {
    const { nickname, password } = await postAuthSchema.validateAsync(req.body);

    const user = await User.findOne({ where: { nickname, password } });

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

router.get("/users/me", authMiddleware, async (req, res) => {
  //로그인 내용 조회
  const { user } = res.locals;
  res.send({
    user,
  });
});

router.get("/board", authMiddleware, async (req, res) => {
  const Allarticle = await Article.find({});

  res.status(200).json(Allarticle);
});

router.post("/board", authMiddleware, async (req, res) => {
  //게시글 작성
  const { title, content, articleNum, authorId } = req.body;
  const article = await Article.find({ articleNum });
  if (article.length) {
    // 이미 있는경우 에러메세지 추가
    return res
      .status(400)
      .json({ success: false, errorMesssage: "이미 있는 데이터입니다." });
  }
  const createdArticle = await Article.create({
    title,
    content,
    articleId,
    authorId,
  });

  res.status(201).json({ article: createdArticle });
});

router.get("/board/detail/:articleId", authMiddleware, async (req, res) => {
  // 게시글 조회
  const { articleNum } = req.params;
  const [detail] = await Article.find({ articleNum: String(articleNum) }); //작성자아이디를 넘버를 이용해서 게시글 조회

  res.status(200).json({
    detail,
  });
});

router.put("/board/detail/:articleId", authMiddleware, async (req, res) => {
  //게시글 수정
  const { user } = res.locals.user;
  const { articleId } = req.params;
  const { detail, title, content, articleNum } = req.body;
  const existsArticleId = await Article.find(user);
  if (articleNum === existsArticleId[0].articleNum) {
    await Article.updateOne(
      { articleId },
      { $set: { title, content, detail } }
    );
  }

  res.status(201).json({ success: true });
});

router.delete("/board/detail/:articleId", authMiddleware, async (req, res) => {
  //게시글 삭제
  const { user } = res.locals.user;
  const { articleId } = req.params;
  const { detail, title, content, articleNum } = req.body;
  const deleteArticle = await Article.find(user);
  if (articleNum === deleteArticle[0].articleNum) {
    await Article.delete({ articleId });
  }

  res.status(200).json({ success: true });
});

router.post('/comments', authMiddleware, async (req, res) => { //댓글작성
  const { authorId, commentId, commentContent } = req.body;

  const postArticle = await Comment.create({
      authorId,
      commentId,
      commentContent,
  });
  res.status(201).json({
      article: postArticle,
      result: "success",
      msg: "댓글이 등록되었습니다.",
    });
});

router.get("/comment/:commentId", async (req, res) => { //댓글 조회
  const allcomment = await Comment.find({});
  res.json(allcomment);
});

router.put("/comment/detail/:commentId",authMiddleware,async (req, res) => { // 댓글수정
    const { user } = res.locals.user; //정보가져와서 권한있어야수정
    const { commentId } = req.params;
    const { commentContent } = req.body;
    const existsComment = await Comment.findById(commentId)
    if(existsComment.user === user){
      await existsComment.updateOne({ commentContent }, { $set: { commentContent } })
    }
  }
);

router.delete("comment/detail/:commetId",authMiddleware,async (req, res) => { //댓글삭제
    const { commentId } = req.body;
    const existsComment = await Comment.findById(commentId);

    if (existsComment) {
      await Comment.findByIdAndDelete(commentId);
      res.status(200).json({
        result: "success",
        msg: "댓글 삭제완료",
      });
    }
  }
);

app.listen(8080, () => {
  console.log("포트로 서버가 열렀습니다.");
});
