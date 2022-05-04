import * as vscode from 'vscode';
import fuzzySearch from './fuzzy-search';

class TreeViewDataProvider implements vscode.TreeDataProvider<any> {
  private onDidChangeTreeDataEvent: vscode.EventEmitter<any | undefined | null> = new vscode.EventEmitter<any | undefined | null>();
  // tslint:disable-next-line:member-ordering
  public readonly onDidChangeTreeData: vscode.Event<any> = this.onDidChangeTreeDataEvent.event;

  updateView() {
		this.onDidChangeTreeDataEvent.fire(null);
	}

  getChildren (el?: any) {
    if (!el) {
      return fuzzySearch.searchResults;
    } else {
      return el.contents.reduce((previous: any, current: any) => {
        previous.push({
          filePath: el.filePath,
          fileName: el.fileName,
          content: current.content,
          line: current.line,
        });
        return previous;
      }, [] as any);
    }
  }

  getTreeItem (el: any) {
    if (el.content) {
      const content = el.content.trim();
      return {
        label: content,
        collapsibleState: 0,
        tooltip: content,
        command: {
          command: "open-text-document",
          title: "Select Node",
          arguments: [el],
        },
      };
    } else {
      return {
        label: el.fileName,
        collapsibleState: 2,
        tooltip: el.filePath,
      };
    }
  }

  getParent () {
    return {};
  }
}

const treeViewDataProvider = new TreeViewDataProvider();

export default treeViewDataProvider;
