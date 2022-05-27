const express = require("express");
const router = express.Router();
const userController = require("../controllers/user.controller");
const auth = require("../middleware/auth");

router
  .route("/profile")
  .get(auth("readOwn", "profile"), userController.profile)
  .patch(auth("updateOwn", "profile"), userController.updateProfile);

router.patch("/email", auth("updateOwn", "profile"), userController.updateUserEmail);
router.patch("/password", auth("updateOwn", "profile"), userController.updateUserPassword);
router.get("/verify", userController.verifyAccount);

module.exports = router;
