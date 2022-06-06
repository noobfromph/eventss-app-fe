<template>
  <div>
    <v-card>
      <!-- header -->
      <v-card-title>
        <h2>Events</h2>
        <!-- toggle buttons: calendar and table view -->
        <v-btn-toggle class="ml-4" v-model="viewToggle" mandatory>
          <v-btn icon @click="viewStyle = 'calendar'">
            <v-icon>mdi-calendar</v-icon>
          </v-btn>
          <v-btn icon @click="viewStyle = 'table'">
            <v-icon>mdi-table</v-icon>
          </v-btn>
        </v-btn-toggle>
      </v-card-title>
      <v-row grid>
        <!-- Table View -->
        <v-col v-if="viewStyle === 'table'">
          <v-data-table :headers="dataTable.headers" :items="events">
          </v-data-table>
        </v-col>
        <!-- Calendar View-->
        <v-col v-if="viewStyle === 'calendar'">
          <v-sheet height="64">
            <!-- calendar header -->
            <v-toolbar flat>
              <v-toolbar-title v-if="$refs.calendar">
                {{ $refs.calendar.title }}
              </v-toolbar-title>
              <v-btn fab text small color="grey darken-2" @click="prev">
                <v-icon small> mdi-chevron-left </v-icon>
              </v-btn>
              <v-btn fab text small color="grey darken-2" @click="next">
                <v-icon small> mdi-chevron-right </v-icon>
              </v-btn>
              <v-spacer></v-spacer>
              <v-menu bottom right>
                <template v-slot:activator="{ on, attrs }">
                  <v-btn
                    outlined
                    color="grey darken-2"
                    v-bind="attrs"
                    v-on="on"
                  >
                    <span>{{ typeToLabel[type] }}</span>
                    <v-icon right> mdi-menu-down </v-icon>
                  </v-btn>
                </template>
                <v-list>
                  <v-list-item @click="type = 'week'">
                    <v-list-item-title>Week</v-list-item-title>
                  </v-list-item>
                  <v-list-item @click="type = 'month'">
                    <v-list-item-title>Month</v-list-item-title>
                  </v-list-item>
                </v-list>
              </v-menu>
            </v-toolbar>
          </v-sheet>
          <!-- main calendar -->
          <v-sheet height="600">
            <v-calendar
              ref="calendar"
              v-model="focus"
              color="primary"
              :events="events"
              :event-color="getEventColor"
              :type="type"
              @click:event="showEvent"
              @change="updateEvents"
              @click:day="addEvent"
              @click:date="addEvent"
            ></v-calendar>
            <!-- Event detail -->
            <v-menu
              v-model="selectedOpen"
              :close-on-content-click="false"
              :activator="selectedElement"
              offset-x
            >
              <v-card color="grey lighten-4" min-width="350px" flat>
                <v-toolbar :color="selectedEvent.color" dark>
                  <v-btn icon @click="editEvent">
                    <v-icon>mdi-pencil</v-icon>
                  </v-btn>
                  <v-toolbar-title
                    v-html="selectedEvent.name"
                  ></v-toolbar-title>
                  <v-spacer></v-spacer>
                  <v-btn icon @click="deleteEvent">
                    <v-icon>mdi-trash-can-outline</v-icon>
                  </v-btn>
                </v-toolbar>
                <v-card-text class="text-left">
                  <v-icon>mdi-calendar-clock</v-icon>&nbsp;{{
                    getTimeFromDateString(selectedEvent.start_time) +
                    " to " +
                    getTimeFromDateString(selectedEvent.end_time)
                  }}
                  <br />
                  <v-icon>mdi-google-maps</v-icon>{{ selectedEvent.venue }}
                  <br />
                  {{ selectedEvent.description }}
                  <div class="text-center">
                    <v-chip-group multiple active-class="primary--text">
                      <v-chip
                        v-for="(user, key) in selectedEvent.users"
                        :key="key"
                      >
                        {{ user.firstname + " " + user.lastname }}
                      </v-chip>
                    </v-chip-group>
                  </div>
                </v-card-text>
                <v-card-actions>
                  <v-btn text color="secondary" @click="selectedOpen = false">
                    Close
                  </v-btn>
                </v-card-actions>
              </v-card>
            </v-menu>
          </v-sheet>
        </v-col>
        <!-- Calendar View-->
      </v-row>
    </v-card>

    <!-- add/edit dialog -->
    <event-dialog
      :value="addEditDialog.open"
      :baseDate="addEditDialog.baseDate"
      :data="addEditDialog.data"
      :mode="addEditDialog.mode"
      @value="onDialogValueChange"
      @onSaveSuccess="onEventSaveSuccess"
      ref="addEditDialog"
    ></event-dialog>

    <!-- confirm dialog, confirmation for deleting -->
    <confirm-dialog
      :value="confirmDialogOpen"
      @value="onConfirmDialogValueChange"
      @yes="onConfirmDialogYes"
    ></confirm-dialog>

    <!-- date picker when creating an event using table view -->
    <date-picker
      :activatorVisible="viewStyle === 'table'"
      @change="onDatePickerChange"
    ></date-picker>
  </div>
