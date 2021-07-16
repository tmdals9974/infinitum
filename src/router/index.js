import Vue from "vue";
import VueRouter from "vue-router";

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    redirect: { name: "restaurant-review" },
  },
  {
    path: "/restaurantReview",
    name: "restaurant-review",
    component: require("@/views/RestaurantReview").default,
  },
  {
    path: "/blind",
    name: "blind",
    component: require("@/views/Blind").default,
  },
  {
    path: "/calendar",
    name: "calendar",
    component: require("@/views/Calendar").default,
  },
  {
    path: "/drive",
    name: "drive",
    component: require("@/views/Drive").default,
  },
  {
    path: "/config",
    name: "config",
    component: require("@/views/Config").default,
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
