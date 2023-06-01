<template>
  <v-data-table :headers="headers" :loading="loading" :items="homeItems" :single-expand="singleExpand"
    :expanded.sync="expanded" item-key="name" show-expand sort-by="name" class="elevation-1">
    <template v-slot:top>
      <v-toolbar flat>
        <v-toolbar-title>Home Carousel Items</v-toolbar-title>
        <v-divider class="mx-4" inset vertical></v-divider>
        <v-spacer></v-spacer>
        <v-dialog v-model="dialog" max-width="500px">
          <template v-slot:activator="{ on, attrs }">
            <v-btn color="primary" dark class="mb-2" v-bind="attrs" v-on="on">
              New Item
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
                    <v-file-input v-model="selectedFile" accept="image/*" label="File input"></v-file-input>
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
        <v-dialog v-model="picVisible">
          <v-card>
            <v-card-title class="text-h5">
              Images
            </v-card-title>
            <v-card-text>
              <v-carousel v-if="picVisible" v-model="carouselIndex">
                <v-carousel-item :src="viewImage" reverse-transition="fade-transition"
                  transition="fade-transition" :key="viewImage">
                </v-carousel-item>
              </v-carousel>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="blue darken-1" text @click="closeviewItem">
                Close
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template v-slot:item.actions="{ item }">
     <v-icon
        small
        class="mr-2"
        @click="viewItem(item)"
      >
        mdi-eye
      </v-icon>
      <v-icon small @click="deleteItem(item)">
        mdi-delete
      </v-icon>
    </template>
    <template v-slot:no-data>
      <v-btn color="primary" @click="initialize">
        Reset
      </v-btn>
    </template>
    <template #[`item.image`]="{ item }">
      <td>
        {{ item.url.substring(item.url.lastIndexOf('/') + 1) }}
      </td>
    </template>
    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length">
        {{ item.url }}
      </td>
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
    selectedFile: null,
    picVisible: false,
    viewImage: '',
    carouselIndex: 0,
    dialogDelete: false,
    nameRules: [
        v => !!v || 'Name is required',
        v => v.length <= 10 || 'Name must be less than 10 characters',
      ],
    headers: [
      {
        text: 'Name',
        align: 'start',
        sortable: false,
        value: 'name',
      },
      { text: 'image', value: 'image', sortable: false },
      { text: 'Actions', value: 'actions', sortable: false },
    ],
    editedItem: {
      name: '',
      url: '',
    },
    defaultItem: {
      name: '',
      url: '',
    },
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    homeItems(){
      return cloneDeep(this.$store.state.home)
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
      this.$store.dispatch('getHomeItems')
    },

    editItem(item) {
      this.editedIndex = this.desserts.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    viewItem(item){
      this.viewImage = item.url
      this.picVisible = true
    },

    closeviewItem(item){
      this.viewImage = ""
      this.picVisible = false
    },

    deleteItem(item) {
      this.editedItem = item
      this.dialogDelete = true
    },

    deleteItemConfirm() {
      this.$store.dispatch("deleteHomeItem", this.editedItem.id)
      this.closeDelete()
    },

    close() {
      this.editedItem = this.defaultItem
      this.selectedFile = null
      this.dialog = false
    },

    closeDelete() {
      this.editedItem = this.defaultItem
      this.dialogDelete = false
    },

    save() {
      if(this.editedItem.name != "" && this.selectedFile != null){
        let data = {
        name: this.editedItem.name,
        files: this.selectedFile,
      }
      this.$store.dispatch("addHomeItem", data)
      this.close()
      }
    },
  },
}
</script>
  