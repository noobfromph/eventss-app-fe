import moment from 'moment';

export default {
    methods: {
        /**
         * Returns the time of a given date string
         * @param {String} dateString 
         */
        getTimeFromDate(dateString) {
            if (!dateString) return null;

            // date format in here is
            // YYYY-MM-DD-THH:mm:ss:ffZ
            let time = dateString.split('T')[1]; // returns HH:mm:ss:ffZ
            // we wanted HH:mm only
            let hour = time.split(':')[0];
            let minute = time.split(':')[1];
            return `${hour}:${minute}`;
        },
        /**
         * Returns a time formatted in 24-hour format
         * @param {String} dateString 
         * @returns Time string
         */
        getHumanReadableTimeFromDateString(dateString) {
            let momentDate = moment(dateString, 'YYYY-MM-DDTHH:mm').utcOffset('+08');
            return momentDate.format('hh:mm A');
        },
        /**
         * Returns the current date in `YYYY-MM-DD` format
         * @returns Date string
         */
        getCurrentDate() {
            return moment().utcOffset('+08').format('YYYY-MM-DD')
        },
        /**
         * Returns a coy of the original json data. To avoid Mutation.
         * @param {object} json 
         * @returns copied json
         */
        copyJson(json) {
            return JSON.parse(JSON.stringify(json));
        },
        /**
         * Returns a date formatted for easy reading
         * @param {String} dateString 
         */
        getDateFormatPretty(dateString) {
            if (!dateString) return dateString;

            let momentDate = moment(dateString, 'YYYY-MM-DDTHH:mm').utcOffset('+08');
            return momentDate.format('YYYY-MM-DD hh:mm A');
        }
    }
}