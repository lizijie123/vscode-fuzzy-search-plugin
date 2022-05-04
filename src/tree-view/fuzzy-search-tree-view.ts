import * as vscode from 'vscode';
import treeViewDataProvider from '../utils/fuzzy-search-tree-view-data';

const fuzzySearchTreeView = vscode.window.createTreeView("fuzzySearchTreeView", {
  treeDataProvider: treeViewDataProvider,
  showCollapseAll: true,
});

export default fuzzySearchTreeView;
