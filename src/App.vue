<template>
  <div id="app">
    <v-app>
      <title-bar />
      <side-bar v-if="$store.state.userName" />
      <v-main>
        <v-container fluid class="h-full">
          <router-view></router-view>
        </v-container>
      </v-main>
    </v-app>
  </div>
</template>

<script>
import TitleBar from "./components/TitleBar";
import SideBar from "./components/SideBar";

export default {
  name: "app",
  components: { TitleBar, SideBar },
  created() {
    this.getUsers();
    this.getUserName();
  },
  methods: {
    getUsers() {
      this.$http
        .get(`${this.$apiUrl}/user`)
        .then((res) => {
          if (res.data[0].statusCode === this.$successCode) {
            this.$store.commit("setUsers", res.data[1]);
          } else {
            this.$toast.error(`${res.data[0].message}`);
          }
        })
        .catch((err) => {
          this.$toast.error(`에러발생\r\n${err}`);
        });
    },
    getUserName() {
      let user = localStorage.getItem("infi_user");
      if (user) {
        user = JSON.parse(user);
        this.$store.commit("setUserName", user.name);
      }
    },
  },
};
</script>

<style scoped></style>
