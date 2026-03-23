const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const mongoose = require("mongoose");
const router = require("./routes");
const app = express();

app.use(
  cors({
    origin: "http://localhost:3001",
    credentials: true,
  }),
);

app.use(express.json());
app.use(cookieParser());
app.use("/", router);

const port = process.env.PORT || 5000;
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to Database"))
  .catch((err) => console.log(err));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
