const mongoose = require("mongoose");
const validator = require("validator");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const event = require("./event");

const admainSchemia = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    unique: true,
    required: true,
    trim: true,
    lowercase: true,
    validate(value) {
      if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
      }
    }
  },
  avatar: {
    type: String
  },
  password: {
    type: String,
    required: true,
    minlength: 7,
    trim: true
  },
  age: {
    type: Number,
    default: 0
  },
  type: {
    type: Number,
    required: true
  },
  tokens: [
    {
      token: {
        type: String,
        required: true
      }
    }
  ]
});

admainSchemia.virtual("events", {
  ref: "event",
  localField: "_id",
  foreignField: "owner"
});

admainSchemia.methods.toJson = function() {
  const userobject = this.toObject();
  delete userobject.password;
  delete userobject.tokens;
  return userobject;
};
admainSchemia.pre("save", async function(next) {
  const admain = this;
  if (admain.isModified("password"))
    admain.password = await bcrypt.hash(admain.password, 9);
  next();
});
admainSchemia.pre("remove", async function(next) {
  const admain = this;
  await event.deleteMany({ owner: admain._id });
  next();
});
admainSchemia.methods.generateAuthToken = async function() {
  console.log("esmail");
  const admain = this;
  const token = jwt.sign({ _id: admain._id.toString() }, "mytoken");
  admain.tokens = admain.tokens.concat({ token });
  await admain.save();
  return token;
};
admainSchemia.statics.findByCredentials = async (email, password) => {
  console.log(email);
  const admain = await Admain.findOne({ email });

  if (!admain) {
    throw new Error("admain not found");
  }
  const isMatch = await bcrypt.compare(password, admain.password);
  if (!isMatch) throw new Error("password error");
  return admain;
};
const Admain = mongoose.model("Admain", admainSchemia);
module.exports = Admain;
