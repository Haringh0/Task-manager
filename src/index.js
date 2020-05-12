require("dotenv").config();
require("./db/mongoose");

const express = require("express");
const userRouter = require("./routes/user");
const taskRouter = require("./routes/task");
const path = require("path");
const hbs = require("hbs");

const viewsPath = path.resolve(__dirname, "../templates/views");
const partialsPath = path.resolve(__dirname, "../templates/partials");

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.set("view engine", "hbs");
app.set("views", viewsPath);
hbs.registerPartials(partialsPath);

app.get("*", (request, response) => response.sendStatus(404));

app.listen(port, () => console.log(`Server started at ${port}`));
