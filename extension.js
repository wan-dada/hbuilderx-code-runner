/**
 * @description Code Runner
 * @createTime 2021-06-13
 * @author oneone
 */

const hx = require("hbuilderx");
const { openExecutorMap } = require('./src/utils.js');
const main = require('./src/main.js');
const {checkUpgrade, about} = require('./src/about.js');

function activate(context) {
    // check upgrade
    checkUpgrade();

    // coderun
    let disposable = hx.commands.registerCommand('codeRunner.run', (param) => {
        main(param);
    });
    context.subscriptions.push(disposable);

    // language map
    let LanguageExecutorMap = hx.commands.registerCommand('codeRunner.LanguageExecutorMap', () => {
        openExecutorMap();
    });
    context.subscriptions.push(LanguageExecutorMap);

    // 关于
    let aboutPlugins = hx.commands.registerCommand('codeRunner.about', () => {
        about();
    });
    context.subscriptions.push(aboutPlugins);
};

function deactivate() {

};

module.exports = {
    activate,
    deactivate
}
