(function() {
    var re = {
        baseUrl : "./js",
        //js路径
        dir : "./js-build",
        //发布目录
        findNestedDependencies : false,
        //代码内部写的require也计算在打包内
        preserveLicenseComments : false,
        //去掉头部版权声明
        /*
         * 模块
         */
        modules : [
            {
                name : "lib/zepto",
                exclude : [  ]
            },
        /**
         * base
         */
        {
            name : "lib/common",
            exclude : [  ]
        },
         {
                name : "config/url",
                exclude : [ ]
        }
        {{$controllerData}}

        ],
        /*
         * 自动删除被合并过的文件
         */
        removeCombined : false
    /*
    ,
    optimize : "none"
    */
    }
    return re;
})()