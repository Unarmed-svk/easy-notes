const { authService, emailService } = require("../services");
const status = require("http-status");

const authController = {
  async register(req, resp, next) {
    try {
      const userData = req.body;
      const user = await authService.createUser(userData);
      const token = await authService.genAuthToken(user);

      // await emailService.registerEmail(email, user);

      resp.cookie("x-access-token", token).status(status.CREATED).send({ user, token });
    } catch (err) {
      next(err);
    }
  },
  async signin(req, resp, next) {
    try {
      const { email, password } = req.body;
      const user = await authService.signInWithEP(email, password);
      const token = await authService.genAuthToken(user);

      resp.cookie("x-access-token", token).send({ user, token });
    } catch (err) {
      next(err);
    }
  },
  async isauth(req, resp) {
    resp.json(req.user);
  },
};

module.exports = authController;
