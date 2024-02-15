<template>
    <v-data-table :search="search" :custom-filter="filterText" :headers="headers" :loading="loading" :items="payments"
        item-key="name" show-expand sort-by="name" class="elevation-1">
        <template v-slot:top>
            <v-toolbar flat>
                <v-toolbar-title>Payments</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-text-field v-model="search" label="Search" class="mx-4"></v-text-field>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-dialog v-model="dialog">
                    <!--  <template v-slot:activator="{ on, attrs }">
              <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                New Payment
              </v-btn>
            </template> -->
                    <v-card>
                        <v-card-title>
                            <span class="text-h5">{{ formTitle }}</span>
                        </v-card-title>

                        <v-card-text>
                            <v-container>
                                <v-row>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.id" label="Payment Id" disabled></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.custId" label="Customer ID"
                                            disabled></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.stripeid"
                                            label="Stripe Payment ID (if applicable)"></v-text-field>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-select v-model="editedItem.mode" :items="PaymentModes"
                                            label="Mode of Payment"></v-select>
                                    </v-col>
                                </v-row>
                                <v-row>
                                    <v-col cols="12" sm="6" md="4">
                                        <v-text-field v-model="editedItem.amount" type="Number"
                                            label="Amount"></v-text-field>
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
                        <v-card-title class="text-h5">Are you sure you want to Revert this Payment and Delete it?</v-card-title>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                            <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
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
        </template>
        <template #[`item.CapturedTimestamp`]="{ item }">
            {{ new Date(item.CapturedTimestamp) }}
        </template>
        <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">
                Created on: {{ new Date(item.CapturedTimestamp) }}
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
        singleExpand: false,
        dialogDelete: false,
        editedIndex: -1,
        search: '',
        nameRules: [
            v => !!v || 'Name is required',
        ],
        PaymentModes: ["Cash", "UPI", "Stripe"],
        headers: [
            {
                text: '_id',
                align: 'start',
                sortable: false,
                value: 'id',
            },
            { text: 'Customer ID', value: 'custid', sortable: false },
            { text: 'Amount', value: 'amount', sortable: false },
            { text: 'Stripe ID', value: 'stripeid', sortable: false },
            { text: 'Mode', value: 'mode', sortable: true },
            { text: 'Date', value: 'CapturedTimestamp', sortable: false },
            { text: 'Actions', value: 'actions', sortable: false },
        ],
        editedItem: {
            custId: '',
            mode: '',
            amount: 0,
            stripeid: '',
        },
        defaultItem: {
            custId: '',
            mode: '',
            amount: 0,
            stripeid: '',
        },
    }),

    computed: {
        formTitle() {
            return this.editedIndex === -1 ? 'New Customer' : 'Edit Customer'
        },
        payments() {
            return cloneDeep(this.$store.state.payments)
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
            this.$store.dispatch('getPayments')
        },

        editItem(item) {
            this.editedIndex = this.payments.indexOf(item)
            this.editedItem = Object.assign({}, item)
            this.dialog = true
        },

        deleteItem(item) {
            this.editedItem = item
            this.dialogDelete = true
        },

        deleteItemConfirm() {
            this.$store.dispatch("revertPayment", this.editedItem.id)
            this.closeDelete()
        },

        close() {
            this.editedItem = cloneDeep(this.defaultItem)
            this.dialog = false
        },

        closeDelete() {
            this.editedItem = cloneDeep(this.defaultItem)
            this.dialogDelete = false
        },

        save() {
            if (this.editedItem.id != "" && this.editedItem.custId != "" &&
                this.editedItem.amount != "" && Number(this.editedItem.amount) >= 0 &&
                
                this.editedItem.mode != "") {
                let data = this.editedItem
                
                    this.$store.dispatch("editPayment", data)
                
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
    