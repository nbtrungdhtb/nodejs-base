const Joi = require("joi");
const jwt = require("jsonwebtoken");
const _ = require("lodash");
const RequestHandler = require("../../utils/RequestHandler");
const Logger = require("../../utils/logger");
const auth = require("../../utils/auth");
const UserModel = require("./model");
const {generateJWT, refreshJWT} = require("./AuthController");


const logger = new Logger();
const requestHandler = new RequestHandler(logger);
const tokenList = {};


class UsersController extends UserModel {
    static async registerUser(req, res) {
        try {
            const schema = Joi.object({
                full_name: Joi.string().required(),
                user_name: Joi.string().required().min(3),
                password: Joi.string().required().min(3)
            });
            const body = req.body;

            const { error } = schema.validate(_.pick(body, ["full_name", "user_name", "password"]));
            if (error) {
                requestHandler.validateJoi(error, 400, error.details[0].message);
            }

            const result = await super.findUserByUserName(body.user_name);
            if (result) requestHandler.errorResponse(req, res, "User already exist");

            const user = await super.createUser(body);
            const responseUser = _.omit(user.toObject(), ["password", "c_time", "u_time", "__v"]);

            return requestHandler.successResponseWithData(res, responseUser);

        } catch (e) {
            return requestHandler.errorResponse(req, res, e);
        }
    }

    static async login(req, res) {
        try {
            const pattern = /^[A-Za-z0-9]+(?:[ _-][A-Za-z0-9]+)*$/;
            const schema = Joi.object({
                user_name: Joi.string().required().regex(pattern).min(3),
                password: Joi.string().required().regex(pattern).min(3)
            });
            const body = req.body;
            const { error } = schema.validate(body);
            if (error) {
                requestHandler.validateJoi(error, 400, error.details[0].message);
            }

            const user = await super.login(body);
            if (!user) {
                return requestHandler.errorLogin(res);
            }
            const jwtData = _.omit(user.toObject(), ["avatar", "gender", "nick_name", "password", "active", "c_time", "u_time", "__v"]);
            const token = generateJWT(jwtData);
            const refreshToken = refreshJWT(jwtData);

            tokenList[refreshToken] = {
                status: "Logged in",
                token,
                refreshToken,
            };

            requestHandler.successLogin(res, token, refreshToken);

        } catch (e) {
            requestHandler.errorResponse(req, res, e);
        }
    }

    static async getProfile(req, res) {
        try {
            const tokenFromHeader = auth.getJwtToken(req);
            const user = jwt.decode(tokenFromHeader);
            const userProfile = await super.getUserByID(user.identity._id);
            const profile = _.omit(userProfile.toObject(), ["c_time", "u_time", "password", "__v"]);
            requestHandler.successResponseWithData(res, profile);
        } catch (err) {
            requestHandler.errorResponse(req, res, err);
        }
    }
    
}


module.exports = UsersController;
