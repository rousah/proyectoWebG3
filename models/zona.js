module.exports = (sequelize, DataTypes) => {
    let zona = sequelize.define("zona", {
        name: DataTypes.STRING,
        color: DataTypes.STRING,
    });

    zona.prototype.toJSON = function () {
        let values = Object.assign({}, this.get());
        delete values.createdAt;
        delete values.updatedAt;
        return values;
    };

    return zona;
};
