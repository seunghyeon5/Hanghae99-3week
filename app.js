const express = require("express");
const connect = require("./schemas")
const cors = require("cors") // cors 패키지 적용
const app = express();
const port = 3000;

connect();

const boardRouter = require("./routes/board")

const requestMiddleware = (req, res, next) => {
    console.log("Request Url:", req.originalUrl, " - ", new Date());
    next();
};

app.use(express.json());
app.use(express.urlencoded());
app.use(requestMiddleware)
app.use(cors());

app.use("/api", [boardRouter]); 

app.get("/", (req, res) => {  
    res.send("Hello World");
})

app.listen(port, () => {
    console.log(port, "포트로 서버가 열렀습니다.");
});