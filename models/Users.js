const mongoose = require("mongoose");
const moment = require("moment");
const {getUid} = require("../utils/helpers");


const UserSchema = new mongoose.Schema({
    _id: {type: String, default: getUid},
    full_name: {type: String, required: true},
    user_name: {type: String, required: true, unique: true},
    avatar: {type: String, default: null},
    email: {type: String, default: null, unique: true},
    gender: {type: Number, default: null},
    nick_name: {type: String, default: null},
    password: {type: String, required: true},
    active: {type: Boolean, default: true},
    c_time: {type: String, default: moment().toISOString(true)},
    u_time: {type: String, default: moment().toISOString(true)}
});

// Virtual for user's full name
// UserSchema
//     .virtual("full_name")
//     .get(function () {
//         return `${this.first_name} ${this.last_name}`;
//     });


module.exports = mongoose.model("Users", UserSchema);
