import * as vscode from 'vscode';

const openTextDocument = vscode.commands.registerCommand("open-text-document", (item: any) => {
  vscode.workspace.openTextDocument(item.filePath).then(document => {
    const options = {
      selection: new vscode.Range(new vscode.Position(item.line, 0), new vscode.Position(item.line, 0)),
      viewColumn: vscode.ViewColumn.One
    };

    vscode.window.showTextDocument(document, options);
  });
});

export default openTextDocument;
