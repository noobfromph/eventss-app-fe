<template>
  <div>
    <v-card>
      <v-card-title>
        <h2>Users</h2>
      </v-card-title>
      <v-row grid>
        <v-col>
          <v-data-table
            :headers="headers"
            :items="users"
            :search="search"
          ></v-data-table>
        </v-col>
      </v-row>
      <v-btn
        class="btn-create"
        color="pink"
        dark
        absolute
        bottom
        right
        fab
        @click="modalOpen = true"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
      <add-edit-user
        :value="modalOpen"
        @value="onDialogValueChange"
        @save="onUserSave"
      ></add-edit-user>
    </v-card>
  </div>
</template>

<script>
import { getUsers } from "@/api/";
import AddEditUser from "@/components/AddEditUser.vue";

export default {
  components: { AddEditUser },
  data() {
    return {
      users: [],
      search: null,
      headers: [
        {
          text: "Firstname",
          align: "start",
          value: "firstname",
        },
        { text: "Lastname", value: "lastname" },
        { text: "Email", value: "email" },
        { text: "Address", value: "address" },
        { text: "Date Created", value: "date_created" },
      ],
      modalOpen: false,
    };
  },
  async mounted() {
    this.fetchUsers();
  },
  methods: {
    async onDialogValueChange(val) {
      this.modalOpen = val;
    },
    onUserSave() {
      this.fetchUsers();
    },
    async fetchUsers() {
      let responseUsers = await getUsers();
      let users = [];
      for (let user of responseUsers) {
        user.date_created = this.getDateFormatPretty(user.date_created); // method from mixins
        console.log("user", this.getDateFormatPretty(user.date_created)); // method from mixins
        users.push(user);
      }

      this.users = users;
    },
  },
};
</script>

<style scope="col">
.btn-create {
  margin-bottom: 100px;
}
</style>