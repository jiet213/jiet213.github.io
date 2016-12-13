(function() {

    var re = {

        //js路径
        baseUrl: "./js",

        //发布目录
        dir: "./build",

        //代码内部写的require也计算在打包内
        findNestedDependencies: true,

        //去掉头部版权声明
        preserveLicenseComments: false,

        // optimizeAllPluginResources: true,

        // fileExclusionRegExp: /^(r|build)\.js$/,

        // stubModules: ['text'],

        /*
         * 模块
         */
        modules: [

            {
                name: "lib/common",
                exclude: ["config/url"]
            },

            {
                name: "config/url",
                exclude: []
            },

            {
                name: "controller/demo",
                exclude: ["lib/common"] //排除lib/common 模块，不让压进来，页面会引入
            }


        ],
        /*
         * 自动删除被合并过的文件
         */
        removeCombined: false
        /*
    ,
    optimize : "none"
    */
    }
    return re;
})()
