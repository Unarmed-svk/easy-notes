const httpStatus = require("http-status");
const { ApiError } = require("../middleware/apiError");
const { User } = require("../models/user");
const jwt = require("jsonwebtoken");

const validateToken = async (token) => {
  return jwt.verify(token, process.env.DB_SECRET);
};

const findUserByEmail = async (email) => {
  return await User.findOne({ email: email });
};

const findUserById = async (_id) => {
  return await User.findById(_id);
};

const updateUserProfile = async (req, permissions) => {
  try {
    const updates = permissions.filter(req.body.data);
    const user = await User.findOneAndUpdate(
      { _id: req.user._id },
      {
        $set: {
          ...updates,
        },
      },
      { new: true }
    );
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    return user;
  } catch (err) {
    throw err;
  }
};

const updateUserEmail = async (req) => {
  try {
    if (await User.emailTaken(req.body.newemail)) {
      throw new ApiError(httpStatus.BAD_REQUEST, "Sorry this email is already taken.");
    }

    const user = await User.findOneAndUpdate(
      { _id: req.user._id, email: req.user.email },
      {
        $set: {
          email: req.body.newemail,
          verified: false,
        },
      },
      { new: true }
    );
    if (!user) {
      throw new ApiError(httpStatus.NOT_FOUND, "User not found");
    }
    return user;
  } catch (err) {
    throw err;
  }
};

const updateUserPassword = async (req) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) throw new ApiError(httpStatus.NOT_FOUND, "User not found");

    const { password, newpassword } = req.body;
    if (!(await user.comparePassword(password)))
      throw new ApiError(httpStatus.UNAUTHORIZED, "Sorry, bad password");
    if (!newpassword) throw new ApiError(httpStatus.BAD_REQUEST, "Incorrect data in request body");

    user.password = newpassword;
    return await user.save();
  } catch (err) {
    throw err;
  }
};

module.exports = {
  findUserByEmail,
  findUserById,
  updateUserProfile,
  updateUserEmail,
  updateUserPassword,
  validateToken,
};
