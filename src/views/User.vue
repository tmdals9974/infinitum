<template>
  <div class="d-flex justify-center align-center flex-column h-full">
    <div class="d-flex justify-center align-center flex-wrap mb-16">
      <div class="align-center d-flex flex-column ml-16">
        <v-avatar :color="color" size="128" class="big-avatar">
          <span
            :class="[
              fontColorIsBlack === '#000000' ? 'black-font' : 'white-font',
            ]"
            >{{ getShortName }}</span
          >
        </v-avatar>

        <v-switch
          v-model="fontColorIsBlack"
          label="검정글씨"
          color="black"
          value="#000000"
          hide-details
        ></v-switch>

        <v-text-field
          class="mt-10"
          label="이름"
          outlined
          single-line
          v-model="name"
        ></v-text-field>
      </div>

      <div class="color-picker-box ml-16">
        <v-color-picker
          dot-size="12"
          show-swatches
          swatches-max-height="100"
          v-model="color"
        ></v-color-picker>
      </div>
    </div>

    <v-btn color="primary" elevation="2" outlined rounded @click="userSave()">
      Save
    </v-btn>
  </div>
</template>

<script>
export default {
  data() {
    return {
      name: "홍길동",
      color: "",
      fontColorIsBlack: "#ffffff",
    };
  },
  created() {
    let user = localStorage.getItem("infi_user");
    if (user) {
      user = JSON.parse(user);
      this.name = user.name;
      this.color = user.back_color;
      this.fontColorIsBlack = user.font_color;
    }
  },
  computed: {
    getShortName() {
      return this.name.substring(this.name.length - 2);
    },
  },
  methods: {
    userSave() {
      const params = {
        name: this.name,
        back_color: this.color,
        font_color:
          this.fontColorIsBlack === "#000000"
            ? this.fontColorIsBlack
            : "#ffffff",
      };

      this.$http
        .post(`${this.$apiUrl}/user`, params)
        .then((res) => {
          if (res.data[0].statusCode === this.$successCode) {
            localStorage.setItem("infi_user", JSON.stringify(params));

            return this.$toast.success(
              "성공적으로 저장하였습니다.",
              this.$defaultToastOption
            );
          } else {
            return this.$toast.error(
              `${res.data[0].message}`,
              this.$defaultToastOption
            );
          }
        })
        .catch((err) => {
          this.$toast.error(`오류 발생\r\n${err}`, this.$defaultToastOption);
        });
    },
  },
};
</script>

<style lang="scss" scoped>
.big-avatar {
  font-size: 40px;
}

.color-picker-box {
  border: solid 1px $color-gray-4;
}

.black-font {
  color: black;
}

.white-font {
  color: white;
}
</style>
