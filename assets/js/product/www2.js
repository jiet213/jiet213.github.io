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
^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^^
*/
$(function() {

    //Ecma 6 bind补丁
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

    //批量打印log
    $.log = function() {
        //window._debug_ &&
        if (typeof console == 'object' && console.log) {
            for (var i = 0; i < arguments.length; i++) {
                console.log(arguments[i]);
            }
        }
    };

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

    $.tab = function(config) {

        //tab默认属性
        var defaults = {

            main: ".J-tab", //tab最外层盒子的class

            menu: ".J-tab-menu", //ul的class

            content: ".J-tab-content", //内容区域外层盒子class

            cont_child: ".J-panel",

            eventtype: "mouseover", //事件名称

            select: "z-select" //标签选中class

        };

        //合并外部对象
        var option = $.extend({}, defaults, config);

        var J_tab = option.main,
            J_menu = option.menu,
            J_content = option.content,
            J_cont_child = option.cont_child,
            J_event = option.eventtype,
            J_select = option.select,
            timer = null;

        $(J_tab).each(function() {

            var self = $(this);
            /*
            self_menu = self.find(J_menu),

            self_content = self.find(J_content);*/


            $(document).on(J_event, J_menu + " li", function() {

                clearTimeout(timer);

                var that = $(this),

                    index = that.index();

                timer = setTimeout(function() {

                    that.addClass(J_select).siblings().removeClass(J_select);

                    self.find(J_content).find(J_cont_child).eq(index).removeClass('hide').siblings(J_cont_child).addClass('hide');

                }, 300);

            });

        });



    };

    $.tplRender = function(config) {

        if (!config || !config.tpl) return;

        var func = $.tpl.template(config.tpl);

        if (config.autocomplete) {

            config.container.html(func(config.json)).show();

        } else {

            config.container.html(func(config.json));

        }


    };

    //公共行为对象
    var oPublic = {

        /**
         * 初始化所有行为
         * @ date 20150818 joker.ye
         * ------------------------------------------------------------------
         */
        init: function() {

            //搜索自动补全功能
            this.autocomplete();

            //绑定首页基础事件
            this.bindEvent();

            //默认tab切换
            $.tab();

            //click触发tab切换
            $.tab({

                main: ".J-tab-c",

                menu: ".J-tab-cm",

                content: ".J-tab-cc",

                cont_child: ".J-c-panel",

                eventtype: "click"
            });


        },

        /**
         * common 全局事件绑定方法
         * @ date 20150818 joker.ye
         * ------------------------------------------------------------------
         */
        bindEvent: function() {

            var oEle = {

                    //一级菜单选中样式
                    li_cur: "cur",

                    //二级菜单显示隐藏
                    c_hide: "hide",

                    //二级分类ajax成功，添加到一级上面的样式
                    li_loaded: "loaded",

                    //分类类目
                    cate_item: ".J_cate_item"

                },

                timer = null,

                //所有二级分类的盒子
                $cateBox = $(".J_cate_box"),

                //一级分类盒子 UL
                $ul = $(".J_cate_list_ul"),

                self = this;


            /**
             * *****************
             * 事件绑定（和下面回调函数对应）
             * *****************
             */

            //关闭顶部提示小喇叭
            $(".J_tip_box").on("click", ".J_close_tip", function() {

                $(this).closest('.J_tip_box').hide();

            });

            //关闭顶部广告图
            $(".J_top_banner").on("click", ".J_btn_closeadv", function() {

                $(this).closest('.J_top_banner').hide();

            });

            //展开收起顶部广告图
            //todo
            $(".J_top_banner").on("click", ".J_btn_fad", function() {

                var bIsIe7 = (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.indexOf("MSIE 7.0") != -1);

                $(this).siblings('.p-b').show().siblings('.p-s').hide();

                if (!bIsIe7) {

                    $(".J_top_banner").stop(true, true).animate({
                        height: '300px'
                    }, 360, function() {

                        $(".J_btn_fad").hide().siblings('.J_btn_ufad').show();
                    })

                } else {

                    $(".J_top_banner").css('height', '300px');

                    $(".J_btn_fad").hide().siblings('.J_btn_ufad').show();

                }



            });

            $(".J_top_banner").on("click", ".J_btn_ufad", function() {

                var bIsIe7 = (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.indexOf("MSIE 7.0") != -1);


                if (!bIsIe7) {

                    $(".J_top_banner").stop(true, true).animate({
                        height: '60px'
                    }, 360, function() {

                        $(".J_btn_ufad").siblings('.p-s').show().siblings('.p-b').hide();

                        $(".J_btn_ufad").hide().siblings('.J_btn_fad').show();
                    })

                } else {

                    $(".J_top_banner").css('height', '60px');

                    $(".J_btn_ufad").siblings('.p-s').show().siblings('.p-b').hide();

                    $(".J_btn_ufad").hide().siblings('.J_btn_fad').show();

                }


            });

            //打开页面自动展开，5s后收起
            $(".J_btn_fad").trigger('click');

            setTimeout(function() {

                $(".J_btn_ufad").trigger('click');

            }, 5000);


            //显示二级三级分类
            $(".J_cate_list_ul").on("mouseenter", "> li", toggleCategoryMenu().li_enter).on("mouseleave", "li", toggleCategoryMenu().li_leave);

            //显示二级三级分类
            $cateBox.on("mouseenter", toggleCateBox().box_enter).on("mouseleave", toggleCateBox().box_leave);

            //返回顶部
            $(document).on("click", ".J_go_top", function() {

                $('html,body').animate({
                    scrollTop: 0
                }, {
                    duration: 500
                });

            });

            //如果菜单类目颜色自定义
            selfColor();

            /**
             * *****************
             * 回调函数
             * *****************
             */

            //如果菜单类目颜色自定义
            function selfColor() {

                var $listUl = $(".J_cate_list_ul");

                if ($listUl.hasClass('J-f-self')) {

                    var o_color = $listUl.data('color');

                    $listUl.find('a,h3').css('color', o_color);

                }
            }

            //移入移出分类 li
            function toggleCategoryMenu() {

                //设置二级分类的位置
                function setCategoryBoxPosition($this) {

                    var nScrollTop = document.body.scrollTop || document.documentElement.scrollTop;

                    var nCoffset = $(".J_cate_list_ul").offset().top;

                    var DEFAULT_TOP = 0;

                    if (nCoffset > nScrollTop) {

                        $cateBox.css("top", DEFAULT_TOP);

                    } else {

                        $cateBox.css("top", nScrollTop - nCoffset + DEFAULT_TOP);

                    }

                }

                function getAngle($this) {

                    $this.on("mouseover", function(e) {

                        var oEvent = e || window.event;

                        $.log(oEvent.pageX, oEvent.pageY);

                    });

                }

                return {

                    li_enter: function() {

                        timer && clearTimeout(timer);

                        var $this = $(this);

                        var $cateListUl = $(".J_cate_list_ul");

                        // getAngle($this);

                        var nIndex = $this.index();

                        $this.addClass(oEle.li_cur).siblings().removeClass(oEle.li_cur);

                        $cateBox.show().children(oEle.cate_item).eq(nIndex).removeClass(oEle.c_hide).siblings().addClass(oEle.c_hide);

                        if (!$this.hasClass(oEle.li_loaded)) {

                            timer = setTimeout(function() {

                                $this.addClass(oEle.li_loaded);

                            }, 200);

                        }

                        //如果字体颜色或者icon是自定义的
                        if ($cateListUl.hasClass('J-f-self')) {

                            var o_color = $cateListUl.data('color'),
                                h_color = $cateListUl.data('hcolor');

                            $this.children('h3').css('color', h_color).children('a').css('color', h_color);

                            $this.siblings().children('h3').css('color', o_color).children('a').css('color', o_color);

                        }

                        //如果icon是自定义的
                        $cateListUl.find(".i-self").each(function(index, el) {

                            var self = $(this);

                            var img_src = "";

                            if (self.parent().index() === nIndex) {

                                img_src = self.data('hover');

                            } else {

                                img_src = self.data('original');

                            }

                            self.css('background-image', 'url(' + img_src + ')');

                        });

                        //设置菜单位置
                        setCategoryBoxPosition($this);

                    },

                    li_leave: function() {

                        var $this = $(this);

                        clearTimeout(timer);

                        timer = setTimeout(function() {

                            $this.removeClass(oEle.li_cur);

                            $cateBox.hide();

                            //如果图标字体是自定义的
                            selfFontIcon();

                        }, 200);

                    }

                };

            }

            //移入移出二级菜单盒子
            function toggleCateBox() {

                return {

                    box_enter: function() {

                        clearTimeout(timer);

                    },

                    box_leave: function() {

                        $ul.children('li').removeClass("cur");

                        $cateBox.hide();

                        selfFontIcon();

                    }

                };

            }

            //自定义菜单图标字体，鼠标离开
            function selfFontIcon() {

                var $listUl = $(".J_cate_list_ul");

                //如果字体颜色是自定义的
                if ($listUl.hasClass('J-f-self')) {

                    var o_color = $listUl.data('color');

                    $listUl.find('h3').css('color', o_color).children('a').css('color', o_color);

                }

                //如果icon是自定义的
                $listUl.find(".i-self").each(function(index, el) {

                    var self = $(this),

                        img_src = self.data('original');

                    self.css('background-image', 'url(' + img_src + ')');

                });

            }




        },

        /**
         * 搜索关键词自动补全方法
         * @ date 20150818 joker.ye
         * ------------------------------------------------------------------
         */
        autocomplete: function() {


            /**
             * 搜索框自动补全函数构造器
             * @param {object} container - 自动补全容器，例如:$(".J_wrap")
             * @returns 无
             *
             * @example
             * new AutoComplete($(".J_wrap"));
             * @date 2015-08-12
             * @author joker.ye
             */
            function AutoComplete(container) {

                this.container = container;

                this.timer = null;

                this.s_input = container.children('.J_ipt_search');

                this.c_input = container.children('.J_c_input');

                this.content = $(".J_tips_list");

                this.s_form = $('#form'),

                    this.s_val = {
                        search: '',
                        flag: false
                    };

                this.isIE = +[1, ]; //判断是否是ie7,8

                this.init();
            }

            AutoComplete.prototype = {

                constructor: AutoComplete,

                init: function() {

                    this.bindEvent();

                },
                bindEvent: function() {

                    var $iptSearch = this.s_input,

                        $tipList = this.content,

                        $sInput = this.s_input,

                        $cInput = this.c_input,

                        $form = this.s_form,

                        oDefault = this.s_val,

                        self = this,

                        timer = this.timer,

                        $btnSearch = $(".J_btn_search"),

                        container = this.container;

                    //搜索框事件绑定
                    $iptSearch.on({

                        focus: searchFocus,

                        mouseenter: function() {

                            clearTimeout(timer);

                        },

                        keydown: function(e) {

                            var sVal = $(this).val();

                            if ($.trim(sVal) === "") return;

                            var oEvent = e || window.event;

                            if (oEvent.keyCode === 13) {

                                action($tipList.children('.active').length ? $tipList.children('.active') : $(this));

                                $form.submit();

                            }

                        }

                    });

                    //搜索按钮事件
                    $btnSearch.on("click", function() {

                        if ($iptSearch.val() === "") {

                            $iptSearch.focus();

                            return false;

                        } else {

                            $form.submit();

                        }


                    });

                    //移入移出输入框
                    container

                        .on("mouseenter", function() {

                        clearTimeout(timer);

                    })

                    .on("mouseleave", function() {

                        searchLeave();

                    });

                    //内容列表事件
                    $tipList

                        .on("click", "li", function() {

                        action($(this));

                        $form.submit();

                    })

                    .on("mouseenter", "li", function() {

                        var _index = $(this).index();

                        $(this).removeClass("active").addClass("hover").siblings().removeClass("hover active");

                        clearTimeout(timer);

                    })

                    .on("mouseleave", "li", function() {

                        searchLeave();

                        $tipList.children('li').removeClass("hover");

                    });

                    //去除上移改变光标位置事件
                    $(document).on('keydown', function(e) {

                        //去除上移改变光标位置事件
                        if (e.keyCode === 38) {

                            return false;

                        }

                    });

                    //上下移动,keyup事件能获取到input改变后的值
                    $(document).on('keyup', function(e) {

                        //38->上  40->下
                        if (e.keyCode === 38 && $tipList.is(':visible')) {

                            selectResultList(true);

                        } else if (e.keyCode === 40 && $tipList.is(':visible')) {

                            selectResultList(false);

                        } else if ($sInput.val() !== oDefault.search) {

                            showResultList();

                        }

                    });

                    /**
                     * 搜索框获取焦点
                     * @param 无
                     * @returns 无
                     *
                     * @example
                     * searchFocus();
                     * @date 2015-08-12
                     * @author joker.ye
                     */
                    function searchFocus() {

                        $sInput.val() === "" || showResultList();

                    }

                    /**
                     * 搜索框失去焦点
                     * @param 无
                     * @returns 无
                     *
                     * @example
                     * searchBlur();
                     * @date 2015-08-12
                     * @author joker.ye
                     */
                    function searchBlur() {

                        $tipList.is(":visible") && $tipList.hide();

                    }

                    /**
                     * 搜索框离开、resultlist离开
                     * @param 无
                     * @returns 无
                     *
                     * @example
                     * searchLeave();
                     * @date 2015-08-12
                     * @author joker.ye
                     */
                    function searchLeave() {

                        timer && clearTimeout(timer);

                        timer = setTimeout(function() {

                            $tipList.is(":visible") && $tipList.hide();

                        }, 500);

                    }


                    /**
                     * 异步生成结果列表函数
                     * @param 无
                     * @returns 无
                     *
                     * @example
                     * showResultList();
                     * @date 2015-08-12
                     * @author joker.ye
                     */
                    function showResultList() {

                        oDefault.search = $sInput.val();

                        $.ajax({

                            url: api.getSearchAutocomplete.url + $sInput.val(),

                            type: api.getSearchAutocomplete.method || "GET",

                            error: function(data, e, info) {
                                $.log(data, e, info);
                                for (var key in data) {
                                    $.log(key, data[key]);
                                }
                            }
                        }).done(function(result) {

                            $.log(result);

                            var tmp;

                            //没有匹配内容
                            if (!result.length || result === '[]') {

                                $tipList.hide();

                                return;

                            }

                            //渲染
                            $.tplRender({

                                tpl: pub_search_autolist,

                                container: $tipList,

                                json: typeof(result) === "string" ? JSON.parse(result) : result,

                                autocomplete: true

                            });

                        });

                    }

                    /**
                     * 选择结果列表函数
                     * @param {boolean} true->keyCode===38上  false->keyCode===40下
                     * @returns 无
                     *
                     * @example
                     * selectResultList(true);
                     * @date 2015-08-12
                     * @author joker.ye
                     */
                    function selectResultList(direction) {

                        //当前鼠标停留的索引
                        var $currHover = $tipList.children('li.hover');

                        //当前上下控制的active索引
                        var $currActive = $tipList.children('li.active');

                        //有多少个li
                        var $li = $tipList.children('li');

                        //目标初始化
                        var target = 0;

                        target = direction ? $li.length - 1 : 0;

                        //1. 只有鼠标hover的情况
                        if (!$currActive.length && $currHover.length) {

                            selectCurrentList($currHover);


                            //2.只有上下箭头控制的active
                        } else if ($currActive.length && !$currHover.length) {

                            selectCurrentList($currActive);

                            //3. 鼠标hover 和  上下箭头控制的active 共存
                        } else if ($currActive.length && $currHover.length) {

                            selectCurrentList($currActive);

                        }

                        $li.eq(target).addClass('active').siblings().removeClass("active");

                        action($li.eq(target));

                        /**
                         * 键盘上下箭头控制和鼠标hover 自动补全列表行为
                         * @param {object} $curr 当前的元素
                         * @returns 无
                         *
                         * @example
                         * selectCurrentList($curr);
                         * @date 2015-08-12
                         * @author joker.ye
                         */
                        function selectCurrentList($curr) {

                            if (direction) {

                                target = $curr.index() ? $curr.index() - 1 : $li.length - 1;

                            } else {

                                target = $curr.index() === $li.length - 1 ? 0 : $curr.index() + 1;

                            }

                        }


                    }


                    /**
                     * 键盘上下箭头控制自动补充到输入框中
                     * @param {object} $curr 当前的元素
                     * @returns 无
                     *
                     * @example
                     * action($curr);
                     * @date 2015-08-12
                     * @author joker.ye
                     */
                    function action($curr) {

                        if ($curr[0].tagName === "INPUT") {

                            $iptSearch.val($curr.val());

                            $cInput.attr('disabled', 'disabled');

                            return;

                        }

                        if ($curr.hasClass('cate')) {

                            $iptSearch.val($curr.attr("label"));

                            $cInput.val($curr.attr('cpseq'))

                            .removeAttr('disabled');

                        } else {

                            $iptSearch.val($curr.children('a').html());

                            $cInput.attr('disabled', 'disabled');

                        }


                    }

                }
            };

            var search = new AutoComplete($('.J_search_form'));

        },
        /**
         * 获取当前cookie，如果为undefined默认填充上海
         * @ date 20150818 joker.ye
         * ------------------------------------------------------------------
         */
        _showCurrPlace: function() {

            // cookie_dist = $.cookie(bc_code + '_dist');
            var cpg_cs = $.cookie('C_dist');

            //根据cookie更改当前显示地区
            $(".J_cur_place").html(typeof cpg_cs === "undefined" ? "上海" : $("#dist_" + cpg_cs + "").html());

        },

        /**
         * 获取对象的长度
         * @ date 20150818 joker.ye
         * ------------------------------------------------------------------
         */
        _getObjectSize: function(obj) {

            var size = 0,
                key;

            for (key in obj) {

                if (obj.hasOwnProperty(key)) size++;

            }

            return size;

        }

    };

    //ready
    $(function() {

        oPublic.init();

    });

});
