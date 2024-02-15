<template>
  <div>
    <button @click="printInvoice">Print</button>
    <div v-if="invoice != null || invoice != undefined && typeof (invoice) === 'object'" ref="invoice"
      class="invoice-container">
      <!-- Your invoice content goes here -->
      <!-- Task 1: Two equal size columns -->
      <v-row>
        <!-- First Column: Display Invoice ID -->
        <v-col cols="6">
          <h1>Invoice</h1>
          <h5>{{ invoice.id }}</h5>
        </v-col>
        <!-- Second Column: Display Hayath Collections and address -->
        <v-col cols="6">
          <h2>Hayath Collections</h2>
          <h5>Abc colony</h5>
          <h5>Hyderabad 560029</h5>
        </v-col>
      </v-row>

      <!-- Task 2: Grid with customer details -->
      <v-row>
        <v-col cols="6">
          <h4>Billed For</h4>
          <h5>{{ invoice.customer.name }}</h5>
          <h5>{{ invoice.customer.address }}</h5>
          <h5>Phone: {{ invoice.customer.number }}</h5>
          <!-- Add more customer details here -->
        </v-col>
        <v-col cols="6">
          <h4>Status: {{ invoice.status }}</h4>
          <h5>Date: {{ new Date(invoice.Date).toDateString() }}</h5>
          <!-- Add more customer details here -->
        </v-col>
      </v-row>

      <!-- Task 3: Table with headers item, price, qty, sub total -->
      <v-row>
        <v-col cols="12">
          <v-data-table disable-pagination hide-default-footer dense :headers="headers" :items="invoice.items"></v-data-table>
        </v-col>
      </v-row>

      <!-- Task 4: Total value -->
      <v-row>
        <v-col class="text-right" cols="12">
          <h3>Total: INR {{ invoice.total }}</h3>
        </v-col>
      </v-row>
    </div>
    <div v-else>
      No invoice found with id : {{ $route.params.slug }}
    </div>
  </div>
</template>
  
<script>
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import { cloneDeep } from 'lodash'

export default {
  layout: 'invoice',
  data: () => ({
    headers: [
        { text: 'Item', value: 'name' },
        { text: 'Price', value: 'price' },
        { text: 'Qty', value: 'qty' },
        { text: 'Sub Total', value: 'totalp' }
      ],
  }),
  computed: {

    invoice() {

      return cloneDeep(this.$store.state.invoices.find(obj => obj.id === this.$route.params.slug))
    }
  },
  created() {
    this.initialize()
  },
  methods: {

    initialize() {
      this.$store.dispatch('getInvoices')

    },
    printInvoice() {
      // Get the element to be printed
      const invoiceElement = this.$refs.invoice;

      // Use html2canvas to capture the invoice element as an image
      html2canvas(invoiceElement).then(canvas => {
        const imgData = canvas.toDataURL('image/png');

        // Create a new jsPDF instance
        const pdf = new jsPDF('p', 'mm', 'a4');

        // Calculate width and height to fit A4 size
        const imgWidth = 210;
        const pageHeight = 297;
        const imgHeight = (canvas.height * imgWidth) / canvas.width;
        let heightLeft = imgHeight;
        let position = 0;

        // Add the image to the PDF
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);

        // Save PDF
        pdf.save(this.invoice.id + '.pdf');

        // Open print preview
        this.openPrintPreview(pdf);
      });
    },
    openPrintPreview(pdf) {
      // Open print preview for the generated PDF
      const blob = pdf.output('blob');
      const url = URL.createObjectURL(blob);
      window.open(url, '_blank');
    }
  }
};
</script>
  
<style scoped>
/* Style for A4 size */
.invoice-container {
  width: 210mm;
  height: 297mm;
  padding: 20px;
  background-color: #fff;
  margin: auto;
}
</style>
  