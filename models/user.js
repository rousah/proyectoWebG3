module.exports = (sequelize, DataTypes) => {
  var user = sequelize.define("user", {
    firstname: DataTypes.STRING,
    lastname: DataTypes.STRING,
    email: { type: DataTypes.STRING, unique: true },
    password: DataTypes.STRING,
    sex: DataTypes.STRING,
    country: DataTypes.STRING,
    city: DataTypes.STRING,
    zip: DataTypes.STRING,
    street: DataTypes.STRING,
    telephone: DataTypes.STRING,
  });
  return user;
};