const express = require("express");
const Http = require("http");
const cors = require("cors") // cors 패키지 적용
const express_router = require("./routes");

const app = express();
const http = Http.createServer(app); //다른서버를 상속받아서 서버확장

const requestMiddleware = (req, res, next) => {
    console.log("Request Url:", req.originalUrl, " - ", new Date());
    next();
};

app.use(express.json());
app.use(express.urlencoded());
app.use(requestMiddleware)
app.use(cors());

app.use("/api", express_router); 

app.get("/", (req, res) => {  
    res.send("Hello World");
})

module.exports = http;