// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
const vscode = require('vscode');
const { exec } = require('child_process');
const { Console } = require('console');
const player = require("play-sound")();

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



const audiosForPress = [
    "son2.wav",
];

let intervalId; // Identifiant de l'intervalle
let soundIndex = 0; // Index du son dans le dossier 
let isSoundPlaying = false;

// Fonction pour jouer le son en cas d'erreurs
function playErrorSound(context) {
    const activeEditor = vscode.window.activeTextEditor;
    
    if (activeEditor) {

        const numErrors = getNumErrors();
        if (numErrors >= 1) {

            if(!isSoundPlaying){
                console.error(`Votre code a ${numErrors} erreurs`);
                vscode.window.showInformationMessage(`Votre code a ${numErrors} erreurs`);
    
                let musicpath = `${context.extensionPath}/Assets/${audiosForPress[soundIndex]}`;
    
                // Utilisez 'powershell' pour exécuter la commande de lecture de média sous Windows
                const command = `powershell -c (New-Object Media.SoundPlayer '${musicpath}').PlaySync()`;
    
                exec(command, (error, stdout, stderr) => {
                    if (error) {
                        console.error(`Erreur lors de la lecture du son : ${error}`);
                    }
                    // Marquez que la lecture est terminée
                    isSoundPlaying = false;
                });
            }
        } else{
              // Si aucune erreur n'est détectée, arrêtez le son s'il est en cours de lecture
              if (isSoundPlaying) {
                // Arrêtez la lecture du son ici en utilisant la commande appropriée (par exemple, tuer le processus audio)
                // Assurez-vous de mettre à jour la variable isSoundPlaying en conséquence
                isSoundPlaying = false;
            }
        }
    }
}

function activate(context) {
    // Démarrez l'intervalle pour vérifier périodiquement les erreurs
    intervalId = setInterval(() => playErrorSound(context),1000); // Vérifiez toutes les secondes

    // Enregistrez la commande pour arrêter l'intervalle si nécessaire
    let disposable = vscode.commands.registerCommand('Yerror.stopErrorSound', () => {
        clearInterval(intervalId); // Arrêtez l'intervalle
        vscode.window.showInformationMessage('Arrêt de la vérification des erreurs sonores.');
    });

    async function choiceSoundHandler() {
		let items = [
			// {
			// 	label: "Test1 Label",
			// 	value: 0
			// 	// description: "Test1 Description",
			// 	// detail: "$(files) Test1 Detail with icon",
			// },
			{ label: "Son1", value: 0 },
		];

		const select = vscode.window.showQuickPick(items);
		select.then((selected) => {
			soundIndex = selected.value;
			console.log(selected);
		});
	}

	const choiseSound = vscode.commands.registerCommand(
		"Yerror.playErrorSound",
		() => {
			choiceSoundHandler();
		}
	);

	context.subscriptions.push(disposable);
	context.subscriptions.push(choiseSound);
}



function deactivate() {
    clearInterval(intervalId); // Assurez-vous d'arrêter l'intervalle lors de la désactivation
}

module.exports = {
	activate,
    deactivate
}
