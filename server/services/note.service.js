const httpStatus = require("http-status");
const { ApiError } = require("../middleware/apiError");
const { User } = require("../models/user");

const findNoteById = async (user, _id) => {
  return await user.notes.id(_id);
};

const findAndRemoveById = async (user, _id) => {
  return await user.notes.pull(_id);
};

const createNote = async (req) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    const newNote = req.body.note;
    if (!newNote || !newNote.title)
      throw new ApiError(httpStatus.BAD_REQUEST, "Incorrect data in request body");

    user.notes.push({
      title: newNote.title,
      description: newNote.description,
      category: newNote.category,
      deadline: newNote.deadline,
    });
    return await user.save();
  } catch (err) {
    throw err;
  }
};

const changeNoteStatus = async (req) => {
  try {
    const { user, note } = await getUserAndNote(req.user._id, req.params.id);
    const newStatus = req.body.newstatus;
    if (!newStatus) throw new ApiError(httpStatus.BAD_REQUEST, "Note status is missing");
    note.status = newStatus;

    return await user.save();
  } catch (err) {
    throw err;
  }
};

const deleteNote = async (req) => {
  try {
    const { user, note } = await getUserAndNote(req.user._id, req.params.id);
    note.remove();

    return await user.save();
  } catch (err) {
    throw err;
  }
};

const getUserAndNote = async (userId, noteId) => {
  try {
    const user = await User.findById(userId);
    if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    const note = await user.notes.id(noteId);
    if (!note) throw new ApiError(httpStatus.NOT_FOUND, "Note not found");

    return { user, note };
  } catch (err) {
    throw err;
  }
};

module.exports = { createNote, deleteNote, changeNoteStatus, findNoteById, findAndRemoveById };
