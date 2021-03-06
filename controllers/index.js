const { User, Device, Groups, DeviceGroups } = require("../models");
const mqttHandler = require("./mqtt_handler");

// Activate device with MQTT given a user_id and device_id
const activateGroup = async(req, res) => {
    const { user_id, group_id } = req.body;
    // Get user associed with the device
    try {
        const user = await User.findOne({
            where: {
                id: user_id,
            },
        });
        // If user exists
        if (user) {
            // Change group state
            const group = await Groups.findOne({
                where: {
                    id: group_id,
                },
            });
            if (group.status === "inactive") {
                let updated = await Groups.update({ status: "active" }, {
                    where: { id: group_id },
                });
                if (updated) {
                    return res.status(200).json({ group });
                }
            } else {
                let updated = await Groups.update({ status: "inactive" }, {
                    where: { id: group_id },
                });
                if (updated) {
                    return res.status(200).json({ group });
                }
            }
        }

    } catch (error) {
        console.log(error);
    }

}
const activateDevice = async(req, res) => {
    console.log("##############################")
    try {
        const { user_id, device_id } = req.body;
        // Get user associed with the device
        const user = await User.findOne({
            where: { id: user_id },
            include: [{
                model: Device,
                where: { id: device_id },
            }, ],
        });
        // If user exists
        if (user) {
            // Get device associed with the user
            const device = await Device.findOne({
                where: { id: device_id },
                include: [{
                    model: User,
                    where: { id: user_id },
                }, ],
            });
            // If device exists
            if (device) {
                // Get the device status
                const status = device.status;
                const device_serial = device.serial_number;
                // If device is not active
                if (status === "inactive") {
                    // Activate device status
                    let updated = await Device.update({ status: "active" }, {
                        where: { id: device_id },
                    });
                    if (updated) {
                        //Call mqtt handler to publsih to client topic
                        console.log("Activating Device");
                        console.log("Device Serial: ", device_serial);
                        console.log("User Email: ", user.email);
                        console.log("Topic: ", user.email + "/" + device_serial + "/serialdata/rx");
                        //mqttHandler.sendMessage(`${user.email}/${device_serial}/serialdata/rx`, { deviceStatus: 1 });
                        mqttHandler.client.publish(`${user.email}/${device_serial}/serialdata/rx`, JSON.stringify({ deviceStatus: 1 }));
                        return res.status(200).json({ device });
                    }
                }
                // If device is active
                if (status === "active") {
                    // Deactivate device status
                    let updated = await Device.update({ status: "inactive" }, {
                        where: { id: device_id },
                    });
                    if (updated) {
                        console.log("Deactivating Device");
                        console.log("Device Serial: ", device_serial);
                        console.log("User Email: ", user.email);
                        console.log("Topic: ", user.email + "/" + device_serial + "/serialdata/rx");
                        //Call mqtt handler to publsih to client topic
                        mqttHandler.client.publish(`${user.email}/${device_serial}/serialdata/rx`, JSON.stringify({ deviceStatus: 0 }));
                        return res.status(200).json({ device });
                    }
                }
            }
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
};
const fetchDevices = async(req, res) => {
    try {
        let user_id = req.body.userId;
        console.log(req.body.userId);
        // Get user associed with the device
        const user = await User.findOne({
            where: { id: user_id },
        });
        // If user exists
        if (user) {
            // readTopic(user.email);
            // Get devices associed with the user
            // let message = await mqttHandler.readTopic(user.email);
            console.log("message: ", message);
            return res.status(200).json({ message });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
};

//USER CONTROLLERS CRUD//

const createUser = async(req, res) => {
    try {
        const user = await User.create(req.body);
        return res.status(201).json({
            status: 200,
            user,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getAllUsers = async(req, res) => {
    try {
        const users = await User.findAll({
            include: [{
                model: Device,
            }, ],
        });
        return res.status(200).json({ users });
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

const getUserById = async(req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findOne({
            where: { id: id },
            include: [{
                model: Device,
            }, ],
        });
        if (user) {
            return res.status(200).json({ user });
        }
        return res.status(404).send("User with the specified ID does not exists");
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

const updateUser = async(req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await User.update(req.body, {
            where: { id: id },
        });
        if (updated) {
            const updatedUser = await User.findOne({ where: { id: id } });
            return res.status(200).json({ user: updatedUser });
        }
        throw new Error("User not found");
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

const deleteUser = async(req, res) => {
    try {
        const { id } = req.params;
        const deleted = await User.destroy({
            where: { id: id },
        });
        if (deleted) {
            return res.status(204).send("User deleted");
        }
        throw new Error("User not found");
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

//DEVICE CONTROLLERS CRUD//

const createDevice = async(req, res) => {
    try {
        const device = await Device.create(req.body);
        return res.status(201).json({
            device,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

const getAllDevices = async(req, res) => {
    try {
        const device = await Device.findAll({
            include: [{
                model: User,
            }, ],
        });
        return res.status(200).json({ device });
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

const getDeviceById = async(req, res) => {
    try {
        const { id } = req.params;
        const device = await Device.findOne({
            where: { id: id },
            include: [{
                model: User,
            }, ],
        });
        if (device) {
            return res.status(200).json({ device });
        }
        return res.status(404).send("Device with the specified ID does not exists");
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

const updateDevice = async(req, res) => {
    try {
        let deviceId = req.body.deviceId;
        let newName = req.body.name;


        const [updated] = await Device.update({ name: newName }, {
            where: { id: deviceId },
        });

        return res.status(200).json({ updated });

    } catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
};

// Delete a device given a device_id and user id
// This could be used for other crude functions where the action is dependent on user id
const deleteDevice = async(req, res) => {
    try {
        let deviceId = req.params.id;
        const deleteAssociations = await DeviceGroups.destroy({
            where: { deviceId: deviceId },
        });
        const deleted = await Device.destroy({
            where: { id: deviceId },
        });
        if (deleted) {
            return res.status(204).send("Device deleted");
        }
        throw new Error("Device not found");
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

// Get all devices given a user_id
const getDevicesFromUserId = async(req, res) => {
    //
    try {
        let id = req.params.user_id;
        console.log("##########")
        console.log("User Id: ", id);
        console.log("##########")
        console.log(id);
        const devices = await Device.findAll({
            where: { userId: id },
            order: [
                ['name', 'ASC']
            ]
        });
        if (devices) {
            return res.status(200).json({ devices });
        }
        return res
            .status(404)
            .send("Device with the specified User ID does not exists");
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

// Simple login with email and password,
// Recieves a JSON with the email and password
// Returns a JSON with the user object
const simpleLogin = async(req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({
            where: { email: email, password: password },
        });
        if (user) {
            return res.status(200).json({ user });
        }
        return res
            .status(401)
            .send("User with the specified email and password does not exists");
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

// Simple signup with email and password,
// Recieves a JSON with the email and password
// Returns a JSON with the user object
const simpleSignup = async(req, res) => {
    try {
        const user = await User.create(req.body);
        return res.status(201).json({
            user,
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

// Delete user given by id, and associated devices
const simpleDeleteAccount = async(req, res) => {
    try {
        const { id } = req.params;
        const userDevices = await Device.findAll({
            where: { userId: id },
        });
        if (userDevices) {
            await Device.destroy({
                where: { userId: id },
            });
        }
        const deleted = await User.destroy({
            where: { id: id },
        });
        if (deleted) {
            return res.status(204).send("User deleted");
        }
        throw new Error("User not found");
    } catch (error) {
        return res.status(500).send(error.message);
    }
};

//Given a user_id, returns all groups that the user is a member of
const getGroupsFromUserId = async(req, res) => {
    try {
        let id = req.params.user_id;
        console.log(req.params.user_id);
        const groups = await Groups.findAll({
            where: { userId: id },
            include: [{
                model: Device,
                as: "device",
            }, ],
        });

        if (groups) {
            return res.status(200).json({ groups });
        }
        return res
            .status(404)
            .send("Device with the specified User ID does not exists");
    } catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
};

const createGroup = async(req, res) => {
    try {
        console.log(req.body);
        const group = await Groups.create({
            name: req.body.name,
            userId: req.body.userId,
            status: 'inactive',
        });
        return res.status(201).json({ group });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message });
    }
};

const deleteGroup = async(req, res) => {
    try {
        let groupId = req.params.id;

        await DeviceGroups.destroy({
            where: { groupId: groupId },
        });

        const deleted = await Groups.destroy({
            where: { id: groupId },
        });
        if (deleted) {
            return res.status(204).send("Group deleted");
        }
        throw new Error("Group not found");
    } catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
};

const updateGroup = async(req, res) => {
    try {
        let groupId = req.body.groupId;
        let newName = req.body.name;


        const [updated] = await Groups.update({ name: newName }, {
            where: { id: groupId },
        });
        if (updated) {
            return res.status(200).json({ group: updated });
        }
        return res.status(200)
    } catch (error) {
        console.log(error);
        return res.status(500).send(error.message);
    }
}

const updateGroupDevices = async(req, res) => {
    try {
        let groupId = req.body.groupId;
        let deviceId = req.body.deviceId;
        let action = req.body.action;
        console.log(req.body.action);
        console.log("Action: ", action, "DeviceId: ", deviceId, "GroupId: ", groupId);

        if (action === 'add') { //bananas
            const groupassoc = await DeviceGroups.create({
                groupId: groupId,
                deviceId: deviceId,
            });
            return res.status(201).json({ groupassoc });
        } else if (action === 'remove') {
            await DeviceGroups.destroy({
                where: { deviceId: deviceId, groupId: groupId },
            });
        }
    } catch (error) {
        console.log(error);
        return res.status(500).send("Error updating group devices");
    }
}


module.exports = {
    deleteGroup,
    createGroup,
    createUser,
    getAllUsers,
    getUserById,
    updateUser,
    updateGroup,
    deleteUser,
    createDevice,
    getAllDevices,
    getDeviceById,
    updateDevice,
    deleteDevice,
    getDevicesFromUserId,
    simpleLogin,
    simpleSignup,
    simpleDeleteAccount,
    activateDevice,
    activateGroup,
    fetchDevices,
    getGroupsFromUserId,
    updateGroupDevices
};