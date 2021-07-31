<template>
  <v-dialog
    v-model="isShow"
    :max-width="maxWidth"
    @click:outside="closeDialog()"
    @keydown.esc="closeDialog()"
  >
    <v-card>
      <v-card-title class="pa-5">
        <span class="text-h5">{{ dialogTitle }}</span>
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text class="my-5 py-0">
        <v-container class="px-0 d-flex">
          <slot></slot>
        </v-container>
      </v-card-text>

      <v-card-actions class="pb-5">
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" text @click="closeDialog()"> Close </v-btn>
        <v-btn color="blue darken-1" text @click="saveClick()">
          {{ dialogButtonText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["isShow", "maxWidth", "dialogTitle", "dialogButtonText"],
  methods: {
    closeDialog() {
      this.$emit("update:isShow", false);
    },
    saveClick() {
      this.$emit("onSave");
      this.closeDialog();
    },
  },
};
</script>

<style></style>
