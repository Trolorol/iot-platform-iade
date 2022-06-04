var mqtt = require("mqtt");
require("dotenv").config();
const deviceDiscovery = require("./discovery");

const mqttEndpoint = process.env.MQTTS_URL;
const mqttPort = process.env.MQTTS_PORT;
const mqttUser = process.env.MQTTS_USER;
const mqttPassword = process.env.MQTTS_PASSWORD;

let opt = {
  host: mqttEndpoint,
  port: mqttPort,
  username: mqttUser,
  password: mqttPassword,
  protocol: "mqtts",
};

function sendMessage(topic, message) {
  console.log("#############");
  console.log("sendMessage");
  console.log(topic);
  console.log(message);
  console.log("#############");
  var client = mqtt.connect(mqttEndpoint, opt);

  client.publish(topic, message);
}

function readTopic() {
  console.log("readTopic");
  var client = mqtt.connect(mqttEndpoint, opt);
  let topic = "discovery/devices/#";

  client.on("connect", () => {
    console.log("Connected");
    client.subscribe([topic], () => {
      console.log(`Subscribe to topic '${topic}'`);
    });
  });

  client.on("message", (topic, payload) => {
    console.log("Received Message:", topic, payload.toString());
    // let message = JSON.parse(payload.toString());
    let userEmail = topic.split("/")[2];
    let message = payload.toString();
    console.log(userEmail !== undefined);

    if (userEmail !== undefined) {
      let deviceParams = {
        userEmail: userEmail,
        deviceSerial: JSON.parse(message).deviceSerial,
      };
      deviceDiscovery(deviceParams);
    }
  });
}

module.exports = {
  readTopic,
  sendMessage,
};
