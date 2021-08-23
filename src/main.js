import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import axios from "axios";

import vuetify from "./plugins/vuetify";

import Toast from "vue-toastification";
import "vue-toastification/dist/index.css";

Vue.config.productionTip = false;

Vue.prototype.$http = axios;
Vue.prototype.$apiUrl =
  process.env.NODE_ENV !== "production" ? "http://localhost:5000" : "/api";
// process.env.NODE_ENV !== "production"
//   ? "http://ec2-13-125-226-102.ap-northeast-2.compute.amazonaws.com/api"
//   : "/api";
Vue.prototype.$successCode = 200;
Vue.prototype.$numberWithComma = function (x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
};
Vue.prototype.$nameToColor = function (users, name) {
  const index = users.findIndex((user) => user.name === name);
  if (index === -1) return { back_color: "#ffffff", font_color: "#000000" };
  return {
    back_color: users[index].back_color,
    font_color: users[index].font_color,
  };
};
Vue.prototype.$defaultToastOption = {
  position: "top-right",
  timeout: 5000,
  closeOnClick: true,
  pauseOnFocusLoss: true,
  pauseOnHover: true,
  draggable: true,
  draggablePercent: 0.6,
  showCloseButtonOnHover: false,
  hideProgressBar: false,
  closeButton: "button",
  icon: true,
  rtl: false,
};

Vue.use(Toast, {
  transition: "Vue-Toastification__bounce",
  maxToasts: 10,
  newestOnTop: true,
});

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
