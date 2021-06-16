const hx = require("hbuilderx");
const path = require("path");
const fs = require("fs");

/**
 * @description 获取codeRunner的配置文件目录
 */
async function getPluginsConfigDir() {
    let appDataDir = hx.env.appData;
    let ConfigDir = path.join(appDataDir, 'code-runner');
    let DirStatus = fs.existsSync(ConfigDir);
    if (!DirStatus) {
        return false;
    };
    let ConfigFile = path.join(appDataDir, 'code-runner', 'ExecutorMap.js');
    let fileStatus = fs.existsSync(ConfigFile);
    if (!fileStatus) {
        return false;
    };
    return ConfigFile;
};

/**
 * @description 复制文件
 * @param {Object} template_path
 * @param {Object} target_path
 * @param {type} isOpenFile
 */
function copyFile(template_path, target_path, isOpenFile) {
    fs.copyFile(template_path, target_path, (err) => {
        if (err) {
            hx.window.showErrorMessage(filename + '创建失败!');
        } else {
            if (isOpenFile) {
                hx.workspace.openTextDocument(target_path);
            };
        };
    });
};

/**
 * @description 打开配置文件，以方便用户自定义设置
 */
function openExecutorMap() {
    let appDataDir = hx.env.appData;
    let ConfigDir = path.join(appDataDir, 'code-runner');
    let DirStatus = fs.existsSync(ConfigDir);
    if (!DirStatus) {
        fs.mkdirSync(ConfigDir);
    };
    let ConfigFile = path.join(appDataDir, 'code-runner', 'ExecutorMap.js');
    let fileStatus = fs.existsSync(ConfigFile);
    if (!fileStatus) {
        let template_path = path.join(__dirname, "template", "ExecutorMap.js");
        let target_path = path.join(ConfigDir, "ExecutorMap.js");
        copyFile(template_path, target_path, true);
    } else {
        hx.workspace.openTextDocument(ConfigFile);
    };
};

module.exports = {
    getPluginsConfigDir,
    openExecutorMap
}
