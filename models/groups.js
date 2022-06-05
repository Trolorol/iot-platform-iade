"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Groups extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            Groups.belongsTo(models.User, {
                foreignKey: "userId",
            });
            Groups.belongsToMany(models.Device, {
                foreignKey: "groupId",
                through: "DeviceGroups",
                as: "device",
            });
        }
    }
    Groups.init({
        name: DataTypes.STRING,
        status: DataTypes.ENUM("active", "inactive"),
    }, {
        sequelize,
        modelName: "Groups",
    });
    return Groups;
};