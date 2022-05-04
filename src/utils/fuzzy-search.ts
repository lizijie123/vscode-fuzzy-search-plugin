import * as fs from 'fs';
import * as lunr from 'lunr';
import * as utils from './index';

class FuzzySearch {
  /**
   * 项目根目录
   */
  _rootDirectorys: Array<string>;

  /**
   * 忽略搜索的文件白名单
   */
  _whiteList: Array<string>;

  /**
   * 所有文件搜索文档
   */
  _allFileDoc: any;

  /**
   * 搜索仓库
   */
  _searchStore: any;

  /**
   * 搜索结果
   */
  searchResults: any;

  constructor () {
    this.searchResults = [];
    this._rootDirectorys = utils.getProjectPath();
    this._whiteList = this._getWhitePath();
  }

  /**
   * 获取白名单路径
   */
  private _getWhitePath (): Array<string> {
    return [
      'node_modules',
      'lurn',
      'package.json',
      'tsconfig.json',
      'package-lock.json',
      'nodemon.json',
      'jsconfig.json',
      '.git',
      'doc',
      '.gitignore',
      '.eslintrc.js',
      '.eslintignore',
      '.editorconfig',
      '.browserslistrc',
      '.npmrc',
      '.vscode',
      'CONTRIBUTE.md',
      'README.md',
    ];
  }

  /**
   * 校验当前文件路径是否为白名单路径
   */
  private _checkWhite (filePath: string): boolean {
    return this._whiteList.some(whiteItem => filePath.includes(whiteItem));
  }

  /**
   * 获取当前目录下的所有文件路径
   */
  private _getAllFilePath (dirName: string): Array<string> {
    const allFilePath: Array<string> = [];

    const fileList = fs.readdirSync(dirName);
    fileList.forEach(fileItem => {
      const filePath = `${dirName}/${fileItem}`;

      // 白名单中的路径跳过
      if (this._checkWhite(filePath)) return

      if (fs.statSync(filePath).isDirectory()) {
        allFilePath.push(...this._getAllFilePath(filePath));
      } else {
        allFilePath.push(filePath);
      }
    });

    return allFilePath;
  }

  /**
   * 获取文件搜索文档
   */
  private _getFileDoc (filePath: string) {
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const fileName = (/\/([^/]*)$/.exec(filePath))?.[1];

    const fileDoc = {
      filePath,
      fileName,
      body: fileContent,
    };

    return fileDoc;
  }

  /**
   * 获取所有文件搜索文档
   */
  private _getAllFileDoc () {
    const results: any = [];
    (this._rootDirectorys || []).map(rootDirectory => {
      const allFilePath = this._getAllFilePath(rootDirectory);
      const res = allFilePath.map(filePath => {
        return this._getFileDoc(filePath);
      });
      results.push(...res);
    });
    return results;
  }

  /**
   * 获取搜索仓库
   */
  private _getSearchStore () {
    const allFileDoc = this._allFileDoc;
    const searchStore = lunr(function () {
      this.ref('filePath');
      this.field('fileName');
      this.field('body');

      allFileDoc.forEach((fileDoc: any) => {
        this.add(fileDoc);
      });
    });
    // 写入硬盘中
    // const targetPath = `${rootDirectory}/lurn.json`
    // fs.writeFileSync(targetPath, JSON.stringify(searchStore, undefined, 2))
    return searchStore;
  }

  /**
   * 开始搜索
   */
  public search (searchKey: string) {
    try {
      this._allFileDoc = this._getAllFileDoc();
      this._searchStore = this._getSearchStore();
    } catch (err) {
      console.log(err);
    }

    const results = this._searchStore.search(searchKey);

    const resultsFull = results.map((resultItem: any) => {
      return this._allFileDoc.filter((fileDoc: any) => {
        return fileDoc.filePath === resultItem.ref;
      })[0];
    });

    const res = resultsFull.reduce((previous: any, current: any) => {
      const contents = current.body.split('\n').reduce((pre: any, cur: any, index: number) => {
        if (cur.includes(searchKey)) {
          pre.push({
            content: cur,
            line: index,
          });
        }
        return pre;
      }, []);
      if (contents.length) {
        previous.push({
          filePath: current.filePath,
          fileName: current.fileName,
          contents,
        });
      }
      return previous;
    }, []);

    this.searchResults = res;

    return res;
  }
}

export default new FuzzySearch();
