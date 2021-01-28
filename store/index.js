// import Vuex from "vuex";

// const store = () => new Vuex.Store({
//     state: {
//         counter: 0
//     },

//     mutations: {
//         increment: (state) => {
//             state.counter++;
//         }
//     }
// })

// export default store;

import Vue from "vue";
import globalTest from "~/mixin.js/global.js";
Vue.mixin(globalTest);

export const state = () => ({
    userName: 'default'
  })
  export const mutations = {
    updateUserName(state, value) {
      state.userName = value
    }
  }
  export const actions = {
    getUserName(context) {
      return this.$axios
        .get('https://jsonplaceholder.typicode.com/users/1')
        .then((res) => {
          context.commit('updateUserName', res.data.name)
        })
    }
}