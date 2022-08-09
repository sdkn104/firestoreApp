import Vue from 'vue'
import App from './App.vue'

Vue.config.devtools = true
Vue.config.productionTip = false

// -- BootstrapVue
//import { BootstrapVue, IconsPlugin } from 'bootstrap-vue'
import { BootstrapVue } from 'bootstrap-vue'
// Import Bootstrap and c CSS files (order is important)
import 'bootstrap/dist/css/bootstrap.css'
import 'bootstrap-vue/dist/bootstrap-vue.css'
// Make BootstrapVue available throughout your project
Vue.use(BootstrapVue)
// Optionally install the BootstrapVue icon components plugin
//Vue.use(IconsPlugin)


new Vue({
  render: h => h(App),
}).$mount('#app')
