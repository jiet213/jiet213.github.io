/**
 * 页面接口配置文件
 * @author jie.tang 2016-07-12
 * ------------------------------------------------------------------
 */
define('api/demo',["config/url"],function(configUrl) {

    return {

        // 这里写接口描述
        getStocks: {

            url : configUrl.sListStocks+ "/stocks/v2?t=" + (new Date().getTime()),

            method: 'post'
        }

    };

});