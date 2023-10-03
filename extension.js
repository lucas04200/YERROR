// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const { exec } = require('child_process');


// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed

/**
 * @param {vscode.ExtensionContext} context
 */
function activate(context) {



	console.log('Extension "Error Sound" activée.');	
	console.log('Commande powershell');

    let disposable = vscode.commands.registerCommand('Yerror.playErrorSound', () => {
        const activeEditor = vscode.window.activeTextEditor;
        if (activeEditor) {
            // Obtenez le texte du fichier actif
            const documentText = activeEditor.document.getText();

			const chemin = "C:\\Users\\Ldech\\Desktop\\Travail\\Ynov\\B3\\Hackathon\\yerror\\Assets\\summer-party-157615.wav"

            // Exemple : recherche de la chaîne "erreur" dans le texte du fichier
            if (documentText.includes("erreur")) {
                // Jouez un son lorsque l'erreur est détectée
                exec(chemin, (error, stdout, stderr) => {
                    if (error) {
						console.log("Erreur du son")
                        console.error(`Erreur lors de la lecture du son : ${error}`);
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
