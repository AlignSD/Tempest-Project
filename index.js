const { MongoClient } = require("mongodb");
const { Client } = require("pg");

const { getClient } = require("./get-client");
const { exec } = require("child_process");
const fs = require("fs");
const _ = require("lodash");

require("dotenv").config();

const MONGODB = process.env.MONGODB; // MONGODB protected env

async function main() {
  // let mongoUsers = []; // empty object to store users collection data from mongodb database
  let mongoPosts = []; // empty object to store posts collection data from mongodb database

  const uri = MONGODB;

  const sourceDB = new MongoClient(uri);

  const newDB = new Client({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    ssl: true,
  });

  try {
    await sourceDB.connect();
    await newDB.connect();

    await moveUsersTable(sourceDB, newDB); // finds users collection data and returns it to mongoUsers variable.
    await findPostsTable(sourceDB, mongoPosts); // finds posts collection data and returns it to mongoUsers variable.
    await createUserTable(mongoUsers, newDB); // Creates Users table and inserts flyway migration file for SQL database migration.
    await createPostTable(mongoPosts, newDB); // Creates Posts table and inserts flyway migration file for SQL database migration.
    await createPostCommentsTable(mongoPosts, newDB);
    await createPostLikesTable(mongoPosts.newDB);
    sourceDB.close(
      // Callback function that will run Flyways migration upon sourceDB.close
      exec("flyway migrate", (err, stdout, stderr) => {
        if (err) {
          console.error(err);
        } else {
          console.log(`stdout: ${stdout}`);
          console.log(`stderr: ${stderr}`);
        }
      })
    );

    // This automatically runs flyway migration at the end of the migration
  } catch (err) {
    console.error(err);
  }
}

// returns users collection data from mongo to mongoUsers variable
async function moveUsersTable(sourceDB, newDB) {
  const result = await sourceDB.db("merng").collection("users").find();

  if (result) {
    await data.forEach((user) => {
      newDB.query(
        `INSERT INTO users (username, email, createdAt)
        Values (${user.username}, ${user.email}, ${user.createdAt})
      `
      );
    });
  } else {
    console.log(`No such table is found`);
  }
}

// async function postUsers(data) {
//   if (data) {
//     await data.forEach((user) => {
//       newDB.query(
//         `INSERT INTO users (username, email, createdAt)
//         Values (${user.username}, ${user.email}, ${user.createdAt})
//       `
//       );
//     });
//   }
// }

// returns posts collection data from mongo to mongoPosts variable
async function findPostsTable(sourceDB, mongoPosts) {
  const result = await sourceDB.db("merng").collection("posts").find();

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
  } else {
    console.log(`No such table is found`);
  }
}

async function createUserTable(users) {
  await users;
  if (users) {
    // TODO: CHECK FOR FILENAME VERSION AND ITERATE IF NEEDED (if V1 then new file = V2)
    fs.writeFile(
      "./db/migrations/V1__CREATE_USERS_TABLE.sql",
      `CREATE TABLE Users 
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
        "./db/migrations/V1__CREATE_USERS_TABLE.sql",
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

// TODO: because im not passing a userId as a key in the mongo side I'm unable to use it as a foreign key so we use username instead.
async function createPostTable(posts) {
  await posts;
  if (posts) {
    fs.writeFile(
      "./db/migrations/V2__CREATE_POSTS_TABLE.sql",
      `CREATE TABLE Posts 
      (
        id INTEGER INDENTITY(1,1) NOT NULL PRIMARY KEY,
        src_id NVARCHAR(100),
        body NVARCHAR(MAX),
        UserName NVARCHAR(100) FOREIGN KEY REFERENCES Users(username),
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
        "./db/migrations/V2__CREATE_POSTS_TABLE.sql",
        `\nINSERT INTO posts (src_id, body, UserName, createdAt)
      VALUES (${posts[i].id}, ${posts[i].body}, ${posts[i].username} , ${posts[i].createdAt});\n`,
        (err) => {
          if (err) {
            console.log(err);
          }
        }
      );
    }
  }
}

async function createPostLikesTable(posts) {
  await posts;
  if (posts) {
    fs.writeFile(
      "./db/migrations/V3__CREATE_POSTS_LIKES_TABLE.sql",
      `CREATE TABLE PostLikes 
      (
        id INTEGER INDENTITY(1,1) NOT NULL PRIMARY KEY,
        PostID INT NOT NULL FOREIGN KEY REFERENCES Posts(id),
        UserName INT FOREIGN KEY REFERENCES Users(username),
      );`,

      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );
    for (let i = 0; i < posts.length; i++) {
      if (posts[i].likes) {
        fs.appendFile(
          "./db/migrations/V3__CREATE_POSTS_LIKES_TABLE.sql",
          `\nINSERT INTO posts (PostID, UserName)
        VALUES (${posts[i].id}, ${posts[i].likes.username});\n`,
          (err) => {
            if (err) {
              console.log(err);
            }
          }
        );
      }
    }
  }
}

// TODO: using 0 index for comments temporarily, need to figure out how to map through all comments on a post.
async function createPostCommentsTable(posts) {
  await posts;
  if (posts) {
    fs.writeFile(
      "./db/migrations/V4__CREATE_POSTS_COMMENTS_TABLE.sql",
      `CREATE TABLE PostComments 
      (
        id INTEGER INDENTITY(1,1) NOT NULL PRIMARY KEY,
        PostID INT NOT NULL FOREIGN KEY REFERENCE Post(id),
        body NVARCHAR(MAX),
        UserName NVARCHAR(100) FOREIGN KEY REFERENCES users(username),
        createdAT DATETIME NOT NULL DEFAULT GETDATE()
      );`,

      (err) => {
        if (err) {
          console.log(err);
        }
      }
    );

    for (let i = 0; i < posts.length; i++) {
      // check if post has comments
      if (posts[i].comments) {
        fs.appendFile(
          "./db/migrations/V4__CREATE_POSTS_COMMENTS_TABLE.sql",
          `\nINSERT INTO posts (PostID, body, UserName, createdAt)
              VALUES (${posts[i].id}, ${posts[i].comments.body}, ${posts[i].comments.username} , ${posts[i].comments.createdAt});\n`,
          (err) => {
            if (err) {
              console.log(err);
            }
          }
        );
      }
    }
  }
}
main().catch(console.error);
