import * as vscode from 'vscode';

/**
 * 获取当前所在工程根目录
 */
export const getProjectPath = () => {
  const res = (vscode.workspace.workspaceFolders || []).map(item => {
    return item.uri.path;
  });
  return res;
};
