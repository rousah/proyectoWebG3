module.exports = (sequelize, DataTypes) => {
    let dato = sequelize.define("dato", {
        temperatura: DataTypes.DECIMAL,
        humedad: DataTypes.DECIMAL,
        tiempo: DataTypes.TIME,
    });

    dato.prototype.toJSON = function () {
        let values = Object.assign({}, this.get());
        delete values.createdAt;
        delete values.updatedAt;
        delete values.sensorId;
        return values;
    };

    return dato;
};
