const mongoose = require("mongoose");

const connect = () => { //mongoose 연결
    mongoose.connect("mongodb://localhost:27017/Hanghae_article", 
    { ignoreUndefined: true }).catch((err) => {
        console.log(err);
    });

    mongoose.connection.on("error", err => {
        console.error("몽고디비 연결 에러",err);
    });
};

module.exports = connect;