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

          <div class="ma-2" style="width: 100px; height: 100%">
            <v-btn
              color="primary"
              block
              @click="
                resDialog = true;
                resDialogMode = 0;
              "
              >추가</v-btn
            >

            <restaurant-dialog
              v-if="resDialog"
              :newRestaurant.sync="newRestaurant"
              :resDialog.sync="resDialog"
              :resDialogMode="resDialogMode"
              @createRestaurant="createRestaurant"
              @updateRestaurant="updateRestaurant"
              @resetNewRestaurant="resetNewRestaurant"
            ></restaurant-dialog>
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
                <v-col cols="5">평가</v-col>
                <v-col cols="1"></v-col>
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
                <v-col class="align-self-center" cols="5">
                  {{ review.reviews }}
                </v-col>
                <v-col class="align-self-center" cols="1">
                  <div class="d-flex gut-pd-2">
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          small
                          class="actionItem"
                          v-bind="attrs"
                          v-on="on"
                          @click.stop="settingUpdateReview(review)"
                        >
                          mdi-file-edit-outline
                        </v-icon>
                      </template>
                      <span>리뷰 수정</span>
                    </v-tooltip>
                    <v-tooltip bottom>
                      <template v-slot:activator="{ on, attrs }">
                        <v-icon
                          small
                          class="actionItem"
                          v-bind="attrs"
                          v-on="on"
                          @click.stop="
                            deleteTargetId = review.id;
                            revDeleteDialog = true;
                          "
                        >
                          mdi-delete
                        </v-icon>
                      </template>
                      <span>리뷰 삭제</span>
                    </v-tooltip>
                  </div>
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

      <!-- position -->
      <template #[`item.position`]="{ item }">
        <a
          v-if="item.map"
          :href="item.map"
          target="_blank"
          :title="item.name"
          >{{ item.position }}</a
        >
        <span v-else>{{ item.position }}</span>
      </template>
      <!-- actions -->
      <template #[`item.actions`]="{ item }">
        <div class="d-flex gut-pd-2">
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                small
                class="actionItem"
                v-bind="attrs"
                v-on="on"
                @click.stop="settingReview(item)"
              >
                mdi-pencil
              </v-icon>
            </template>
            <span>리뷰 작성</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                small
                class="actionItem"
                v-bind="attrs"
                v-on="on"
                @click.stop="settingUpdateRestaurant(item)"
              >
                mdi-file-edit-outline
              </v-icon>
            </template>
            <span>가게 정보 수정</span>
          </v-tooltip>
          <v-tooltip bottom>
            <template v-slot:activator="{ on, attrs }">
              <v-icon
                small
                class="actionItem"
                v-bind="attrs"
                v-on="on"
                @click.stop="
                  deleteTargetId = item.id;
                  resDeleteDialog = true;
                "
              >
                mdi-delete
              </v-icon>
            </template>
            <span>가게 삭제</span>
          </v-tooltip>
        </div>
      </template>
    </v-data-table>

    <review-dialog
      v-if="revDialog"
      :newReview.sync="newReview"
      :revDialog.sync="revDialog"
      :revDialogMode="revDialogMode"
      @createReview="createReview"
      @updateReview="updateReview"
      @resetNewReview="resetNewReview"
    ></review-dialog>

    <!-- 가게 삭제 -->
    <two-button-dialog
      v-if="resDeleteDialog"
      :maxWidth="'500px'"
      :isShow.sync="resDeleteDialog"
      :dialogTitle="'가게 삭제'"
      :dialogButtonText="'Delete'"
      @onSave="deleteRestaurant"
    >
      <div class="subtitle-1" style="text-align: center">
        삭제 시 작성된 리뷰까지 같이 제거되며 이후 복구가 불가능합니다.
        <br />
        <br />
        정말 삭제하시겠습니까?
      </div>
    </two-button-dialog>

    <!-- 리뷰 삭제 -->
    <two-button-dialog
      v-if="revDeleteDialog"
      :maxWidth="'500px'"
      :isShow.sync="revDeleteDialog"
      :dialogTitle="'리뷰 삭제'"
      :dialogButtonText="'Delete'"
      @onSave="deleteReview"
    >
      <div class="subtitle-1 w-full" style="text-align: center">
        삭제 후 복구가 불가능합니다.
        <br />
        <br />
        정말 삭제하시겠습니까?
      </div>
    </two-button-dialog>

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
  </div>
</template>

<script>
import ReviewDialog from "../components/ReviewDialog.vue";
import RestaurantDialog from "../components/RestaurantDialog.vue";
import TwoButtonDialog from "../components/TwoButtonDialog.vue";

