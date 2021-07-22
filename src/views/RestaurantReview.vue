<template>
  <div>
    <v-toolbar flat color="white">
      <v-toolbar-title>오늘 뭐먹지?</v-toolbar-title>
    </v-toolbar>

    <!-- table -->
    <v-data-table
      class="mt-5"
      :headers="headers"
      :items="restaurants"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      @page-count="pageCount = $event"
      multi-sort
      hide-default-footer
      :loading="loading"
      loading-text="로딩 중입니다. 잠시만 기다려주세요."
      item-key="id"
      :expanded="expanded"
      @click:row="tableRowClicked"
      :search="search"
      :custom-filter="filterRestaurants"
    >
      <!-- table header -->
      <template v-slot:top>
        <div class="d-flex align-baseline">
          <v-text-field
            outlined
            dense
            label="Search"
            v-model="search"
            prepend-inner-icon="mdi-magnify"
            class="mx-4"
          ></v-text-field>

          <v-spacer> </v-spacer>
          <v-spacer> </v-spacer>

          <!-- modal button -->
          <div class="ma-2" style="width: 100px; height: 100%">
            <v-dialog v-model="resDialog" max-width="600px">
              <template v-slot:activator="{ on, attrs }">
                <v-btn color="primary" block v-bind="attrs" v-on="on">
                  추가
                </v-btn>
              </template>

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
                        ></v-text-field>
                      </v-col>
                      <v-col class="mx-3">
                        <v-text-field
                          label="상호명"
                          outlined
                          hide-details
                          v-model="newRestaurant.name"
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
                          @keydown.enter="createRestaurant()"
                        ></v-text-field>
                      </v-col>
                    </v-row>
                  </v-container>
                </v-card-text>

                <v-card-actions class="pb-5">
                  <v-spacer></v-spacer>
                  <v-btn color="red darken-1" text @click="resDialog = false">
                    Close
                  </v-btn>
                  <v-btn color="blue darken-1" text @click="createRestaurant()">
                    Save
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-dialog>
          </div>
        </div>
      </template>

      <!-- expand component -->
      <template v-slot:expanded-item="{ headers, item }">
        <td
          :colspan="headers.length"
          :class="{
            'ma-0 px-10 sub-table': true,
            'expanded-closing': !transitioned[getItemId(item)],
          }"
          style="height: auto"
        >
          <v-expand-transition>
            <div
              v-show="transitioned[getItemId(item)]"
              v-if="item.reviews && item.reviews.length > 0"
            >
              <v-row class="px-5 py-3 sub-table-tr" dense>
                <v-col cols="2">작성자</v-col>
                <v-col cols="2">메뉴</v-col>
                <v-col cols="1">가격</v-col>
                <v-col cols="1">별점</v-col>
                <v-col cols="6">평가</v-col>
              </v-row>
              <v-row
                class="px-5 py-3 sub-table-tr"
                v-for="review in item.reviews"
                :key="review.id"
                dense
              >
                <v-col class="align-self-center" cols="2">
                  <v-icon>mdi-subdirectory-arrow-right</v-icon>
                  <v-avatar
                    class="ml-2"
                    :color="
                      $nameToColor($store.state.users, review.writer).back_color
                    "
                    size="34"
                  >
                    <span
                      :class="[
                        $nameToColor($store.state.users, review.writer)
                          .font_color === '#000000'
                          ? 'black-font'
                          : 'white-font',
                      ]"
                      >{{ getShortName(review.writer) }}</span
                    >
                  </v-avatar>
                </v-col>
                <v-col class="align-self-center" cols="2">
                  {{ review.menu }}
                </v-col>
                <v-col class="align-self-center" cols="1">
                  {{ $numberWithComma(review.price) }}
                </v-col>
                <v-col class="align-self-center" cols="1">
                  {{ review.rating }}
                </v-col>
                <v-col class="align-self-center" cols="6">
                  {{ review.reviews }}
                </v-col>
              </v-row>
            </div>
            <div
              v-show="transitioned[getItemId(item)]"
              v-else
              class="subtitle-1 px-5"
            >
              <v-icon class="py-3">mdi-subdirectory-arrow-right</v-icon>
              등록된 리뷰가 없습니다.
            </div>
          </v-expand-transition>
        </td>
      </template>

      <!-- actions -->
      <template #[`item.actions`]="{ item }">
        <v-icon
          small
          class="mr-2"
          style="cursor: pointer"
          @click.stop="settingReview(item)"
        >
          mdi-pencil
        </v-icon>
      </template>
    </v-data-table>

    <!-- pagination -->
    <div class="text-center pt-3 pr-3 card-padding d-flex justify-end">
      <v-pagination
        v-model="page"
        :length="pageCount"
        circle
        color="primary"
        class="pagination"
      ></v-pagination>
    </div>

    <!-- review modal -->
    <v-dialog v-model="revDialog" max-width="600px">
      <v-card>
        <v-card-title class="pa-5">
          <span class="text-h5">리뷰 등록</span>
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
                ></v-text-field>
              </v-col>
              <v-col class="mx-3">
                <v-text-field
                  label="가게"
                  outlined
                  filled
                  disabled
                  hide-details
                  v-model="newReview.restaurants_name"
                ></v-text-field>
              </v-col>
              <v-col class="mx-3">
                <v-text-field
                  label="별점"
                  outlined
                  hide-details
                  v-model="newReview.rating"
                  placeholder="1~5 숫자만 입력"
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
                ></v-text-field>
              </v-col>
              <v-col class="mx-3">
                <v-text-field
                  label="가격"
                  outlined
                  hide-details
                  placeholder="숫자만 입력"
                  v-model="newReview.price"
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
                ></v-textarea>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>

        <v-card-actions class="pb-5">
          <v-spacer></v-spacer>
          <v-btn color="red darken-1" text @click="revDialog = false">
            Close
          </v-btn>
          <v-btn color="blue darken-1" text @click="createReview()">
            Save
          </v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>
  </div>
