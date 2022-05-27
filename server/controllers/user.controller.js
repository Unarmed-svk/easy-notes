const status = require("http-status");
const { ApiError } = require("../middleware/apiError");
const { authService, userService, emailService } = require("../services");

const userController = {
  async profile(req, resp, next) {
    try {
      const user = await userService.findUserById(req.user._id);
      if (!user) {
        throw new ApiError(status.NOT_FOUND, "User not found");
      }
      resp.json(resp.locals.permission.filter(user._doc));
    } catch (err) {
      next(err);
    }
  },
  async updateProfile(req, resp, next) {
    try {
      const user = await userService.updateUserProfile(req, resp.locals.permission);
      resp.json(resp.locals.permission.filter(user._doc));
    } catch (err) {
      next(err);
    }
  },
  async updateUserEmail(req, resp, next) {
    try {
      const user = await userService.updateUserEmail(req);
      const token = await authService.genAuthToken(user);

      await emailService.updatedEmail(user.email, user);

      resp.cookie("x-access-token", token).send({ user, token });
    } catch (err) {
      next(err);
    }
  },
  async updateUserPassword(req, resp, next) {
    try {
      const user = await userService.updateUserPassword(req);
      resp.json(resp.locals.permission.filter(user._doc));
    } catch (err) {
      next(err);
    }
  },
  async verifyAccount(req, resp, next) {
    try {
      const token = await userService.validateToken(req.query.validation);
      const user = await userService.findUserById(token.sub);

      if (!user) throw new ApiError(status.NOT_FOUND, "Sorry user not found");
      if (user.verified) throw new ApiError(status.BAD_REQUEST, "User already verified");

      user.verified = true;
      user.save();
      resp.status(status.CREATED).send({ user });
    } catch (err) {
      next(err);
    }
  },
};

module.exports = userController;
