const jwt = require("jsonwebtoken");
const Admain = require("../models/admain");
const auth = async (req, res, next) => {
  try {
    //ejfddsffdfdfdd    Bearer ejf
    console.log("l2a");
    const token = req.header("Authorization").replace("Bearer ", "");
    console.log(token);
    const decoded = jwt.verify(token, "mytoken");
    const admain = await Admain.findOne({
      _id: decoded._id,
      "tokens.token": token
    });
    if (!admain) throw new Error();
    req.token = token;
    req.admain = admain;
    next();
  } catch (e) {
    res.send({ error: "unauthorized" });
  }
};
module.exports = auth;
