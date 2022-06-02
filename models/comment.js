const mongoose = require('mongoose');

const CommentSchema = mongoose.Schema(
    {
        commentId: String,
        authorId: String,
        commentContent: String,
    },
    { timestamps: true }
);

CommentSchema.virtual('commentsId').get(function () {
    return this._id.toHexString();
});
CommentSchema.set('toJSON', {
    virtuals: true,
});

module.exports = mongoose.model('Comment', CommentSchema);