CREATE DATABASE IF NOT EXISTS chat;

USE chat;

CREATE TABLE rooms (
  room_id int NOT NULL,
  room_name varchar(20),
  PRIMARY KEY (room_id)
) ENGINE = InnoDB;

CREATE TABLE users (
  user_id int NOT NULL,
  user_name varchar(20),
  PRIMARY KEY (user_id)
) ENGINE = InnoDB;

CREATE TABLE messages (
  msg_id int NOT NULL,
  msg_text varchar(140),
  room_id int NOT NULL,
  user_id int NOT NULL,
  created_at TIMESTAMP,
  FOREIGN KEY (room_id) REFERENCES rooms(room_id),
  FOREIGN KEY (user_id) REFERENCES users(user_id),
  PRIMARY KEY (msg_id)
) ENGINE = InnoDB;


/*  Execute this file from the command line by typing:
 *    mysql < schema.sql
 *  to create the database and the tables.*/




