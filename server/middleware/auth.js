const passport = require("passport");
const { ApiError } = require("./apiError");
const status = require("http-status");
const { roles } = require("../config/roles");

const verify = (req, resp, resolve, reject, rights) => async (err, user) => {
  if (err || !user) {
    return reject(new ApiError(status.UNAUTHORIZED, "Sorry, unauthorized request"));
  }

  req.user = user;

  if (rights.length) {
    const action = rights[0]; //create any, read any
    const resource = rights[1]; //test, profile, user
    const permission = roles.can(req.user.role)[action](resource);
    if (!permission.granted) {
      return reject(new ApiError(status.FORBIDDEN, "Sorry, you don't have enough rights"));
    }
    resp.locals.permission = permission;
  }

  resolve();
};

const auth =
  (...rights) =>
  async (req, resp, next) => {
    return new Promise((resolve, reject) => {
      passport.authenticate("jwt", { session: false }, verify(req, resp, resolve, reject, rights))(
        req,
        resp,
        next
      );
    })
      .then(() => next())
      .catch((err) => next(err));
  };

module.exports = auth;
