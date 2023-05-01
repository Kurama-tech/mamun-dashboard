<template>
  <div>
    <h2>Stored Excel Sheets</h2>
    <div class="w-100 p-3" v-if="sheets.length">
      <div v-for="(sheet,ind) in sheets" :key="ind">
        <h3>{{ sheet }}{{ ind }}</h3>
        <vue-excel-editor v-model="excelData[sheet]" :editable="true" :options="{ sheetName: sheet }" />
      </div>
    </div>
    <div v-else>
      <p>No Excel sheets found.</p>
    </div>
  </div>
</template>

<script>
const XLSX = require('xlsx')

export default {
  data () {
    return {
      sheets: [],
      excelData: {}
    }
  },
  mounted () {
    const dataContext = require.context('../tempfiles', false, /\.xlsx?$/)
    const files = dataContext.keys()

    const excelFiles = files.filter((file) => {
      const extname = file.split('.').pop()
      return extname === 'xlsx' || extname === 'xls'
    })

    for (const file of excelFiles) {
      const data = new Uint8Array(file)
      const workbook = XLSX.read(data, { type: 'array' })
      const sheetNames = workbook.SheetNames

      for (const sheetName of sheetNames) {
        const worksheet = workbook.Sheets[sheetName]
        const sheetData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })
        this.excelData[sheetName] = sheetData
      }

      this.sheets.push(...sheetNames)
    }
  }
}
</script>
