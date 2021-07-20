<template>
  <main>
    <v-toolbar flat color="white">
      <v-toolbar-title>오늘 뭐먹지?</v-toolbar-title>
    </v-toolbar>

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
            <v-btn color="primary" block> 추가 </v-btn>
          </div>
        </div>
      </template>
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
            <div v-show="transitioned[getItemId(item)]">
              <v-row class="px-5 py-3 sub-table-tr" dense>
                <v-col cols="2">작성자</v-col>
                <v-col cols="2">메뉴</v-col>
                <v-col cols="1">별점</v-col>
                <v-col cols="7">평가</v-col>
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
                    :color="nameToColor(review.writer)"
                    size="34"
                  >
                    <span class="white--text">{{
                      getShortName(review.writer)
                    }}</span>
                  </v-avatar>
                </v-col>
                <v-col class="align-self-center" cols="2">
                  {{ review.menu }}
                </v-col>
                <v-col class="align-self-center" cols="1">
                  {{ review.rating }}
                </v-col>
                <v-col class="align-self-center" cols="7">
                  {{ review.reviews }}
                </v-col>
              </v-row>
            </div>
          </v-expand-transition>
        </td>
      </template>
    </v-data-table>
    <div class="text-center pt-3 pr-3 card-padding d-flex justify-end">
      <v-pagination
        v-model="page"
        :length="pageCount"
        circle
        color="primary"
        class="pagination"
      ></v-pagination>
    </div>
  </main>
</template>

<script>
export default {
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
      ],
      restaurants: [],
    };
  },
  created: function () {
    this.$http.get(`${this.$apiUrl}/getRestaurants`).then((res) => {
      if (res.data[0].statusCode === this.$successCode) {
        this.restaurants = res.data[1];
        this.loading = false;
      }
    });
  },
  methods: {
    nameToColor(name) {
      switch (name) {
        case "이용정":
          return "red";
        case "이승민":
          return "yellow";
        default:
          return "black";
      }
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
      this.closeTimeouts[id] = setTimeout(() =>
        this.$refs.vDataTable.expand(item, false)
      );
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
