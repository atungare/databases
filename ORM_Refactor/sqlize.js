var Sequelize = require("sequelize");
var sequelize = new Sequelize("chat", "root", "", {dialect:'mysql', port:3306});

exports.User = sequelize.define('User', {
  username: Sequelize.STRING,
  user_id: { type: Sequelize.BIGINT, primaryKey: true, allowNull: false, autoIncrement:true}
});

exports.Message = sequelize.define('Message', {
  user_id: Sequelize.BIGINT,
  room_id: Sequelize.BIGINT,
  message: Sequelize.STRING,
  msg_id: { type: Sequelize.BIGINT, primaryKey: true, allowNull: false, autoIncrement:true}
});

exports.Room = sequelize.define('Room', {
  room_id: { type: Sequelize.BIGINT, primaryKey: true, allowNull: false, autoIncrement:true},
  room: Sequelize.STRING
});
