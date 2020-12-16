const jwt = require("jsonwebtoken");
const config = require("../../config/appConfig");


exports.generateJWT = function (identity) {
    return jwt.sign(
        {identity},
        config.auth.jwt_secret,
        {
            expiresIn: config.auth.jwt_expiresin,
            algorithm: config.auth.algorithm
        }
    );
};

exports.refreshJWT = function (identity) {
    return jwt.sign({
        identity,
    }, config.auth.refresh_token_secret, {
        expiresIn: config.auth.refresh_token_expiresin,
    });
};
