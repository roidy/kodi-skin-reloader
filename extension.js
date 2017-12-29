const vscode = require('vscode');
const ftech = require('isomorphic-fetch');

function activate(context) {

  var extension = new OnSaveExtension(context);

  vscode.workspace.onDidChangeConfiguration(() => {
    extension.loadConfig();
  });

  let disposable = vscode.commands.registerCommand('extension.enableKodiSkinReloader', function () {
    extension.isEnabled = true;
  });
  context.subscriptions.push(disposable);

  disposable = vscode.commands.registerCommand('extension.disableKodiSkinReloader', function () {
    extension.isEnabled = fasle;
  });
  context.subscriptions.push(disposable);

  vscode.workspace.onDidSaveTextDocument((document) => {
    vscode.window.showInformationMessage("doin the doings");
    extension.reloadSkin();
  });
}
exports.activate = activate;

class OnSaveExtension {

  constructor(context) {
    this._context = context;
    this.loadConfig();
  }

  get isEnabled() {
    return !!this._context.globalState.get('isEnabled', true);
  }

  set isEnabled(value) {
    return this._context.globalState.update('isEnabled', value);
  }

  loadConfig() {
    let config = vscode.workspace.getConfiguration('kodiSkinReloader');
    this._ip = config.get('ip');
    this._port = config.get('port');
  }

  reloadSkin() {

    if (!this.isEnabled) { return; }
    let url = `http://${this._ip}:${this._port}/jsonrpc`;
    fetch(url,
      {
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        method: "POST",
        body: JSON.stringify({ "jsonrpc": "2.0", "id": 1, "method": "Addons.ExecuteAddon", "params": { "addonid": "script.toolbox", "params": { "info": "builtin", "id": "ReloadSkin()" } } })
      })
      .catch(function (res) { vscode.window.showErrorMessage("Unable to refresh skin"); })
  }


}

