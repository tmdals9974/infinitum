import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: { name: "tutorial" },
  },
  {
    path: "/tutorial",
    name: "tutorial",
    component: require("@/views/Tutorial").default,
    beforeEnter(to, from, next) {
      if (localStorage.getItem("infi_user")) {
        return next({ path: "restaurantReview" });
      }
      next();
    },
  },
  {
    path: "/restaurantReview",
    name: "restaurant-review",
    component: require("@/views/RestaurantReview").default,
    beforeEnter(to, from, next) {
      if (!localStorage.getItem("infi_user")) {
        return next({ path: "/tutorial" });
      }
      next();
    },
  },
  {
    path: "/blind",
    name: "blind",
    component: require("@/views/Blind").default,
    beforeEnter(to, from, next) {
      if (!localStorage.getItem("infi_user")) {
        return next({ path: "/tutorial" });
      }
      next();
    },
  },
  {
    path: "/calendar",
    name: "calendar",
    component: require("@/views/Calendar").default,
    beforeEnter(to, from, next) {
      if (!localStorage.getItem("infi_user")) {
        return next({ path: "/tutorial" });
      }
      next();
    },
  },
  {
    path: "/drive",
    name: "drive",
    component: require("@/views/Drive").default,
    beforeEnter(to, from, next) {
      if (!localStorage.getItem("infi_user")) {
        return next({ path: "/tutorial" });
      }
      next();
    },
  },
  {
    path: "/config",
    name: "config",
    component: require("@/views/Config").default,
    beforeEnter(to, from, next) {
      if (!localStorage.getItem("infi_user")) {
        return next({ path: "/tutorial" });
      }
      next();
    },
  },
  {
    path: "/user",
    name: "user",
    component: require("@/views/User").default,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

export default router;
