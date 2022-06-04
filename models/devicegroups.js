"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class DeviceGroups extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      DeviceGroups.belongsTo(models.Device, {
        foreignKey: "deviceId",
        as: "device",
      });
      DeviceGroups.belongsTo(models.Groups, {
        foreignKey: "groupId",
        as: "group",
      });
    }
  }
  DeviceGroups.init(
    {
      groupId: DataTypes.INTEGER,
      deviceId: DataTypes.INTEGER,
    },
    {
      sequelize,
      modelName: "DeviceGroups",
    }
  );
  return DeviceGroups;
};
