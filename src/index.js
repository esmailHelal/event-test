const express = require("express");
require("../db/mongoose");
const usersRouter = require("../routers/admain");
const articleRouter = require("../routers/event");

const app = express();
const port = process.env.PORT || 3000;
app.use(express.json());

app.use(usersRouter);
app.use(articleRouter);
app.listen(port, () => {
    console.log("server up on ", port);
  });