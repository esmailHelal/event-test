const express = require("express");
const Event = require("../models/event");
const auth = require("../middelwire/authadmain");
const router = new express.Router();

router.post("/event", auth, async (req, res) => {
  const event = new Event({ ...req.body, owner: req.admain._id });
  try {
    if (req.admain.type == 0) {
      await event.save();
      res.send(event);
    } else {
      res.send("you should superadmain");
    }
  } catch (e) {
    console.log(e);
  }
});
router.get("/event", auth, async (req, res) => {
  const event = await Event.find({ owner: req.user._id }).sort({
    description: 1
  });
  res.send(event);
});
router.patch("/event/:id", auth, async (req, res) => {
  const updates = Object.keys(req.body);
  const allowed = ["title", "description"];

  var isvalid = updates.every(update => allowed.includes(update));
  console.log(isvalid);
  if (!isvalid) res.send("cann't update ");

  try {
    if (req.admain.type == 0) {
      const user = await Event.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
      });

      if (!user) return res.send("not found");
      res.send(user);
    } else {
      throw new Error("you should superadmain");
    }
  } catch (e) {
    res.send(e.message);
  }
});
/*
router.patch("/event/:id", async (req, res) => {
  const updates = Object.keys(req.body);
  const allowed = ["title", "description"];

  var isvalid = updates.every(update => allowed.includes(update));
  console.log(isvalid);
  if (!isvalid) res.send("cann't update ");

  try {
    const user = await Event.findByIdAndUpdate(req.params.id, req.body, {
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
