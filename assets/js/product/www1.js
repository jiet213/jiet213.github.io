$(function(){

    var oMain = {

        init: function() {

            this.bindEvent();

        },

        bindEvent: function() {

            var self = this;

            var time = null;

            //初始化加载可视化区域内的模块
            self.lazyloadModule();

            //滚动异步加载楼层及其他需要懒加载的模块
            $(window).on("resize scroll", $.throttle(function() {

                time && clearTimeout(time);

                time = setTimeout(function() {

                    //楼层懒加载
                    self.lazyloadModule();

                    //楼层锚点控制
                    ctrlFloorPoint();

                    //侧边栏控制
                    showRightBar();

                }, 400);

            }, 300));

            //改变窗口大小时动态赋值
            $(window).on('resize', $.throttle(function() {

                sdboxHeight();

                ctrlRightBar();

            }, 300));

            //侧边栏点击、hover效果
            $(document).on({
                mouseenter: function() {

                    $(this).find('.J-sdb-tip').css('background', '#da3a4c').stop(true, false).animate({
                        left: "-90px"
                    }, 500);

                },
                mouseleave: function() {

                    $(this).find('.J-sdb-tip').css('background', '#333').stop(true, false).animate({
                        left: "35px"
                    }, 500);

                }
            }, ".J-sbd-tab");

            //-----展开、关闭侧边栏购物车
            $(document).on('click', '.J-sdb-cart', function() {

                var self = $(this),

                    Jsdb = $(".J-sdb");

                var bIsIe7 = (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.indexOf("MSIE 7.0") != -1);

                if (!Jsdb.hasClass('m-sdb-e')) {

                    if (!bIsIe7) {

                        Jsdb.addClass('m-sdb-e').animate({
                            right: "0"
                        }, 360);

                    } else {

                        Jsdb.addClass('m-sdb-e').css('right', "0");

                    }

                    self.addClass('t-cart-active');

                    //促销图片大小图切换
                    //if (Jsdb.hasClass('m-sdb-sale')) {

                    $(".J-sdb-sale").children('.p-b').show().siblings('.p-s').hide();
                    //}


                } else {

                    sdbClose(); //关闭

                }

            });
            //---关闭
            $(document).on('click', '.J-sdb-cc', function() {

                sdbClose();
            });

            //---图书排行版
            $(document).on('mouseenter', '.J-bk-rk li', function() {

                $(this).addClass('z-select').siblings('li').removeClass('z-select');

            });
            /**
             * *****************
             * 回调函数
             * *****************
             */
            /**
             * 右侧边栏随窗口大小改变
             * @ date 20150926 jie.tang
             * ------------------------------------------------------------------
             */
            function ctrlRightBar() {

                var winHeight = $(window).height(),

                    $sdbCart = $(".J-sdb-cart");

                if (winHeight < 635) {

                    $sdbCart.show().siblings('li').hide();

                } else {

                    $sdbCart.show().siblings('li').show();
                }

            }

            ctrlRightBar(); //初始化


            /**
             * 显示轮播边上的促销图片
             * @ date 20150917 jie.tang
             * ------------------------------------------------------------------
             */
            function showGlobalSale() {

                var screenWidth = screen.width,

                    $globalSale = $(".J-g-sale");

                if (screenWidth >= 1600) {

                    $globalSale.show();

                }
            }
            //showGlobalSale();

            /**
             * 显示右侧边栏
             * @ date 20150821 joker.ye
             * ------------------------------------------------------------------
             */
            function showRightBar() {

                var nScrollTop = document.body.scrollTop || document.documentElement.scrollTop,

                    nDefault = 730,

                    $rightBar = $(".J-sdb");

                nScrollTop >= nDefault ? $rightBar.show() : $rightBar.hide();

            }

            showRightBar(); //初始化

            /**
             * 楼层1F ~ NF 锚点控制、悬浮层控制
             * @ date 20150821 joker.ye,jie.tang
             * ------------------------------------------------------------------
             */

            /*            //获取所有楼层的top、bottom值
                        var floor_arr = new Array();

                        $(".m-fn-floor").each(function(index, el) {
                            floor_arr[index] = new Object();
                            floor_arr[index].top = $(this).offset().top;
                            floor_arr[index].bottom = $(this).offset().top + $(this).outerHeight();
                        });
            */
            function ctrlFloorPoint() {

                var nScrollTop = document.body.scrollTop || document.documentElement.scrollTop,

                    yCenter = $(window).height() / 2,

                    $floor = $(".J-floor"),

                    $lift = $(".J_fn_lift"),

                    $fixbar = $(".J-fixbar,.J-fixcont"),

                    nDuration = 200,

                    floorHeight = $floor.outerHeight() / 2,

                    floorOffTop = [],

                    minIndex = 0,

                    floorOffTop_0 = $floor.eq(0).offset().top;

                //悬浮层控制
                if (nScrollTop > 730) {

                    $fixbar.css("top", 0);

                } else {

                    $fixbar.css("top", -50);

                }

                if (nScrollTop + yCenter > floorOffTop_0) {

                    $lift.show().stop(true, true).animate({
                        opacity: 1
                    }, 100, function() {
                        $lift.addClass('m-lift-show')
                    });

                    //楼层和lift控制
                    $floor.each(function(index, el) {

                        var self = $(this),
                            f_top = self.offset().top;

                        floorOffTop[index] = Math.abs(nScrollTop + yCenter - f_top - floorHeight);

                    });

                    //控制楼层选中，中心点离哪个近就选中哪个楼层
                    //兼容IE8以下indexOf写法
                    if (!Array.prototype.indexOf) {

                        Array.prototype.indexOf = function(obj) {

                            for (var i = 0; i < this.length; i++) {

                                if (this[i] == obj) {

                                    return i;

                                }

                            }

                            return -1;

                        }

                    }

                    minIndex = floorOffTop.indexOf(Math.min.apply(Math, floorOffTop));

                    $floor.eq(minIndex).addClass('u-flo-cur').siblings('.J-floor').removeClass('u-flo-cur');

                    $lift.find("li").eq(minIndex).addClass('active').siblings('li').removeClass('active');

                } else {

                    $lift.removeClass('m-lift-show').stop(true, true).animate({
                        opacity: 0
                    }, 100, function() {
                        $lift.hide();
                    });;

                    $(".J_fn_lift li").removeClass('active');

                    $floor.removeClass('u-flo-cur');

                }

            }

            ctrlFloorPoint(); //初始化时判断楼层，是否显示

            //锚点点击跳转到相应楼层
            $(document).on('click', '.J_fn_lift li', function() {

                var self = $(this),

                    index = self.index();

                self.addClass('active').siblings('li').removeClass('active');

                /*$('html,body').stop(true, true).animate({
                    scrollTop: $(".J-floor").eq(index).offset().top - 150
                }, 360);*/
                $('html,body').stop(true, true).animate({
                    scrollTop: $(".J-floor").eq(index).offset().top - 150
                }, 500);
            });


            //首页轮播控制
            //----------------主大图轮播--------------------//
            $('#slideMain').fn_slide({

                type: "fadeIn",

                time: 5000,

                auto: true,

                hide_page_btn: true

            });

            //----------------主大图旁边广告轮播--------------------//
            $('#slideAd').fn_slide({

                has_num: false,

                type: "move",

                flip: false

            });

            //----侧边栏购物车的宽度随可视区域变化
            function sdboxHeight() {

                var wHeight = $(window).height(),

                    Jsdb = $(".J-sdb"),

                    cHeight = 0;

                if (!Jsdb.hasClass('m-sdb-sale')) {

                    cHeight = wHeight - 137;

                } else {
                    cHeight = wHeight - 337;
                }

                $(".J-sdb-cb").css('height', cHeight + 'px');
            }

            sdboxHeight(); //初始化时赋值高度

            //关闭侧边栏购物车效果
            function sdbClose() {

                var Jsdb = $(".J-sdb");

                var bIsIe7 = (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.indexOf("MSIE 7.0") != -1);

                if (!bIsIe7) {

                    Jsdb.removeClass('m-sdb-e').animate({

                        right: "-280px"

                    }, 360, function() {

                        //促销图片大小图切换
                        $(".J-sdb-sale").children('.p-b').hide().siblings('.p-s').show();

                    });

                } else {

                    Jsdb.removeClass('m-sdb-e').css('right', "-280px");

                    //促销图片大小图切换
                    $(".J-sdb-sale").children('.p-b').hide().siblings('.p-s').show();

                }

                $(".J-sdb-cart").removeClass('t-cart-active');


            }


        },

        lazyloadModule: function() {

            var nHeight = $(window).height();

            var nScrollTop = document.body.scrollTop || document.documentElement.scrollTop;

            var self = this;

            


        },
        /**
         * 加载模块公共方法
         * @param {object} config
         * @param config [ajax中传入的对象]
         *        obj.tpl [当前需要渲染的tpl] [必传]
         *        obj.container [当前渲染的tpl容器] [必传]
         *        obj.cur_floor [当前楼层，加J_loaded用] [必传]
         * @returns 无
         *
         * @example
         * loadModuleTemplate({...})
         * @date 2015-08-24
         * @author joker.ye
         */
        loadModuleTemplate: function(config, obj) {

            var opts = $.extend({}, config, obj);

            $.ajax(opts).done(function(result) {

                $.log(JSON.stringify(result));

                $.tplRender({

                    tpl: opts.tpl,

                    container: opts.container,

                    json: result

                });

                opts.cur_floor.addClass(obj.loaded || "J_loaded");

                opts.callback && opts.callback();

            });

        }

    };

    //document ready
    $(function() {

        oMain.init();

    });

});
