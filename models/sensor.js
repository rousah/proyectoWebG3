module.exports = (sequelize, DataTypes) => {
    var sensor = sequelize.define("sensor", {
        lng: DataTypes.STRING,
        mac: DataTypes.STRING,
        lat: DataTypes.STRING,
    });

    sensor.prototype.toJSON = function () {
        var values = Object.assign({}, this.get());
        delete values.id;
        delete values.createdAt;
        delete values.updatedAt;
        delete values.userId;
        return values;
    }

    return sensor;
};
