/**
 * 每个页面单独的js
 * @ author jie.tang 2016-07-12
 * ------------------------------------------------------------------
 */
require(["lib/common", "widget/util", 'widget/slide', "api/demo", "tpl/demo"], function($, util, slide, demoApi, demoTpl) {

    "use strict";

    //module 模式
    var oMain = (function() {

        //这里还可以定义局部私有变量
        var sId = 666;

        return {

            //例子：埋点上报编码
            reportCode: "9033",

            //初始化
            init: function() {

                //执行页面事件绑定相关逻辑
                this.bindEvent();

                //绑定其他自定义事件
                //this.otherEvent();

            },

            //用户行为绑定
            bindEvent: function() {

                //------------------------------事件绑定列表-------------------------------------//

                $(document).on("click",".J_demo1",demo1Callback);

                $(document).on("click",".J_demo2",demo2Callback);

                //-------------------------------事件回调列表-------------------------------------//

                function demo1Callback(e){

                    alert("1");

                }

                function demo2Callback(e){

                    alert("2");

                }

                //-------------------------------其他---------------------------------------------//
                //----------------轮播示例--------------------//
                $('#slideMain').fn_slide({

                    type: "fadeIn",

                    time: 5000,

                    auto: true,

                    hide_page_btn: true,

                    has_num:false

                });

            },

            //其他自定义事件 例如请求接口
            ajaxEvent: function() {

                $.ajaxDefine({

                    url: demoApi.getStocks.url,

                    type: 'post',

                    dataType: "jsonp",

                    jsonp: "callback",

                    data: {
                        data:"123"
                    }

                }).done(function(res) {

                    //接口正确返回处理的事件
                    //例如渲染列表
                    $.tplRender({

                        tpl: demoTpl.list_hrd,

                        container: $("#listHotRmd"),

                        json: result

                    });

                });
            }

        }

    }());

    //document ready
    $(function() {

        oMain.init();

    });


});
