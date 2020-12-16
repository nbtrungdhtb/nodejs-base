const router = require("express").Router();
const userRouter = require("./usersRouter");


router.use("/users", userRouter);

module.exports = router;
