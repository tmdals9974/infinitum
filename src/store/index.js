import Vue from "vue";
import Vuex from "vuex";

Vue.use(Vuex);

export default new Vuex.Store({
  state: {
    users: [],
    userName: "",
  },
  mutations: {
    setUsers(state, payload) {
      state.users = payload;
    },
    addUser(state, payload) {
      const index = state.users.findIndex((user) => user.name === payload.name);
      if (index !== -1) state.users.splice(index, 1);

      state.users.push(payload);
    },
    setUserName(state, payload) {
      state.userName = payload;
    },
  },
  actions: {},
  modules: {},
});
