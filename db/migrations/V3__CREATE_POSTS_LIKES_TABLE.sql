CREATE TABLE PostLikes 
      (
        id INTEGER INDENTITY(1,1) NOT NULL PRIMARY KEY,
        PostID INT NOT NULL FOREIGN KEY REFERENCES Posts(id),
        UserName INT FOREIGN KEY REFERENCES Users(username),
      );
INSERT INTO posts (PostID, UserName)
        VALUES (6090d5139ec4f62b40e1da16, katie);

INSERT INTO posts (PostID, UserName)
        VALUES (608f54d36af7e90fe89fc3ea, katie);

INSERT INTO posts (PostID, UserName)
        VALUES (608e689c79d0602504b92e5c, katie);

INSERT INTO posts (PostID, UserName)
        VALUES (609386a550e9500015ef4681, katie);