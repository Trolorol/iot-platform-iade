const app = Vue.createApp({
    data() {
        return {
            logedin: false,
            loginMode: false,
            registerMode: false,
            welcomeMode: false,
            deviceMode: true,
            editDeviceMode: false,
            editGroupMode: false,
            groupMode: true,
            addDeviceMode: false,
            addDeviceToGroupMode: false,
            addGroupMode: false,
            wrongCredentials: false,
            groupManaging: null,
            passwordCheck: "",
            passwordCheckError: null,
            emailCheckError: false,
            group: {},
            device: {},
            user: {
                id: "",
                email: "",
                password: "",
                name: "",
                lastName: "",
            },
            devices: [],
            groups: [],
        };
    },
    methods: {
        showLogin() {
            this.loginMode = true;
            this.registerMode = false;
            this.welcomeMode = false;
        },
        async submitLogin() {
            var raw = JSON.stringify({
                email: this.user.email,
                password: this.user.password,
            });
            try {
                let response = await $.ajax({
                    url: "/api/login",
                    method: "post",
                    dataType: "json",
                    data: raw,
                    contentType: "application/json",
                });
                this.user.id = response.user.id;
                localStorage.setItem("id", response.user.id);
                this.user.name = response.user.firstName;
                localStorage.setItem("firstName", response.user.firstName);
                this.user.lastName = response.user.lastName;
                localStorage.setItem("lastName", response.user.lastName);
                this.user.email = response.user.email;
                localStorage.setItem("email", response.user.email);
                this.loginMode = false;
                this.logedin = true;
            } catch (error) {
                if (error.status == 401) {
                    this.wrongCredentials = true;
                }
            }
            this.getDevices();
            this.getGroups();
        },
        logout() {
            this.logedin = false;
            localStorage.removeItem("id");
            localStorage.removeItem("firstName");
            localStorage.removeItem("lastName");
            localStorage.removeItem("email");
            this.loginMode = true;
        },
        showRegister() {
            this.registerMode = true;
            this.loginMode = false;
            this.welcomeMode = false;
        },
        changeModeDevices() {
            this.deviceMode = !this.deviceMode;
        },
        changeModeGroups() {
            this.groupMode = !this.groupMode;
        },
        async changeDeviceStatus(device_id) {
            //post to /switch_state
            // send user_id, device_id
            if (this.logedin) {
                var raw = JSON.stringify({
                    user_id: this.user.id,
                    device_id: device_id,
                });

                await $.ajax({
                    url: "/api/switch_state",
                    method: "post",
                    dataType: "json",
                    data: raw,
                    contentType: "application/json",
                });
                this.getDevices();
            }
        },
        async changeGroupStatus(group_index) {
            let devices = this.groups[group_index].device;
            for (let i = 0; i < devices.length; i++) {
                this.changeDeviceStatus(devices[i].id)
            }
            let currentStatus = this.groups[group_index].status
            if (currentStatus == "active") {
                this.groups[group_index].status = "inactive";
            } else {
                this.groups[group_index].status = "active";
            }
        },
        async getDevices() {
            if (this.logedin) {
                try {
                    let response = await $.ajax({
                        url: `/api/users/devices/${this.user.id}`,
                        method: "GET",
                        dataType: "json",
                    });
                    this.devices = response.devices;
                } catch (error) {
                    console.log(error);
                }
            }
        },
        async getGroups() {
            if (this.logedin) {
                try {
                    let response = await $.ajax({
                        url: `/api/groups/${this.user.id}`,
                        method: "GET",
                        dataType: "json",
                    });
                    this.groups = response.groups;
                } catch (error) {
                    console.log(error);
                }
            }
        },
        async addGroup() {
            if (this.logedin) {
                try {
                    let response = await $.ajax({
                        url: `/api/groups`,
                        method: "POST",
                        dataType: "json",
                        data: JSON.stringify({
                            name: this.group.name, //TODO
                            userId: this.user.id,
                        }),
                        contentType: "application/json",
                    });
                    this.groups.push(response.group);
                } catch (error) {
                    console.log(error);
                }
                this.getGroups();
                this.groupMode = true;
                this.addGroupMode = false;
            }
        },
        async deleteGroup(group_id) {
            if (this.logedin) {
                try {
                    await $.ajax({
                        url: `/api/groups/${group_id}`,
                        method: "DELETE",
                        dataType: "json",
                    });
                    this.groups = this.groups.filter((group) => group.id != group_id);
                } catch (error) {
                    console.log(error);
                }
                this.getGroups();
            }
        },
        async editGroup(index) {
            if (this.logedin) {
                try {
                    let groupUpdate = this.groups[index]
                    let dataSend = JSON.stringify({
                        groupId: groupUpdate.id,
                        name: groupUpdate.name,
                    })
                    await $.ajax({
                        url: `/api/groups/edit`,
                        method: "POST",
                        dataType: "json",
                        data: dataSend,
                        contentType: "application/json",
                    });
                } catch (error) {
                    console.log(error);
                }
                this.getGroups();
                this.editGroupMode = false;
            }
        },
        deleteDeviceFromGroup(deviceId, groupId, group_key) {
            if (this.logedin) {
                try {
                    let dataSend = JSON.stringify({
                        deviceId: deviceId,
                        groupId: groupId,
                        action: "remove",
                    })
                    $.ajax({
                        url: `/api/groups/edit/associated_devices`,
                        method: "POST",
                        dataType: "json",
                        data: dataSend,
                        contentType: "application/json",
                    });
                } catch (error) {
                    console.log(error);

                }
                //Remove index group from this.groups
                this.groups.splice(group_key, 1);
            }

            this.getGroups();

        },
        editDevice() {
            this.editDeviceMode = !this.editDeviceMode
        },
        async saveDeviceEdit(index) {
            if (this.logedin) {
                try {
                    let deviceUpdate = this.devices[index]
                    let dataSend = JSON.stringify({
                        deviceId: deviceUpdate.id,
                        name: deviceUpdate.name,
                    })
                    await $.ajax({
                        url: `/api/devices/edit`,
                        method: "POST",
                        dataType: "json",
                        data: dataSend,
                        contentType: "application/json",
                    });
                } catch (error) {
                    console.log(error);
                }
                this.getDevices();
                this.editDeviceMode = false;
            }

        },
        async deletedevice(device_id) {
            if (this.logedin) {
                try {
                    await $.ajax({
                        url: `/api/devices/${device_id}`,
                        method: "DELETE",
                        dataType: "json",
                    });
                    this.devices = this.devices.filter(
                        (device) => device.id != this.device.id
                    );
                } catch (error) {
                    console.log(error);
                }
                this.getDevices();
            }
        },
        async createDevice() {
            if (this.logedin) {
                try {
                    await $.ajax({
                        url: `/api/devices`,
                        method: "POST",
                        dataType: "json",
                        data: JSON.stringify({
                            name: this.device.name, //TODO
                            userId: this.user.id,
                        }),
                        contentType: "application/json",
                    });
                } catch (error) {
                    console.log(error);
                }
                this.getDevices();
                this.deviceMode = true;
            }
        },
        checkIfinGroup(deviceId) { //groupIdManaging=group.id
            let x = this.groupManaging.device
            for (let i = 0; i < x.length; i++) {
                if (x[i].id == deviceId) {
                    return true
                }
            }
            return false

        },
        addDeviceToGroup(group) {
            this.addDeviceToGroupMode = true;
            this.groupManaging = group;
        },
        exitAddDeviceToGroup() {
            this.addDeviceToGroupMode = false;
            this.groupManaging = null;
        },
        async addDeviceToGroupConfirm(device_id) {
            if (this.logedin) {
                try {
                    let dataSend = JSON.stringify({
                        deviceId: device_id,
                        groupId: this.groupManaging.id,
                        action: "add",
                    })
                    $.ajax({
                        url: `/api/groups/edit/associated_devices`,
                        method: "POST",
                        dataType: "json",
                        data: dataSend,
                        contentType: "application/json",
                    });
                } catch (error) {
                    console.log(error);

                }
                //Remove index group from this.groups
                this.getGroups();
                this.getDevices();
                this.exitAddDeviceToGroup()

            }
        },
        async registerNewUser() {
            console.log(this.emailCheckError);
            console.log(this.passwordCheckError);
            if (this.emailCheckError == false && this.passwordCheckError == false) {
                console.log("New user with email: " + this.user.email + " and password: " + this.user.password)

                //post to api/users
                let register = await $.ajax({
                    url: "/api/users",
                    method: "POST",
                    dataType: "json",
                    data: JSON.stringify({
                        firstName: this.user.name,
                        lastName: this.user.lastName,
                        email: this.user.email,
                        password: this.user.password,
                    }),
                    contentType: "application/json",
                });

                if (register.status == "200") {
                    this.registerMode = false;
                    this.welcomeMode = true;
                } else {
                    console.log("Error: " + register);
                }


            }

        },
        validateEmail(value) {
            if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(value)) {
                this.emailCheckError = false;
            } else {
                this.emailCheckError = true;
            }
        },
        validatePassword(value) {
            if (this.user.password != value) {
                this.passwordCheckError = true;
                console.log("Password not match")
            } else {
                this.passwordCheckError = false;
                console.log("Password match")
            }
        }

    },
    mounted() {
        if (localStorage.getItem("id")) {
            this.logedin = true;
            this.user.id = localStorage.getItem("id");
            this.user.name = localStorage.getItem("firstName");
            this.user.lastName = localStorage.getItem("lastName");
            this.user.email = localStorage.getItem("email");
            this.getDevices();
            this.getGroups();
        }
    },
    watch: {
        passwordCheck(newValue) {
            this.passwordCheck = newValue;
            this.validatePassword(newValue);
        },
        'user.email' (value) {
            // binding this to the data value in the email input
            this.email = value;
            this.validateEmail(value);
        }

    }

});

app.mount("#app");