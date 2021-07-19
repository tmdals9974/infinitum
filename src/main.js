import Vue from "vue";
import App from "./App.vue";
import "./registerServiceWorker";
import router from "./router";
import store from "./store";
import axios from "axios";

import "boxicons/css/boxicons.min.css";
import vuetify from "./plugins/vuetify";

Vue.config.productionTip = false;

Vue.prototype.$http = axios;
Vue.prototype.$apiUrl = "http://localhost:5000";
Vue.prototype.$successCode = 200;

new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount("#app");
