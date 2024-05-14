const URL = "https://dumdum-api.mamun.app/api/"
//const URL = "http://localhost:8001/"

export const state = () => ({
  counter: 0,
  loading: false,
  users: [],
  requirements: [],
  payment: {},
  loggedIn: false,
  showauthErr: false,
  authErr: ''
})

export const getters = {
  getCounter(state) {
    return state.counter
  },
}

export const mutations = {
  increment(state) {
    state.counter++
  },
  setUsers(state, value) {
    state.users = value
  },
  setPayment(state,value){
    state.payment = value
  },
  
  setRequirements(state, value) {
    state.requirements = value
  },

  setLoading(state, value){
    state.loading = value
  }
}

export const actions = {
  
  async deleteItem(context, id) {
    const result = await this.$axios.$delete(URL + "users/delete/" + id)
    await context.dispatch("getItems")
    console.log(result)
  },
  async disableItem(context, id) {
    const result = await this.$axios.$delete(URL + "users/disable/" + id)
    await context.dispatch("getItems")
    console.log(result)
  },
  async enableItem(context, item) {
    const result = await this.$axios.$get(URL + "users/enable/" + item.id + "/" + item.userid)
    await context.dispatch("getItems")
    console.log(result)
  },

  async closeRequirement(context, item) {
    const result = await this.$axios.$post(URL + "requirements/close/" + item.id + "/" + item.userid)
    await context.dispatch("getRequirements")
    console.log(result)
  },

  async editRequirement(context, item){
    const result = await this.$axios.$put(URL + "requirements/update/" + item.id, item)
    await context.dispatch("getRequirements")
    console.log(result)
  },

  async editPayment(context, item){
    const result = await this.$axios.$post(URL + "updatePayment", item)
    await context.dispatch("getPaymentsProfile")
    console.log(result)
  },

  async getItems(context) {
    context.commit("setLoading", true)
    const result = await this.$axios.$get(URL + "users")
    if (result != null) {
      context.commit("setUsers", result)
      context.commit("setLoading", false)
    }
    context.commit("setLoading", false)
  },

  async getRequirements(context) {
    context.commit("setLoading", true)
    const result = await this.$axios.$get(URL + "requirements")
    
    if (result != null) {
      const newResult = []
      result.forEach(element => {
        const foundObject = context.state.users.find(item => item.userid === element.userid);
        element.user = foundObject
        newResult.push(element)
      });
      context.commit("setRequirements", newResult)
      context.commit("setLoading", false)
    }
    context.commit("setLoading", false)
  },

  async getPaymentsProfile(context){
    context.commit("setLoading", true)
    const result = await this.$axios.$get(URL + "payment/list/64cf821cb21ffb7da82615f0" )
    if (result != null) {
      context.commit("setPayment", result[0])
      context.commit("setLoading", false)
    }
    context.commit("setLoading", false)

  }
}