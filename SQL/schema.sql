sCREATE DATABASE IF NOT EXISTS chat;

USE chat;

DROP TABLE IF EXISTS messages;
DROP TABLE IF EXISTS rooms;
DROP TABLE IF EXISTS users;

CREATE TABLE IF NOT EXISTS rooms (
  room_id MEDIUMINT NOT NULL AUTO_INCREMENT,
  room varchar(20),
  PRIMARY KEY (room_id)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS users (
  user_id MEDIUMINT NOT NULL AUTO_INCREMENT,
  username varchar(20),
  PRIMARY KEY (user_id)
) ENGINE = InnoDB;

CREATE TABLE IF NOT EXISTS messages (
  msg_id MEDIUMINT NOT NULL AUTO_INCREMENT,
  message varchar(140),
  room_id int NOT NULL,
  user_id int NOT NULL,
  created_at TIMESTAMP,
  PRIMARY KEY (msg_id)
) ENGINE = InnoDB;


/*  Execute this file from the command line by typing:
 *    mysql < schema.sql
 *  to create the database and the tables.*/




