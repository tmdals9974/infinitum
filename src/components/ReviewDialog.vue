<template>
  <v-dialog
    v-model="revDialog"
    max-width="600px"
    @click:outside="closeDialog()"
    @keydown.esc="closeDialog()"
  >
    <v-card>
      <v-card-title class="pa-5">
        <span class="text-h5">{{ dialogTitle }}</span>
      </v-card-title>
      <v-divider></v-divider>

      <v-card-text class="my-5 py-0">
        <v-container class="px-0">
          <v-row dense class="mb-5">
            <v-col class="mx-3">
              <v-text-field
                class="my-0"
                label="작성자"
                outlined
                filled
                disabled
                hide-details
                v-model="newReview.writer"
                @change="$emit('update:newReview.writer', $event.target.value)"
              ></v-text-field>
            </v-col>
            <v-col class="mx-3">
              <v-text-field
                label="가게"
                outlined
                filled
                disabled
                hide-details
                v-model="newReview.restaurant_name"
                @change="
                  $emit('update:newReview.restaurant_name', $event.target.value)
                "
              ></v-text-field>
            </v-col>
            <v-col class="mx-3">
              <v-text-field
                label="별점"
                outlined
                hide-details
                v-model="newReview.rating"
                placeholder="1~5 숫자만 입력"
                @change="$emit('update:newReview.rating', $event.target.value)"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row dense class="mb-5">
            <v-col class="mx-3">
              <v-text-field
                label="메뉴"
                outlined
                hide-details
                v-model="newReview.menu"
                @change="$emit('update:newReview.menu', $event.target.value)"
              ></v-text-field>
            </v-col>
            <v-col class="mx-3">
              <v-text-field
                label="가격"
                outlined
                hide-details
                placeholder="숫자만 입력"
                v-model="newReview.price"
                @change="$emit('update:newReview.price', $event.target.value)"
              ></v-text-field>
            </v-col>
          </v-row>
          <v-row dense>
            <v-col class="mx-3">
              <v-textarea
                label="평가"
                outlined
                hide-details
                v-model="newReview.reviews"
                @change="$emit('update:newReview.reviews', $event.target.value)"
                @keydown.enter="saveClick()"
              ></v-textarea>
            </v-col>
          </v-row>
        </v-container>
      </v-card-text>

      <v-card-actions class="pb-5">
        <v-spacer></v-spacer>
        <v-btn color="red darken-1" text @click="closeDialog()"> Close </v-btn>
        <v-btn color="blue darken-1" text @click="saveClick()"> Save </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: ["newReview", "revDialog", "revDialogMode"],
  computed: {
    dialogTitle() {
      switch (this.revDialogMode) {
        case 0:
          return "리뷰 등록";
        case 1:
          return "리뷰 수정";
        default:
          return "리뷰";
      }
    },
  },
  methods: {
    closeDialog() {
      this.$emit("update:revDialog", false);
      this.$emit("resetNewReview");
    },
    saveClick() {
      switch (this.revDialogMode) {
        case 0:
          this.$emit("createReview");
          break;
        case 1:
          this.$emit("updateReview");
          break;
        default:
          break;
      }
    },
  },
};
</script>

<style></style>
