import * as vscode from 'vscode';
import fuzzySearch from '../utils/fuzzy-search';
import treeViewDataProvider from '../utils/fuzzy-search-tree-view-data';

const fuzzySearchInput = vscode.commands.registerCommand('fuzzy-search-input', () => {
  vscode.window.showInputBox({ 
    placeHolder: '请输入关键字',
  }).then((search: any) => {
    fuzzySearch.search(search);
    treeViewDataProvider.updateView();
  });
});

export default fuzzySearchInput;
