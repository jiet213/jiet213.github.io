/*
。                   _ooOoo_
。                  o8888888o
。                  88" . "88
。                  (| -_- |)
。                  O\  =  /O
。               ____/`---'\____
。             .'  \\|     |//  `.
。            /  \\|||  :  |||//  \
。           /  _||||| -:- |||||-  \
。           |   | \\\  -  /// |   |
。           | \_|  ''\---/''  |   |
。           \  .-\__  `-`  ___/-. /
。         ___`. .'  /--.--\  `. . __
。      ."" '<  `.___\_<|>_/___.'  >'"".
。     | | :  `- \`.;`\ _ /`;.`/ - ` : | |
。     \  \ `-.   \_ __\ /__ _/   .-` /  /
。======`-.____`-.___\_____/___.-`____.-'======
。                   `=---='
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
。         佛祖保佑       永无BUG
。 所有页面公共的js事件 包括全局定义的一些方法
。 author jie.tang 2016-07-12
*/
define('lib/common', ['lib/jquery/1.11.1/jquery-1.11.1', 'lib/zepto', 'config/url', 'lib/cookie', 'lib/doT', 'config/constant'], function(undefined, zepto, configUrl, cookie, doT, constant) {

    'use strict';

    //批量打印log
    $.log = function() {
        //window._debug_ &&
        if (typeof console == 'object' && console.log) {
            for (var i = 0; i < arguments.length; i++) {
                console.log(arguments[i]);
            }
        }
    };

    //捕获js报错
    window.onerror = function(msg, url, line, colno, error) {
        $.log('ERROR:' + msg + '\n' + url + ':line' + line);

        window._errorMessage = 'Javascript Error: ' + msg + ' (' + url + ')';
        window._errorObject = $.extend({}, error);
    }

    //ECMA 6 function 的方法bind兼容
    if (!Function.prototype.bind) {
        Function.prototype.bind = function(oThis) {
            if (typeof this !== "function") {
                // closest thing possible to the ECMAScript 5 internal IsCallable function
                throw new TypeError("Function.prototype.bind - what is trying to be bound is not callable");
            }

            var aArgs = Array.prototype.slice.call(arguments, 1),
                fToBind = this,
                fNOP = function() {},
                fBound = function() {
                    return fToBind.apply(this instanceof fNOP && oThis ? this : oThis || window,
                        aArgs.concat(Array.prototype.slice.call(arguments)));
                };

            fNOP.prototype = this.prototype;
            fBound.prototype = new fNOP();

            return fBound;
        };
    }

    // Production steps of ECMA-262, Edition 5, 15.4.4.18
    // Reference: http://es5.github.io/#x15.4.4.18
    if (!Array.prototype.forEach) {

        Array.prototype.forEach = function(callback, thisArg) {

            var T, k;

            if (this == null) {
                throw new TypeError(' this is null or not defined');
            }

            // 1. Let O be the result of calling ToObject passing the |this| value as the argument.
            var O = Object(this);

            // 2. Let lenValue be the result of calling the Get internal method of O with the argument "length".
            // 3. Let len be ToUint32(lenValue).
            var len = O.length >>> 0;

            // 4. If IsCallable(callback) is false, throw a TypeError exception.
            // See: http://es5.github.com/#x9.11
            if (typeof callback !== "function") {
                throw new TypeError(callback + ' is not a function');
            }

            // 5. If thisArg was supplied, let T be thisArg; else let T be undefined.
            if (arguments.length > 1) {
                T = thisArg;
            }

            // 6. Let k be 0
            k = 0;

            // 7. Repeat, while k < len
            while (k < len) {

                var kValue;

                // a. Let Pk be ToString(k).
                //   This is implicit for LHS operands of the in operator
                // b. Let kPresent be the result of calling the HasProperty internal method of O with argument Pk.
                //   This step can be combined with c
                // c. If kPresent is true, then
                if (k in O) {

                    // i. Let kValue be the result of calling the Get internal method of O with argument Pk.
                    kValue = O[k];

                    // ii. Call the Call internal method of callback with T as the this value and
                    // argument list containing kValue, k, and O.
                    callback.call(T, kValue, k, O);
                }
                // d. Increase k by 1.
                k++;
            }
            // 8. return undefined
        };
    }

    //事件节流
    $.throttle = function(fn, interval) {

        var doing = false;

        return function() {

            if (doing) {

                return;

            }

            doing = true;

            fn.apply(this, arguments);

            setTimeout(function() {

                doing = false;

            }, interval);

        };

    };

    $.tpl = doT;

    //全局绑定
    $.tplRender = function(config) {

        if (!config || !config.tpl) return;

        var func = $.tpl.template(config.tpl);

        config.container.html(func(config.json));

    };


    //全局常量配置
    $.constant = constant;

    // 获取url配置
    $._configUrl = configUrl;

    $.cookie = cookie;

    //判断是否为空
    $.isNull = function(o) {
        return o == undefined || o == "undefined" || o == null || o == '';
    };

    //自定义ajax
    $.ajaxDefine = function(config) {

        var defaults = {

            url: config.url,

            type: config.type || "post",

            data: config.data || {},

            error: function(data, e, info) {

                $.log(data, e, info);
            }

        };

        var option = $.extend({}, defaults, config);

        return $.ajax(option);

    };

    $.getUrlParam = function(name) {
        var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
        var r = window.location.search.substr(1).match(reg);
        if (r != null) return decodeURIComponent(r[2]);
        return null;
    };

    //jsonparse
    $.parseJSON = function(str) {
        try {
            return JSON.parse(str);
        } catch (e) {
            return (new Function('try{return ' + str + '}catch(e){return undefined}'))();
        }
    };

    //alert
    $.alert = function(msg, t, icon) {
        if (typeof msg == 'undefined') {
            return '';
        }
        window._alert_pIndex = (window._alert_pIndex || 0) + 1;
        var _timeout = null;
        var t = t || 3000;
        var iconStr = icon || '<i class="ic_1"></i>';
        if (icon == '0') {
            iconStr = '';
        }
        var str = '<div class="alert_box">' + iconStr + '<p class="alertnr">' + msg + '</p></div>';
        var oDiv = document.createElement('div');
        oDiv.className = "popalert J_alert" + window._alert_pIndex;
        document.body.appendChild(oDiv);
        oDiv.innerHTML = str;
        if (t >= 0) {
            _timeout = setTimeout(function() {
                clearTimeout(_timeout);
                try {
                    oDiv.parentNode.removeChild(oDiv);
                } catch (e) {}
                oDiv = null;
            }, t);
        } else {
            $('.J_alert' + window._alert_pIndex).on('click', function() {
                $(this).hide();
            });
        }
    };

    $.isWeixin = function() {
        //判断是否在微信内
        var ua = navigator.userAgent.toLowerCase();
        var isWeixin = ua.indexOf('micromessenger') != -1;
        return isWeixin;
    };

    //公共行为对象
    var oPublic = (function() {

        return {

            //初始化
            init: function() {

                //执行页面事件绑定相关逻辑
                this.bindEvent();

            },

            //用户行为绑定
            bindEvent: function() {


            }

        }

    }());

    $(function() {

       //每个页面初始化都要跑的逻辑写在这里
       oPublic.init();

    });

    return $;
});
