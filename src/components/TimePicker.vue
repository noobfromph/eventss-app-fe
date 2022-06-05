<template>
  <v-dialog v-model="open" width="350">
    <v-card class="pa-7">
      <v-card-title class="d-flex justify-center pa-0"
        >Select
        {{ pickerFor === "start_time" ? "start" : "end" }} time</v-card-title
      >
      <v-time-picker
        class="mb-8"
        v-model="picker"
        format="ampm"
      ></v-time-picker>
      <v-btn class="mr-4" color="primary" @click="save" :disabled="!picker">
        Save
      </v-btn>
      <v-btn @click="cancel">Cancel</v-btn>
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
    pickerFor: {
      type: String,
    },
  },
  data() {
    return {
      picker: null,
    };
  },
  methods: {
    save() {
      // executed when the Save button was clicked
      // create a date string of the selected time
      // we will use this date string to get the 12 hour format of the selected time
      let dateString = `${this.getCurrentDate()}:${this.picker}`;
      // convert to 24 hour
      let twelveHourTime = this.getHumanReadableTimeFromDateString(dateString);

      // the output of this module is object
      // 24 hour and 12 hour
      let times = {
        militaryHourFormat: this.picker,
        twelveHourFormat: twelveHourTime,
      };
      this.$emit("change", times);
      this.open = false;
      this.picker = null;
    },
    cancel() {
      this.picker = null;
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
