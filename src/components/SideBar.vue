<template>
  <v-navigation-drawer
    v-model="drawer"
    app
    absolute
    color="grey lighten-4"
    mini-variant
    permanent
  >
    <side-item
      @iconClick="$router.push('/restaurantReview')"
      :isActive="isActive('/restaurantReview')"
      :iconName="'mdi-food-fork-drink'"
      :tooltipText="'오늘 뭐먹지 ?'"
    ></side-item>

    <side-item
      @iconClick="$router.push('/calendar')"
      :isActive="isActive('/calendar')"
      :iconName="'mdi-calendar'"
      :tooltipText="'일정'"
    ></side-item>

    <side-item
      @iconClick="$router.push('/drive')"
      :isActive="isActive('/drive')"
      :iconName="'mdi-folder-open-outline'"
      :tooltipText="'공유 폴더'"
    ></side-item>

    <template v-slot:append>
      <v-divider class="mx-3 my-5"></v-divider>

      <side-item
        @iconClick="$router.push('/config')"
        :isActive="isActive('/config')"
        :iconName="'mdi-cog-outline'"
        :tooltipText="'설정'"
      ></side-item>

      <side-item
        @iconClick="$router.push('/user')"
        :isActive="isActive('/user')"
        :iconName="'mdi-account-outline'"
        :tooltipText="'정보'"
      ></side-item>
    </template>
  </v-navigation-drawer>
</template>

<script>
import SideItem from "./SideItem.vue";

export default {
  data: function () {
    return {
      activeMenu: "/restaurantReview",
    };
  },
  components: { SideItem },
  methods: {
    isActive(val) {
      return this.activeMenu === val;
    },
  },
  watch: {
    $route(to) {
      this.activeMenu = to.path;
    },
  },
};
</script>

<style lang="scss">
//툴팁부분
.side-menu-tooltip {
  &.active {
    > span {
      transition: color ease-in 0.25s;
      color: $color-main;
    }
  }

  > span {
    color: black;
  }
}

//아이콘부분
.side-menu {
  cursor: pointer;
  position: relative;

  &.active {
    transition: color ease-in 0.25s;
    color: $color-main;

    // &:before {
    //   content: "";
    //   height: 100%;
    //   width: 5px;
    //   left: 0;
    //   top: 0;
    //   position: absolute;
    //   border-radius: 0 20px 20px 0;
    //   background: $color-main;
    //   transition: all 0.25s ease;
    // }
  }
}

.v-icon:focus:after {
  //아이콘 클릭 시 백그라운드로 원이 생기는 현상 방지
  opacity: 0 !important;
}
</style>
