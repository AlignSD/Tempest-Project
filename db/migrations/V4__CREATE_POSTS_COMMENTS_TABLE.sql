CREATE TABLE PostComments 
      (
        id INTEGER INDENTITY(1,1) NOT NULL PRIMARY KEY,
        PostID INT NOT NULL FOREIGN KEY REFERENCE Post(id),
        body NVARCHAR(MAX),
        UserName NVARCHAR(100) FOREIGN KEY REFERENCES users(username),
        createdAT DATETIME NOT NULL DEFAULT GETDATE()
      );
INSERT INTO posts (PostID, body, UserName, createdAt)
              VALUES (609386a550e9500015ef4681, boh, katie , 2021-05-06T06:03:34.950Z);

INSERT INTO posts (PostID, body, UserName, createdAt)
              VALUES (6079cc384f29926256e1ab04, test, katie , 2021-05-04T09:07:29.278Z);