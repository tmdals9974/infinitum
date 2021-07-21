<template>
  <div id="app">
    <v-app>
      <title-bar />
      <side-bar />
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
};
</script>

<style scoped></style>
