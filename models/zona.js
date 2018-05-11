module.exports = (sequelize, DataTypes) => {
    let zona = sequelize.define("zona", {
        name: DataTypes.STRING,
        color: DataTypes.STRING,
        temp_max: DataTypes.INTEGER,
        temp_min: DataTypes.INTEGER,
        hume_min: DataTypes.INTEGER,
    });

    zona.prototype.toJSON = function () {
        let values = Object.assign({}, this.get());
        delete values.createdAt;
        delete values.updatedAt;
        return values;
    };

    return zona;
};
