import './style.css';
import 'primevue/resources/themes/saga-blue/theme.css';
import 'primevue/resources/primevue.min.css';
import 'primeicons/primeicons.css';

import { createApp } from 'vue';

import PrimeVue from 'primevue/config';

import App from './App.vue';

createApp(App).use(PrimeVue).mount('#app')
