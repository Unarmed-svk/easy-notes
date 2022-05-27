const { User } = require("../models/user");
const status = require("http-status");
const { ApiError } = require("../middleware/apiError");
const userService = require("./user.service");

const createUser = async ({ email, password, firstname, lastname }) => {
  try {
    if (await User.emailTaken(email)) {
      throw new ApiError(status.BAD_REQUEST, "Sorry this email is already taken.");
    }

    const user = new User({
      email,
      password,
      firstname: firstname,
      lastname: lastname,
    });
    await user.save();
    return user;
  } catch (err) {
    throw err;
  }
};

const genAuthToken = async (user) => {
  const token = user.generateAuthToken();
  return token;
};

const signInWithEP = async (email, password) => {
  try {
    const user = await userService.findUserByEmail(email);
    if (!user) throw new ApiError(status.UNAUTHORIZED, "Sorry, bad email");
    if (!(await user.comparePassword(password)))
      throw new ApiError(status.UNAUTHORIZED, "Sorry, bad password");

    return user;
  } catch (err) {
    throw err;
  }
};

module.exports = { createUser, genAuthToken, signInWithEP };
