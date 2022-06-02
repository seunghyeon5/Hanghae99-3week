const mongoose = require('mongoose');

const ArticleSchema = mongoose.Schema(
    {
        title: String,
        content: String,
        authorId: String,
        articleNum: String,
    },
    { timestamps: true }
);

ArticleSchema.virtual('articleId').get(function () {
    return this._id.toHexString(); //id가서와서 tohexstring으로 해야 정상적으로 동작
});

ArticleSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('Article', ArticleSchema);