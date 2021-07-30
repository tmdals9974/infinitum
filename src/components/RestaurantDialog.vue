<template>
  <v-dialog
    v-model="resDialog"
    max-width="600px"
    @click:outside="$emit('update:resDialog', $event.target.value)"
    @keydown.esc="$emit('update:resDialog', $event.target.value)"
  >
    <v-card>
      <v-card-title class="pa-5">
        <span class="text-h5">식당 등록</span>
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text class="my-5 py-0">
        <v-container class="px-0">
          <v-row dense class="mb-5">
            <v-col class="mx-3">
              <v-text-field
                label="구분"
                outlined
                hide-details
                v-model="newRestaurant.type"
                @change="
                  $emit('update:newRestaurant.type', $event.target.value)
                "
              ></v-text-field>
            </v-col>
            <v-col class="mx-3">
              <v-text-field
                label="상호명"
                outlined
                hide-details
                v-model="newRestaurant.name"
                @change="
                  $emit('update:newRestaurant.name', $event.target.value)
                "
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col class="mx-3">
              <v-text-field
                label="위치"
                outlined
                hide-details
                v-model="newRestaurant.position"
                @change="
                  $emit('update:newRestaurant.position', $event.target.value)
                "
                @keydown.enter="$emit('createRestaurant')"
              ></v-text-field>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions class="pb-5">
        <v-spacer></v-spacer>
        <v-btn
          color="red darken-1"
          text
          @click="$emit('update:resDialog', $event.target.value)"
        >
          Close
        </v-btn>
        <v-btn color="blue darken-1" text @click="$emit('createRestaurant')">
          Save
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["newRestaurant", "resDialog"],
};
</script>

<style></style>
