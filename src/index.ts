import fuzzySearchInput from './command/fuzzy-search-sinput';
import openTextDocument from './command/open-text-document';
import fuzzySearchTreeView from './tree-view/fuzzy-search-tree-view';

export function activate (context: any) {
	console.log('start');
	context.subscriptions.push(...[
		fuzzySearchInput,
		openTextDocument,
		fuzzySearchTreeView,
	]);
}

export function deactivate() {}
