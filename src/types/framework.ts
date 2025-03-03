

// 应用打开方式
export type OpenModeType = 'drawer' | 'blank' | 'mdi'; 

// 菜单项类型
export type MenuItemType = 'route' | 'function' | 'link';
// 用户信息接口
export interface UserInfo {
  username: string;
  role: string;
  id: number;
  [key: string]: any; // 允许其他属性
}

// 子应用接口
export interface SubApp {
  name: string;
  entry: string;
  container: string;
  openMode?: OpenModeType; // 应用打开方式
  [key: string]: any; // 允许其他属性
}

// 系统消息接口
export interface SystemMessage {
  id: number;
  content: string;
  timestamp: string;
  read: boolean;
}


// 菜单项接口
export interface MenuItem {
  id: string;
  name: string;
  icon: string;
  type: MenuItemType;
  path: string;
  openMode?: OpenModeType; // 应用打开方式
  order: number;
  children?: MenuItem[];
  [key: string]: any; // 允许其他属性
}

// 打开方式接口
export interface OpenMode {
  id: string;
  name: string;
  description: string;
  isDefault?: boolean;
  [key: string]: any; // 允许其他属性
}

// 框架状态接口
export interface FrameworkState {
  // 布局相关
  sidebarCollapsed: boolean;
  currentTheme: string;
  
  // 用户相关
  userInfo: UserInfo | null;
  isLoggedIn: boolean;
  
  // 微前端相关
  subApps: SubApp[];
  currentApp: SubApp | null;
  showDrawer: boolean;
  
  // 系统状态
  isLoading: boolean;
  systemMessages: SystemMessage[];
  
  // 配置相关
  configLoaded: boolean;
  mainMenu?: MenuItem[];
  openModes?: OpenMode[];
} 