<template>
  <v-stepper v-model="step" vertical>
    <div class="pa-5 mb-5">
      <p class="text-h4 mb-0">사용자 설정</p>
    </div>
    <v-stepper-step :complete="step > 1" :editable="step > 1" step="1">
      사용자 이름 입력
    </v-stepper-step>

    <v-stepper-content step="1">
      <v-card class="mb-8 pa-10" color="grey lighten-4" outlined>
        <v-text-field
          label="이름"
          outlined
          single-line
          hide-details
          v-model="name"
          @keypress.enter="nextStep(true)"
        ></v-text-field>
      </v-card>
      <v-btn
        class="mb-3"
        color="primary"
        outlined
        rounded
        @click="nextStep(true)"
      >
        다음
      </v-btn>
    </v-stepper-content>

    <v-stepper-step :complete="step > 2" :editable="step > 2" step="2">
      사용자 선호 색상 선택
    </v-stepper-step>

    <v-stepper-content step="2">
      <div class="color-picker-box mb-8" style="width: fit-content">
        <v-color-picker
          dot-size="12"
          show-swatches
          swatches-max-height="100"
          v-model="color"
        ></v-color-picker>
      </div>
      <v-btn class="mb-3" color="primary" outlined rounded @click="nextStep()">
        다음
      </v-btn>
      <v-btn class="mb-3 ml-3" color="error" text rounded @click="prevStep()">
        이전
      </v-btn>
    </v-stepper-content>

    <v-stepper-step :complete="step > 3" :editable="step > 3" step="3">
      사용자 프로필 확인
    </v-stepper-step>

    <v-stepper-content step="3">
      <v-card class="mb-8 pa-10" color="grey lighten-4" outlined>
        <div class="d-flex flex-wrap">
          <div class="align-center align-self-center d-flex flex-column ml-16">
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
              @keypress.enter="nextStep(true)"
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
      </v-card>
      <v-btn
        class="mb-3"
        color="primary"
        outlined
        rounded
        @click="nextStep(true)"
      >
        다음
      </v-btn>
      <v-btn class="mb-3 ml-3" color="error" text rounded @click="prevStep()">
        이전
      </v-btn>
    </v-stepper-content>

    <v-stepper-step step="4"> 최종 확인 </v-stepper-step>
    <v-stepper-content step="4">
      <v-card class="mb-8 pa-10" color="grey lighten-4" outlined>
        <v-avatar :color="color" size="128" class="big-avatar">
          <span
            :class="[
              fontColorIsBlack === '#000000' ? 'black-font' : 'white-font',
            ]"
            >{{ getShortName }}</span
          >
        </v-avatar>
        <p class="text-h6 mt-10 mb-0">
          확인 버튼을 누르시면 입력하신 값이 저장됩니다.
        </p>
      </v-card>

      <v-btn class="mb-3" color="primary" outlined rounded @click="userSave()">
        확인
      </v-btn>
      <v-btn class="mb-3 ml-3" color="error" text rounded @click="prevStep()">
        이전
      </v-btn>
    </v-stepper-content>
  </v-stepper>
</template>

<script>
export default {
  data() {
    return {
      step: 1,
      name: "",
      color: "",
      fontColorIsBlack: "#ffffff",
    };
  },
  computed: {
    getShortName() {
      return this.name.substring(this.name.length - 2);
    },
  },
  methods: {
    nextStep(nameCheck) {
      if (nameCheck && this.name === "") {
        return this.$toast.warning(
          "이름을 입력해주세요.",
          this.$defaultToastOption
        );
      }
      this.step = parseInt(this.step) + 1;
    },
    prevStep() {
      this.step = parseInt(this.step) - 1;
    },
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
            this.$store.commit("setUserName", params.name);
            this.$store.commit("addUser", params);

            this.$toast.success(
              "성공적으로 저장하였습니다.",
              this.$defaultToastOption
            );

            return this.$router.push("restaurantReview");
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

<style></style>
