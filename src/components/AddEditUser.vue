<template>
  <div>
    <v-dialog v-model="open" width="300">
      <v-card class="pa-7">
        <v-card-title>Create new User</v-card-title>
        <!-- Input form -->
        <form>
          <!-- first name input field -->
          <v-text-field
            label="First name"
            required
            v-model="userDetail.firstname"
          ></v-text-field>
          <!-- last name input field -->
          <v-text-field
            label="Last name"
            required
            v-model="userDetail.lastname"
          ></v-text-field>
          <!-- email input field -->
          <v-text-field
            label="Email"
            required
            v-model="userDetail.email"
            type="email"
          ></v-text-field>
          <!-- address input field -->
          <v-text-field
            label="Address"
            required
            v-model="userDetail.address"
          ></v-text-field>
          <!-- submit button -->
          <v-btn class="mr-4" @click="submit" color="primary"> Submit </v-btn>
          <!-- cancel button -->
          <v-btn @click="cancel"> Cancel</v-btn>
        </form>
      </v-card>
    </v-dialog>
  </div>
</template>
<script>
import { createUser } from "@/api";
export default {
  name: "AddEditUser",
  props: {
    // v-model for this component
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      userDetail: {} // v-model for user data
    };
  },
  methods: {
    // Executed when the submit button is clicked
    async submit() {
      let snackbarData = {}; // snackbar data

      try {
        await createUser(this.userDetail); // send api request
        snackbarData.message = "User created!";
        snackbarData.color = "success";
        this.open = false;
        this.$emit("save"); // emit a success event
      } catch (err) {
        // handle error from api
        // api is using Joi validator
        if (typeof err.response.data == "object") {
          snackbarData.message = err.response.data.message;
        } else {
          snackbarData.message = err.response.data;
        }
        snackbarData.color = "red";
      } finally {
        snackbarData.open = true;
        // Vuex store
        this.$store.commit('setSnackBar', snackbarData); // commit snackbar data
      }
    },
    
    // Executed when the cancel button is clicked
    // close the dialog and reset the data
    cancel() {
      this.userDetail = {};
      this.open = false;
    },
  },
  computed: {
    open: {
      get() {
        return this.value;
      },
      set(val) {
        this.$emit("value", val);
      },
    },
  },
};
</script>