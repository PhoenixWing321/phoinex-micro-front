import { createApp } from "vue";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import App from "./App.vue";
import router from "./router";
import WujieVue from "wujie-vue3";

const app = createApp(App);

// 添加 Wujie 配置
const wujieOptions = {
  name: 'main-app',
  sync: true,
  props: {},
  degrade: false,
  // 自定义 fetch
  fetch: (url: string, options: RequestInit) => fetch(url, options),
  plugins: [],
  // 不添加 url 前缀
  prefix: {
    'main-app': '/'
  },
  // 忽略 url 参数列表
  urlIgnoreList: [
    '/counter-app',
    '/dialog-app'
  ],
  fiber: false,
  // 加载失败处理
  loadError: (url: string, e: Error): void => {
    console.error(`[Wujie] Load ${url} failed:`, e);
  }
};

app.use(ElementPlus);
app.use(router);
app.use(WujieVue, wujieOptions);
app.mount("#app");
