CREATE TABLE Posts 
      (
        id INTEGER INDENTITY(1,1) NOT NULL PRIMARY KEY,
        src_id NVARCHAR(100),
        body NVARCHAR(MAX),
        UserName NVARCHAR(100) FOREIGN KEY REFERENCES Users(username),
        createdAT DATETIME NOT NULL DEFAULT GETDATE()
      );
INSERT INTO posts (src_id, body, UserName, createdAt)
      VALUES (6079cc384f29926256e1ab04, this is a sample post, user , whocares);

INSERT INTO posts (src_id, body, UserName, createdAt)
      VALUES (60892803f431870f183fa77d, this is another post, validators , 2021-04-28T09:16:51.004Z);

INSERT INTO posts (src_id, body, UserName, createdAt)
      VALUES (608b966cdb53922c3c6a014b, Subscrition Posts num 2, validators , 2021-04-30T05:32:28.942Z);

INSERT INTO posts (src_id, body, UserName, createdAt)
      VALUES (608b9659db53922c3c6a014a, Subscrition Posts, validators , 2021-04-30T05:32:09.730Z);

INSERT INTO posts (src_id, body, UserName, createdAt)
      VALUES (608e680679d0602504b92e5a, another test, user4 , 2021-05-02T08:51:18.750Z);

INSERT INTO posts (src_id, body, UserName, createdAt)
      VALUES (608e67e879d0602504b92e59, another test, user4 , 2021-05-02T08:50:48.654Z);

INSERT INTO posts (src_id, body, UserName, createdAt)
      VALUES (608e661679d0602504b92e58, test, user4 , 2021-05-02T08:43:02.494Z);

INSERT INTO posts (src_id, body, UserName, createdAt)
      VALUES (608e684a79d0602504b92e5b, test, user4 , 2021-05-02T08:52:26.319Z);

INSERT INTO posts (src_id, body, UserName, createdAt)
      VALUES (608e698079d0602504b92e5d, testcache, user4 , 2021-05-02T08:57:36.099Z);

INSERT INTO posts (src_id, body, UserName, createdAt)
      VALUES (608f54d36af7e90fe89fc3ea, my wife has stinky feet, user4 , 2021-05-03T01:41:39.958Z);

INSERT INTO posts (src_id, body, UserName, createdAt)
      VALUES (609386a550e9500015ef4681, selectah, mayeski , 2021-05-06T06:03:17.215Z);

INSERT INTO posts (src_id, body, UserName, createdAt)
      VALUES (6090d5139ec4f62b40e1da16, test, katie , 2021-05-04T05:01:07.857Z);

INSERT INTO posts (src_id, body, UserName, createdAt)
      VALUES (608e689c79d0602504b92e5c, testcache, user4 , 2021-05-02T08:53:48.535Z);

INSERT INTO posts (src_id, body, UserName, createdAt)
      VALUES (609386aa50e9500015ef4682, Oh my days, stuffandthings , 2021-05-06T06:03:22.371Z);

INSERT INTO posts (src_id, body, UserName, createdAt)
      VALUES (609398c32e35080015fc5b05, Welcome to my app! Hope you enjoy your stay :), Evan , 2021-05-06T07:20:35.652Z);