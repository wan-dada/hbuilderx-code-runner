/**
 * @description Code Runner
 * @createTime 2021-06-13
 * @author oneone
 */

const hx = require("hbuilderx");
const { openExecutorMap } = require('./src/utils.js');
const main = require('./src/main.js');

function activate(context) {
    let disposable = hx.commands.registerCommand('codeRunner.run', (param) => {
        main(param);
    });
    context.subscriptions.push(disposable);

    let LanguageExecutorMap = hx.commands.registerCommand('codeRunner.LanguageExecutorMap', () => {
        openExecutorMap();
    });
    context.subscriptions.push(LanguageExecutorMap);
};

function deactivate() {

};

module.exports = {
    activate,
    deactivate
}
