<template>
    <v-data-table :search="search" :custom-filter="filterText" :loading="loading" :headers="headers" :items="items"
        :single-expand="singleExpand" :expanded.sync="expanded" item-key="id" show-expand sort-by="products"
        class="elevation-1">
        <template #top>
            <v-toolbar flat>
                <v-toolbar-title>Requirements</v-toolbar-title>
                <v-divider class="mx-4" inset vertical />
                <v-text-field v-model="search" label="Search" class="mx-4"></v-text-field>
                <v-dialog v-model="dialogDelete" max-width="500px">
                    <v-card>
                        <v-card-title class="text-h5">
                            Are you sure you want to delete this user?
                        </v-card-title>
                        <v-card-actions>
                            <v-spacer />
                            <v-btn color="blue darken-1" text @click="closeDelete">
                                Cancel
                            </v-btn>
                            <v-btn :loading="loading" color="blue darken-1" text @click="deleteItemConfirm">
                                OK
                            </v-btn>
                            <v-spacer />
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog fullscreen v-model="editdailog" max-width="500px">
                    <v-card>
                        <v-card-title class="text-h5">
                            Edit Requirement?
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-form ref="form" v-model="valid" lazy-validation>
                                    <v-row>
                                        <v-text-field v-model="newEditvar.title" label="Title" required></v-text-field>
                                    </v-row>
                                    <v-row>
                                        <v-select :items="selectitems" label="Priority"
                                            v-model="newEditvar.priority"></v-select>
                                    </v-row>
                                    <v-row>
                                        <v-textarea name="input-7-1" label="Description" v-model="newEditvar.description"></v-textarea>
                                    </v-row>
                                    <v-row>
                                        <v-textarea name="input-7-1" label="Remarks" v-model="newEditvar.remarks"></v-textarea>
                                    </v-row>

                                </v-form>
                            </v-container>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer />
                            <v-btn color="blue darken-1" text @click="closeEdit">
                                Cancel
                            </v-btn>
                            <v-btn :loading="loading" color="blue darken-1" text @click="editItemConfirm">
                                Save
                            </v-btn>
                            <v-spacer />
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>
        </template>
        <template #[`item.actions`]="{ item }">

            <v-icon small @click="editItem(item)">
                mdi-pencil
            </v-icon>
        </template>
        <template #no-data>
            <v-btn color="primary" @click="initialize">
                Reset
            </v-btn>
        </template>

        <template #[`item.status`]="{ item }">
            <v-chip v-model="item.status" :color="item.status === 'open' ? 'green lighten-2' : 'red lighten-2'"
                @click="editStatus(item)">
                {{ item.status === 'open' ? 'Open' : 'Closed' }}
            </v-chip>
        </template>


        <template v-slot:expanded-item="{ headers, item }">
            <td :colspan="headers.length">
                <v-list-item>
                    <v-list-item-content>
                        <v-list-item-title>More Data</v-list-item-title>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item two-line>
                    <v-list-item-content>
                        <v-list-item-title>Description</v-list-item-title>
                        <v-list-item-subtitle>{{ item.description }}</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-content>
                        <v-list-item-title>Remarks</v-list-item-title>
                        <v-list-item-subtitle>{{ item.remarks }}</v-list-item-subtitle>
                    </v-list-item-content>

                </v-list-item>




            </td>
        </template>
    </v-data-table>
</template>
  
<script>
import { cloneDeep } from 'lodash'

export default {
    name: 'RequirementsPage',

    data: () => ({
        carouselIndex: 0,
        search: '',
        valid: true,
        expanded: [],
        selectitems: ['Low', 'High', 'Critical'],
        singleExpand: false,
        dialog: false,
        showerror: false,
        errorString: '',
        dialogDelete: false,
        editdailog: false,
        headers: [
            {
                text: 'userID',
                align: 'start',
                sortable: false,
                value: 'userid'
            },
            {
                text: 'Title',
                align: 'start',
                sortable: true,
                filterable: true,
                value: 'title'
            },
            { text: 'Status', align: 'center', value: 'status', sortable: true },
            { text: 'Priority', align: 'center', value: 'priority', sortable: true },
            { text: 'Actions', align: 'center', value: 'actions', sortable: false },

        ],
        viewitem: null,
        editedIndex: -1,
        deleteitem: null,
        editSelectedTables: [],
        lockParent: false,
        newEditvar: {},
        editedItem: null
    }),

    computed: {
        items() {
            return cloneDeep(this.$store.state.requirements)
        },
        users() {
            return cloneDeep(this.$store.state.users)
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
        }
    },

    created() {
        this.initialize()

    },

    methods: {
        initialize() {
            this.$store.commit("setLoading", true)
            this.$store.dispatch('getRequirements')
            this.$store.commit("setLoading", false)
        },

        deleteItem(item) {
            this.deleteitem = item
            this.dialogDelete = true
        },

        editItem(item) {
            this.newEditvar = item
            this.editdailog = true
        },



        deleteItemConfirm() {
            this.$store.commit("setLoading", true)
            this.$store.dispatch("deleteItem", this.deleteitem.id)
            this.closeDelete()
        },

        editItemConfirm() {
            console.log(this.newEditvar)
            this.$store.commit("setLoading", true)
            this.$store.dispatch("editRequirement", this.newEditvar)
            this.closeEdit()
        },


        closeEdit() {
            this.newEditvar = {}
            this.editdailog = false
        },

        closeDelete() {
            this.$store.commit("setLoading", false)
            this.dialogDelete = false
        },
        editStatus(item) {
            console.log(item)
            this.$store.commit("setLoading", true)
            if (item.status === "open") {
                this.$store.dispatch("closeRequirement", item)
            } //else {
            // this.$store.dispatch("enableItem", item)
            //}
            this.$store.commit("setLoading", false)
        },
        filterText(value, search, item) {
            return value != null &&
                search != null &&
                typeof value === 'string' &&
                value.toString().toLocaleLowerCase().indexOf(search) !== -1
        },
    }
}
</script>
  