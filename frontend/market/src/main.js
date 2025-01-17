import { createApp } from 'vue';
import App from './App.vue';
import 'bootstrap'


import store from './store';

import "./plugin.js";

const app = createApp(App);

app.use(store);

app.mount('#app');