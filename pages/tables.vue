<template>
  <div>
    <h3>Import XLSX</h3>
    <input type="file" @change="onChange">
    <xlsx-read :file="file">
      <xlsx-table style="overflow: scroll; border:2px solid black; background-color:lightsteelblue;"/>
    </xlsx-read>
  </div>
</template>
<script>
import { XlsxRead, XlsxTable } from 'vue-xlsx'
export default {
  components: {
    XlsxRead,
    XlsxTable
  },
  data () {
    return {
      file: null
    }
  },
  methods: {
    onChange (event) {
      this.file = event.target.files ? event.target.files[0] : null
    }
  }
}
</script>
