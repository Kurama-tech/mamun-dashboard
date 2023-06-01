<template>
  <v-container fluid fill-height>
    <v-row>
      <v-col cols="12" md="4" />
      <v-col cols="12" md="4">
        <v-form ref="form" v-model="valid" lazy-validation>
          <v-card class="text-center">
            <br>
            <v-img contain height="200"
              src="https://firebasestorage.googleapis.com/v0/b/mamun-public.appspot.com/o/Mamoon-2.png?alt=media&token=ddd01f63-860c-44c4-af00-ea9a9b314cc9" />
            <v-card-title>Login - JWC</v-card-title>
            <v-card-text>
              <!-- Card content goes here -->

              <v-text-field v-model="email" :rules="emailRules" label="E-mail" required />
              <v-text-field v-model="password" type="password" label="Password" required />
              <v-alert v-if="iserror" dense outlined type="error">
               {{ errorStr }}
              </v-alert>
            </v-card-text>
            <v-card-actions>
              <v-spacer />
              <v-btn color="info" rounded block @click="validate">
                Login
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-form>
      </v-col>
      <v-col cols="12" md="4" />
    </v-row>
  </v-container>
</template>

<script>
export default {
  layout: 'login',
  data: () => ({
    valid: true,
    password: '',
    nameRules: [
      v => !!v || 'Name is required',
      v => (v && v.length <= 10) || 'Name must be less than 10 characters'
    ],
    email: '',
    emailRules: [
      v => !!v || 'E-mail is required',
      v => /.+@.+\..+/.test(v) || 'E-mail must be valid'
    ]
  }),
  computed: {
    iserror() {
      return this.$store.state.showauthErr
    },
    errorStr() {
      return this.$store.state.authErr
    }
  },

  methods: {
    async validate() {
      if (this.$refs.form.validate()) {
        let data = {
          username: this.email,
          password: this.password
        }
        await this.$store.dispatch("login", data)
        //this.$router.push({path: '/' })
      }
    },
    reset() {
      this.$refs.form.reset()
    },
    resetValidation() {
      this.$refs.form.resetValidation()
    }
  }
}
</script>
