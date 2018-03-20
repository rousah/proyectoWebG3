module.exports = (sequelize, DataTypes) => {
    var sensor = sequelize.define("sensor", {
        lng: DataTypes.BIGDECIMAL,
        mac: DataTypes.STRING,
        lat: DataTypes.BIGDECIMAL,
    });
    return sensor;
};
