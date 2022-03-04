const { MongoClient } = require("mongodb");
const { exec } = require("child_process");
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
    await createUserTable(mongoUsers); // Creates Users table and inserts flyway migration file for SQL database migration.
    await createPostTable(mongoPosts); // Creates Posts table and inserts flyway migration file for SQL database migration.
    await createPostCommentsTable(mongoPosts);
    await createPostLikesTable(mongoPosts);
    client.close(
      // Callback function that will run Flyways migration upon client.close
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
  } else {
    console.log(`No such table is found`);
  }
}

async function createUserTable(users) {
  await users;
  if (users) {
    // TODO: CHECK FOR FILENAME VERSION AND ITERATE IF NEEDED (if V1 then new file = V2)
    fs.writeFile(
      "./db/migrations/V1_CREATE_USERS_TABLE.conf",
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
        "./db/migrations/V1_CREATE_USERS_TABLE.conf",
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
      "./db/migrations/V2_CREATE_POSTS_TABLE.conf",
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
        "./db/migrations/V2_CREATE_POSTS_TABLE.conf",
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
      "./db/migrations/V3_CREATE_POSTS_LIKES_TABLE.conf",
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
          "./db/migrations/V3_CREATE_POSTS_LIKES_TABLE.conf",
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
      "./db/migrations/V4_CREATE_POSTS_COMMENTS_TABLE.conf",
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
          "./db/migrations/V4_CREATE_POSTS_COMMENTS_TABLE.conf",
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
