require("dotenv").config();
require("./db/mongoose");

const express = require("express");
const userRouter = require("./routes/user");
const taskRouter = require("./routes/task");

const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(userRouter);
app.use(taskRouter);

app.get("*", (request, response) => response.sendStatus(404));

app.listen(port, () => console.log(`Server started at ${port}`));
