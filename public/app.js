const app = Vue.createApp({
  data() {
    return {
      logedin: false,
      loginMode: false,
      registerMode: false,
      deviceMode: false,
      groupMode: false,
      addDeviceMode: false,
      addGroupMode: false,
      wrongCredentials: false,
      user: {
        id: "",
        email: "",
        password: "",
        name: "",
        lastName: "",
      },
      devices: [],
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
    },
    logout() {
      this.logedin = false;
    },
    showRegister() {
      this.registerMode = true;
      this.loginMode = false;
    },
    changeModeDevices() {
      this.deviceMode = !this.deviceMode;
      this.groupMode = false;
      this.getDevices();
    },
    changeModeGroups() {
      this.groupMode = !this.groupMode;
      this.deviceMode = false;
    },
    changeDeviceStatus(device_id) {
      console.log(device_id);
    },
    async getDevices() {
      if (this.logedin) {
        try {
          let response = await $.ajax({
            url: `/api/users/devices/${1}`,
            method: "GET",
            dataType: "json",
          });
          console.log(response);
          this.devices = response.devices;
        } catch (error) {
          console.log(error);
        }
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
    }
  },
});

app.mount("#app");