</template>

<script>
export default {
  name: "restaurant-review",
  data() {
    return {
      search: "",
      page: 1,
      pageCount: 0,
      itemsPerPage: 10,
      loading: true,
      expanded: [],
      transitioned: [],
      closeTimeouts: {},
      headers: [
        { text: "구분", value: "type" },
        { text: "위치", value: "position" },
        { text: "상호명", value: "name" },
        { text: "평점", value: "ratingAverage" },
        { text: "", value: "actions", sortable: false, width: "50px" },
      ],
      restaurants: [],
      resDialog: false,
      revDialog: false,
      newRestaurant: {},
      newReview: {},
    };
  },
  created: function () {
    this.getRestaurants();
    this.resetNewRestaurant();
    this.resetNewReview();
  },
  methods: {
    getRestaurants() {
      this.$http.get(`${this.$apiUrl}/restaurant`).then((res) => {
        if (res.data[0].statusCode === this.$successCode) {
          this.restaurants = res.data[1];
          this.loading = false;
        }
      });
    },
    createRestaurant() {
      if (!Object.values(this.newRestaurant).every((v) => v))
        return this.$toast.warning(
          "모든 값을 입력해주세요.",
          this.$defaultToastOption
        );

      this.$http
        .post(`${this.$apiUrl}/restaurant`, this.newRestaurant)
        .then((res) => {
          if (res.data[0].statusCode === this.$successCode) {
            this.newRestaurant.ratingAverage = 0;
            this.newRestaurant.id = res.data[1].insertId;
            this.restaurants.push({ ...this.newRestaurant });
            this.resDialog = false;

            this.resetNewRestaurant();
          } else {
            this.$toast.error(
              `${res.data[0].message}`,
              this.$defaultToastOption
            );
          }
        })
        .catch((err) => {
          this.$toast.error(`오류 발생\r\n${err}`, this.$defaultToastOption);
        });
    },
    resetNewRestaurant() {
      this.newRestaurant = {
        type: "",
        name: "",
        position: "",
      };
    },
    settingReview(item) {
      this.newReview.restaurants_id = item.id;
      this.newReview.restaurants_name = item.name;
      this.revDialog = true;
    },
    createReview() {
      if (!Object.values(this.newReview).every((v) => v))
        return this.$toast.warning(
          "모든 값을 입력해주세요.",
          this.$defaultToastOption
        );

      this.$http
        .post(`${this.$apiUrl}/review`, this.newReview)
        .then((res) => {
          if (res.data[0].statusCode === this.$successCode) {
            this.newReview.id = res.data[1].insertId;

            const index = this.restaurants.findIndex(
              (r) => r.id === this.newReview.restaurants_id
            );
            if (index === -1) throw "리뷰 작성 중 오류가 발생하였습니다.";

            //리뷰등록
            if (!this.restaurants[index].reviews)
              this.restaurants[index].reviews = [];
            this.restaurants[index].reviews.push({ ...this.newReview });

            //평점 재계산
            let totalRating = 0;
            this.restaurants[index].reviews.forEach(
              (r) => (totalRating += parseInt(r.rating))
            );
            this.restaurants[index].ratingAverage = +(
              Math.round(
                totalRating / this.restaurants[index].reviews.length + "e+2"
              ) + "e-2"
            );

            //모달 닫기
            this.revDialog = false;

            //데이터 초기화
            this.resetNewReview();
          } else {
            this.$toast.error(
              `${res.data[0].message}`,
              this.$defaultToastOption
            );
          }
        })
        .catch((err) => {
          this.$toast.error(`오류 발생\r\n${err}`, this.$defaultToastOption);
        });
    },
    resetNewReview() {
      this.newReview = {
        writer: this.$store.state.userName,
        menu: "",
        reviews: "",
        restaurants_id: "",
        restaurants_name: "",
        rating: undefined,
        price: undefined,
      };
    },
    getShortName(name) {
      return name.substring(name.length - 2);
    },
    tableRowClicked(items, props) {
      this.toggleExpand(props);
    },
    filterRestaurants(value, search, item) {
      const menus = [];
      item.reviews.forEach((r) => menus.push(r.menu));
      return JSON.stringify([
        item.type,
        item.position,
        item.name,
        menus,
      ]).includes(search);
    },
    getItemId(item) {
      return item.id;
    },
    //https://codepen.io/webifi/pen/ExxmXbJ 예제 참조
    toggleExpand(props) {
      const item = props.item;
      const id = this.getItemId(item);
      if (props.isExpanded && this.transitioned[id]) {
        this.closeExpand(item);
      } else {
        clearTimeout(this.closeTimeouts[id]);
        props.expand(true);
        this.$nextTick(() => this.$set(this.transitioned, id, true));
        if (this.singleExpand)
          this.$nextTick(() =>
            this.expanded.forEach((i) => i !== item && this.closeExpand(i))
          );
      }
    },
    closeExpand(item) {
      const id = this.getItemId(item);
      this.$set(this.transitioned, id, false);
      // this.closeTimeouts[id] = setTimeout(() =>
      //   this.$refs.vDataTable.expand(item, false)
      // );
    },
  },
};
</script>

<style lang="scss" scoped>
.expanded-closing {
  border-bottom: none !important;
}

.sub-table {
  background: #f5f5f5;
}

.sub-table-tr {
  &:not(:last-child) {
    border-bottom: solid 1px #e0e0e0;
  }

  &:first-child {
    font-size: 16px;
    font-weight: bold;
    border-bottom: solid 1px black;
  }
}
</style>
