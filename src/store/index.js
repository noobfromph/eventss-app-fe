import Vue from 'vue';
import Vuex from 'vuex';

Vue.use(Vuex);

export default new Vuex.Store({
    state: {
        snackbar: {
            message: null,
            color: "error",
            open: false
        }
    },
    mutations: {
        closeSnackBar(state) {
            state.snackbar.open = false
        },
        setSnackBar(state, payload) {
            state.snackbar = payload
        }
    },
    actions: {},
    getters: {
        getSnackbar(state) {
            return state.snackbar
        }
    }
});
