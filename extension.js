// Importation des modules nécessaires
const vscode = require('vscode'); // VS Code API
const { exec } = require('child_process'); // Module pour exécuter des commandes système
const player = require('play-sound')(); // Module pour jouer des sons

// Déclarations de variables globales
let intervalId; // Identifiant de l'intervalle pour vérifier les erreurs périodiquement
let soundIndex = 0; // Index du son dans le dossier
let isSoundPlaying = false; // Indicateur pour savoir si un son est en cours de lecture
let music = false; // Indicateur pour le son spécial "chad"

// Fonction pour obtenir le nombre d'erreurs dans le fichier ouvert
function getNumErrors() {
    const activeTextEditor = vscode.window.activeTextEditor;
    if (!activeTextEditor) return 0; // Si aucun éditeur de texte n'est ouvert, il n'y a pas d'erreurs

    const document = activeTextEditor.document;
    // Récupère les diagnostics (erreurs) du document et filtre ceux qui ont une gravité "Error"
    return vscode.languages.getDiagnostics(document.uri)
        .filter(d => d.severity === vscode.DiagnosticSeverity.Error).length;
}

// Choix des fichiers audios
const audiosForPress = [
    "son2.wav", "piano1.wav", "klaxon.wav", "bip.wav", "beep.wav", "chad.wav", "corbac.wav"
];

// Fonction pour jouer le son en cas d'erreurs
function playErrorSound(context) {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) return; // Si aucun éditeur de texte n'est ouvert, ne fait rien

    const numErrors = getNumErrors();
    if (numErrors >= 1 && !isSoundPlaying) {
        music = true;
        // S'il y a au moins une erreur et qu'aucun son n'est en cours de lecture
        vscode.window.setStatusBarMessage(`Votre code a ${numErrors} erreurs`);
        const musicpath = `${context.extensionPath}/Assets/${audiosForPress[soundIndex]}`;
        const command = `powershell -c (New-Object Media.SoundPlayer '${musicpath}').PlaySync()`;

        // Exécute la commande système pour jouer le son
        exec(command, (error) => {
            if (error) console.error(`Erreur lors de la lecture du son : ${error}`);
            isSoundPlaying = false; // Marque que la lecture est terminée
        });
    } else {
        vscode.window.setStatusBarMessage('');
        // Si un son est en cours de lecture, arrêtez-le ici si nécessaire
        isSoundPlaying = false;
    }
    
    // Si gigachad est activé et il n'y a plus d'erreurs, jouez le son spécial "chad"
    if (music && numErrors === 0) {
        music = false;
        const musicpath = `${context.extensionPath}/Assets/${audiosForPress[5]}`;
        const command = `powershell -c (New-Object Media.SoundPlayer '${musicpath}').PlaySync()`;
        
        // Exécute la commande système pour jouer le son spécial "chad"
        exec(command, (error) => {
            if (error) console.error(`Erreur lors de la lecture du son : ${error}`);
            isSoundPlaying = false; // Marque que la lecture est terminée
        });
    }
}

// Fonction d'activation de l'extension
function activate(context) {
    // Démarre l'intervalle pour vérifier périodiquement les erreurs
    intervalId = setInterval(() => playErrorSound(context), 1000); // Vérifie toutes les secondes

    // Enregistre la commande pour arrêter l'intervalle si nécessaire
    let disposable = vscode.commands.registerCommand('Yerror.stopErrorSound', () => {
        clearInterval(intervalId); // Arrête l'intervalle
        vscode.window.showInformationMessage('Arrêt de la vérification des erreurs sonores.');
    });

    // Enregistre la commande pour choisir un son
    const choiseSound = vscode.commands.registerCommand(
        "Yerror.playErrorSound",
        () => {
            choiceSoundHandler();
        }
    );

    context.subscriptions.push(disposable);
    context.subscriptions.push(choiseSound);
}

// Fonction pour gérer le choix du son
function choiceSoundHandler() {
    let items = [
        { label: "Son gamer", value: 0 },
        { label: "Piano", value: 1 },
        { label: "Klaxon", value: 2 },
        { label: "Bip", value: 3 },
        { label: "Beep", value: 4 },
        { label: "Corbac", value: 6 },
    ];

    // Affiche une liste rapide pour choisir un son
    const select = vscode.window.showQuickPick(items);
    select.then((selected) => {
        soundIndex = selected.value;
        console.log(selected);
    });
}

// Fonction de désactivation de l'extension
function deactivate() {
    clearInterval(intervalId); // Assurez-vous d'arrêter l'intervalle lors de la désactivation
}

// Exporte les fonctions d'activation et de désactivation de l'extension
module.exports = { activate, deactivate };