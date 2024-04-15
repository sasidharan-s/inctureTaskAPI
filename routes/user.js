const express = require("express");

/* Schema validation middleware */
const { validateParams } = require("../middleware/validation");

/* Controller files */
const { getUsers, addUser, deleteUser, getROI } = require("../controller/user");

/* Schema validation files */
const {
  getUsersSchema,
  addUserSchema,
  deleteUserSchema,
  getROISchema,
} = require("../validation/user");
const userRoutes = express.Router();

/* Routes */
userRoutes
  .route("/")
  .get(validateParams(getUsersSchema), getUsers)
  .post(validateParams(addUserSchema), addUser)
  .delete(validateParams(deleteUserSchema), deleteUser);

userRoutes.post("/getROI", validateParams(getROISchema), getROI);

module.exports = userRoutes;
