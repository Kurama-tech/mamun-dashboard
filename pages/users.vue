<template>
    <v-data-table :search="search" :custom-filter="filterText" :loading="loading" :headers="headers" :items="items"
        :single-expand="singleExpand" :expanded.sync="expanded" item-key="id" show-expand sort-by="products"
        class="elevation-1">
        <template #top>
            <v-toolbar flat>
                <v-toolbar-title>Users</v-toolbar-title>
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
                <v-dialog v-model="picVisible" max-width="500px">
                    <v-card>
                        <v-card-title class="text-h5">
                            Images
                        </v-card-title>
                        <v-card-text>
                            <v-carousel v-if="picVisible" v-model="carouselIndex">
                                <v-carousel-item v-for="(image, i) in viewitem.images" :src="image"
                                    reverse-transition="fade-transition" transition="fade-transition" :key="i">
                                </v-carousel-item>
                            </v-carousel>
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer />
                            <v-btn color="blue darken-1" text @click="viewImageClose">
                                Close
                            </v-btn>
                            <v-spacer />
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>
        </template>
        <template #[`item.actions`]="{ item }">

            <v-icon small @click="deleteItem(item)">
                mdi-delete
            </v-icon>
        </template>
        <template #no-data>
            <v-btn color="primary" @click="initialize">
                Reset
            </v-btn>
        </template>
        <template #[`item.avatar`]="{ item }">
            <v-avatar size="36px">
                <img :src="item.avatar" alt="Avatar">
            </v-avatar>
        </template>
        <template #[`item.status`]="{ item }">
            <v-chip v-model="item.status" :color="item.status === 'active' ? 'green lighten-2' : 'red lighten-2'"
                @click="editStatus(item)">
                {{ item.status === 'active' ? 'Active' : 'Banned' }}
            </v-chip>
        </template>
        <template #[`item.busniesstype`]="{ item }">
            <v-chip v-model="item.busniesstype"
                :color="item.busniess_type === 'Individual' ? 'green lighten-2' : 'purple lighten-2'">
                {{ item.busniess_type }}
            </v-chip>
        </template>
        <template #[`item.govid`]="{ item }">
            {{ item.busniess_type == "Individual" ? "PAN " : "GSTIN " }} {{ item.govid }}
        </template>
        <template #[`item.contact`]="{ item }">
            <a :href="'tel:' + item.contact">{{ item.contact }}</a>
        </template>
        <template #[`item.images`]="{ item }">
            <v-icon small class="mr-2" @click="viewImage(item)">
                mdi-eye
            </v-icon>
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
                        <v-list-item-title>Busniess Category</v-list-item-title>
                        <v-list-item-subtitle>{{ item.busniess_category }}</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-content>
                        <v-list-item-title>Company</v-list-item-title>
                        <v-list-item-subtitle>{{ item.company }}</v-list-item-subtitle>
                    </v-list-item-content>
                    <v-list-item-content>
                        <v-list-item-title>Proprietor</v-list-item-title>
                        <v-list-item-subtitle>{{ item.proprietor }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item two-line>
                    <v-list-item-content>
                        <v-list-item-title>Address</v-list-item-title>
                        <v-list-item-subtitle>{{ item.location }}</v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>

                <v-list-item three-line>
                    <v-list-item-content>
                        <v-list-item-title>Location</v-list-item-title>
                        <v-list-item-subtitle>
                            {{ item.latitude }},
                        </v-list-item-subtitle>
                        <v-list-item-subtitle>
                            {{ item.longitude }}
                        </v-list-item-subtitle>
                    </v-list-item-content>
                </v-list-item>
            </td>
        </template>
    </v-data-table>
</template>
  
<script>
import { cloneDeep } from 'lodash'

export default {
    name: 'UsersPage',

    data: () => ({
        carouselIndex: 0,
        search: '',
        expanded: [],
        singleExpand: false,
        dialog: false,
        showerror: false,
        errorString: '',
        dialogDelete: false,
        picVisible: false,
        selectedFiles: null,
        selectedTables: [],
        editdailog: false,


        headers: [
            {
                text: 'avatar',
                align: 'start',
                sortable: false,
                value: 'avatar'
            },
            {
                text: 'userID',
                align: 'start',
                sortable: false,
                value: 'userid'
            },
            {
                text: 'User',
                align: 'start',
                sortable: true,
                filterable: true,
                value: 'name'
            },
            { text: 'Status', align: 'center', value: 'status', sortable: false },
            { text: 'Type', align: 'center', value: 'busniess_type', sortable: false },
            { text: 'Gov ID', align: 'center', value: 'govid', sortable: false },
            { text: 'Contact', align: 'center', value: 'contact', sortable: false },
            { text: 'Actions', align: 'center', value: 'actions', sortable: false },
            { text: 'Images', align: 'center', value: 'images', sortable: false }
        ],
        viewitem: null,
        editedIndex: -1,
        deleteitem: null,
        editSelectedTables: [],
        lockParent: false,
        newEditvar: null,
    }),

    computed: {
        items() {
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
            this.$store.dispatch('getItems')
            this.$store.commit("setLoading", false)
        },

        deleteItem(item) {
            this.deleteitem = item
            this.dialogDelete = true
        },

        viewImage(item) {
            this.viewitem = item
            this.picVisible = true
        },

        viewImageClose() {
            this.viewitem = null
            this.picVisible = false
        },

        deleteItemConfirm() {
            this.$store.commit("setLoading", true)
            this.$store.dispatch("deleteItem", this.deleteitem.id)
            this.closeDelete()
        },

        close() {
            this.editedItem.description = ""
            this.editedItem.name = ""
            this.selectedFiles = null
            this.selectedTables = []
            this.dialog = false
        },
        closeEdit() {
            this.newEditvar = null
            this.selectedFiles = null
            this.editdailog = false
        },

        closeDelete() {
            this.$store.commit("setLoading", false)
            this.dialogDelete = false
        },
        editStatus(item) {
            console.log(item)
            this.$store.commit("setLoading", true)
            if (item.status === "active") {
                this.$store.dispatch("disableItem", item.id)
            } else {
                this.$store.dispatch("enableItem", item)
            }
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
  