"use strict";

module.exports = {
    async up(queryInterface, Sequelize) {
        return queryInterface.bulkInsert(
            "DeviceGroups", [{
                    groupId: 1,
                    deviceId: 1,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    groupId: 2,
                    deviceId: 2,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    groupId: 3,
                    deviceId: 3,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    groupId: 1,
                    deviceId: 4,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    groupId: 2,
                    deviceId: 5,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    groupId: 3,
                    deviceId: 6,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    groupId: 1,
                    deviceId: 7,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    groupId: 5,
                    deviceId: 8,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    groupId: 4,
                    deviceId: 9,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    groupId: 4,
                    deviceId: 10,
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ], {}
        );
    },

    async down(queryInterface, Sequelize) {
        return queryInterface.bulkDelete("DeviceGroups", null, {});
    },
};