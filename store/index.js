//const URL = "https://api.jwcindia.com/"
const URL = "https://omer-api.mamun.cloud/"

export const state = () => ({
  counter: 0,
  tables: [],
  type: ["Parent"],
  loading: false,
  select: [],
  customers: [],
  products: [],
  products_qty: [],
  payments: [],
  loggedIn: false,
  NoChilds: 0,
  invoices: [],
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
  setPayments(state, value) {
    state.payments = value
  },
  setProductsQty(state, value){
    state.products_qty = value
  },
  setProducts(state, value) {
   
    state.products = value
    let items_Qty = []
    value.forEach((item) => {
      let temp = { id: item.id, name: item.name, description: item.description, price: item.price, images: item.images, type: item.type, status: item.status, qty: 1, totalp: item.price }
      items_Qty.push(temp)
    })
    state.products_qty = items_Qty
   
  },
  setType(state, value) {
    state.type = value
  },
  setSelect(state, value) {
    state.select = value
  },
  setLoading(state, value) {
    state.loading = value
  },
  setCustomers(state, value) {
    state.customers = value
  },
  setInvoices(state, value) {
    state.invoices = value
  },
  setloggedIn(state, value) {
    state.loggedIn = value
  },
  setshowauthErr(state, value) {
    state.authErr = value.str
    state.showauthErr = value.bool
  },
}

export const actions = {

  setEditDataInv(context,data){
    context.commit("setProductsQty", data)
  },

  async addTable(context, data) {
    const result = await this.$axios.$post(URL + "tables", data)
    await context.dispatch("getTables")
    console.log(result)
  },
  async login(context, data) {
    context.commit("setLoading", true)
    try {
      const result = await this.$axios.post(URL + "login", data, {
        withCredentials: true
      })
      if (result.status == 200) {
        context.commit("setshowauthErr", { str: "", bool: false })
        context.commit("setloggedIn", true)
        context.commit("setLoading", false)
        this.$router.push('/')
      }
      else {
        context.commit("setshowauthErr", { str: "Invalid creds/ Unauthorized", bool: true })
        context.commit("setLoading", false)
      }
    } catch (error) {
      context.commit("setshowauthErr", { str: "Invalid creds/ Unauthorized", bool: true })
      context.commit("setLoading", false)
    }

  },
  logout(context) {
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
  async deleteItem(context, id) {
    const result = await this.$axios.$delete(URL + "items/" + id)
    await context.dispatch("getItems")
    console.log(result)
  },
  async deleteCustomer(context, id) {
    const result = await this.$axios.$delete(URL + "customer/" + id)
    await context.dispatch("getCustomers")
    console.log(result)
  },
  async revertPayment(context, id) {
    const result = await this.$axios.$delete(URL + "payments/revert/" + id)
    await context.dispatch("getPayments")
    console.log(result)
  },
  async deleteInvoice(context, id) {
    const result = await this.$axios.$delete(URL + "invoices/" + id)
    await context.dispatch("getInvoices")
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

  async setInvoiceStatus(context, data) {
    const result = await this.$axios.$get(URL + "invoices/status/" + data.id + "/" + data.status )
    await context.dispatch("getInvoices")
    console.log(result)
  },
  async disableCustomer(context, id) {
    const result = await this.$axios.$delete(URL + "customer/disabled/" + id)
    await context.dispatch("getCustomers")
    console.log(result)
  },
  async enableCustomer(context, id) {
    const result = await this.$axios.$get(URL + "customer/enabled/" + id)
    await context.dispatch("getCustomers")
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

  async getPayments(context) {
    context.commit("setLoading", true)
    const result = await this.$axios.$get(URL + "payments")
    if (result != null) {
      context.commit("setPayments", result)
      context.commit("setLoading", false)
    } else {
      context.commit("setPayments", [])
    }
    context.commit("setLoading", false)
  },

  async getCustomers(context) {
    context.commit("setLoading", true)
    const result = await this.$axios.$get(URL + "customers")
    if (result != null) {
      context.commit("setCustomers", result)
      context.commit("setLoading", false)
    } else {
      context.commit("setCustomers", [])
    }
    context.commit("setLoading", false)
  },

  async getInvoices(context) {
    context.commit("setLoading", true)
    const result = await this.$axios.$get(URL + "invoices")
    if (result != null) {
      context.commit("setInvoices", result)
      context.commit("setLoading", false)
    } else {
      context.commit("setInvoices", [])
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
          price: Number(data.price),

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


  async addCustomer(context, data) {
    context.commit("setLoading", true)
    try {

      let FinalRequest = {
        "name": data.name,
        "careof": data.careof,
        "number": Number(data.number),
        "address": data.address,
        "balance": Number(data.balance),
        "dueday": Number(data.dueday),
        "description": data.description,
        "status": "active",
        "monthlypayf": Number(data.monthlypayf),
        "monthlypayr": Number(data.monthlypayr)
      }

      await this.$axios.$post(URL + "customer", FinalRequest).then(async (resp) => {
        context.commit("setLoading", false)
        await context.dispatch("getCustomers")
      }).catch((error) => {
        throw error
      })
    } catch (error) {
      // Handle error
      context.commit("setLoading", false)
      console.error(error);
    }
  },

  async addInvoice(context, data) {
    context.commit("setLoading", true)
    try {

      let FinalRequest = data
      FinalRequest.status = "Due"

      await this.$axios.$post(URL + "invoices", FinalRequest).then(async (resp) => {
        context.commit("setLoading", false)
        await context.dispatch("getInvoices")
        await context.dispatch("getCustomers")
      }).catch((error) => {
        throw error
      })
    } catch (error) {
      // Handle error
      context.commit("setLoading", false)
      console.error(error);
    }
  },

  async addPayments(context, data) {
    context.commit("setLoading", true)
    try {

      let FinalRequest = data

      await this.$axios.$post(URL + "payment/capture", FinalRequest).then(async (resp) => {
        context.commit("setLoading", false)
        await context.dispatch("getPayments")
        await context.dispatch("getCustomers")

      }).catch((error) => {
        throw error
      })
    } catch (error) {
      // Handle error
      context.commit("setLoading", false)
      console.error(error);
    }
  },

  async addPaymentsInvoice(context, data) {
    context.commit("setLoading", true)
    try {

      let FinalRequest = data

      await this.$axios.$post(URL + "payment/capture/"+ data.invoiceId, FinalRequest).then(async (resp) => {
        context.commit("setLoading", false)
        await context.dispatch("getPayments")
        await context.dispatch("getInvoices")
      }).catch((error) => {
        throw error
      })
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
          }
        })
        if (response != null) {
          imgMerge = response
        }
      } catch (error) {
        // Handle error
        context.commit("setLoading", false)
        console.error(error);
      }
    }

    const finalImages = data.images.concat(imgMerge);
    console.log(finalImages)

    let FinalRequest = {
      id: data.id,
      name: data.name,
      description: data.description,
      images: finalImages,
      status: "active",
      type: data.type,
      price: data.price,

    }
    console.log(FinalRequest)

    try {
      await this.$axios.$put(URL + "items/" + data.id, FinalRequest).then(async (resp) => {
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
  },

  async editCustomer(context, data) {
    context.commit("setLoading", true)
    let FinalRequest = {
      id: data.id,
      name: data.name,
      careof: data.careof,
      number: Number(data.number),
      address: data.address,
      balance: Number(data.balance),
      dueday: Number(data.dueday),
      description: data.description,
      status: "active",
      monthlypayf: Number(data.monthlypayf),
      monthlypayr: Number(data.monthlypayr)

    }

    try {
      await this.$axios.$put(URL + "customer/" + data.id, FinalRequest).then(async (resp) => {
        await context.dispatch("getCustomers")
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
  },

  async editInvoice(context, data) {
    context.commit("setLoading", true)
    let FinalRequest = data
    FinalRequest.status = 'Due'

    try {
      await this.$axios.$put(URL + "invoices/" + data.id, FinalRequest).then(async (resp) => {
        await context.dispatch("getInvoices")
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
  },

  async editPayment(context, data) {
    context.commit("setLoading", true)
    let FinalRequest = data

    try {
      await this.$axios.$put(URL + "payments/" + data.id, FinalRequest).then(async (resp) => {
        await context.dispatch("getPayments")
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