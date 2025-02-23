export interface MicroApp {
  name: string;
  title: string;
  url: string;
  port: number;
  icon: string;
  defaultWidth?: string;
  defaultHeight?: string;
}

export const microApps: MicroApp[] = [
  {
    name: "counter-app",
    title: "计数器应用",
    url: "http://localhost:8081",
    port: 8081,
    icon: "Monitor",
    defaultWidth: "600px",
    defaultHeight: "400px"
  },
  {
    name: "dialog-app",
    title: "对话框应用",
    url: "http://localhost:8082",
    port: 8082,
    icon: "ChatDotRound",
    defaultWidth: "500px",
    defaultHeight: "300px"
  }
]; 