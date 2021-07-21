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
Vue.prototype.$apiUrl = "http://localhost:5000";
Vue.prototype.$successCode = 200;
Vue.prototype.$numberWithComma = function (x) {
  return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
