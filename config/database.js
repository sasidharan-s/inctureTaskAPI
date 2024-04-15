const { MongoClient } = require("mongodb");
var DB = null;
var CLIENT = null;

exports.connectToDatabase = async () => {
  if (DB) return DB;

  try {
    let url = process.env.DATABASE_URL;

    const client = new MongoClient(url);
    await client.connect();

    CLIENT = client;
    DB = client.db(process.env.DATABASE);

    console.log("Database connected successfully");
  } catch (err) {
    console.log(err.message);
    DB = null;
    CLIENT = null;
    throw new Error(err.message);
  }
};

exports.getDatabase = () => {
  return DB;
};

exports.getClient = () => {
  return CLIENT;
};
