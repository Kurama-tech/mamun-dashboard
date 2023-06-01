<template>
  <div>
    <div class="text-h3" v-text="heading" />
    <v-divider></v-divider>
    <br />
    <v-row>
      <v-col cols="12" sm="6" md="4">
        <v-card elevation="2" shaped color="#CAF1DE" :loading="loading">
          <v-card-title>Number of Products</v-card-title>
          <v-card-text>
            <div class="text-h4">
              {{ totalP }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card elevation="2" shaped color="#E1F8DC" :loading="loading">
          <v-card-title>Number of Parents</v-card-title>
          <v-card-text>
            <div class="text-h4">
              {{ NoParents }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card elevation="2" shaped color="#FFE7C7" :loading="loading">
          <v-card-title>Number of Childs</v-card-title>
          <v-card-text>
            <div class="text-h4">
              {{ NoChilds }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
      <v-col cols="12" sm="6" md="4">
        <v-card elevation="2" shaped color="#ACDDDE" :loading="loading">
          <v-card-title>Number of Tables</v-card-title>
          <v-card-text>
            <div class="text-h4">
              {{ totalT }}
            </div>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </div>
</template>

<script>
export default {
  name: 'IndexPage',
  data: () => ({
    heading: "Dashboard",
    value: [
      423,
      446,
      675,
      510,
      590,
      610,
      760,
    ],
  }),
  created() {
    this.initialize()

  },
  computed: {
    totalP() {
      return this.$store.state.products.length
    },
    totalT() {
      return this.$store.state.tables.length
    },
    NoChilds() {
      return this.$store.state.NoChilds
    },
    NoParents() {
      return this.$store.state.NoParents
    },
    loading() {
      return this.$store.state.loading
    }
  },
  methods: {
    initialize() {
      this.$store.commit("setLoading", true)
      this.$store.dispatch('getItems')
      this.$store.dispatch('getTables')
    },
  }
}
</script>
