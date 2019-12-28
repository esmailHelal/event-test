const express = require("express");
const Admain = require("../models/admain");
const auth = require("../middelwire/authadmain");
const multer = require("multer");
const storage1 = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function(req, file, cb) {
    cb(null, new Date().getDay().toString() + file.originalname);
  }
});

const upload = multer({
  storage: storage1,
  limits: { fileSize: 1024 * 1024 * 5 },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|tif|png)$/))
      return cb(new Error("image error"));
    cb(undefined, true);
  }
});
//const sharp = require("sharp");

const router = new express.Router();
router.post("/admain", upload.single("avatar"), async (req, res) => {
  const admains = new Admain({
    name: req.body.name,
    email: req.body.email,
    password: req.body.password,
    age: req.body.age,
    type: req.body.type,
    avatar: req.file.path
  });

  try {
    await admains.save();
    const token = await admains.generateAuthToken();
    res.status(200).send({ admains, token });
  } catch (e) {
    res.send(e.message);
  }
});

/*
const upload = multer({
  limits:{fileSize:10000},
  fileFilter(req,file,cb){
    if(!file.originalname.match(/\.(jpg|tif|png)$/))return cb(new Error('image error'))
    cb(undefined,true)
  }
})
router.post("/users/avatar",auth,upload.single('avatar'),async(req,res)=>{
  const buffer=await sharp(req.file.buffer).resize({width:360,height:250}).toBuffer()
   req.user.avatar=buffer
})*/
router.post("/admain/login", async (req, res) => {
  console.log(req.body.email);
  try {
    const admain = await Admain.findByCredentials(
      req.body.email,
      req.body.password
    );
    const token = await admain.generateAuthToken();
    res.send({ admain, token });
  } catch (e) {
    res.send(e.message);
  }
});
router.get("/admain/myprofile", auth, async (req, res) => {
  res.send(req.admain);
});
router.post("/admain/logoutAll", auth, async (req, res) => {
  try {
    req.admain.tokens = [];
    await req.admin.save();
    res.send();
  } catch (e) {
    res.send(e);
  }
});
router.post("/admain/logout", auth, async (req, res) => {
  try {
    req.admain.tokens = req.admain.tokens.filter(tok => {
      return tok.token != req.token;
    });
    await req.admain.save();
    res.send();
  } catch (e) {
    res.send(e);
  }
});

router.delete("/admain", auth, async (req, res) => {
  try {
    // user= User.findOne({_id: req.params._id})
    console.log();
    if (req.admain.type == 0) {
      console.log("eah");
      await req.admain.remove();
    } else {
      throw new Error("you can't do this");
    }
    res.send("you can't do this");
  } catch (e) {
    res.send(e.message);
  }
});
/*
router.patch("/user/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowed = ["name", "email"];

  var isvalid = updates.every(update => allowed.includes(update));
  console.log(isvalid);
  if (!isvalid) res.send("cann't update ");

  try {
    const user = await User.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!user) return res.send("not found");
    res.send(user);
  } catch (e) {
    res.send(e);
  }
});*/

module.exports = router;
