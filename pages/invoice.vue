<template>
    <v-data-table :search="search" :custom-filter="filterText" :headers="headers" :loading="loading" :items="invoices"
        item-key="id" show-expand sort-by="id" class="elevation-1" :single-expand="singleExpand" :expanded.sync="expanded">
        <template v-slot:top>
            <v-toolbar flat>
                <v-toolbar-title>Invoices</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>

                <v-text-field v-model="search" label="Search" class="mx-4"></v-text-field>

                <v-divider class="mx-4" inset vertical />
                <v-dialog v-model="dialog" fullscreen>
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                            New Invoice
                        </v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                            <span class="text-h5">{{ formTitle }}</span>
                        </v-card-title>

                        <v-card-text>

                            <v-container>
                                <v-stepper v-model="e1">
                                    <v-stepper-header>
                                        <v-stepper-step :complete="e1 > 1" step="1">
                                            Enter Number
                                        </v-stepper-step>

                                        <v-divider></v-divider>
                                        <v-stepper-step :complete="e1 > 2" step="2">
                                            Select / Add Customer
                                        </v-stepper-step>

                                        <v-divider></v-divider>

                                        <v-stepper-step :complete="e1 > 3" step="3">
                                            Select Products
                                        </v-stepper-step>

                                        <v-divider></v-divider>

                                        <v-stepper-step step="4">
                                            Done
                                        </v-stepper-step>
                                    </v-stepper-header>

                                    <v-stepper-items>
                                        <v-stepper-content step="1">


                                            <v-row>
                                                <v-col cols="12" sm="6" md="4">
                                                    <v-combobox :v-model="invoice_cust" :value="invoice_cust"
                                                        :items="customers" :filter="customFilter" @change="autochange"
                                                        @keyup="keyautochange" item-text="number" solo filled
                                                        label="Phone Number"></v-combobox>
                                                </v-col>
                                            </v-row>

                                            <v-alert dense v-if="error" outlined type="error">
                                                {{ errorText }}
                                            </v-alert>



                                            <v-btn color="primary" @click="stepper_one">
                                                Continue
                                            </v-btn>
                                        </v-stepper-content>

                                        <v-stepper-content step="2">
                                            <v-container v-if="isNewCustomer && e1 === 2">
                                                <h3>Add new Customer </h3>
                                                <v-row>
                                                    <v-col cols="12" sm="6" md="4">
                                                        <v-text-field :rules="nameRules" v-model="newCustomer.name"
                                                            label="Name"></v-text-field>
                                                    </v-col>
                                                </v-row>
                                                <v-row>
                                                    <v-col cols="12" sm="6" md="4">
                                                        <v-text-field v-model="newCustomer.careof"
                                                            label="Care of"></v-text-field>
                                                    </v-col>
                                                </v-row>
                                                <v-row>
                                                    <v-col cols="12" sm="6" md="4">
                                                        <v-text-field v-model="newCustomer.description"
                                                            label="Description"></v-text-field>
                                                    </v-col>
                                                </v-row>
                                                <v-row>
                                                    <v-col cols="12" sm="6" md="4">
                                                        <v-text-field :rules="nameRules" v-model="newCustomer.address"
                                                            label="Address"></v-text-field>
                                                    </v-col>
                                                </v-row>
                                                <v-row>
                                                    <v-col cols="12" sm="6" md="4">
                                                        <v-text-field disabled v-model="newCustomer.number" type="Number"
                                                            label="Phone Number"></v-text-field>
                                                    </v-col>
                                                </v-row>
                                                <v-row>
                                                    <v-col cols="12" sm="6" md="4">
                                                        <v-text-field disabled v-model="newCustomer.balance"
                                                            label="Old Balance"></v-text-field>
                                                    </v-col>
                                                </v-row>
                                                <v-row>
                                                    <v-col cols="12" sm="6" md="4">
                                                        <v-text-field disabled v-model="newCustomer.monthlypayf"
                                                            type="Number" label="EMI (Min)"></v-text-field>
                                                    </v-col>
                                                </v-row>
                                                <v-row>
                                                    <v-col cols="12" sm="6" md="4">
                                                        <v-text-field disabled v-model="newCustomer.monthlypayr"
                                                            type="Number" label="EMI (Max)"></v-text-field>
                                                    </v-col>
                                                </v-row>
                                                <v-row>
                                                    <v-col cols="12" sm="6" md="4">
                                                        <v-text-field disabled v-model="newCustomer.dueday" type="Number"
                                                            label="Day of Payment"></v-text-field>
                                                    </v-col>
                                                </v-row>

                                                <v-alert dense v-if="error" outlined type="error">
                                                    {{ errorText }}
                                                </v-alert>
                                            </v-container>


                                            <v-container v-if="!isNewCustomer && e1 === 2">
                                                <h3>Selected Customer is: </h3>
                                                <v-card>
                                                    <v-card-title>{{ invoice_cust.name }}</v-card-title>
                                                    <v-card-subtitle>{{ invoice_cust.number }}</v-card-subtitle>
                                                    <v-card-text>
                                                        {{ invoice_cust.address }}
                                                    </v-card-text>
                                                </v-card>

                                            </v-container>

                                            <v-btn color="primary" @click="stepper_two">
                                                Save & Continue
                                            </v-btn>

                                            <v-btn text @click="steper_back_one">
                                                Back
                                            </v-btn>
                                        </v-stepper-content>

                                        <v-stepper-content step="3">
                                            <v-container>
                                                <v-alert v-if="editedIndex != -1" dense border="left" type="warning">
                                                    Please <strong> Re-Select Items </strong> again during
                                                    <strong>Editing</strong> To prevent overlaps
                                                </v-alert>
                                                <v-data-table :search="items_search" :custom-filter="filterText"
                                                    v-model="selectedItems" :headers="headersItem" :items="items"
                                                    item-key="name" show-select class="elevation-1">
                                                    <template v-slot:top>
                                                        <v-toolbar flat>

                                                            <v-toolbar-title>Select Products</v-toolbar-title>
                                                            <v-divider class="mx-4" inset vertical></v-divider>

                                                            <v-text-field v-model="items_search" label="Search"
                                                                class="mx-4"></v-text-field>
                                                        </v-toolbar>
                                                    </template>
                                                    <template #[`item.qty`]="{ item }">
                                                        <v-btn class="mx-2" fab dark small color="primary"
                                                            @click="qty_minus(item)">
                                                            <v-icon dark>
                                                                mdi-minus
                                                            </v-icon>
                                                        </v-btn>
                                                        {{ item.qty }}
                                                        <v-btn class="mx-2" fab dark small color="primary"
                                                            @click="qty_plus(item)">
                                                            <v-icon dark>
                                                                mdi-plus
                                                            </v-icon>
                                                        </v-btn>
                                                    </template>
                                                    <template #[`item.totalp`]="{ item }">
                                                        {{ item.totalp }}
                                                    </template>
                                                </v-data-table>
                                            </v-container>


                                            <v-btn color="primary" @click="steper_three">
                                                Generate

                                            </v-btn>


                                        </v-stepper-content>

                                        <v-stepper-content step="4">
                                            <v-container>
                                                <v-alert type="success">Created Invoice Successfully</v-alert>
                                            </v-container>

                                        </v-stepper-content>
                                    </v-stepper-items>
                                </v-stepper>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="close">
                                Close
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
                        <v-card-title  class="text-h5">Capture Payment For invoice </v-card-title>
                        <v-card-text>
                            <v-row>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-select v-model="selectedMode" :items="PaymentModes"
                                            label="Mode of Payment"></v-select>
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

            <v-icon small class="mr-2" @click="viewInvoice(item)">mdi-eye</v-icon>

            <v-icon small @click="deleteItem(item)">
                mdi-delete
            </v-icon>

            <v-icon small @click="capturePayment(item)">
                mdi-cash-edit
            </v-icon>
        </template>
        <template #[`item.status`]="{ item }">
            <v-chip v-model="item.status" :color="item.status === 'paid' ? 'green lighten-2' : 'red lighten-2'">
                {{ item.status }}
            </v-chip>
        </template>
        <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">


                <v-simple-table>
                    <template>
                        <thead>
                            <tr>
                                <th class="text-left">
                                    Name
                                </th>
                                <th class="text-left">
                                    QTY
                                </th>
                                <th class="text-left">
                                    Sub total
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr v-for="i in item.items" :key="i.name">
                                <td>{{ i.name }}</td>
                                <td>{{ i.qty }}</td>
                                <td>{{ i.totalp }}</td>
                            </tr>
                        </tbody>
                    </template>
                </v-simple-table>
                Created on: {{ new Date(item.Date) }}
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
        e1: 1,
        invoice_cust: '',
        expanded: [],
        selectedMode: '',
        singleExpand: true,
        dialogDelete: false,
        dialogPayment: false,
        editedIndex: -1,
        search: '',
        items_search: '',
        isNewCustomer: false,
        error: false,
        errorText: '',
        selectedItems: [],
        PaymentModes: ["Cash", "UPI", "Stripe"],
        nameRules: [
            v => !!v || 'Name is required',
        ],
        headers: [
            {
                text: 'id',
                align: 'start',
                sortable: false,
                value: 'id',
            },
            { text: 'total', value: 'total', sortable: true },
            { text: 'Status', align: 'center', value: 'status', sortable: false },
            { text: 'Customer Name', value: 'customer.name', sortable: false },
            { text: 'Customer Phone', value: 'customer.number', sortable: false },
            { text: 'Actions', value: 'actions', sortable: false },
        ],
        headersItem: [
            {
                text: 'Product',
                align: 'start',
                sortable: true,
                filterable: true,
                value: 'name'
            },
            { text: 'Price', align: 'center', value: 'price' },
            { text: 'Type', align: 'center', value: 'type' },
            { text: 'QTY', align: 'center', value: 'qty' },
            { text: 'Sub total', align: 'center', value: 'totalp' }
        ],

        editedItem: {
            items: [],
            customer: {},
            total: 0,
        },
        defaultItem: {
            items: [],
            customer: {},
            total: 0,
        },
        newCustomer: {
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
            return this.editedIndex === -1 ? 'New Invoice' : 'Edit Invoice'
        },
        customers() {
            return cloneDeep(this.$store.state.customers)
        },
        items() {
            return cloneDeep(this.$store.state.products_qty)
        },
        invoices() {
            return cloneDeep(this.$store.state.invoices)
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
            this.$store.dispatch('getInvoices')
            this.$store.dispatch('getCustomers')
            this.$store.dispatch('getItems')
        },

        viewInvoice(item) {
            this.$router.push("/invoices/" + item.id)
        },



        qty_plus(item) {
            item.qty = item.qty + 1
            item.totalp = item.price * item.qty

        },

        qty_minus(item) {
            if (item.qty <= 1) {
                item.qty = 1
            }
            else {
                item.qty = item.qty - 1
            }
            item.totalp = item.price * item.qty

        },

        steper_back_one() {
            this.invoice_cust = ''
            this.e1 = this.e1 - 1
        },

        steper_three() {
            let total = 0
            this.selectedItems.forEach((item) => {
                total += item.totalp
            })
            this.editedItem.total = total
            this.editedItem.items = this.selectedItems
            console.log(this.editedItem)
            if (this.editedIndex != -1) {
                this.$store.dispatch("editInvoice", this.editedItem)
            } else {
                this.$store.dispatch("addInvoice", this.editedItem)
            }

            this.e1 = 4
        },


        stepper_two() {

            if (this.isNewCustomer) {
                // make add customer api call 
                // proceed
                this.saveCustomer().then(() => {
                    try {
                        let converted = Number(this.newCustomer.number)
                        if (this.checkObjectByNumber(this.customers, converted)) {
                            let temp = this.getObjectByNumber(this.customers, converted)
                            this.editedItem.customer = temp
                            this.error = false
                            this.errorText = ''
                            this.e1 = 3
                        } else {
                            throw "Customer Profile Not avaliable"
                        }
                    }
                    catch (e) {

                        this.error = true
                        this.errorText = e
                    }
                })


            } else {
                this.editedItem.customer = this.invoice_cust
                this.e1 = 3
            }
        },


        stepper_one() {
            if (typeof (this.invoice_cust) === 'string') {
                try {
                    if (this.invoice_cust != '' && this.invoice_cust.length === 10) {
                        let converted = Number(this.invoice_cust)
                        console.log(converted)
                        if (this.checkObjectByNumber(this.customers, converted)) {
                            let temp = this.getObjectByNumber(this.customers, converted)
                            this.invoice_cust = temp
                            this.error = false
                            this.errorText = ''
                            this.isNewCustomer = false
                            this.e1 = 2

                        }
                        else {
                            // maybe new customer
                            // procede to next step
                            console.log("new customer")
                            this.isNewCustomer = true
                            this.error = false
                            this.errorText = ''
                            this.newCustomer.number = this.invoice_cust
                            this.e1 = 2

                        }
                    } else {
                        throw "Not a valid phone number"
                    }
                }
                catch (e) {
                    this.error = true
                    this.errorText = e
                    console.log(e)
                }
            }
            else if (typeof (this.invoice_cust) === 'object') {
                // returning customer  assign and proceed to next 
                this.error = false
                this.errorText = ''
                this.isNewCustomer = false
                this.e1 = 2
            }
            else {
                this.error = true
                this.errorText = 'Check the Number and try again'
            }
        },

        getObjectByNumber(objects, number) {
            return objects.find(obj => obj.number === number);
        },

        checkObjectByNumber(objects, number) {
            return objects.some(obj => obj.number === number);
        },

        autochange(value) {

            this.invoice_cust = value
        },

        keyautochange(event) {

            this.invoice_cust = event.target.value
        },

        customFilter(item, queryText, itemText) {
            const textOne = item.number.toString();

            const searchText = queryText

            return textOne.indexOf(searchText) > -1
        },

        editItem(item) {
            this.editedIndex = this.invoices.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.invoice_cust = item.customer
            let editItemsData = this.replaceObjectsById(item.items, this.items)
            this.$store.dispatch("setEditDataInv", editItemsData)
            //this.selectedItems = item.items
            this.dialog = true
        },

        deleteItem(item) {
            this.editedItem = item
            this.dialogDelete = true
        },

        capturePayment(item) {
            this.editedItem = item
            this.dialogPayment = true
        },

        capturePaymentConfirm() {
            let data = {
                invoiceId: this.editedItem.id,
                custId: this.editedItem.customer.id,
                amount: Number(this.editedItem.total),
                stripeid: 'none',
                mode: this.selectedMode
            }
            this.$store.dispatch("addPaymentsInvoice", data)
            this.closePayment()
        },

        deleteItemConfirm() {
            this.$store.dispatch("deleteInvoice", this.editedItem.id)
            this.closeDelete()
        },

        close() {
            this.editedItem = cloneDeep(this.defaultItem)
            this.editedIndex = -1
            this.selectedItems = []
            this.invoice_cust = ''
            this.e1 = 1
            this.$store.dispatch("getItems")
            this.dialog = false
        },

        closeDelete() {
            this.editedItem = cloneDeep(this.defaultItem)
            this.dialogDelete = false
        },

        closePayment() {
            this.selectedMode = ''
            this.editedItem = cloneDeep(this.defaultItem)
            this.dialogPayment = false
        },

        replaceObjectsById(a, b) {
            // Iterate through each object in array b
            for (let i = 0; i < b.length; i++) {
                // Get the id of the current object in array b
                let currentId = b[i].id;

                // Find the corresponding object in array a with the same id
                let matchingObject = a.find(obj => obj.id === currentId);

                // If a matching object is found in array a, replace the current object in array b
                if (matchingObject) {
                    b[i] = matchingObject;
                }
            }
            return b;
        },

        async saveCustomer() {
            if (this.newCustomer.name != "" && this.newCustomer.careof != "" &&
                this.newCustomer.number != "" &&
                this.newCustomer.address != "" &&
                this.newCustomer.nextdue != "") {
                let data = this.newCustomer

                await this.$store.dispatch("addCustomer", data)

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
    