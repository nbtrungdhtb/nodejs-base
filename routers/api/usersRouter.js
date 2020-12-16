const router = require("express").Router();
const usersController = require("../../app/users/UsersController");
const auth = require("../../utils/auth");


router.post("/", usersController.registerUser);
router.post("/login", usersController.login);
router.get("/me", auth.isAuthenticated, usersController.getProfile);


module.exports = router;
