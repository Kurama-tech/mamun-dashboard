<template>
    <div>
      <input type="file" @change="handleFileUpload">
      <vue-excel-editor
        v-if="showEditor"
        ref="grid"
        
        v-model="jsondata"
        :options="options"
        @workbook-updated="handleWorkbookUpdated"
      />
      <!-- <button v-if="showEditor" @click="handleSaveFile">
        Save File
      </button> -->
    </div>
  </template>
  
  <script>
  import XLSX from 'xlsx'
  export default {
    props: {
        setjson: { type: Function },
        isedit: Boolean,
        suppliedData: Array
    },
    data () {
      return {
        options: {
          mode: 'view',
          format: 'xlsx',
          data: []
        },
        workbook: null,
        jsondata: [],
        showEditor: false
      }
    },
    methods: {
      handleFileUpload (event) {
        const file = event.target.files[0]
        const reader = new FileReader()
  
        reader.onload = (e) => {
          const data = new Uint8Array(e.target.result)
          const workbook = XLSX.read(data, { type: 'array' })
          const sheetName = workbook.SheetNames[0]
          const worksheet = workbook.Sheets[sheetName]
          this.jsondata = XLSX.utils.sheet_to_json(worksheet)
          this.setjson(this.jsondata)
  
          if (this.jsondata.length) {
            this.options.data = [{ [sheetName]: this.jsondata }]
            this.showEditor = true
            this.workbook = workbook
          }

        }

        reader.readAsArrayBuffer(file)
      },
      handleWorkbookUpdated (workbook) {
        const sheetName = workbook.SheetNames[0]
        const sheet = workbook.Sheets[sheetName]
        this.jsondata = XLSX.utils.sheet_to_json(sheet)
        console.log(this.jsondata)
        this.setjson(this.jsondata)
        this.workbook = workbook
      },
      handleSaveFile () {
        if (!this.workbook) {
          return
        }
        const sheetName = this.workbook.SheetNames[0]
        const worksheet = this.workbook.Sheets[sheetName]
        const wb = XLSX.utils.book_new()
        XLSX.utils.book_append_sheet(wb, worksheet, sheetName)
        this.$refs.grid.exportTable('xlsx', false, sheetName)
      }
    }
  }
  </script>
  