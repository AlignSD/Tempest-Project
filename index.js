const { MongoClient } = require("mongodb");
const fs = require("fs");
const _ = require("lodash");

require("dotenv").config();

const MONGODB = process.env.MONGODB; // MONGODB protected env

async function main() {
  let mongoUsers = []; // empty object to store users collection data from mongodb database
  let mongoPosts = []; // empty object to store posts collection data from mongodb database

  const uri = MONGODB;

  const client = new MongoClient(uri);
  try {
    await client.connect();

    await findUsersTable(client, mongoUsers); // finds users collection data and returns it to mongoUsers variable.
    await findPostsTable(client, mongoPosts); // finds posts collection data and returns it to mongoUsers variable.
    console.log(mongoPosts);

    await createUserTable(mongoUsers);
    await client.close();
  } catch (err) {
    console.error(err);
  }
}

// returns users collection data from mongo to mongoUsers variable
async function findUsersTable(client, mongoUsers) {
  const result = await client.db("merng").collection("users").find();

  if (result) {
    await result.forEach((user) => {
      mongoUsers.push({
        id: user._id,
        name: user.username,
        email: user.email,
        createdAt: user.createdAt,
      });
    });
  } else {
    console.log(`No such table is found`);
  }
}

// returns posts collection data from mongo to mongoPosts variable
async function findPostsTable(client, mongoPosts) {
  const result = await client.db("merng").collection("posts").find();

  // TODO: Figure out how to iterate through comments and likes
  if (result) {
    await result.forEach((post, idx) => {
      mongoPosts.push({
        id: post._id,
        body: post.body,
        username: post.username,
        createdAt: post.createdAt,
        comments: post.comments[0],
        likes: post.likes[0],
      });
    });
    //TODO: This is where I could write INSERTS into flyway migration file
  } else {
    console.log(`No such table is found`);
  }
}

async function createUserTable(users) {
  await users;
  if (users) {
    // TODO: CHECK FOR FILENAME VERSION AND ITERATE IF NEEDED (if V1 then new file = V2)
    fs.writeFile(
      "./db/migrations/V1_CREATE_USER_TABLE.conf",
      `CREATE TABLE users 
      (
        id INTEGER INDENTITY(1,1) NOT NULL PRIMARY KEY,
        username NVARCHAR(255),
        email NVARCHAR(255),
        createdAT DATETIME NOT NULL DEFAULT GETDATE()
      );`,

      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );
    for (let i = 0; i < users.length; i++) {
      fs.appendFile(
        "./db/migrations/V1_CREATE_USER_TABLE.conf",
        `\nINSERT INTO users (username, email, createdAt)
      VALUES (${users[i].name}, ${users[i].email}, ${users[i].createdAt});\n`,
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
    }
  }
}

async function createPostTable(posts) {
  await posts;
  if (users) {
    fs.writeFile(
      "./db/migrations/V2_CREATE_POST_TABLE.conf",
      `CREATE TABLE posts 
      (
        id INTEGER INDENTITY(1,1) NOT NULL PRIMARY KEY,
        username NVARCHAR(255),
        email NVARCHAR(255),
        createdAT DATETIME NOT NULL DEFAULT GETDATE()
      );`,

      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );
    for (let i = 0; i < posts.length; i++) {
      fs.appendFile(
        "./db/migrations/V1_CREATE_USER_TABLE.conf",
        `\nINSERT INTO posts (username, email, createdAt)
      VALUES (${posts[i].name}, ${posts[i].email}, ${posts[i].createdAt});\n`,
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
    }
  }
}
main().catch(console.error);
