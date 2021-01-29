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