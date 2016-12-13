/**
 * cookies的一些公共方法
 * @author jie.tang 2016-07-12
 */
define('lib/cookie', function() {
    return {
        cookiePrefix : 'th5_',
        siteIdArray : {
            '1' : 'sh-0-0-0',//上海
        },
        get : function(name) {
            var g = new RegExp("(^|;|\\s+)" + name + "=([^;]*)(;|$)",'g');
            var a = document.cookie.match(g);
            var r = new RegExp("(^|;|\\s+)" + name + "=([^;]*)(;|$)");
            //if(a && a.length > 1){
            if(false){
                var m = a[a.length -1];
                m = m.match(r);
            }else{
                m = document.cookie.match(r);
            }
            var val = (!m ? "" : decodeURIComponent(m[2]));


            //四级市上线暂时性需求
            if(name == "th5_siteid"){
                if(val.match(/^\d+$/)){
                    val = this.siteIdArray[val] || val;
                }
                if((val || "---").indexOf("---") > -1){
                    val = this.siteIdArray['1'];
                }
            }
            return val;
        },
        getH5 : function(name) {
        	var value = this.get(this.cookiePrefix + '' + name);
        	if( name == 'islogin' && value == '1' ){
        		return $.checkLoginCookie();
        	} else {
            	return value;
            }
        },
        add : function(name, v, path, expire, domain, isTimePoint) {
            var s = name + "=" + encodeURIComponent(v) + "; path=" + (path || '/') // 默认根目录
                + (domain ? ("; domain=" + domain) : '');
            if (isTimePoint) {
                s += ";expires=" + expire;
            } else if (expire > 0) {
                var d = new Date();
                d.setTime(d.getTime() + expire * 1000);
                s += ";expires=" + d.toGMTString();
            }
            document.cookie = s;
        },
        addH5 : function(name, v, path, expire, domain, isTimePoint) {
            this.add(this.cookiePrefix + '' + name, v, path, expire, domain, isTimePoint);
            if( name == 'islogin' ){
            	if( v == '1' ){
            		this.add(this.cookiePrefix + 'loginEnv', $._configUrl['environment'], path, expire, domain);
            	} else {
            		this.delH5('loginEnv');
            	}
            }
        },
        del : function(name, path, domain) {
            if (arguments.length == 2) {
                domain = path;
                path = "/"
            }
            document.cookie = name + "=;path=" + path + ";" + (domain ? ("domain=" + domain + ";") : '') + "expires=Thu, 01-Jan-70 00:00:01 GMT";
        },
        delH5 : function(name, path, domain) {
            this.del(this.cookiePrefix + '' + name, path, domain);
        }
    }
})