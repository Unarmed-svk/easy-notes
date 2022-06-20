const express = require("express");
const authRoute = require("./auth.route");
const userRoute = require("./user.route");
const noteRoute = require("./note.route");
const router = express.Router();

const routesIndex = [
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/user",
    route: userRoute,
  },
  {
    path: "/note",
    route: noteRoute,
  },
];

routesIndex.forEach((route) => {
  router.use(route.path, route.route);
});

module.exports = router;
