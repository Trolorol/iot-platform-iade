var mqtt = require("mqtt");
require("dotenv").config();
const deviceDiscovery = require("./discovery");

const mqttEndpoint = process.env.MQTTS_URL;
const mqttPort = process.env.MQTTS_PORT;
const mqttUser = process.env.MQTTS_USER;
const mqttPassword = process.env.MQTTS_PASSWORD;

let opt = {
    clean: true,
    host: mqttEndpoint,
    port: mqttPort,
    username: mqttUser,
    password: mqttPassword,
    clientId: 'mqtt-' + Math.random().toString(16)
};

console.log("Logged in MQTT with id: ", opt.clientId);

var client = mqtt.connect(mqttEndpoint, opt);

client.on('connect', function() {
    let topic = "discovery/devices/#";
    console.log('mqtt connected');

    client.subscribe([topic], () => {
        console.log(`Subscribe to topic '${topic}'`);
    });

    client.on('message', function(topic, payload) {
        console.log("Received Message:", topic, payload.toString());
        // let message = JSON.parse(payload.toString());
        let userEmail = topic.split("/")[2];
        let message = payload.toString();
        console.log("message", payload);
        console.log(userEmail !== undefined);

        if (userEmail !== undefined) {
            if (message) {

                let messageObj = JSON.parse(message);
                if (messageObj.deviceSerial) {
                    let deviceParams = {
                        userEmail: userEmail,
                        deviceSerial: messageObj.deviceSerial,
                    };
                    deviceDiscovery(deviceParams);
                }
            }
            console.log("Fool You")
        }
    });
});

client.on('error', function(error) {
    console.log('mqtt error: ' + error);
});

client.on('close', function() {
    console.log('mqtt closed');
});

client.on('offline', function() {
    console.log('offline');
});

client.on('reconnect', function() {
    console.log('reconnect');
});

// function sendMessage(topic, message) {
//     message = JSON.stringify(message);
//     console.log("#############");
//     console.log("sendMessage");
//     console.log(topic);
//     console.log(message);
//     console.log("#############");
//     var client = mqtt.connect(mqttEndpoint, opt);

//     client.publish(topic, message);
//     client.end();
// }

// function readTopic() {
//     console.log("readTopic");
//     console.log(opt);
//     var client = mqtt.connect(mqttEndpoint, opt);
//     let topic = "discovery/devices/#";

//     client.on("connect", () => {
//         console.log("Connected");
//         client.subscribe([topic], () => {
//             console.log(`Subscribe to topic '${topic}'`);
//         });
//     });

//     client.on("message", (topic, payload) => {
//         console.log("Received Message:", topic, payload.toString());
//         // let message = JSON.parse(payload.toString());
//         let userEmail = topic.split("/")[2];
//         let message = payload.toString();
//         console.log("message", payload);
//         console.log(userEmail !== undefined);

//         if (userEmail !== undefined) {
//             if (message) {

//                 let messageObj = JSON.parse(message);
//                 if (messageObj.deviceSerial) {
//                     let deviceParams = {
//                         userEmail: userEmail,
//                         deviceSerial: messageObj.deviceSerial,
//                     };
//                     deviceDiscovery(deviceParams);
//                 }
//             }
//             console.log("Fool You")
//         }
//     });
// }

module.exports = { client };