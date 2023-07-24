const URL = "https://api.jwcindia.com/"
//const URL = "http://localhost:8001/"

export const state = () => ({
  counter: 0,
  tables: [],
  type: ["Parent"],
  loading: false,
  select: [],
  home: [],
  products: [],
  loggedIn: false,
  NoChilds: 0,
  NoParents: 0,
  showauthErr: false,
  authErr: ''
})

export const getters = {
  getCounter(state) {
    return state.counter
  },
  getTables(state) {
    return state.tables
  }
}

export const mutations = {
  increment(state) {
    state.counter++
  },
  setTables(state, value) {
    state.tables = value
  },
  setProducts(state, value) {
    let counterParent = 0
    let counterChild = 0
    state.products = value
    value.forEach((item) =>{
      if(item.type === "Parent"){
       
        counterParent = counterParent + 1
       
      }else {
        counterChild = counterChild + 1
        
      }
    })
    state.NoChilds = counterChild
    state.NoParents = counterParent
  },
  setType(state, value) {
    state.type = value
  },
  setSelect(state, value) {
    state.select = value
  },
  setLoading(state, value){
    state.loading = value
  },
  setHome(state, value){
    state.home = value
  },
  setloggedIn(state, value){
    state.loggedIn = value
  },
  setshowauthErr(state, value){
    state.authErr = value.str
    state.showauthErr = value.bool
  },
}

export const actions = {
  async fetchCounter({ state, commit }) {
    // make request
    const res = { data: 10 };
    state.counter = res.data;
    commit("increment")
    return res.data;
  },

  async addTable(context, data) {
    const result = await this.$axios.$post(URL + "tables", data)
    await context.dispatch("getTables")
    console.log(result)
  },
  async login(context, data){
    context.commit("setLoading", true)
    try {
      const result = await this.$axios.post(URL + "login", data, {
        withCredentials: true
      })
      if(result.status == 200){
        context.commit("setshowauthErr", {str: "", bool: false})
        context.commit("setloggedIn", true)
        context.commit("setLoading", false)
        this.$router.push('/')
      }
      else{
        context.commit("setshowauthErr", {str: "Invalid creds/ Unauthorized", bool: true})
        context.commit("setLoading", false)
      }
    } catch (error) {
      context.commit("setshowauthErr", {str: "Invalid creds/ Unauthorized", bool: true})
      context.commit("setLoading", false)
    }
    
  },
  logout(context){
    document.cookie = 'jwt=; expires=Thu, 01 Jan 1970 00:00:00 UTC;'

    // Optional: Perform any additional cleanup or state updates here

    // Redirect to the login page
    this.$router.push('/login')
  },
  async getTables(context) {
    const result = await this.$axios.$get(URL + "tables")
    if (result != null) {
      context.commit("setTables", result)
    }
  },
  async deleteTable(context, id) {
    const result = await this.$axios.$delete(URL + "tables/" + id)
    await context.dispatch("getTables")
    console.log(result)
  },
  async deleteItem(context, id) {
    const result = await this.$axios.$delete(URL + "items/" + id)
    await context.dispatch("getItems")
    console.log(result)
  },
  async deleteHomeItem(context, id) {
    const result = await this.$axios.$delete(URL + "home/" + id)
    await context.dispatch("getHomeItems")
    console.log(result)
  },
  async disableItem(context, id) {
    const result = await this.$axios.$delete(URL + "items/disabled/" + id)
    await context.dispatch("getItems")
    console.log(result)
  },
  async enableItem(context, id) {
    const result = await this.$axios.$get(URL + "items/enabled/" + id)
    await context.dispatch("getItems")
    console.log(result)
  },

  setSelectList(context) {
    let list = []
    context.state.products.forEach((item) => {
      if (item.type != "Child") {
        let i = {

          text: item.name,
          value: item.id,
          disabled: false,
        }
        list.push(i)
      }
    })
    context.commit("setSelect", list)

  },

  async getItems(context) {
    context.commit("setLoading", true)
    const result = await this.$axios.$get(URL + "items")
    if (result != null) {
      context.commit("setProducts", result)
      context.commit("setType", ["Child", "Parent"])
      context.dispatch("setSelectList")
      context.commit("setLoading", false)
    }
    context.commit("setLoading", false)
  },

  async getHomeItems(context) {
    context.commit("setLoading", true)
    const result = await this.$axios.$get(URL + "home")
    if (result != null) {
      context.commit("setHome", result)
      context.commit("setLoading", false)
    }else {
      context.commit("setHome", [])
    }
    context.commit("setLoading", false)
  },

  async addItem(context, data) {
    context.commit("setLoading", true)
    const formData = new FormData();
    data.files.forEach((value) => {
      formData.append('files', value);
    })
    console.log(formData)
    try {
      const response = await this.$axios.$post(URL + "upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      if (response != null) {
        console.log(response)
        let FinalRequest = {
          name: data.name,
          description: data.description,
          images: response,
          status: "active",
          type: data.type,
          parent: data.parent,
          tables: data.tables
        }

        await this.$axios.$post(URL + "items", FinalRequest).then(async (resp) => {
          context.commit("setLoading", false)
          await context.dispatch("getItems")
        }).catch((error) => {
          throw error
        })

      }
    } catch (error) {
      // Handle error
      context.commit("setLoading", false)
      console.error(error);
    }
  },


  async addHomeItem(context, data) {
    context.commit("setLoading", true)
    const formData = new FormData();
    
    formData.append('files', data.files);
    
    console.log(formData)
    try {
      const response = await this.$axios.$post(URL + "upload", formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      if (response != null) {
        console.log(response)
        let FinalRequest = {
          name: data.name,
          url: response[0]
        }

        await this.$axios.$post(URL + "home", FinalRequest).then(async (resp) => {
          context.commit("setLoading", false)
          await context.dispatch("getHomeItems")
        }).catch((error) => {
          throw error
        })

      }
    } catch (error) {
      // Handle error
      context.commit("setLoading", false)
      console.error(error);
    }
  },


  async editItem(context, data) {
    context.commit("setLoading", true)
    let imgMerge = []
    if (data.files != null) {
      const formData = new FormData();
      data.files.forEach((value) => {
        formData.append('files', value);
      })
      console.log(formData)
      try {
        const response = await this.$axios.$post(URL + "upload", formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }})
          if (response != null) {
            imgMerge = response
          }
      }  catch (error) {
        // Handle error
        context.commit("setLoading", false)
        console.error(error);
      }
    }

    const finalImages = data.images.concat(imgMerge);

    let FinalRequest = {
      id: data.id,
      name: data.name,
      description: data.description,
      images: finalImages,
      status: "active",
      type: data.type,
      parent: data.parent,
      tables: data.tables
    }
    console.log(FinalRequest)

    try {
      await this.$axios.$put(URL + "items/"+ data.id, FinalRequest).then(async (resp) => {
        await context.dispatch("getItems")
        context.commit("setLoading", false)
      }).catch((error) => {
        context.commit("setLoading", false)
        throw error
      })

    } catch (error) {
      // Handle error
      context.commit("setLoading", false)
      console.error(error);
    }
  }
}