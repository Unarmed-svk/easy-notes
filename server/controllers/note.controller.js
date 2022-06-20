const { AccessControl } = require("accesscontrol");
const httpStatus = require("http-status");
const { ApiError } = require("../middleware/apiError");
const { noteService, userService } = require("../services");

const responseFilter = ["notes", "notesCreated", "notesCompleted", "notesDeleted"];

const noteController = {
  async getNotes(req, resp, next) {
    try {
      const user = await userService.findUserById(req.user._id);
      if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");
      resp.json(resp.locals.permission.filter(user._doc));
    } catch (err) {
      next(err);
    }
  },
  async createNote(req, resp, next) {
    try {
      const user = await noteService.createNote(req);
      resp.json(AccessControl.filter(user._doc, responseFilter));
    } catch (err) {
      next(err);
    }
  },
  async changeStatus(req, resp, next) {
    try {
      const user = await noteService.changeNoteStatus(req);
      resp.json(AccessControl.filter(user._doc, responseFilter));
    } catch (err) {
      next(err);
    }
  },

  // async completeNote(req, resp, next) {
  //   try {
  //     const user = await noteService.changeNoteStatus(req, "completed");
  //     resp.json(resp.locals.permission.filter(user._doc));
  //   } catch (err) {
  //     next(err);
  //   }
  // },
  // async trashNote(req, resp, next) {
  //   try {
  //     const user = await noteService.changeNoteStatus(req, "deleted");
  //     resp.json(resp.locals.permission.filter(user._doc));
  //   } catch (err) {
  //     next(err);
  //   }
  // },

  async deleteNote(req, resp, next) {
    try {
      const user = await noteService.deleteNote(req);
      resp.json(AccessControl.filter(user._doc, responseFilter));
    } catch (err) {
      next(err);
    }
  },
};

module.exports = noteController;
