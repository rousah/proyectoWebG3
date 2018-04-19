module.exports = (sequelize, DataTypes) => {
    let vertice = sequelize.define("vertice", {
        lng: DataTypes.FLOAT,
        orden: DataTypes.INTEGER,
        lat: DataTypes.FLOAT,
    });

    vertice.prototype.toJSON = function () {
        let values = Object.assign({}, this.get());
        delete values.createdAt;
        delete values.updatedAt;
        return values;
    };

    return vertice;
};
