// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const { exec } = require('child_process');


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */

// function to get the number of errors in the open file
function getNumErrors() {
    const activeTextEditor = vscode.window.activeTextEditor
    if (!activeTextEditor) {
      return 0
    }
    const document = activeTextEditor.document

    const numErrors = vscode.languages
      .getDiagnostics(document.uri)
      .filter(d => d.severity === vscode.DiagnosticSeverity.Error).length

    return numErrors
}

function activate(context) {

	console.log('Extension "Error Sound" activée.');

    let disposable = vscode.commands.registerCommand('Yerror.playErrorSound', () => {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {

            // constante
            const chemin = "C:\\Users\\Ldech\\Desktop\\Travail\\Ynov\\B3\\Hackathon\\yerror\\Assets\\summer-party-157615.wav"
            const numErrors = getNumErrors();

            if (numErrors >= 1) {
                console.error(`Votre code a ${numErrors} erreurs`)
                exec(chemin, (error) => {
                    if (error) {
                        console.error(`Erreur lors de la lecture du son : ${error}`);
                        console.log("La musique n'est pas trouvée")
                    }
                });
            }
        }
    });
    context.subscriptions.push(disposable);

}

module.exports = {
	activate,
}
