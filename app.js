/* Loading .env configuration file */
require("dotenv").config();

/* Initial imports */
const express = require("express");
const cors = require("cors");
const path = require("path");

/* Database module */
const { connectToDatabase } = require("./config/database");

/* Constants */
const { INTERNAL_SERVER_ERROR, FAILED } = require("./config/constants");

/* CORS */
const app = express();
app.use(cors());

/* Express JSON middleware */
app.use(express.json());

/* Server static files */
app.use(
  "/public/pdf",
  express.static(path.join(__dirname, "public/pdf"), {
    setHeaders: (res, filePath) => {
      res.setHeader("Content-Disposition", "attachment");
    },
  })
);

/* Routes modules */
const userRoutes = require("./routes/user");

app.use("/user", userRoutes);

/* Error handling middleware */
app.use((err, req, res, next) => {
  return res.send({
    status: INTERNAL_SERVER_ERROR,
    message: "Internal server error",
    data: [],
    error: {},
  });
});

/* Catch all routes */
app.all("*", (req, res) => {
  res.send({
    status: FAILED,
    message: "Invalid Request",
  });
});

/* Connect to database and spinoff the server */
connectToDatabase()
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server is listening on PORT ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
    process.exit();
  });
