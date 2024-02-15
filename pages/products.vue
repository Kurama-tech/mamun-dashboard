<template>
  <v-data-table :search="search" :custom-filter="filterText" :loading="loading" :headers="headers" :items="items" :single-expand="singleExpand"
    :expanded.sync="expanded" item-key="id" show-expand sort-by="products" class="elevation-1">
    <template #top>
      <v-toolbar flat>
        <v-toolbar-title>Products</v-toolbar-title>
        <v-divider class="mx-4" inset vertical />
        <v-text-field
          v-model="search"
          label="Search"
          class="mx-4"
        ></v-text-field>
        <v-dialog fullscreen v-model="dialog" max-width="500px">
          <template #activator="{ on, attrs }">
            <v-btn color="purple lighten-3" class="mb-2" v-bind="attrs" v-on="on">
              New Item
            </v-btn>
          </template>
          <v-card>
            <v-card-title>
              <span class="text-h5">{{ formTitle }}</span>
            </v-card-title>

            <v-card-text>
              <v-container>
                <v-row v-if="showerror">
                  <v-alert dense outlined type="error">
                    {{ errorString }}
                  </v-alert>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.name" label="Product name" />
                  </v-col>
                </v-row>
                <v-row v-if="loading">
                  <v-progress-linear :active="loading" indeterminate color="cyan"></v-progress-linear>
                </v-row>
                <v-row>

                  <v-textarea outlined v-model="editedItem.description" label="Description" />
                </v-row>

                <v-row>
                  <v-select :items="productTypes" label="Select Type" v-model="editedItem.type"></v-select>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="editedItem.price" label="Price" />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col cols="12" sm="6" md="8">
                    <v-file-input multiple v-model="selectedFiles" label="Add Image" show-size counter
                      accept="image/png" />
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer />
              <v-btn color="blue darken-1" text @click="close">
                Cancel
              </v-btn>
              <v-btn :loading="loading" color="blue darken-1" text @click="save">
                Save
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-dialog>
        <v-dialog v-model="dialogDelete" max-width="500px">
          <v-card>
            <v-card-title class="text-h5">
              Are you sure you want to delete this item?
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
                <v-carousel-item v-for="(image, i) in viewitem.images" :src="image" reverse-transition="fade-transition"
                  transition="fade-transition" :key="i">
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
        <v-dialog v-model="editdailog" fullscreen max-width="500px">
          <div v-if="newEditvar != null">
            <v-card>
              <v-card-title>
                <span class="text-h5">Edit item</span>
              </v-card-title>

              <v-card-text>
                <v-container>
                  <v-row v-if="showerror">
                    <v-alert dense outlined type="error">
                      {{ errorString }}
                    </v-alert>
                  </v-row>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <v-text-field v-model="newEditvar.name" label="Product name" />
                    </v-col>
                  </v-row>
                  <v-row>

                    <v-textarea outlined v-model="newEditvar.description" label="Description" />
                  </v-row>
                  <v-row>
                    <v-select :disabled="lockParent" :items="productTypes" label="Select Type"
                      v-model="newEditvar.type"></v-select>
                  </v-row>
                  <v-row>
                  <v-col cols="12" sm="6" md="4">
                    <v-text-field v-model="newEditvar.price" label="Price" />
                  </v-col>
                </v-row>
                  <v-row>
                    <v-col cols="12" sm="6" md="4">
                      <span>Images Present</span>
                      <v-list-item v-for="image, i in newEditvar.images">
                        <v-list-item-avatar>
                          <v-img :src="image"></v-img>
                        </v-list-item-avatar>
                        <v-list-item-content>
                          <v-list-item-title>{{ image }}</v-list-item-title>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-btn icon @click="removeImg(i)">
                            <v-icon color="error lighten-1">mdi-delete</v-icon>
                          </v-btn>
                        </v-list-item-action>
                      </v-list-item>
                    </v-col>
                    <v-divider vertical></v-divider>
                    <v-col cols="12" sm="6" md="4">
                      <span>Add New Images</span>
                      <v-file-input multiple v-model="selectedFiles" label="Add Image" show-size counter
                        accept="image/png" />
                    </v-col>
                  </v-row>
                </v-container>
              </v-card-text>

              <v-card-actions>
                <v-spacer />
                <v-btn color="blue darken-1" text @click="closeEdit">
                  Cancel
                </v-btn>
                <v-btn :loading="loading" color="blue darken-1" text @click="saveEdit">
                  Save
                </v-btn>
              </v-card-actions>
            </v-card>
          </div>
        </v-dialog>
      </v-toolbar>
    </template>
    <template #[`item.actions`]="{ item }">

      <v-icon small class="mr-2" @click="editItem(item)">
        mdi-pencil
      </v-icon>

      <v-icon small @click="deleteItem(item)">
        mdi-delete
      </v-icon>
    </template>
    <template #no-data>
      <v-btn color="primary" @click="initialize">
        Reset
      </v-btn>
    </template>
    <template #[`item.tables`]="{ item }">
      <v-chip v-for="i in item.tables">
        {{ i.name }}
      </v-chip>
    </template>
    <template #[`item.status`]="{ item }">
      <v-chip v-model="item.status" :color="item.status === 'active' ? 'green lighten-2' : 'red lighten-2'"
        @click="editStatus(item)">
        {{ item.status === 'active' ? 'Enabled' : 'Disabled' }}
      </v-chip>
    </template>
    <template #[`item.images`]="{ item }">
      <v-icon small class="mr-2" @click="viewImage(item)">
        mdi-eye
      </v-icon>
    </template>


    <template v-slot:expanded-item="{ headers, item }">
      <td :colspan="headers.length">
        {{ item.description }}
      </td>
    </template>
  </v-data-table>
