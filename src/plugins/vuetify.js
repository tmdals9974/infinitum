import Vue from "vue";
import Vuetify from "vuetify/lib/framework";

import "@/scss/_index.scss";

Vue.use(Vuetify);

export default new Vuetify({
  theme: {
    themes: {
      light: {
        primary: "#1565C0",
      },
    },
  },
});
