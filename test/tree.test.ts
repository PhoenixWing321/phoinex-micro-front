import { describe, expect, test, beforeEach } from '@jest/globals';
import { TreeNode, Tree, TreeUtils } from '../src/types/tree';

// 测试用的数据类型
interface FileData {
  name: string;
  type: 'file' | 'folder';
  size?: number;
}

// 实现一个简单的树类用于测试
class FileTree implements Tree<FileData> {
  root: TreeNode<FileData>;
  private nodeMap: Map<string | number, TreeNode<FileData>>;

  constructor() {
    this.root = {
      id: 'root',
      data: { name: 'root', type: 'folder' },
      children: [],
      depth: 0,
      isLeaf: true
    };
    this.nodeMap = new Map();
    this.nodeMap.set('root', this.root);
  }

  getNode(id: string | number): TreeNode<FileData> | null {
    return this.nodeMap.get(id) || null;
  }

  addNode(parentId: string | number, node: TreeNode<FileData>): boolean {
    const parent = this.getNode(parentId);
    if (!parent) return false;

    node.parent = parent;
    node.depth = parent.depth + 1;
    parent.children.push(node);
    parent.isLeaf = false;
    this.nodeMap.set(node.id, node);
    return true;
  }

  removeNode(id: string | number): boolean {
    const node = this.getNode(id);
    if (!node || !node.parent) return false;

    const parent = node.parent;
    const index = parent.children.indexOf(node);
    if (index > -1) {
      parent.children.splice(index, 1);
      if (parent.children.length === 0) {
        parent.isLeaf = true;
      }
      this.nodeMap.delete(id);
      return true;
    }
    return false;
  }

  moveNode(nodeId: string | number, newParentId: string | number): boolean {
    const node = this.getNode(nodeId);
    const newParent = this.getNode(newParentId);
    if (!node || !newParent) return false;

    // 先从原来的父节点中移除
    if (node.parent) {
      this.removeNode(nodeId);
    }

    // 添加到新的父节点
    return this.addNode(newParentId, node);
  }

  traverse(callback: (node: TreeNode<FileData>) => void): void {
    const traverseNode = (node: TreeNode<FileData>) => {
      callback(node);
      node.children.forEach(child => traverseNode(child));
    };
    traverseNode(this.root);
  }

  findNodes(predicate: (node: TreeNode<FileData>) => boolean): TreeNode<FileData>[] {
    const result: TreeNode<FileData>[] = [];
    this.traverse(node => {
      if (predicate(node)) {
        result.push(node);
      }
    });
    return result;
  }

  getPath(id: string | number): TreeNode<FileData>[] {
    const node = this.getNode(id);
    if (!node) return [];

    const path: TreeNode<FileData>[] = [node];
    let current = node;
    while (current.parent) {
      path.unshift(current.parent);
      current = current.parent;
    }
    return path;
  }

  getLeaves(): TreeNode<FileData>[] {
    return this.findNodes(node => node.isLeaf);
  }

  getDepth(): number {
    let maxDepth = 0;
    this.traverse(node => {
      maxDepth = Math.max(maxDepth, node.depth);
    });
    return maxDepth;
  }

  toJSON(): string {
    return JSON.stringify(this.root);
  }

  fromJSON(json: string): void {
    const data = JSON.parse(json);
    this.nodeMap.clear();
    this.root = this.buildTreeFromJSON(data);
  }

  private buildTreeFromJSON(data: any): TreeNode<FileData> {
    const node: TreeNode<FileData> = {
      id: data.id,
      data: data.data,
      children: [],
      depth: data.depth,
      isLeaf: data.isLeaf
    };
    this.nodeMap.set(node.id, node);
    
    if (data.children) {
      node.children = data.children.map((child: any) => {
        const childNode = this.buildTreeFromJSON(child);
        childNode.parent = node;
        return childNode;
      });
    }
    return node;
  }
}

// 测试用例
describe('FileTree', () => {
  let tree: FileTree;

  beforeEach(() => {
    tree = new FileTree();
  });

  test('初始化树', () => {
    expect(tree.root).toBeDefined();
    expect(tree.root.id).toBe('root');
    expect(tree.root.children).toHaveLength(0);
  });

  test('添加节点', () => {
    const node: TreeNode<FileData> = {
      id: 'folder1',
      data: { name: 'Documents', type: 'folder' },
      children: [],
      depth: 0,
      isLeaf: true
    };

    expect(tree.addNode('root', node)).toBe(true);
    expect(tree.root.children).toHaveLength(1);
    expect(tree.root.isLeaf).toBe(false);
  });

  test('获取节点', () => {
    const node: TreeNode<FileData> = {
      id: 'file1',
      data: { name: 'test.txt', type: 'file', size: 100 },
      children: [],
      depth: 0,
      isLeaf: true
    };

    tree.addNode('root', node);
    const foundNode = tree.getNode('file1');
    expect(foundNode).toBeDefined();
    expect(foundNode?.data.name).toBe('test.txt');
  });

  test('删除节点', () => {
    const node: TreeNode<FileData> = {
      id: 'file1',
      data: { name: 'test.txt', type: 'file', size: 100 },
      children: [],
      depth: 0,
      isLeaf: true
    };

    tree.addNode('root', node);
    expect(tree.removeNode('file1')).toBe(true);
    expect(tree.getNode('file1')).toBeNull();
    expect(tree.root.children).toHaveLength(0);
  });

  test('获取路径', () => {
    const folder: TreeNode<FileData> = {
      id: 'folder1',
      data: { name: 'Documents', type: 'folder' },
      children: [],
      depth: 0,
      isLeaf: true
    };

    const file: TreeNode<FileData> = {
      id: 'file1',
      data: { name: 'test.txt', type: 'file', size: 100 },
      children: [],
      depth: 0,
      isLeaf: true
    };

    tree.addNode('root', folder);
    tree.addNode('folder1', file);

    const path = tree.getPath('file1');
    expect(path).toHaveLength(3);
    expect(path.map(node => node.id)).toEqual(['root', 'folder1', 'file1']);
  });
}); 