const { MongoClient } = require("mongodb");

require("dotenv").config();

// create connections to mongodb database (express?)

const MONGODB = process.env.MONGODB;

async function main() {
  let mongoUsers = {}; // empty object to store users collection data from mongodb database
  let mongoPosts = {}; // empty object to store posts collection data from mongodb database
  const uri = MONGODB;

  const client = new MongoClient(uri);
  try {
    await client.connect();

    // await listDatabases(client);
    await findUsersTable(client, mongoUsers); // finds users collection data and returns it to mongoUsers variable.
    await findPostsTable(client, mongoPosts); // finds posts collection data and returns it to mongoUsers variable.
    console.log("mongoUsers", mongoUsers);
    console.log("mongoPosts", mongoPosts);
  } catch (err) {
    console.error(err);
  }
}

// returns users collection data from mongo to mongoUsers variable
async function findUsersTable(client, mongoUsers) {
  const result = await client.db("merng").collection("users").find();

  // TODO: either find a way to write to object or input straight into flyway migration
  if (result) {
    // result.forEach((user) => {
    //   return console.log({
    //     id: user._id,
    //     name: user.username,
    //     email: user.email,
    //     createdAt: user.createdAt,
    //   });
    // });
    await result.forEach((user) => {
      mongoUsers[user._id] = {
        id: user._id,
        name: user.username,
        email: user.email,
        createdAt: user.createdAt,
      };
    });
    return await mongoUsers;
    //TODO: This is where I could write INSERTS into flyway migration file
  } else {
    console.log(`No such table is found`);
  }
}

// returns posts collection data from mongo to mongoPosts variable
async function findPostsTable(client, mongoPosts) {
  const result = await client.db("merng").collection("posts").find();
  let idx = 0;

  if (result) {
    await result.forEach((post) => {
      for (let i = 0; i < post.comments.length; i++) {
        idx += i;
      }
      mongoPosts[post._id] = {
        id: post._id,
        body: post.body,
        username: post.username,
        createdAt: post.createdAt,
        comments: post.comments[idx],
        likes: post.likes[0],
      };
    });
    return await mongoPosts;
    //TODO: This is where I could write INSERTS into flyway migration file
  } else {
    console.log(`No such table is found`);
  }
}
main().catch(console.error);
// create connection to flyway database (using filepath)

// pull data for users from mongo database and store in an object
// const mongodbUsers =

// const users = {
//   id: "SELECT users.id FROM users",
//   username: "SELECT users.username FROM users",
//   email: "SELECT users.email FROM users",
//   createdAt: "SELECT users.createdAt FROM users"
// }

// // Create Table and insert object into new flyway migration
// CREATE TABLE users (
//   ID INT IDENTITY(1, 1) NOT NULL PRIMARY KEY,
//   username NVARCHAR(200),
//   email NVARCHAR(200),
//   createdAt DATETIME NOT NULL DEFAULT GETDATE(),
// )

// for(each user in users) {
//   INSERT INTO users(username, email, createdAt) VALUES(users.username, users.email, users.createdAt)
// }
