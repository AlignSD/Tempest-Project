CREATE TABLE Users 
      (
        id INTEGER INDENTITY(1,1) NOT NULL PRIMARY KEY,
        username NVARCHAR(255),
        email NVARCHAR(255),
        createdAT DATETIME NOT NULL DEFAULT GETDATE()
      );
INSERT INTO users (username, email, createdAt)
      VALUES (seed, seed@seed.com, undefined);

INSERT INTO users (username, email, createdAt)
      VALUES (validators, validators@email.com, 2021-04-17T09:48:14.511Z);

INSERT INTO users (username, email, createdAt)
      VALUES (, testuser@email.com, 2021-04-17T09:29:46.609Z);

INSERT INTO users (username, email, createdAt)
      VALUES (seconduser, validators@email.com, 2021-04-28T09:22:15.548Z);

INSERT INTO users (username, email, createdAt)
      VALUES (new2, new2@email.com, 2021-05-01T09:42:32.377Z);

INSERT INTO users (username, email, createdAt)
      VALUES (user4, user4@email.com, 2021-05-01T09:44:48.099Z);

INSERT INTO users (username, email, createdAt)
      VALUES (new3, new2@email.com, 2021-05-01T09:42:43.400Z);

INSERT INTO users (username, email, createdAt)
      VALUES (new5, new5@email.com, 2021-05-01T09:54:13.195Z);

INSERT INTO users (username, email, createdAt)
      VALUES (stuffandthings, nonono@yespls.com, 2021-05-06T06:03:09.081Z);

INSERT INTO users (username, email, createdAt)
      VALUES (new, new@email.com, 2021-05-01T09:34:05.349Z);

INSERT INTO users (username, email, createdAt)
      VALUES (katie, katie@gmail.com, 2021-05-03T01:41:55.803Z);

INSERT INTO users (username, email, createdAt)
      VALUES (mayeski, benisbump@ghail.coom, 2021-05-06T06:03:13.645Z);

INSERT INTO users (username, email, createdAt)
      VALUES (Evan, evan@gmail.com, 2021-05-06T07:20:13.908Z);