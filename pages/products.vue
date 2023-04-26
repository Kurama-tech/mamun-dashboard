<template>
  <v-data-table
    :headers="headers"
    :items="products"
    sort-by="products"
    class="elevation-3"
  >
    <template #top>
      <v-toolbar
        flat
      >
        <v-toolbar-title>Products</v-toolbar-title>
        <v-divider
          class="mx-4"
          inset
          vertical
        />
        <v-spacer />
        <v-dialog
          v-model="dialog"
          max-width="500px"
        >
          <template #activator="{ on, attrs }">
            <v-btn
              color="purple lighten-3"
              class="mb-2"
              v-bind="attrs"
              v-on="on"
            >
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
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <v-text-field
                      v-model="editedItem.name"
                      label="Product name"
                    />
                  </v-col>
                  <v-col
                    cols="12"
                    sm="6"
                    md="8"
                  >
                    <v-text-field
                      v-model="editedItem.description"
                      label="Description"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="4"
                  >
                    <span>Attach tables</span>
                    <v-checkbox
                      v-model="editedItem.table1"
                      label="Table 1"
                    />
                    <v-checkbox
                      v-model="editedItem.table2"
                      label="Table 2"
                    />
                    <v-checkbox
                      v-model="editedItem.table3"
                      label="Table 3"
                    />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col
                    cols="12"
                    sm="6"
                    md="8"
                  >
                    <v-file-input
                      v-model="editedItem.image"
                      label="Add Image"
                      show-size
                      counter
                      single
                      accept="image/*"
                    />
                  </v-col>
                </v-row>
              </v-container>
            </v-card-text>

            <v-card-actions>
              <v-spacer />
              <v-btn
                color="blue darken-1"
                text
                @click="close"
              >
                Cancel
              </v-btn>
              <v-btn
                color="blue darken-1"
                text
                @click="save"
              >
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
              <v-btn color="blue darken-1" text @click="deleteItemConfirm">
                OK
              </v-btn>
              <v-spacer />
            </v-card-actions>
          </v-card>
        </v-dialog>
      </v-toolbar>
    </template>
    <template #[`item.actions`]="{ item }">
      <v-icon
        small
        class="mr-2"
        @click="editItem(item)"
      >
        mdi-pencil
      </v-icon>
      <v-icon
        small
        @click="deleteItem(item)"
      >
        mdi-delete
      </v-icon>
    </template>
    <template #no-data>
      <v-btn
        color="primary"
        @click="initialize"
      >
        Reset
      </v-btn>
    </template>
    <template #[`item.status`]="{ item }">
      <v-chip
        v-model="item.status"
        :color="item.status ? 'green lighten-2' : 'red lighten-2'"
        @click="editStatus(item)"
      >
        {{ item.status ? 'Enabled' : 'Disabled' }}
      </v-chip>
    </template>
    <template #[`item.image`]="{ item }">
      <v-icon
        small
        class="mr-2"
        @mouseover="picVisible=!picVisible"
      >
        mdi-eye
      </v-icon>
      <v-overlay
        v-model="picVisible"
        @click="picVisible=!picVisible"
      >
        <img :src="item.image">
      </v-overlay>
    </template>
  </v-data-table>
</template>

<script>
export default {
  name: 'ProductsPage',
  data: () => ({
    dialog: false,
    dialogDelete: false,
    picVisible: false,
    headers: [
      {
        text: 'Product',
        align: 'start',
        sortable: true,
        value: 'name'
      },
      { text: 'Description', align: 'center', value: 'description', sortable: false },
      { text: 'Number of Tables', align: 'center', value: 'tables' },
      { text: 'Table 1', align: 'center', value: 'table1', sortable: false },
      { text: 'Table 2', align: 'center', value: 'table2', sortable: false },
      { text: 'Table 3', align: 'center', value: 'table3', sortable: false },
      { text: 'Status', align: 'center', value: 'status', sortable: false },
      { text: 'Actions', align: 'center', value: 'actions', sortable: false },
      { text: 'Image', align: 'center', value: 'image', sortable: false }
    ],
    products: [],
    editedIndex: -1,
    editedItem: {
      name: '',
      tables: 0,
      description: '',
      status: false,
      table1: false,
      table2: false,
      table3: false,
      image: ''
    },
    defaultItem: {
      name: '',
      tables: 0,
      description: '',
      status: false,
      table1: false,
      table2: false,
      table3: false,
      image: ''
    }
  }),

  computed: {
    formTitle () {
      return this.editedIndex === -1 ? 'New Item' : 'Edit Item'
    }
  },

  watch: {
    dialog (val) {
      val || this.close()
    },
    dialogDelete (val) {
      val || this.closeDelete()
    }
  },

  created () {
    this.initialize()
  },

  methods: {
    initialize () {
      this.products = [
        {
          name: 'CCTV cables',
          tables: 1,
          description: 'CCTV cables',
          status: false,
          table1: true,
          table2: false,
          table3: false,
          image: 'https://cdn.britannica.com/39/7139-050-A88818BB/Himalayan-chocolate-point.jpg'

        },
        {
          name: 'Harness Wires',
          tables: 2,
          description: 'Harness Wires',
          status: true,
          table1: true,
          table2: false,
          table3: true,
          image: 'https://cdn.britannica.com/39/7139-050-A88818BB/Himalayan-chocolate-point.jpg'
        }
      ]
    },

    editItem (item) {
      this.editedIndex = this.products.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialog = true
    },

    deleteItem (item) {
      this.editedIndex = this.products.indexOf(item)
      this.editedItem = Object.assign({}, item)
      this.dialogDelete = true
    },

    deleteItemConfirm () {
      this.products.splice(this.editedIndex, 1)
      this.closeDelete()
    },

    close () {
      this.dialog = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    closeDelete () {
      this.dialogDelete = false
      this.$nextTick(() => {
        this.editedItem = Object.assign({}, this.defaultItem)
        this.editedIndex = -1
      })
    },

    save () {
      if (this.editedIndex > -1) {
        Object.assign(this.products[this.editedIndex], this.editedItem)
      } else {
        this.products.push(this.editedItem)
      }
      this.close()
    },

    editStatus (item) {
      item.status = !item.status
    }
  }
}
</script>
