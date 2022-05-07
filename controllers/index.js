//const { where } = require('sequelize/types');
const { User, Device } = require('../models')
var mqttHandler = require('./mqtt_handler');






// Activate device with MQTT given a user_id and device_id
const activateDevice = async (req, res) => {
	try {
		const { user_id, device_id } = req.body;
		// Get user associed with the device
		const user = await User.findOne({
			where: { id: user_id },
			include: [
				{
					model: Device,
					where: { id: device_id }
				}
			]
		});
		// If user exists
		if (user) {
			// Get device associed with the user
			const device = await Device.findOne({
				where: { id: device_id },
				include: [
					{
						model: User,
						where: { id: user_id }
					}
				]
			});
			// If device exists
			if (device) {
				// Get the device status
				const status = device.status
				// If device is not active
				if (status === 'inactive') {
					// Activate device status
					let updated = await Device.update({ status: 'active' }, {
						where: { id: device_id }
					});
					if (updated) {
						//Call mqtt handler to publsih to client topic
						mqttHandler.sendMessage(`${user.email}/${device_id}`, 'active');
						return res.status(200).json({ device });
					}

				}
				// If device is active
				if (status === 'active') {
					// Deactivate device status
					let updated = await Device.update({ status: 'inactive' }, {
						where: { id: device_id }
					});
					if (updated) {
						//Call mqtt handler to publsih to client topic
						mqttHandler.sendMessage(`${user.email}/${device_id}`, 'inactive');
						return res.status(200).json({ device });
					}
				}
			}
		}
	} catch (error) {
		return res.status(500).send(error.message);
	}
}


//USER CONTROLLERS CRUD//

const createUser = async (req, res) => {
	try {
		const user = await User.create(req.body);
		return res.status(201).json({
			user,
		});
	} catch (error) {
		return res.status(500).json({ error: error.message })
	}
}

const getAllUsers = async (req, res) => {
	try {
		const users = await User.findAll({
			include: [
				{
					model: Device
				}
			]
		});
		return res.status(200).json({ users });
	} catch (error) {
		return res.status(500).send(error.message);
	}
}

const getUserById = async (req, res) => {
	try {
		const { id } = req.params;
		const user = await User.findOne({
			where: { id: id },
			include: [
				{
					model: Device
				}
			]
		});
		if (user) {
			return res.status(200).json({ user });
		}
		return res.status(404).send('User with the specified ID does not exists');
	} catch (error) {
		return res.status(500).send(error.message);
	}
}

const updateUser = async (req, res) => {
	try {
		const { id } = req.params;
		const [updated] = await User.update(req.body, {
			where: { id: id }
		});
		if (updated) {
			const updatedUser = await User.findOne({ where: { id: id } });
			return res.status(200).json({ user: updatedUser });
		}
		throw new Error('User not found');
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

const deleteUser = async (req, res) => {
	try {
		const { id } = req.params;
		const deleted = await User.destroy({
			where: { id: id }
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

const createDevice = async (req, res) => {
	try {
		const device = await Device.create(req.body);
		return res.status(201).json({
			device,
		});
	} catch (error) {
		return res.status(500).json({ error: error.message })
	}
}

const getAllDevices = async (req, res) => {
	try {
		const device = await Device.findAll({
			include: [
				{
					model: User
				}
			]
		});
		return res.status(200).json({ device });
	} catch (error) {
		return res.status(500).send(error.message);
	}
}

const getDeviceById = async (req, res) => {
	try {
		const { id } = req.params;
		const device = await Device.findOne({
			where: { id: id },
			include: [
				{
					model: User
				}
			]
		});
		if (device) {
			return res.status(200).json({ device });
		}
		return res.status(404).send('Device with the specified ID does not exists');
	} catch (error) {
		return res.status(500).send(error.message);
	}
}

const updateDevice = async (req, res) => {
	try {
		const { id } = req.params;
		const [updated] = await Device.update(req.body, {
			where: { id: id }
		});
		if (updated) {
			const updatedDevice = await Device.findOne({ where: { id: id } });
			return res.status(200).json({ device: updatedDevice });
		}
		throw new Error('Device not found');
	} catch (error) {
		return res.status(500).send(error.message);
	}
};

// Delete a device given a device_id and user id
// This could be used for other crude functions where the action is dependent on user id
const deleteDevice = async (req, res) => {
	try {
		const user = await User.findOne({
			where: { id: req.body.user_id }
		});
		if (user) {
			const device = await Device.findOne({
				where: { id: req.body.device_id }
			});
			if (device) {
				const deleted = await Device.destroy({
					where: { id: req.body.device_id }
				});
				if (deleted) {
					return res.status(204).send("Device deleted");
				}
				throw new Error("Device not found");
			}
			throw new Error("Device not found");
		}
		throw new Error("User not found");
	} catch (error) {
		return res.status(500).send(error.message);
	}
}

// Get all devices given a user_id
const getDevicesFromUserId = async (req, res) => { //
	try {
		let id = req.body.user_id;
		console.log(id)
		const devices = await Device.findAll({
			where: { userId: id },
		});
		if (devices) {
			return res.status(200).json({ devices });
		}
		return res.status(404).send('Device with the specified User ID does not exists');
	} catch (error) {
		return res.status(500).send(error.message);
	}

}

// Simple login with email and password,
// Recieves a JSON with the email and password
// Returns a JSON with the user object
const simpleLogin = async (req, res) => {
	try {
		const { email, password } = req.body;
		const user = await User.findOne({
			where: { email: email, password: password }
		});
		if (user) {
			return res.status(200).json({ user });
		}
		return res.status(404).send('User with the specified email and password does not exists');
	} catch (error) {
		return res.status(500).send(error.message);
	}
}

// Simple signup with email and password,
// Recieves a JSON with the email and password
// Returns a JSON with the user object
const simpleSignup = async (req, res) => {
	try {
		const user = await User.create(req.body);
		return res.status(201).json({
			user,
		});
	} catch (error) {
		return res.status(500).json({ error: error.message })
	}
}

// Delete user given by id, and associated devices
const simpleDeleteAccount = async (req, res) => {
	try {
		const { id } = req.params;
		const userDevices = await Device.findAll({
			where: { userId: id }
		});
		if (userDevices) {
			await Device.destroy({
				where: { userId: id }
			});
		}
		const deleted = await User.destroy({
			where: { id: id }
		});
		if (deleted) {
			return res.status(204).send("User deleted");
		}
		throw new Error("User not found");
	} catch (error) {
		return res.status(500).send(error.message);
	}
}




module.exports = {
	createUser,
	getAllUsers,
	getUserById,
	updateUser,
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
	activateDevice
}

