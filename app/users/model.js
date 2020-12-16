const userModel = require("../../models/Users");
const {hashPassword, checkHashPassword} = require("../../utils/helpers");


class UserModel {
    static async findUserByUserName(userName) {
        const result = await userModel.findOne({user_name: userName});
        return !!result;

    }

    static async createUser(payload) {
        try {
            payload.password = await hashPassword(payload.password);
            const user = new userModel(payload);
            return await user.save();
        } catch (e) {
            return Promise.reject(e);
        }
    }

    static async getUserByID(id) {
        try {
            const profile = await userModel.findOne({_id: id});
            if (!profile) {
                return null;
            }
            return profile;
        } catch (e) {
            return Promise.reject("Something went wrong");
        }
    }

    static async login(payload) {
        try {
            const user = await userModel.findOne({user_name: payload.user_name});
            if (!user) {
                return null;
            }
            const isValid = await checkHashPassword(payload.password, user);

            if (!isValid) {
                return null;
            }

            return user;

        } catch (e) {
            return Promise.reject("Something went wrong");
        }
    }

}

module.exports = UserModel;
