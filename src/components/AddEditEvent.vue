<template>
  <div>
    <v-dialog v-model="open" width="350" :persistent="loading">
      <v-card class="pa-7">
        <v-card-title class="pa-0">Create new Event</v-card-title>
        <form>
          <v-text-field
            label="Name"
            required
            v-model="event_detail.name"
            :disabled="loading"
          ></v-text-field>
          <v-text-field
            label="Description"
            required
            v-model="event_detail.description"
            :disabled="loading"
          ></v-text-field>
          <v-text-field
            label="Venue"
            required
            v-model="event_detail.venue"
            :disabled="loading"
          ></v-text-field>
          <div>
            <v-text-field
              label="Start"
              required
              readonly
              v-model="time_labels.start_time"
              :disabled="loading"
              @click="getTime('start_time')"
            ></v-text-field>
            <v-text-field
              label="End"
              required
              readonly
              v-model="time_labels.end_time"
              :disabled="loading"
              @click="getTime('end_time')"
            ></v-text-field>
          </div>
          <v-autocomplete
            v-model="event_detail.event_users"
            :items="users"
            chips
            small-chips
            label="Participants"
            multiple
            :disabled="loading"
          ></v-autocomplete>
          <v-btn
            class="mr-4"
            @click="submit"
            color="primary"
            :disabled="loading"
          >
            Submit
          </v-btn>
          <v-btn @click="open = false" :disabled="loading">Cancel</v-btn>
        </form>
      </v-card>
    </v-dialog>
    <time-picker
      :value="timePickerOpen"
      :pickerFor="pickerFor"
      @value="onTimePickerChange"
      @change="setTime"
    ></time-picker>
  </div>
</template>
<script>
import { getUsers, createEvent, updateEvent } from "@/api";
import TimePicker from "./TimePicker.vue";
export default {
  name: "AddEditEventDialog",
  components: {
    "time-picker": TimePicker,
  },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    baseDate: {
      type: String,
    },
    data: {
      type: Object,
    },
    mode: {
      type: String,
      default: "add",
    },
  },
  data() {
    return {
      event_detail: {
        start_time: null,
        end_time: null,
        event_users: [],
        venue: null,
        description: null,
      },
      time_labels: {
        start_time: null,
        end_time: null
      },
      users: [],
      timePickerOpen: false,
      pickerFor: "start_time",
      loading: false,
    };
  },
  methods: {
    async submit() {
      let snackbarData = {}; // snackbar data

      // executed when the save button is clicked
      try {
        this.loading = true; // set as requesting in progress
        // create a copy of the event detail data
        let data = this.copyJson(this.event_detail);
        // append time with the base date
        data.start_time = `${this.baseDate}T${data.start_time}:00.000Z`;
        data.end_time = `${this.baseDate}T${data.end_time}:00.000Z`;
        if (this.mode === "add") {
          // send the request
          await createEvent(data);
          // messages
          snackbarData.color = "success";
          snackbarData.message = "Event created!";
        } else {
          // send the request
          let eventId = data.id;
          delete data.id;
          await updateEvent(eventId, data);
          // messages
          snackbarData.color = "success";
          snackbarData.message = "Event updated!";
        }

        this.open = false;
        this.resetEvent();
        this.$emit("onSaveSuccess"); // edit this event so that te listener can reload the list
      } catch (err) {
        if (typeof err.response.data == "object") {
          snackbarData.message = err.response.data.message;
        } else {
          snackbarData.message = err.response.data;
        }
        snackbarData.color = "red";
      } finally {
        this.loading = false;
        snackbarData.open = true;
        // store
        this.$store.commit('setSnackBar', snackbarData); // commit snackbar data
      }
    },
    resetEvent() {
      // a function to reset session data
      this.event_detail = {
        start_time: null,
        end_time: null,
        event_users: [],
        venue: null,
        description: null,
      };

      this.time_labels = {
        start_time: null,
        end_time: null
      };
    },
    getTime(pickerForTime) {
      // called when the user clicked the start time or end time field
      this.pickerFor = pickerForTime;
      this.timePickerOpen = true;
    },
    onTimePickerChange(val) {
      // called when the time picker v-model was changed
      this.timePickerOpen = val;
    },
    setTime(val) {
      // called when the change event is emitted from the time picker component
      if (this.pickerFor === "start_time") {
        this.event_detail.start_time = val.militaryHourFormat;
        this.time_labels.start_time = val.twelveHourFormat;
      } else {
        this.event_detail.end_time = val.militaryHourFormat;
        this.time_labels.end_time = val.twelveHourFormat;
      }
    },
  },
  computed: {
    open: {
      get() {
        return this.value;
      },
      set(val) {
        if (!val) this.resetEvent(); // if modal is closing, clear session data
        this.$emit("value", val);
      },
    },
  },
  async mounted() {
    // api request for users
    let users = await getUsers();

    // add to user list
    for (let user of users) {
      this.users.push({
        text: `${user.firstname} ${user.lastname}`,
        value: user.id,
      });
    }
  },
  watch: {
    open(newValue) {
      if (newValue === true && this.mode === "edit") {
        // when mode is edit
        // display prop data
        this.event_detail = this.data; // set event detail object as the prop data
        // build dates to display 12 hour format
        let startDateString = `${this.getCurrentDate()}:${this.event_detail.start_time}`;
        let endDateString = `${this.getCurrentDate()}:${this.event_detail.end_time}`;

        // get 12 hour formats
        this.time_labels.start_time = this.getHumanReadableTimeFromDateString(startDateString);
        this.time_labels.end_time = this.getHumanReadableTimeFromDateString(endDateString);
      }
    },
  },
};
</script>
