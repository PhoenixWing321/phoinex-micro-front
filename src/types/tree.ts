// 树节点接口
export interface TreeNode<T> {
  // 节点唯一标识
  id: string | number;
  
  // 节点数据
  data: T;
  
  // 父节点引用（可选）
  parent?: TreeNode<T>;
  
  // 子节点数组
  children: TreeNode<T>[];
  
  // 节点深度
  depth: number;
  
  // 是否为叶子节点
  isLeaf: boolean;
  
  // 是否展开（用于UI显示）
  expanded?: boolean;
  
  // 是否被选中（用于UI显示）
  selected?: boolean;
  
  // 节点标签（用于显示）
  label?: string;
  
  // 节点图标（可选）
  icon?: string;
}

// 树接口
export interface Tree<T> {
  // 根节点
  root: TreeNode<T>;
  
  // 获取节点
  getNode(id: string | number): TreeNode<T> | null;
  
  // 添加节点
  addNode(parentId: string | number, node: TreeNode<T>): boolean;
  
  // 删除节点
  removeNode(id: string | number): boolean;
  
  // 移动节点
  moveNode(nodeId: string | number, newParentId: string | number): boolean;
  
  // 遍历树
  traverse(callback: (node: TreeNode<T>) => void): void;
  
  // 搜索节点
  findNodes(predicate: (node: TreeNode<T>) => boolean): TreeNode<T>[];
  
  // 获取节点路径
  getPath(id: string | number): TreeNode<T>[];
  
  // 获取所有叶子节点
  getLeaves(): TreeNode<T>[];
  
  // 获取树的深度
  getDepth(): number;
  
  // 序列化树结构
  toJSON(): string;
  
  // 从JSON构建树
  fromJSON(json: string): void;
}

// 可选：添加一些辅助类型
export type TreeNodeCallback<T> = (node: TreeNode<T>) => void;
export type TreeNodePredicate<T> = (node: TreeNode<T>) => boolean;

// 可选：添加一些工具类型
export interface TreeUtils<T> {
  // 创建新节点
  createNode(data: T, id?: string | number): TreeNode<T>;
  
  // 克隆节点
  cloneNode(node: TreeNode<T>, deep?: boolean): TreeNode<T>;
  
  // 比较两个节点
  compareNodes(node1: TreeNode<T>, node2: TreeNode<T>): boolean;
} 