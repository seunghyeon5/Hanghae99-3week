const jwt = require("jsonwebtoken");
const { User } = require("../models");

module.exports = (req, res, next) => {
    try {
    const { authorization } = req.headers;
    const [ tokenType, tokenValue ] = authorization.split(' ');

    if(tokenType !== 'Bearer') {
        res.status(401).send({
            errorMessaage: '로그인 후 사용하세요'
        });
        return;
    }
        const { userId } = jwt.verify(tokenValue, "4week-secret-key"); //decoded가 제대로된 값

        User.findByPk(userId).then((user) => {
            res.locals.user = user;
            next();
        });
    } catch (error) { //제대로 안된 값
        res.status(401).send({
            errorMessaage: "로그인 후 사용하세요",
        });
        return;
    }
};