<template>
  <v-tooltip
    right
    color="transparent"
    :content-class="isActive ? 'side-menu-tooltip active' : 'side-menu-tooltip'"
    nudge-left="5"
    transition="slide-x-transition"
  >
    <template v-slot:activator="{ attrs, on }">
      <v-icon
        class="side-menu d-block text-center mx-auto mb-5 mt-4"
        :class="{ active: isActive }"
        :size="28"
        v-bind="attrs"
        v-on="on"
        ripple="false"
        @click.prevent="$emit('iconClick')"
      >
        {{ iconName }}
      </v-icon>
    </template>
    <span>{{ tooltipText }}</span>
  </v-tooltip>
</template>

<script>
export default {
  props: ["isActive", "iconName", "tooltipText"],
};
</script>

<style></style>
