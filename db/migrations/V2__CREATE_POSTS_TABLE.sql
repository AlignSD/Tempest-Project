CREATE TABLE Posts 
      (
        id INTEGER GENERATED BY DEFAULT AS IDENTITY NOT NULL,
        src_id VARCHAR(100) UNIQUE NOT NULL,
        body VARCHAR(9999),
        username VARCHAR(100),
        createdAt timestamp NOT NULL DEFAULT now(),
        comments VARCHAR(9999),
        likes INT,
        PRIMARY KEY (id)
      );