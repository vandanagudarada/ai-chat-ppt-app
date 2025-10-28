import { createApp } from 'vue'
import App from './App/index.vue'
import router from './router'
import { createPinia } from 'pinia'
import vuetify from './plugins/vuetify'
import './plugins/webfontloader'
import './assets/styles.css'
import 'roboto-fontface/css/roboto/roboto-fontface.css'

createApp(App)
  .use(createPinia())
  .use(router)
  .use(vuetify)
  .mount('#app')