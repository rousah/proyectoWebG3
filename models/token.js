module.exports = (sequelize, DataTypes) => {
    var token = sequelize.define("token", {
        token: DataTypes.STRING,
        valid: DataTypes.DATE,
    });
    return token;
};