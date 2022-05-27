const express = require("express");
const app = express();
require("dotenv").config();
const mongoose = require("mongoose");
const xss = require("xss-clean");
const mongoSanitize = require("express-mongo-sanitize");
const routes = require("./routes");
const passport = require("passport");
const { jwtStrategy } = require("./middleware/passport");

const { handleError, handleUnrecognisedError } = require("./middleware/apiError");

const mongoUri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_HOST}?retryWrites=true&w=majority`;

mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

//  Body parser
app.use(express.json());

//  Sanitize
app.use(xss());
app.use(mongoSanitize());

//  Passport
app.use(passport.initialize());
passport.use("jwt", jwtStrategy);

//  Routes
app.use("/api", routes);

//  Handle Errors
app.use(handleUnrecognisedError);
app.use((err, req, resp, next) => {
  handleError(err, resp);
});

app.use(express.static("client/build"));
if (process.env.NODE_ENV === "production") {
  const path = require("path");
  app.get("/*", (req, resp) => {
    resp.sendFile(path.resolve(__dirname, "../client", "build", "index.html"));
  });
}

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port: ${PORT}`);
});
