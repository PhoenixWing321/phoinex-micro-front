declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<{}, {}, any>
  export default component
}

// 添加 wujie 全局类型声明
declare interface Window {
  $wujie?: {
    props: {
      instanceId: number;
      appName: string;
    };
  };
} 