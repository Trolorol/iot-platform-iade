const app = Vue.createApp({
    data() {
        return {
            logedin: false,
            loginMode: false,
            registerMode: false,
            deviceMode: true,
            groupMode: true,
            addDeviceMode: false,
            addGroupMode: true,
            wrongCredentials: false,
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
                console.log(response);
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
        },
        showRegister() {
            this.registerMode = true;
            this.loginMode = false;
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
            console.log("Groups", this.groups[group_index].status);
        },

        async getDevices() {
            if (this.logedin) {
                try {
                    let response = await $.ajax({
                        url: `/api/users/devices/${1}`,
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
                        url: `/api/groups/${1}`,
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
                            devices: this.group.devices,
                        }),
                        contentType: "application/json",
                    });
                    this.groups.push(response.group);
                } catch (error) {
                    console.log(error);
                }
                this.getGroups();
                this.groupMode = true;
            }
        },
        async deleteGroup(group_id) {
            console.log(group_id);
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
});

app.mount("#app");