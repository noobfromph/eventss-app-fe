<template>
  <v-dialog
    ref="dialog"
    v-model="open"
    :return-value.sync="date"
    persistent
    width="290px"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        class="btn-create"
        color="pink"
        dark
        absolute
        bottom
        right
        fab
        v-bind="attrs"
        v-on="on"
        v-show="activatorVisible"
      >
        <v-icon>mdi-plus</v-icon>
      </v-btn>
    </template>
    <v-date-picker v-model="date" scrollable>
      <v-spacer></v-spacer>
      <v-btn text color="primary" @click="open = false"> Cancel </v-btn>
      <v-btn text color="primary" @click="setDate"> OK </v-btn>
    </v-date-picker>
  </v-dialog>
</template>

<script>
export default {
  props: {
    activatorVisible: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      date: null,
      open: false
    };
  },
  methods: {
    setDate() {
      this.open = false;
      this.$emit('change', this.date);
    },
  },
};
</script>
