const simpleFlake = require("simpleflake");
const bcrypt = require("bcrypt");

const saltRounds = 12;


exports.getUid = function () {
    return simpleFlake().toString("base10");
};

exports.hashPassword = async function (password) {
    return new Promise((resolve, reject) => {
        bcrypt.hash(password, saltRounds, function (err, hash) {
            if (err) {
                reject(err);
            } else {
                resolve(hash);
            }
        });

    });
};

exports.checkHashPassword = function (password, user) {
    return new Promise((resolve, reject) => {
        bcrypt.compare(password, user.password, (err, result) => {
            if (err) {
                reject(err);
            } else {
                resolve(result);
            }
        });
    });
};
