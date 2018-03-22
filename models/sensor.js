module.exports = (sequelize, DataTypes) => {
    var sensor = sequelize.define("sensor", {
        lng: DataTypes.STRING,
        mac: DataTypes.STRING,
        lat: DataTypes.STRING,
    });
    return sensor;
};
