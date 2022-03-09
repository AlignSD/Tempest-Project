const { MongoClient } = require("mongodb");
const { Client } = require("pg");

// const { getClient } = require("./get-client");
// const { exec } = require("child_process");
// const fs = require("fs");
// const _ = require("lodash");

require("dotenv").config();

const MONGODB = process.env.MONGODB; // MONGODB protected env

async function main() {
  const uri = MONGODB;

  const sourceDB = new MongoClient(uri);

  const newDB = new Client({
    host: process.env.PG_HOST,
    port: process.env.PG_PORT,
    user: process.env.PG_USER,
    password: process.env.PG_PASSWORD,
    database: process.env.PG_DATABASE,
    ssl: false,
  });

  try {
    await sourceDB.connect();
    await newDB.connect();

    await moveUsersTable(sourceDB, newDB); // finds users collection data and returns it to postgreSQL server.
    await movePostsTable(sourceDB, newDB); // finds posts collection data and returns it to postgreSQL server.
    await moveComments(sourceDB, newDB); // finds posts comments data and returns it to postgreSQL server.
    await moveLikes(sourceDB, newDB); // finds likes data and returns it to postgreSQL server.
    sourceDB.close();
  } catch (err) {
    console.error(err);
  }
}

// returns users collection data from mongo to mongoUsers variable
async function moveUsersTable(sourceDB, newDB) {
  const result = await sourceDB.db("merng").collection("users").find();

  if (result) {
    try {
      await result.forEach((user) => {
        newDB.query(
          `INSERT INTO users(username, email, createdAt)
        VALUES ('${user.username}', '${user.email}', '${user.createdAt}') ON CONFLICT DO NOTHING
      `
        );
      });
    } catch (err) {
      console.error(err);
    }
  } else {
    console.log(`No such table is found`);
  }
}

async function movePostsTable(sourceDB, newDB) {
  const result = await sourceDB.db("merng").collection("posts").find();

  if (result) {
    try {
      await result.forEach((post) => {
        newDB.query(
          `INSERT INTO posts(src_id, body, username, createdAt)
        VALUES ('${post._id}', '${post.body}', '${post.username}', '${post.createdAt}') ON CONFLICT DO NOTHING
      `
        );
      });
    } catch (err) {
      console.error(err);
    }
  } else {
    console.log(`No such table is found`);
  }
}

async function moveComments(sourceDB, newDB) {
  const result = await sourceDB.db("merng").collection("posts").find();
  /* 
    I'm using nest forloops to iterate over the comments array within our posts object. This isnt optimal I'm sure.
  */
  if (result) {
    await result.forEach((post) => {
      post.comments.forEach((comment) => {
        console.log(comment.body, comment.username);
        newDB.query(`
        INSERT INTO PostComments (PostID, body, UserName, createdAt)
        VALUES ('${post._id}', '${comment.body}', '${comment.username}', '${comment.createdAt}') ON CONFLICT DO NOTHING
        `);
      });
    });
  } else {
    console.log(`No such table is found`);
  }
}

async function moveLikes(sourceDB, newDB) {
  const result = await sourceDB.db("merng").collection("posts").find();
  /* 
    I'm using nest forloops to iterate over the likes array within our posts object. This isnt optimal I'm sure.
  */
  if (result) {
    await result.forEach((post) => {
      post.likes.forEach((like) => {
        newDB.query(`
        INSERT INTO PostLikes (PostID, username, createdAt)
        VALUES ('${post._id}', '${like.username}', '${like.createdAt}') ON CONFLICT DO NOTHING
        `);
      });
    });
  } else {
    console.log(`No such table is found`);
  }
}

main().catch(console.error);
