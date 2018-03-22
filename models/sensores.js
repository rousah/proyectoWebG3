module.exports = (sequelize, DataTypes) => {
    var sensores = sequelize.define("sensor", {
        lng: DataTypes.STRING,
        mac: DataTypes.STRING,
        lat: DataTypes.STRING,
    });
    return sensores;
};
