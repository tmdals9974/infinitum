<template>
  <header>
    <v-system-bar color="#dfe2e7" app window height="35">
      <img id="logo" src="~@/assets/infi_color_full_logo.png" />
      <v-spacer></v-spacer>

      <v-icon>mdi-minus</v-icon>
      <v-icon>mdi-checkbox-blank-outline</v-icon>
      <v-icon>mdi-close</v-icon>
    </v-system-bar>
  </header>
</template>

<script>
export default {};
</script>

<style lang="scss" scoped>
#logo {
  height: 100%;
  padding: 5px 0 5px 10px;
}

.v-system-bar .v-icon {
  cursor: pointer;
}
</style>
