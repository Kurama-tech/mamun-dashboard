
<template>
    <v-data-table :loading="loading" :headers="headers" :items="tables" class="elevation-1">
        <template v-slot:top>
            <v-toolbar flat>
                <v-toolbar-title>My Tables</v-toolbar-title>
                <v-divider class="mx-4" inset vertical></v-divider>
                <v-spacer></v-spacer>
                <v-dialog v-model="dialog" fullscreen max-width="500px">
                    <template v-slot:activator="{ on, attrs }">
                        <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
                            New Table
                        </v-btn>
                    </template>
                    <v-card>
                        <v-card-title>
                            <span class="text-h5">{{ formTitle }}</span>
                        </v-card-title>
                        <v-card-text>
                            <v-container>
                                <v-form ref="addImageForm" lazy-validation>
                                    <v-row v-if="showerror">
                                        <v-alert dense outlined type="error">
                                            {{ errorString }}
                                        </v-alert>
                                    </v-row>
                                    <v-row>
                                        <v-col cols="12" sm="6" md="4">
                                            <v-text-field v-model="NewName" label="Table Name"></v-text-field>
                                        </v-col>
                                    </v-row>
                                    <v-row>
                                        <input type="file" ref="uploadedFile" @change="handleFileUpload">
                                        <vue-excel-editor v-if="showEditor" ref="grid" v-model="jsondata" :options="options"
                                            @workbook-updated="handleWorkbookUpdated" />
                                    </v-row>
                                </v-form>
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
                        <v-card-title class="text-h5">Are you sure you want to delete this?</v-card-title>

                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="closeDelete">Cancel</v-btn>
                            <v-btn color="blue darken-1" text @click="deleteItemConfirm">OK</v-btn>
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
                <v-dialog v-model="viewDailog" fullscreen max-width="500px">
                    <v-card>
                        <v-card-title v-if="viewDailog" class="text-h5">Table: {{ viewitem.name }} </v-card-title>
                        <v-card-text>
                            <vue-excel-editor ref="grid" v-if="viewDailog" v-model="viewitem.data" :options="options" />
                        </v-card-text>
                        <v-card-actions>
                            <v-spacer></v-spacer>
                            <v-btn color="blue darken-1" text @click="viewItemConfirm">close</v-btn>
                            <v-spacer></v-spacer>
                        </v-card-actions>
                    </v-card>
                </v-dialog>
            </v-toolbar>
        </template>
        <template v-slot:item.actions="{ item }">
        <!-- <v-icon small class="mr-2" @click="editItem(item)">
                mdi-pencil
                        </v-icon> -->
            <v-icon small @click="deleteItem(item)">
                mdi-delete
            </v-icon>
            <v-icon small @click="viewItem(item)">
                mdi-eye
            </v-icon>
        </template>
        <template v-slot:no-data>
            <v-btn color="primary" @click="initialize">
                Refresh
            </v-btn>
        </template>
    </v-data-table>
</template>
<script>
/* eslint-disable */
import XLSX from 'xlsx'
export default {
    data: () => ({
        isEdit: false,
        options: {
            mode: 'view',
            format: 'xlsx',
            data: []
        },
        showerror: false,
        errorString: '',
        viewDailog: false,
        NewName: '',
        workbook: null,
        jsondata: [],
        viewitem: null,
        deleteitem: "",
        showEditor: false,
        dialog: false,
        dialogDelete: false,
        headers: [
            {
                text: 'Table Name',
                align: 'start',
                sortable: false,
                value: 'name',
            },
            { text: 'Actions', value: 'actions', sortable: false },
        ],
    }),

    computed: {
        formTitle() {
            return this.isEdit ? 'New Item' : 'Edit Item'
        },
        tables() {
            return this.$store.state.tables
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
        handleFileUpload(event) {
            const file = event.target.files[0]
            const reader = new FileReader()

            reader.onload = (e) => {
                const data = new Uint8Array(e.target.result)
                const workbook = XLSX.read(data, { type: 'array' })
                const sheetName = workbook.SheetNames[0]
                const worksheet = workbook.Sheets[sheetName]
                this.jsondata = XLSX.utils.sheet_to_json(worksheet)

                let index = this.editedIndex === -1 ? 0 : this.editedIndex




                if (this.jsondata.length) {
                    this.options.data = [{ [sheetName]: this.jsondata }]
                    this.showEditor = true
                    this.workbook = workbook
                }

            }

            reader.readAsArrayBuffer(file)
        },
        handleWorkbookUpdated(workbook) {
            const sheetName = workbook.SheetNames[0]
            const sheet = workbook.Sheets[sheetName]
            this.jsondata = XLSX.utils.sheet_to_json(sheet)
            console.log(this.jsondata)
            this.workbook = workbook
        },
        handleSaveFile() {
            if (!this.workbook) {
                return
            }
            const sheetName = this.workbook.SheetNames[0]
            const worksheet = this.workbook.Sheets[sheetName]
            const wb = XLSX.utils.book_new()
            XLSX.utils.book_append_sheet(wb, worksheet, sheetName)
            this.$refs.grid.exportTable('xlsx', false, sheetName)
        },
        initialize() {
            this.$store.dispatch('getTables')
        },

        editItem(item) {
            this.workbook = null
            this.jsondata = item.tables
            this.dialog = true
        },

        deleteItem(item) {
            this.deleteitem = item['id']
            this.dialogDelete = true
        },

        viewItem(item) {
            this.viewitem = item
            this.viewDailog = true
        },

        viewItemConfirm() {
            this.viewitem = null
            this.viewDailog = false
        },

        deleteItemConfirm() {
            this.$store.dispatch("deleteTable", this.deleteitem)
            this.closeDelete()
        },

        close() {

            this.dialog = false
            this.showEditor = false
            this.NewName = ""
            this.resetSelectedFile()
        },

        closeDelete() {
            this.deleteitem = ""
            this.dialogDelete = false
        },

        save() {
            if (this.NewName != "" && this.jsondata.length >  0) {
                this.errorString = ''
                this.showerror = false
                let tempD = {
                    name: this.NewName,
                    data: this.jsondata
                }

                this.$store.dispatch('addTable', tempD)
                this.close()
            }
            else{
                this.showerror = true
                this.errorString = "All the Fields Are Required"
            }
        },

        resetSelectedFile() {
            this.$refs.uploadedFile.value = null
            this.jsondata = []
            this.options.data = []
            this.showEditor = false
            this.workbook = null
        }
    },
}
/* eslint-enable */
</script>
