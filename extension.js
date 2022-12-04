// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const axios = require('axios');
const xmlParser = require('fast-xml-parser');

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
async function activate(context) {
	const res = await axios.get("https://dev.to/feed/tlylt");
	const articles = new xmlParser.XMLParser().parse(res.data).rss.channel.item.map(item => {
		return {
			label: item.title,
			detail: item.description,
			link: item.link
		}
	});
	console.log(articles);


	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "first-search-blog-example" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with  registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('first-search-blog-example.searchExample', async function () {
		const article = await vscode.window.showQuickPick(articles, {
			matchOnDetail: true,
		})
		if (article == null) return;

		vscode.env.openExternal(vscode.Uri.parse(article.link));
	});

	context.subscriptions.push(disposable);
}

// This method is called when your extension is deactivated
function deactivate() { }

module.exports = {
	activate,
	deactivate
}
