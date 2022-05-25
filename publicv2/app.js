const app = Vue.createApp({
  data() {
    return {
      tasks: [],
      enteredTask: "",
      visible: true,
      status: "Hide",
      login: true,
    };
  },
  methods: {
    addTask() {
      this.tasks.push(this.enteredTask);
      console.log(this.tasks);
      this.enteredTask = "";
    },
    changeVisible() {
      this.visible = !this.visible;

      if (this.visible) {
        this.status = " Hide ";
      } else {
        this.status = " Show ";
      }
    },
    login() {
      this.login = !this.login;
    },
  },
  computed: {},
});

app.mount("#app");
