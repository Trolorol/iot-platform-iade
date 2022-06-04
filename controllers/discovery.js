const { User, Device } = require("../models");

const deviceDiscovery = async (params) => {
  try {
    deviceSerial = params.deviceSerial;
    userEmail = params.userEmail;

    // Get user associed with the device
    const user = await User.findOne({
      where: { email: userEmail },
      include: [
        {
          model: Device,
          where: { serial_number: deviceSerial.toString() },
        },
      ],
    });
    console.log("#######");
    console.log("First User Check");
    console.log(user);
    console.log("#######");
    //If user exists no need to create device
    if (!user) {
      //Check if user exists
      const user = await User.findOne({
        where: { email: userEmail },
      });

      //If user does not exist
      if (user) {
        console.log("#######");
        console.log("Creating Device");
        console.log("#######");
        //Create device
        const device = await Device.create({
          serial_number: deviceSerial,
          status: "inactive",
          userId: user.id,
          name: "New Device-" + deviceSerial,
        });
      }
    }

    console.log("New Device Discovered");
    console.log(params);
  } catch (error) {
    console.log(error);
    return res.status(500).send(error.message);
  }
};

module.exports = deviceDiscovery;
