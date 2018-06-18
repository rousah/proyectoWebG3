module.exports = (sequelize, DataTypes) => {
    var user = sequelize.define("user", {
        firstname: DataTypes.STRING,
        lastname: DataTypes.STRING,
        email: {
            type: DataTypes.STRING,
            unique: true
        },
        password: DataTypes.STRING,
        sex: DataTypes.STRING,
        country: DataTypes.STRING,
        city: DataTypes.STRING,
        zip: DataTypes.STRING,
        street: DataTypes.STRING,
        telephone: DataTypes.STRING,
        force_password_change: DataTypes.BOOLEAN,
        alerts: DataTypes.BOOLEAN,
        /*activo: DataTypes.STRING,
        rol: DataTypes.STRING,*/

    });

    user.prototype.toJSON = function () {
        var values = Object.assign({}, this.get());
        delete values.password;
        return values;
    };
    return user;
};
