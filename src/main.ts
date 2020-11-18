import { createApp } from 'vue'
import Desktop from './window/desktop/Desktop.vue'
import store from './store'

createApp(Desktop)
  .use(store)
  .mount('#app')
