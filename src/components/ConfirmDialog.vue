<template>
  <v-dialog v-model="open" width="350">
    <v-card class="pa-7">
      <v-card-text class="text-center"
        >Are you sure you want to delete this event? This cannot be
        undone.</v-card-text
      >
      <v-btn class="mr-4" color="error" @click="confirm">Yes</v-btn>
      <v-btn @click="open = false" color="primary">Cancel</v-btn>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  props: {
    value: {
      type: Boolean,
      default: false,
    },
  },
  methods: {
    confirm() {
      this.$emit("yes");
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
