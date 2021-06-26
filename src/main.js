const hx = require("hbuilderx");
const path = require("path");
const fs = require("fs");
const {exec} = require('child_process');

const language = require('./language.js');
const help = require('./help.js');

const utils = require('./utils.js');

const os = require("os");
const osName = os.platform();

// 特殊的语言，即在操作系统上无需安装任何环境都可以运行的脚本
let specialLanguageList = ["sh", "bat", "out"]

class Code {
    constructor(projectPath, filePath) {
        this.projectPath = projectPath;
        this.filePath = filePath;
    };

    /**
     * @description 检查命令是否存在
     */
    checkProgram(commands) {
        let cmd = osName == 'darwin' ? `which ${commands}` : `where ${commands}`;
        return new Promise((resolve, reject) => {
            exec(cmd, function(error, stdout, stderr) {
                if (error) {
                    reject(error)
                };
                resolve(true);
            });
        })
    };

    /**
     * @description 获取用户自定义的配置
     * @param {String} fileSuffix 文件后缀
     */
    getUserCustomConfig(fileSuffix) {
        // 插件配置目录文件
        let UserConfigFile = utils.getPluginsConfigDir();
        if (UserConfigFile == false) {return false};
        try{
            let tmp = path.join(hx.env.appData, 'code-runner', 'ExecutorMap.js');
            let userSet = require(tmp);
            let runProgramPath = userSet[fileSuffix];
            if (runProgramPath == undefined || runProgramPath == '') {
                return false;
            };
            let stat = fs.statSync(runProgramPath);
            if (stat.isFile()) {
                return runProgramPath;
            };
            return false;
        }catch(e){
            console.log(e)
            return false;
        }
    };

    async run() {
        let filename = (this.filePath).replace(path.join(this.projectPath, '/'), '');

        // 文件后缀
        let ext = path.extname(this.filePath);
        ext = ext.toLowerCase().substr(1);
        let program = language[ext];

        // 组织运行命令
        let cmd = `${program} ${filename}`;

        // 特殊程序, 比如shell、bat
        if (specialLanguageList.includes(ext)) {
            cmd = osName == 'darwin' ? `./${filename}` : filename;
        } else {
            // 检查系统
            let SystemEnv = await this.checkProgram(program).catch( error => {return false});
            // 检查用户设置
            let UserSet = await this.getUserCustomConfig(ext);
            if (SystemEnv == false && UserSet == false) {
                let msgKey = program ? program : ext;
                try{
                    let p = program.split(' ')[0];
                    let programWebstie = help[p]["website"];
                    let programName = help[p]["name"];
                    hx.window.showErrorMessage(`CodeRunner: 当前电脑未检测到 ${msgKey} 运行环境。<br/>请打开官网安装下载相关程序。<a href="${programWebstie}">${programName}官网</a>`, ["我知道了"]);
                }catch(e){
                    hx.window.showErrorMessage(`CodeRunner: 当前电脑未检测到 ${msgKey} 运行环境。`, ["我知道了"]);
                };
                return;
            };
            if (UserSet != false) {
                cmd = `${UserSet} ${filename}`;
            };
        };

        let RunParam = {
            cmd: cmd,
            rootPath: this.projectPath,
        };
        hx.window.openAndRunTerminal(RunParam).then( data => {
            let { error } = data;
            if (error) {
                console.error('CodeRunner: ' + error);
            };
        });
    };
};


/**
 * @description 主入口文件
 * @param {Object} param 项目管理器或编辑器选中的信息
 */
function main(param) {
    if (param == null) {
        hx.window.showErrorMessage("CodeRunner: 请选中文件要执行的文件");
        return;
    };

    let filePath, projectPath;
    try{
        let { metaType } = param;
        if (metaType == 'TextEditor') {
            filePath = param.document.uri.fsPath;
            projectPath = param.document.workspaceFolder.uri.fsPath;
        };
        if (metaType == undefined) {
            filePath = param.fsPath;
            projectPath = param.workspaceFolder.uri.fsPath;
        };
    }catch(e){
        return;
    };

    // 运行
    let rc = new Code(projectPath, filePath);
    rc.run();
};



module.exports = main;
