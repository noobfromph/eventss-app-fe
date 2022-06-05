import Vue from 'vue'

import vuetify from '@/plugins/vuetify' // path to vuetify plugin
import '@mdi/font/css/materialdesignicons.css'

import router from './router'
import store from './store'

import App from './App.vue'

// global mixins
import './mixins'

Vue.config.productionTip = false

new Vue({
  vuetify,
  router,
  store,
  render: h => h(App),
}).$mount('#app')
