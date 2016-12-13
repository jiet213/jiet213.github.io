//requirejs config
//require的公共配置文件

var host = location.host;

var version = new Date().getTime();

var basePath = "./static/js/";


require.config({

    waitSeconds : 2000,

    baseUrl : basePath,

    paths : {},

    urlArgs : 'v=' +20161104

});