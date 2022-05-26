const mongoose = require("mongoose");

const boardSchema = new mongoose.Schema({
    articleId: {
        type: Number,
        //required: true,
        //unique: true,
    },
    Password: {
        type : String,
    },
    title: {
        type : String,
    },
    content: {
        type: String,
    },
    Date: {
        type: Date,
    },
    name: {
        type : String,
    }
});

module.exports = mongoose.model("board", boardSchema);