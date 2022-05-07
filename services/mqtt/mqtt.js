
var mqtt = require('mqtt')
require('dotenv').config();

const mqttEndpoint = process.env.MQTTS_URL;
const mqttPort = process.env.MQTTS_PORT;
const mqttUser = process.env.MQTTS_USER;
const mqttPassword = process.env.MQTTS_PASSWORD;

let opt = {
  host: mqttEndpoint,
  port: mqttPort,
  username: mqttUser,
  password: mqttPassword,
  protocol: 'mqtts',

}

var client = mqtt.connect(mqttEndpoint, opt)


client.on('connect', function () {
  client.subscribe('presence', function (err) {
    if (!err) {
      client.publish('presence', 'Hello mqtt' + ' ' + Math.random())
    }
  })
})

// client.on('close', () => {
//   console.log(`mqtt client disconnected`);
// });

client.on('message', function (topic, message) {
  // message is Buffer
  console.log(message.toString())
  client.end()
})

//////////////////////////

// var mqtt = require('mqtt')
// require('dotenv').config();

// const mqttEndpoint = process.env.MQTTS_URL;
// const mqttPort = process.env.MQTTS_PORT;
// const mqttUser = process.env.MQTTS_USER;
// const mqttPassword = process.env.MQTTS_PASSWORD;

// let opt = {
//   host: mqttEndpoint,
//   port: mqttPort,
//   username: mqttUser,
//   password: mqttPassword,
//   protocol: 'mqtts',

// }

// function publish(topic, message) {
//   var client = mqtt.connect(mqttEndpoint, opt);

//   client.publish(topic, message);
// }



// // client.on('connect', function () {
// //   client.subscribe('presence', function (err) {
// //     if (!err) {
// //       client.publish('presence', 'Hello mqtt' + ' ' + Math.random())
// //     }
// //   })
// // })

// // client.on('close', () => {
// //   console.log(`mqtt client disconnected`);
// // });


// module.exports = {
//   publish
// }