export default {
  name: "restaurant-review",
  components: {
    ReviewDialog,
    RestaurantDialog,
    TwoButtonDialog,
  },
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
      deleteTargetId: "",
      //가게 관리
      resDialog: false,
      resDialogMode: -1, //-1:초기값, 0:생성, 1:수정
      newRestaurant: {},
      resDeleteDialog: false,
      //리뷰 관리
      revDialog: false,
      revDialogMode: -1, //-1:초기값, 0:생성, 1:수정
      newReview: {},
      revDeleteDialog: false,
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
    updateRestaurant() {
      if (!Object.values(this.newRestaurant).every((v) => v))
        return this.$toast.warning(
          "모든 값을 입력해주세요.",
          this.$defaultToastOption
        );

      this.$http
        .put(`${this.$apiUrl}/restaurant`, this.newRestaurant)
        .then((res) => {
          if (res.data[0].statusCode === this.$successCode) {
            const index = this.restaurants.findIndex(
              (r) => r.id === this.newRestaurant.id
            );
            if (index === -1) throw "가게 수정 중 오류가 발생하였습니다.";

            const res = this.restaurants[index];
            res.type = this.newRestaurant.type;
            res.position = this.newRestaurant.position;
            res.name = this.newRestaurant.name;
            res.map = this.newRestaurant.map;
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
    deleteRestaurant() {
      this.$http
        .delete(`${this.$apiUrl}/restaurant`, {
          data: { id: this.deleteTargetId },
        })
        .then((res) => {
          if (res.data[0].statusCode === this.$successCode) {
            const index = this.restaurants.findIndex(
              (r) => r.id === this.deleteTargetId
            );
            if (index === -1) throw "가게 삭제 중 오류가 발생하였습니다.";

            this.restaurants.splice(index, 1);
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
        map: "",
      };
    },
    settingUpdateRestaurant(item) {
      const { id, type, position, name, map } = item;
      this.newRestaurant = { id, type, position, name, map };
      this.resDialog = true;
      this.resDialogMode = 1;
    },
    settingReview(item) {
      this.newReview.restaurant_id = item.id;
      this.newReview.restaurant_name = item.name;
      this.revDialogMode = 0;
      this.revDialog = true;
    },
    settingUpdateReview(item) {
      const index = this.restaurants.findIndex(
        (r) => r.id === item.restaurant_id
      );
      const restaurant_name = this.restaurants[index].name;
      const { id, writer, restaurant_id, reviews, rating, menu, price } = item;
      this.newReview = {
        id,
        writer,
        restaurant_id,
        restaurant_name,
        reviews,
        rating,
        menu,
        price,
      };

      this.revDialogMode = 1;
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
              (r) => r.id === this.newReview.restaurant_id
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
    updateReview() {
      if (!Object.values(this.newReview).every((v) => v))
        return this.$toast.warning(
          "모든 값을 입력해주세요.",
          this.$defaultToastOption
        );

      this.$http
        .put(`${this.$apiUrl}/review`, this.newReview)
        .then((res) => {
          if (res.data[0].statusCode === this.$successCode) {
            const index = this.restaurants.findIndex(
              (r) =>
                r.reviews.findIndex((re) => re.id === this.newReview.id) != -1
            );
            if (index === -1) throw "리뷰 수정 중 오류가 발생하였습니다.";

            const res = this.restaurants[index];
            const reviewIndex = res.reviews.findIndex(
              (r) => r.id === this.newReview.id
            );
            // const review = res.reviews[reviewIndex];
            res.reviews[reviewIndex] = { ...this.newReview };

            this.revDialog = false;
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
    deleteReview() {
      this.$http
        .delete(`${this.$apiUrl}/review`, {
          data: { id: this.deleteTargetId },
        })
        .then((res) => {
          if (res.data[0].statusCode === this.$successCode) {
            const index = this.restaurants.findIndex(
              (r) =>
                r.reviews.findIndex((re) => re.id === this.deleteTargetId) != -1
            );
            if (index === -1) throw "리뷰 삭제 중 오류가 발생하였습니다.";

            const res = this.restaurants[index];

            const reviewIndex = res.reviews.findIndex(
              (r) => r.id === this.deleteTargetId
            );
            res.reviews.splice(reviewIndex, 1);
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
        restaurant_id: "",
        restaurant_name: "",
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

.actionItem {
  cursor: pointer;

  &:last-child {
    margin-right: 10px;
  }
}
</style>