</template>

<script>
import { cloneDeep } from 'lodash'

export default {
  name: 'ProductsPage',
  
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
    productTypes: ["Clothes", "Jewelry"],


    headers: [
      {
        text: '_id',
        align: 'start',
        sortable: false,
        value: 'id'
      },
      {
        text: 'Product',
        align: 'start',
        sortable: true,
        filterable: true,
        value: 'name'
      },
      { text: 'Price', align: 'center', value: 'price' },
      { text: 'Type', align: 'center', value: 'type' },
      { text: 'Status', align: 'center', value: 'status', sortable: false },
      { text: 'Actions', align: 'center', value: 'actions', sortable: false },
      { text: 'Images', align: 'center', value: 'images', sortable: false }
    ],
    viewitem: null,
    editedIndex: -1,
    deleteitem: null,
    editSelectedTables: [],
    lockParent: false,

    editedItem: {
      name: '',
      type: '',
      price: 0,
      description: '',
      status: '',
      images: []
    },
    newEditvar: null,
  }),

  computed: {
    formTitle() {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    },
    items() {
      return cloneDeep(this.$store.state.products)
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

    editItem(item) {
      this.newEditvar = item
     
      this.editdailog = true
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

    save() {
      if(this.editedItem.price != '' && this.editedItem.description != '' && this.editedItem.name != '' && this.editedItem.type != '' && this.selectedFiles != null && this.selectedFiles.length > 0){
      
      this.errorString = ''
      this.showerror = false
      if(this.editedItem.type != 'Parent' && this.editedItem.parent === '') {
        this.errorString = 'Parent is Required'
        this.showerror = true
        return
      }
      this.$store.commit("setLoading", true)

      let data = {
        files: this.selectedFiles,
        description: this.editedItem.description,
        name: this.editedItem.name,
        type: this.editedItem.type,
        price: this.editedItem.price,
      }
      console.log(data)
      this.$store.dispatch("addItem", data)
      this.close()
      }
      else {
        this.errorString = `Fields name , type, description , images, price required!`
        this.showerror = true
      }
      
    },
    saveEdit() {
      if(this.newEditvar.images.length <= 0 && this.selectedFiles === null){
        this.errorString = 'Any one Image is Required'
        this.showerror = true
        return
      }
      if(this.newEditvar.name != '' && this.newEditvar.description != '' && this.newEditvar.price != ''){
      this.errorString = ''
      this.showerror = false
      

      this.$store.commit("setLoading", true)
      
      let data = {
        id: this.newEditvar.id,
        files: this.selectedFiles,
        description: this.newEditvar.description,
        name: this.newEditvar.name,
        type: this.newEditvar.type,
        images: this.newEditvar.images,
        price: this.newEditvar.price,
      }
      console.log(data)
      this.$store.dispatch("editItem", data)
      this.closeEdit()
    }
    else {
      this.errorString = `Fields name , description , required!`
        this.showerror = true
    }
    },

    editStatus(item) {
      this.$store.commit("setLoading", true)
      if (item.status === "active") {
        this.$store.dispatch("disableItem", item.id)
      } else {
        this.$store.dispatch("enableItem", item.id)
      }
      this.$store.commit("setLoading", false)
    },
    mergeArraysIgnoreDuplicates(arr1, arr2) {
      const mergedArray = [];

      arr1.forEach(obj => {
        const duplicateIndex = arr2.findIndex(item => item.id === obj.id);
        const checked = duplicateIndex !== -1;
        mergedArray.push({ ...obj, checked });
      });

      arr2.forEach(obj => {
        const duplicateIndex = mergedArray.findIndex(item => item.id === obj.id);
        const checked = duplicateIndex !== -1;
        if (duplicateIndex === -1) {
          mergedArray.push({ ...obj, checked });
        }
      });

      return mergedArray;
    },
    removeItemByIndex(arr, index) {
      if (index >= 0 && index < arr.length) {
        arr.splice(index, 1);
      }
      return arr;
    },
    removeImg(n) {
      this.newEditvar.images = this.removeItemByIndex(this.newEditvar.images, n)
    },
    filterText (value, search, item) {
        return value != null &&
          search != null &&
          typeof value === 'string' &&
          value.toString().toLocaleLowerCase().indexOf(search) !== -1
      },
  }
}
</script>
