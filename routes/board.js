const express = require("express");
const Article = require("../schemas/article");
const router = express.Router();

router.get("/board", async (req, res) => { // 게시글 목록조회
    const { Date } = req.query;
    const article = await Article.find({Date}).sort({Date: -1}); // 내림차순

    res.status(200).json( article );
});

router.post("/board", async(req, res) => { //게시글 작성
    const { title, name, Password, content, Date, articleId} = req.body;
    
    const article = await Article.find({ articleId });
    if (article.length) {
        return res.status(400).json({ success: false, errorMesssage: "이미 있는 데이터입니다." });
      }

    const createdArticle = await Article.create({ title, name, Password, content, Date, articleId });
    
    res.status(201).json({article: createdArticle});
});

router.get("/board/:articleId", async(req, res) => { // 게시글 조회
    const { articleId } = req.params;

    const [ detail ] = await Article.find({ articleId: Number(articleId) });
  
    res.status(200).json({
      detail,
    });
});

router.put("/board/:articleId", async(req, res) => { //게시글 수정
    const { articleId } = req.params;
    const { Password, title, content, name } = req.body;
    const PW = await Article.findOne({ articleId })
    if (Password == PW.Password) {
        const updateArticle = await Article.updateOne({ articleId: Number(articleId) }, { $set: { name, content , title} });
        res.status(201).json({ board: UpdateBoard })
    };
})

router.delete("/board/:articleId", async(req, res) => { //게시글 삭제
    const { articleId  } = req.params;
    const { Password, title, content, name } = req.body;
    const PW = await Article.findOne({ articleId })
    if (Password == PW.Password) {
        const deleteArticle = await Article.deleteOne({ articleId: Number(articleId) });
        res.status(200).json({ board: DeleteBoard })
    }; 
});

module.exports = router;