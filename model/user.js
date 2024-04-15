const { getDatabase } = require("../config/database");
const COLLECTIONS = require("../config/collections.json");
const { PDF_LOCATION } = require("../config/constants");

/* Get all data */
exports.getUsers = async ({ filter, page: skip, pageSize: limit }) => {
  let DB = getDatabase();
  let usersCollection = await DB.collection(COLLECTIONS.USER);

  let match = {
    status: "A",
  };

  if (filter) {
    match["name"] = { $regex: new RegExp(filter), $options: "ix" };
  }

  let response = await usersCollection
    .find(match)
    .project({
      name: 1,
      companyName: 1,
      email: 1,
      _id: 1,
      invoices: 1,
      teamSize: 1,
      accountantSalary: 1,
      ROIPercentage: 1,
      savings: 1,
      savingsPerentage: 1,
      invoice: 1,
      createdAt: 1,
    })
    .sort({ createdAt: -1 })
    .skip(+skip)
    .limit(+limit)
    .toArray();

  let totalUsers = await usersCollection.countDocuments(match);
  return { users: response, totalUsers, url: PDF_LOCATION };
};

/* Insert user */
exports.insertUser = async (user) => {
  let DB = getDatabase();
  let usersCollection = await DB.collection(COLLECTIONS.USER);
  let response = await usersCollection.insertOne(user);
  return response && response?.insertedId;
};

/* Delete user */
exports.deleteUser = async (id) => {
  let DB = getDatabase();
  let usersCollection = await DB.collection(COLLECTIONS.USER);
  let response = await usersCollection.deleteOne({ _id: id });
  return response && response?.deletedCount;
};
