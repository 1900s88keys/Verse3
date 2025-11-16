import "@/shared/style/app.css";

import { createPinia } from "pinia";
import { createApp } from "vue";

import App from "./App.vue";
import router from "./router/Router";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
