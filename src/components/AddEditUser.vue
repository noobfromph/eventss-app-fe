<template>
  <div>
    <v-dialog v-model="open" width="300">
      <v-card class="pa-7">
        <v-card-title>Create new User</v-card-title>
        <form>
          <v-text-field
            label="First name"
            required
            v-model="userDetail.firstname"
          ></v-text-field>
          <v-text-field
            label="Last name"
            required
            v-model="userDetail.lastname"
          ></v-text-field>
          <v-text-field
            label="Email"
            required
            v-model="userDetail.email"
            type="email"
          ></v-text-field>
          <v-text-field
            label="Address"
            required
            v-model="userDetail.address"
          ></v-text-field>
          <v-btn class="mr-4" @click="submit" color="primary"> Submit </v-btn>
          <v-btn @click="cancel"> Cancel</v-btn>
        </form>
      </v-card>
    </v-dialog>
    <v-snackbar v-model="snackbar" :color="message_color" top class="mt-12">
      {{ message }}
      <template v-slot:action="{ attrs }">
        <v-btn text v-bind="attrs" @click="snackbar = false"> Close </v-btn>
      </template>
    </v-snackbar>
  </div>
</template>
<script>
import { createUser } from "@/api";
export default {
  name: "AddEditUser",
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      userDetail: {},
      snackbar: false,
      message: null,
      message_color: "red",
    };
  },
  methods: {
    async submit() {
      try {
        await createUser(this.userDetail);
        this.message = "User created!";
        this.message_color = "success";
        this.open = false;
        this.$emit("save");
      } catch (err) {
        if (typeof err.response.data == "object") {
          this.message = err.response.data.message;
        } else {
          this.message = err.response.data;
        }
        this.message_color = "red";
      } finally {
        this.snackbar = true;
      }
    },
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