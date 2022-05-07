const { User, Device } = require('./models')
const Sequelize = require('sequelize');
const Op = Sequelize.Op

// Find all users with their associated devices
// Raw SQL: SELECT * FROM "Users" JOIN "Devices" ON "Devices"."userId" = "Users".id;

const findAllWithDevices = async () => {
    const users = await User.findAll({
        attributes: ['id', 'firstName'],
        include: [{
            model: Device,
            where: {status:'inactive'}
        }],
    });
    console.log("All users with their associated devices:", JSON.stringify(users, null, 4));
}

const run = async () => {
    await findAllWithDevices()
    await process.exit()
}

run()