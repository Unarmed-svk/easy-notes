const express = require("express");
const noteController = require("../controllers/note.controller");
const auth = require("../middleware/auth");
const router = express.Router();

router.get("/all", auth("readOwn", "notes"), noteController.getNotes);
router.patch("/status/:id", auth("updateOwn", "notes"), noteController.changeStatus);
// router.patch("/complete/:id", auth("updateOwn", "notes"), noteController.completeNote);
// router.delete("/trash/:id", auth("deleteOwn", "notes"), noteController.trashNote);
router.delete("/:id", auth("deleteOwn", "notes"), noteController.deleteNote);
router.post("/new", auth("updateOwn", "notes"), noteController.createNote);

module.exports = router;
