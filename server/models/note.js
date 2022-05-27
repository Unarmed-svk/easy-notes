const mongoose = require("mongoose");
const add = require("date-fns/add");

const noteSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      maxlength: 100,
    },
    description: {
      type: String,
      maxlength: 900,
      default: "",
    },
    category: {
      type: Number,
      default: 0,
      max: 50,
    },
    deadline: {
      type: Date,
      min: new Date(0),
      max: [
        add(new Date(), { years: 5 }),
        "Please select a deadline, that is less than 5 years in future.",
      ],
    },
    status: {
      type: String,
      enum: ["active", "completed", "deleted"],
      default: "active",
    },
  },
  { timestamps: true }
);

const Note = mongoose.model("Note", noteSchema);

module.exports = { noteSchema, Note };
