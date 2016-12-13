/**
 * 公共URL地址配置文件 用于接口地址的域名等,ruquire该js即可
 * @author jie.tang 2016-07-12
 * ------------------------------------------------------------------
 */
define('config/url', function() {

    var self = this;

    return (function() {

    	var sSourceDomain = typeof(source_domain) !== "undefined" ? source_domain : '';

        var sStaticDomain = "https://st.abc.com";

        //列表页价格可卖量域名
        var sListStocks = "http://ac."+sSourceDomain;

        return {

        	sSourceDomain:sSourceDomain,

            sStaticDomain:sStaticDomain,

            sListStocks : sListStocks

        }

    }).call(self);

});