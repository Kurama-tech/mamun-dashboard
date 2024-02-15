<template>
  <v-data-table :search="search" :custom-filter="filterText" :headers="headers" :loading="loading" :items="customers"
    item-key="name" show-expand sort-by="name" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Customers</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-text-field v-model="search" label="Search" class="mx-4"></v-text-field>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-dialog v-model="dialog">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              New Customer
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field :rules="nameRules" v-model="editedItem.name" label="Name"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.careof" label="Care of"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.description" label="Description"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field :rules="nameRules" v-model="editedItem.address" label="Address"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.number" type="Number" label="Phone Number"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.balance" label="Old Balance"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.monthlypayf" type="Number" label="EMI (Min)"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.monthlypayr" type="Number" label="EMI (Max)"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.dueday" type="Number" label="Day of Payment"></v-text-field>
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="close">
                Cancel
              </v-btn>
              <v-btn color="blue darken-1" text @click="save">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Are you sure you want to delete this item?</v-card-title>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogPayment" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">Capture Payment For Customer </v-card-title>
            <v-card-text>
              <v-row>
                <v-col cols="12" sm="6" md="4">
                  <v-select v-model="selectedMode" :items="PaymentModes" label="Mode of Payment"></v-select>
                </v-col>
              </v-row>
              <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="amount" type="Number" label="Amount"></v-text-field>
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="stripeId"  label="Stripe Id / Txn ID"></v-text-field>
                  </v-col>
                </v-row>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="blue darken-1" text @click="closePayment">Cancel</v-btn>
              <v-btn color="blue darken-1" text @click="capturePaymentConfirm">OK</v-btn>
              <v-spacer></v-spacer>
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
      <v-icon small class="mr-2" @click="editItem(item)">
        mdi-pencil
      </v-icon>
      <v-icon small @click="deleteItem(item)">
        mdi-delete
      </v-icon>
      <v-icon small @click="capturePayment(item)">
        mdi-cash-edit
      </v-icon>
    </template>
    <template #[`item.status`]="{ item }">
      <v-chip v-model="item.status" :color="item.status === 'active' ? 'green lighten-2' : 'red lighten-2'"
        @click="editStatus(item)">
        {{ item.status === 'active' ? 'Enabled' : 'Disabled' }}
      </v-chip>
    </template>
    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length">
        Description : {{ item.description }} / Created on: {{ new Date(item.CapturedTimestamp) }}

      </td>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">
        Reset
      </v-btn>
    </template>
  </v-data-table>
</template>
  
<script>
import { cloneDeep } from 'lodash'
export default {
  data: () => ({
    dialog: false,
    expanded: [],
    amount: 0,
    stripeId: '',
    singleExpand: false,
    dialogDelete: false,
    editedIndex: -1,
    dialogPayment: false,
    selectedMode: '',
    PaymentModes: ["Cash", "UPI", "Stripe"],
    search: '',
    nameRules: [
      v => !!v || 'Name is required',
    ],
    headers: [
      {
        text: 'Name',
        align: 'start',
        sortable: false,
        value: 'name',
      },
      { text: 'Care of', value: 'careof', sortable: false },
      { text: 'Number', value: 'number', sortable: false },
      { text: 'Address', value: 'address', sortable: false },
      { text: 'Balance', value: 'balance', sortable: true },
      { text: 'Due Date', value: 'dueday', sortable: false },
      { text: 'EMI (min)', value: 'monthlypayf', sortable: true },
      { text: 'EMI (max)', value: 'monthlypayr', sortable: true },
      { text: 'Status', align: 'center', value: 'status', sortable: false },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    editedItem: {
      name: '',
      careof: '',
      number: 0,
      address: '',
      balance: 0,
      dueday: 1,
      description: '',
      monthlypayf: 0,
      monthlypayr: 0,
    },
    defaultItem: {
      name: '',
      careof: '',
      number: 0,
      address: '',
      balance: 0,
      dueday: 1,
      description: '',
      monthlypayf: 0,
      monthlypayr: 0,
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Customer' : 'Edit Customer'
    },
    customers() {
      return cloneDeep(this.$store.state.customers)
    },
    loading() {
      return this.$store.state.loading
    }
  },

  watch: {
    dialog(val) {
      val || this.close()
    },
    dialogDelete(val) {
      val || this.closeDelete()
    },
  },

  created() {
    this.initialize()
  },

  methods: {
    initialize() {
      this.$store.dispatch('getCustomers')
    },

    editItem(item) {
      this.editedIndex = this.customers.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem(item) {
      this.editedItem = item
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.$store.dispatch("deleteCustomer", this.editedItem.id)
      this.closeDelete()
    },

    capturePayment(item) {
      this.editedItem = item
      this.dialogPayment = true
    },

    capturePaymentConfirm() {
      if(this.amount > 0){
      let data = {
        custId: this.editedItem.id,
        amount: Number(this.amount),
        stripeid: this.stripeId,
        mode: this.selectedMode
      }
      this.$store.dispatch("addPayments", data)
      this.closePayment()}
    },

    close() {
      this.editedItem = cloneDeep(this.defaultItem)
      this.dialog = false
    },

    closeDelete() {
      this.editedItem = cloneDeep(this.defaultItem)
      this.dialogDelete = false
    },

    closePayment() {
      this.selectedMode = ''
      this.stripeId = ''
      this.amount = 0
      this.editedItem = cloneDeep(this.defaultItem)
      this.dialogPayment = false
    },

    editStatus(item) {
      this.$store.commit("setLoading", true)
      if (item.status === "active") {
        this.$store.dispatch("disableCustomer", item.id)
      } else {
        this.$store.dispatch("enableCustomer", item.id)
      }
      this.$store.commit("setLoading", false)
    },

    save() {
      if (this.editedItem.name != "" && this.editedItem.careof != "" &&
        this.editedItem.number != "" &&
        this.editedItem.address != "" &&
        this.editedItem.balance != "" &&
        this.editedItem.nextdue != "" &&
        this.editedItem.monthlypayf != 0 && this.editedItem.monthlypayr != 0) {
        let data = this.editedItem
        if (this.editedIndex === -1) {
          this.$store.dispatch("addCustomer", data)
        } else {
          this.$store.dispatch("editCustomer", data)
        }

        this.close()
      }
    },
    filterText(value, search, item) {
      return value != null &&
        search != null &&
        typeof value === 'string' &&
        value.toString().toLocaleLowerCase().indexOf(search) !== -1
    },
  },
}
</script>
  