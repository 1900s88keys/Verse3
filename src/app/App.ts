import "@/shared/style/app.css";

import { createApp } from "vue";
import { createPinia } from "pinia";

import App from "./App.vue";
import router from "./router/Router";

const app = createApp(App);

app.use(createPinia());
app.use(router);

app.mount("#app");