</template>

<script>
import { getEvents, deleteEvent } from "@/api";
import AddEventDialog from "@/components/AddEditEvent.vue";
import ConfirmDialogVue from "@/components/ConfirmDialog.vue";
import DatePickerVue from "@/components/DatePicker.vue";

export default {
  components: {
    "event-dialog": AddEventDialog,
    "confirm-dialog": ConfirmDialogVue,
    "date-picker": DatePickerVue,
  },
  data: () => ({
    focus: "", // calendar focus
    type: "month", // calendar type
    typeToLabel: { // calendar view options
      month: "Month",
      week: "Week",
      day: "Day",
    },
    selectedEvent: {}, // calendar v-model when selecting an event
    selectedElement: null, // calendar item dom object, to be used in the activator prop for the v-menu element
    selectedOpen: false, // v-model for the event detail menu
    events: [], // event list
    addEditDialog: { // data for add/edit component
      open: false,
      mode: "add",
      baseDate: null,
      data: null,
    },
    confirmDialogOpen: false, // v-model for confirm dialog
    viewToggle: 0, // v-model for the button toggles, calendar or table view
    colors: [ // event colors, used in random function  `rnd`
      "blue",
      "indigo",
      "deep-purple",
      "cyan",
      "green",
      "orange",
      "grey darken-1",
    ],
    viewStyle: "calendar", // view style, either calendar or table
    dataTable: { // data table configuration, for table view
      headers: [
        {
          text: "Name",
          align: "start",
          value: "name",
        },
        { text: "Description", value: "description" },
        { text: "Venue", value: "venue" },
        { text: "Start", value: "tbl_start_time" },
        { text: "End", value: "tbl_end_time" },
        { text: "Date Created", value: "date_created" },
      ],
    },
    loading: true, // for sending api request
  }),
  mounted() {
    this.updateEvents();
  },
  methods: {
    // returns the color of the event
    getEventColor(event) {
      return event.color;
    },

    // calendar prev button
    prev() {
      this.$refs.calendar.prev();
    },

    // calendar next button
    next() {
      this.$refs.calendar.next();
    },

    // Executed when the an event item is clicked
    showEvent({ event, nativeEvent }) {
      if (this.loading) return; // check if api request is ongoing

      this.selectedEvent = event;
      this.selectedElement = nativeEvent.target;

      const open = () => {
        requestAnimationFrame(() =>
          requestAnimationFrame(() => (this.selectedOpen = true))
        );
      };

      if (this.selectedOpen) {
        this.selectedOpen = false;
        requestAnimationFrame(() => requestAnimationFrame(() => open()));
      } else {
        open();
      }

      nativeEvent.stopPropagation();
    },

    // Executed when a table cell is clicked
    addEvent(data) {
      if (this.loading) return; // check if api request is ongoing

      this.addEditDialog.mode = "add"; // add event
      this.addEditDialog.baseDate = data.date;
      this.addEditDialog.open = true;
    },

    // Executed when the edit button is clicked, edit button is located in the event detail menu
    editEvent() {
      this.addEditDialog.mode = "edit"; // add event
      // get a date from the selected event, we will use it as base date
      let eventDate = this.selectedEvent.start_time;
      // date format is YYYY-MM-DD-THH:mm:ss:ffZ, we want to get the date so we split date and time
      this.addEditDialog.baseDate = eventDate.split("T")[0];
      // setting event data from the selectedEvent object
      this.addEditDialog.data = {
        id: this.selectedEvent.id,
        name: this.selectedEvent.name,
        description: this.selectedEvent.description,
        venue: this.selectedEvent.venue,
        start_time: this.getTimeFromDate(this.selectedEvent.start_time), // format date
        end_time: this.getTimeFromDate(this.selectedEvent.end_time), // format date
        event_users: this.selectedEvent.users.map((user) => user.id), // we only need user id here
      };
      this.addEditDialog.open = true;
    },

    // Performs an api call and updates the events in the calendar
    async updateEvents() {
      // api request
      this.loading = true;
      try {
        let responseEvents = await getEvents(); // api call

        let events = [];
        for (let event of responseEvents) {
          // updating selected event after an api call
          if (this.selectedEvent && this.selectedEvent.id === event.id) {
            this.selectedEvent = event;
          }
          // construct an event for the calendar
          events.push({
            id: event.id,
            name: event.name,
            description: event.description,
            venue: event.venue,
            start_time: event.start_time,
            end_time: event.end_time,
            users: event.users,
            start: new Date(Date.parse(event.start_time)),
            end: new Date(Date.parse(event.end_time)),
            color: this.colors[this.rnd(0, this.colors.length - 1)],
            tbl_start_time: this.getDateFormatPretty(event.start_time),
            tbl_end_time: this.getDateFormatPretty(event.end_time),
            date_created: this.getDateFormatPretty(event.date_created),
            timed: false,
          });
        }

        this.events = events;
      } catch (er) {
        console.log("er", er);
      } finally {
        this.loading = false;
      }
    },

    // Executed when the delete button is clicked
    // shows a confirm dialog
    deleteEvent() {
      this.confirmDialogOpen = true;
    },

    // cb function for confirm dialog
    onConfirmDialogValueChange(val) {
      this.confirmDialogOpen = val;
    },

    // cb function when the confirm dialogs's Yes button is clicked
    async onConfirmDialogYes() {
      let snackbarData = {}; // snackbar data
      try {
        await deleteEvent(this.selectedEvent.id);
        snackbarData.message = "Successfully deleted!";
        snackbarData.color = "success";
      } catch (err) {
        snackbarData.message = err;
        snackbarData.color = "red";
      } finally {
        snackbarData.open = true;
        this.$store.commit("setSnackBar", snackbarData); // commit snackbar data
        this.updateEvents();
      }
    },

    // Returns a random number
    // use in generating color
    rnd(a, b) {
      return Math.floor((b - a + 1) * Math.random()) + a;
    },

    // cb function for add/edit dialog
    onDialogValueChange(val) {
      this.addEditDialog.open = val;
    },

    // returns a formatted date
    getTimeFromDateString(dateString) {
      return this.getHumanReadableTimeFromDateString(dateString); // a mixin function
    },

    // cb function when saving an event is successful
    onEventSaveSuccess() {
      this.updateEvents();
    },

    // cb function for date picker
    onDatePickerChange(date) {
      // construct date param
      let dateData = {
        date: date,
      };
      this.addEvent(dateData);
    },
  },
};
</script>