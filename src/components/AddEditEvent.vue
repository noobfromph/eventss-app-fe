<template>
  <div>
    <v-dialog v-model="open" width="350" :persistent="loading">
      <v-card class="pa-7">
        <v-card-title class="pa-0">Create new Event</v-card-title>
        <!-- Input form -->
        <form>
          <!-- the name text input -->
          <v-text-field
            label="Name"
            required
            v-model="event_detail.name"
            :disabled="loading"
          ></v-text-field>
          <!-- the description text input -->
          <v-text-field
            label="Description"
            required
            v-model="event_detail.description"
            :disabled="loading"
          ></v-text-field>
          <!-- the venue text input -->
          <v-text-field
            label="Venue"
            required
            v-model="event_detail.venue"
            :disabled="loading"
          ></v-text-field>
          <!-- start and end time text inputs -->
          <div>
            <!-- the start time picker -->
            <v-text-field
              label="Start"
              required
              readonly
              v-model="time_labels.start_time"
              :disabled="loading"
              @click="getTime('start_time')"
            ></v-text-field>
            <!-- the end time picker -->
            <v-text-field
              label="End"
              required
              readonly
              v-model="time_labels.end_time"
              :disabled="loading"
              @click="getTime('end_time')"
            ></v-text-field>
          </div>
          <!-- user picker input -->
          <v-autocomplete
            v-model="event_detail.event_users"
            :items="users"
            chips
            small-chips
            label="Participants"
            multiple
            :disabled="loading"
          ></v-autocomplete>
          <!-- button submit -->
          <v-btn
            class="mr-4"
            @click="submit"
            color="primary"
            :disabled="loading"
          >
            Submit
          </v-btn>
          <!-- button cancel -->
          <v-btn @click="open = false" :disabled="loading">Cancel</v-btn>
        </form>
      </v-card>
    </v-dialog>

    <!-- time picker dialog -->
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
    // value is binded to the v-model of this dialog
    value: {
      type: Boolean,
      default: false,
    },
    // the date of the event to be created/updated
    baseDate: {
      type: String,
    },
    // the data property is use when updating an event
    data: {
      type: Object,
    },
    // the mode property is for identifying the operation
    mode: {
      type: String,
      default: "add", // add | edit
    },
  },
  data() {
    return {
      // v-model for the form
      event_detail: {
        start_time: null,
        end_time: null,
        event_users: [],
        venue: null,
        description: null,
      },
      // v-model for start time and end time
      time_labels: {
        start_time: null,
        end_time: null
      },
      // v-model for listing available users
      users: [],
      // v-model for time picker dialog
      timePickerOpen: false,
      // flag for identifying time picker result, could be for start or end time
      // since we are using a single dialog for time picker
      pickerFor: "start_time",
      // loading flag, true when api request is ongoing
      loading: false,
    };
  },
  methods: {
    // executed when the save button is clicked
    async submit() {
      let snackbarData = {}; // snackbar data

      try {
        this.loading = true; // set as requesting in progress
        // create a copy of the event detail data
        let data = this.copyJson(this.event_detail); // a mixin function

        // format the dates to YYYY-MM-DDTHH:mm:ss.fffZ format 
        // append time with the base date
        data.start_time = `${this.baseDate}T${data.start_time}:00.000Z`;
        data.end_time = `${this.baseDate}T${data.end_time}:00.000Z`;

        // this component has two functions
        // this component can add new event or update an exiting event
        // check operation mode
        if (this.mode === "add") {
          // send the request
          await createEvent(data); // api function
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

        this.open = false; // close this component
        this.resetEvent(); // reset event data
        this.$emit("onSaveSuccess"); // emit this event so that the listener can reload the list
      } catch (err) {
        // possible error is object because the server is using Joi validator
        if (typeof err.response.data == "object") {
          snackbarData.message = err.response.data.message;
        } else {
          snackbarData.message = err.response.data;
        }
        snackbarData.color = "red";
      } finally {
        this.loading = false;
        snackbarData.open = true;
        // Vuex store
        this.$store.commit('setSnackBar', snackbarData); // commit snackbar data
      }
    },

    // a function to reset session data
    resetEvent() {
      // reset event detail
      this.event_detail = {
        start_time: null,
        end_time: null,
        event_users: [],
        venue: null,
        description: null,
      };

      // reset start and end time labels
      this.time_labels = {
        start_time: null,
        end_time: null
      };
    },

    // called when the user clicked the start time or end time field
    getTime(pickerForTime) {
      this.pickerFor = pickerForTime;
      this.timePickerOpen = true;
    },

    // called when the time picker v-model was changed
    onTimePickerChange(val) {
      this.timePickerOpen = val;
    },

    // called when the change event is emitted from the time picker component
    setTime(val) {
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
