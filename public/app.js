const app = Vue.createApp({
  data() {
    return {
      logedin: false,
      registerMode: true,
      deviceMode: false,
      groupMode: false,
      addDeviceMode: false,
      addGroupMode: false,
      devices: [
        {
          id: 1,
          name: "Device 1",
          status: false,
        },
        {
          id: 2,
          name: "Device 2",
          status: false,
        },
        {
          id: 2,
          name: "Device 2",
          status: false,
        },
      ],
      groups: [
        {
          id: 1,
          name: "Group 1",
          status: false,
        },
        {
          id: 2,
          name: "Group 2",
          status: false,
        },
      ],
    };
  },
  methods: {
    login() {
      this.logedin = true;
      this.registerMode = false;
    },
    logout() {
      this.logedin = false;
    },
    register() {
      this.registerMode = true;
    },
    changeModeDevices() {
      this.deviceMode = !this.deviceMode;
      this.groupMode = false;
    },
    changeModeGroups() {
      this.groupMode = !this.groupMode;
      this.deviceMode = false;
    },
    changeDeviceStatus(device_id) {
      console.log(device_id);
    },
  },
});

app.mount("#app");
