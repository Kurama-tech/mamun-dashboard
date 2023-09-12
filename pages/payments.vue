<template>
    <div>
        <v-row>
            <v-toolbar elevation="0" class="mt-5">
                <v-toolbar-title>
                    <div class="text-h3" v-text="heading"></div>
                </v-toolbar-title>
                <v-spacer></v-spacer>

                <v-btn class="mx-2" fab dark large color="indigo" @click.stop="editItem(payment)">
                    <v-icon dark>mdi-pencil</v-icon>
                </v-btn>

                <v-dialog v-model="dialog" max-width="290">
                    <v-card>
                        <v-card-title class="text-h5">
                            Change Pricing
                        </v-card-title>

                        <v-card-text>
                            <v-container>
                                <v-form ref="form" v-model="valid" lazy-validation>
                                    <v-row>
                                        <v-text-field v-model="newEditvar.oldprice" type="number" label="Strike off Price"
                                            required></v-text-field>
                                    </v-row>

                                    <v-row>
                                        <v-text-field label="Actual Price" type="number" v-model="newEditvar.newprice"
                                            required></v-text-field>
                                    </v-row>

                                </v-form>
                            </v-container>
                        </v-card-text>

                        <v-card-actions>
                            <v-spacer></v-spacer>

                            <v-btn color="secondary" text @click="closeEdit">
                                Close
                            </v-btn>

                            <v-btn color="green darken-1" text @click="save">
                                Save
                            </v-btn>
                        </v-card-actions>
                    </v-card>
                </v-dialog>

            </v-toolbar>

            <br />

        </v-row>
        <br />
        <v-divider></v-divider>
        <br />
        <v-row>
            <v-col cols="12" sm="6" md="4">
                <v-card elevation="2" shaped color="#CAF1DE" :loading="loading">
                    <v-card-title>Strike off Price</v-card-title>
                    <v-card-text>
                        <div class="text-h4">
                            INR {{ payment.oldprice }}
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
            <v-col cols="12" sm="6" md="4">
                <v-card elevation="2" shaped color="#ACDDDE" :loading="loading">
                    <v-card-title>Actual Price</v-card-title>
                    <v-card-text>
                        <div class="text-h4">
                            INR {{ payment.newprice }}
                        </div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>

    </div>
</template>
  
<script>
import { cloneDeep } from 'lodash'
export default {
    name: 'Payments',
    data: () => ({
        heading: "Payments",
        dialog: false,
        valid: true,
        newEditvar: {},
    }),
    created() {
        this.initialize()

    },
    computed: {
        payment() {

            return cloneDeep(this.$store.state.payment)
        },
        loading() {
            return this.$store.state.loading
        }
    },
    methods: {
        initialize() {
            this.$store.commit("setLoading", true)

            this.$store.dispatch('getPaymentsProfile')
        },
        editItem(item) {
            this.newEditvar = item
            this.dialog = true
        },
        save(){
            this.newEditvar.newprice = Number(this.newEditvar.newprice)
            this.newEditvar.oldprice = Number(this.newEditvar.oldprice)
            const req = {
                "newprice": Number(this.newEditvar.newprice),
                "oldprice": Number(this.newEditvar.oldprice),
                "id": this.newEditvar.id
            }
            this.$store.dispatch('editPayment', req)
            this.$store.commit("setLoading", true)
            this.closeEdit()
        },
        closeEdit() {
            this.newEditvar = {}
            this.dialog = false
        },
    }
}
</script>
  