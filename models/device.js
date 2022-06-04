"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Device extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     *
     *
     */
    static associate(models) {
      Device.belongsTo(models.User, {
        foreignKey: "userId",
        onDelete: "CASCADE",
      });
      Device.belongsToMany(models.Groups, {
        foreignKey: "deviceId",
        through: "DeviceGroups",
        as: "groups",
      });
    }
  }
  Device.init(
    {
      name: DataTypes.STRING,
      userId: DataTypes.INTEGER,
      serial_number: DataTypes.STRING,
      status: DataTypes.ENUM("active", "inactive", "sensor"),
    },
    {
      sequelize,
      modelName: "Device",
    }
  );
  return Device;
};
