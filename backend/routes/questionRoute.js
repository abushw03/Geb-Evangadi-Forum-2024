const router = require("express").Router();

//Question controllers
const { postQuestion, getAllQuestions, getSingleQuestion} = require("../controllers/questionController");

//auth Middleware
const {authMiddleware} = require("../middlewares/authMiddleware");

//All Questions route
router.get("/", authMiddleware, getAllQuestions);

//Single Question route
router.get("/:question_id", authMiddleware, getSingleQuestion);

// Post a Question route
router.post("/", authMiddleware, postQuestion);

module.exports = router;
