module.exports = (sequelize, DataTypes) => {
    let sensor = sequelize.define("sensor", {
        lng: DataTypes.FLOAT,
        mac: DataTypes.STRING,
        lat: DataTypes.FLOAT,
        temp_min: DataTypes.INTEGER,
        hume_min: DataTypes.INTEGER,
    });

    sensor.prototype.toJSON = function () {
        let values = Object.assign({}, this.get());
        delete values.createdAt;
        delete values.updatedAt;
        delete values.userId;
        return values;
    };

    return sensor;
};
