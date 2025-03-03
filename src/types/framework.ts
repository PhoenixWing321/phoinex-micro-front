// 应用打开方式
export type OpenModeType = 'drawer' | 'blank' | 'mdi'; 

// 菜单项类型
export type MenuItemType = 'route' | 'function' | 'link';

// 用户信息接口
export interface UserInfo {
  name: string;
  avatar: string;
  role: string;
  username?: string;
}

// 子应用接口
export interface SubApp {
  name: string;
  entry: string;
  container: string;
  openMode?: 'drawer' | 'blank' | 'mdi';
}

// 系统消息接口
export interface SystemMessage {
  id: number;
  text: string;
  type: 'info' | 'error' | 'success';
  read?: boolean;
}

// 菜单项接口
export interface MenuItem {
  id: string;
  name: string;
  icon: string;
  type: 'route' | 'function' | 'link';
  path?: string;
  action?: string;
  openMode?: 'drawer' | 'blank' | 'mdi';
  order: number;
  children?: MenuItem[];
}

// 打开方式接口
export interface OpenMode {
  id: string;
  name: string;
  description: string;
  isDefault?: boolean;
}

// 框架状态接口
export interface FrameworkState {
  // 布局相关
  sidebarCollapsed: boolean;
  currentTheme: 'light' | 'dark';
  
  // 用户相关
  userInfo: UserInfo | null;
  isLoggedIn: boolean;
  
  // 微前端相关
  subApps: SubApp[];
  currentAppName: string | null;
  showDrawer: boolean;
  
  // 系统状态
  isLoading: boolean;
  systemMessages: SystemMessage[];
  
  // 配置相关
  configLoaded: boolean;
  mainMenu: MenuItem[];
  openModes: OpenMode[];
  mdiApps: SubApp[]; // MDI应用列表
} 