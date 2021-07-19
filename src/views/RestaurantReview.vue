<template>
  <main>
    <v-toolbar flat color="white">
      <v-toolbar-title>오늘 뭐먹지?</v-toolbar-title>
    </v-toolbar>

    <v-data-table
      :headers="headers"
      :items="resturants"
      :page.sync="page"
      :items-per-page="itemsPerPage"
      hide-default-footer
      @page-count="pageCount = $event"
      multi-sort
      :expanded="expanded"
      item-key="id"
      class="mt-5"
      @click:row="tableRowClicked"
      :search="search"
      :custom-filter="filterResturants"
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
            'ma-0 pa-0': true,
            'expanded-closing': !transitioned[getItemId(item)],
          }"
          style="height: auto"
        >
          <v-expand-transition>
            <div v-show="transitioned[getItemId(item)]">
              <div class="pa-2" style="background: gray">Peek-a-boo!</div>
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
      expanded: [],
      transitioned: [],
      closeTimeouts: {},
      headers: [
        { text: "구분", value: "type" },
        { text: "위치", value: "position" },
        { text: "상호명", value: "name" },
      ],
      resturants: [],
    };
  },
  created: function () {
    this.$http.get(`${this.$apiUrl}/getResturants`).then((res) => {
      if (res.data[0].statusCode === this.$successCode) {
        this.resturants = res.data[1];
      }
    });
  },
  methods: {
    tableRowClicked(items, props) {
      this.toggleExpand(props);
    },
    filterResturants(value, search, item) {
      return JSON.stringify(item).includes(search);
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

<style scoped>
.expanded-closing {
  border-bottom: none !important;
}
</style>
