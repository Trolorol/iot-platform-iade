<!-- <p align="center">
  <a href="" rel="noopener">
 <img width=200px height=200px src="https://i.imgur.com/6wj0hh6.jpg" alt="Project logo"></a>
</p> -->

<h1 align="center">iot-node-project</h1>

<div align="center">

[![Status](https://img.shields.io/badge/status-active-success.svg)]()
[![License](https://img.shields.io/badge/license-MIT-blue.svg)](/LICENSE)

</div>

---

<p align="center"> In here you will find a basic node api that serves as an IoT server experiment. It conects to an mqtt server with tls encryption and send triggers based on the selected device.
    <br> 
</p>

## 📝 Table of Contents

- [About](#about)
- [Getting Started](#getting_started)
- [Deployment](#deployment)
- [Usage](#usage)
- [Built Using](#built_using)
- [TODO](../TODO.md)
- [Contributing](../CONTRIBUTING.md)
- [Authors](#authors)
- [Acknowledgments](#acknowledgement)

## 🧐 About <a name = "about"></a>

This project was created to a project factory class @ IADE Europeia in Lisbon
It aims to shed some light in IoT apliances comunications.

## 🏁 Getting Started <a name = "getting_started"></a>

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See [deployment](#deployment) for notes on how to deploy the project on a live system.

### Prerequisites

What things you need to install the software and how to install them.

```
node
```

```
mosquitto server
```

### Installing

A step by step series of examples that tell you how to get a development env running.

1- Start by cloning this repo

<p>
2- Create a postgres db
<p>
3- Run npm install to install all project dependencies
<p>
4- This project uses sequelize, so besides runing a postgres db, there are some npx comands the we have to do first.
<p>
After running npm install and creating a postgres db run:

```
npx sequelize-cli db:create
```

```
npx sequelize-cli db:migrate
```

```
npx sequelize-cli db:seeds
```

This comenads will create the database, migrate the model into postgres and seed some examples into the database.

After this steps you are ready to go!

TODO

```
ADD DOCKER OPTIONS
```

Run

```
npm start
```

To start the server and you can test some calls to this API.

Start by:

```
get http://localhost:3000/api/users/1
```

This call will return user wityh id = 1 and all associated devices:

```json
{
  "user": {
    "id": 1,
    "firstName": "John",
    "lastName": "Doe",
    "email": "kobe@blackmamba.com",
    "password": null,
    "createdAt": "2022-05-08T03:36:40.574Z",
    "updatedAt": "2022-05-08T03:36:40.574Z",
    "Devices": [
      {
        "id": 1,
        "name": "Device 1",
        "userId": 1,
        "status": "inactive",
        "createdAt": "2022-05-08T03:36:40.592Z",
        "updatedAt": "2022-05-08T16:25:48.822Z"
      }
    ]
  }
}
```

OR:

```
post http://localhost:3000/api/switch_state
```

with the json payload of:

```json
{ "user_id": 1, "device_id": 1 }
```

This call will change to `n=!n` state of the device
<br/>
<br/>
<br/>

### MQTT Server

MQTT server works by recieving messages to topics, and subscriptions that listents to those topics. Topics are urlish style ex: `/mainTopic1/subTopic1/subSubTopic1`
There is no need to create any topic on mqtt server side, when a client sends a message to any topic, if that topic tdoesnt exists, it will be created.
There are some more advance features regarding topic creation amd security, but I will not cover this here.

<br/>

### MQTT Server Node connection

This project uses node MQTT library [Link Here](https://www.npmjs.com/package/mqtt).

In the controllers sections, there is a mqtt_handler.js file.
This file exports a client, that recognizes mqtt actions.
This handler is also responsible for automatic mqtt subscription to the mqtt server.
In discovery mode, the server has to recognize any devices that are new, and didn't got connected to a specific user. For this we subscribe to all topics beyond `discovery/devices/#` The '#' symbol means that it will listen to all topics beyond `discovery/devices/#` ex: `discovery/devices/test1` & `discovery/devices/2` & `discovery/devices/n`
In this project domain, this means, that the devices when activated for the first time will send a 'im alive' kinda message to this general topic, this is then grabed by the backend that recognizes the user, and adds the device ID to the database in junction with the user_id.

<br/>

```js
client.on("connect", function () {
  const topic = "discovery/devices/#";
  console.log("mqtt connected");

  client.subscribe([topic], () => {
    console.log(`Subscribe to topic '${topic}'`);
  });
```

<br/>

If you don't want to create a docker container for the MQTT mosquitto server, you can allways use the mosquitto testing server, endpoints can be found [here](https://test.mosquitto.org).

<br/>
<br/>
<br/>

## ⛏️ Built Using <a name = "built_using"></a>

- [Postgres](https://www.postgresql.org/) - Database
- [Express](https://expressjs.com/) - Server Framework
- [MQTT](https://https://mqtt.org/)

## ✍️ Authors <a name = "authors"></a>

- [@Trolorol](https://github.com/Trolorol)
- [@Fredcostar](https://github.com/Fredcostar)
