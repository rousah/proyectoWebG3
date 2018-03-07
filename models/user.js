module.exports = (sequelize, DataTypes) => {
    var user = sequelize.define("user", {
        firstname: DataTypes.STRING,
        lastname: DataTypes.STRING,
        username: DataTypes.STRING,
        email: { type: DataTypes.STRING, unique: true },
        password: DataTypes.STRING,
    });
    return user;
};