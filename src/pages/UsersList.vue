<template>
  <div>
    <v-card>
      <!-- header -->
      <v-card-title>
        <h2>Users</h2>
      </v-card-title>
      <v-row grid>
        <v-col>
          <!-- table -->
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

      <!-- Add user dialog -->
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
      users: [], // user list
      search: null, 
      headers: [ // data table configurations
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
    // cb for add user dialog
    async onDialogValueChange(val) {
      this.modalOpen = val;
    },

    // cb function when saving of user was successful
    onUserSave() {
      this.fetchUsers();
    },

    // performs get request to get users and updates the table
    async fetchUsers() {
      let responseUsers = await getUsers();
      let users = [];
      for (let user of responseUsers) {
        user.date_created = this.getDateFormatPretty(user.date_created); // method from mixins
        users.push(user);
      }

      this.users = users;
    },
  },
};
</script>