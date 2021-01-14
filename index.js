// 一个 JavaScript 命名函数。
let startTime = 0;
function recordPlugin (options) {
    this.options = options;
    this.filename = this.options.filename || 'fileList.md'
}
recordPlugin.prototype.apply = function(compiler) {

    console.log('开始执行插件')

    compiler.hooks.compile.tap('MyExample', () => {
        startTime = new Date().getTime();
    })

    compiler.hooks.emit.tapAsync('FileListPlugin', (compilation, cb) => {
        const fileListName = this.filename;

        let len = Object.keys(compilation.assets).length;

        let content = `# 一共有${len}个文件\n\n`;

        for (let filename in compilation.assets) {
            content += `- ${filename}\n`
        }
        compilation.assets[fileListName] = {
            source: function () {
                return content;
            },
            size: function () {
                return content.length;
            }
        }
        cb();
    })

    compiler.hooks.done.tap('MyExample', () => {
        let duration = new Date().getTime() - startTime;
        console.log('打包时长==>', `${(duration / 1000)}s`)
        console.log('打包完成......')
    })
};
module.exports = recordPlugin;
