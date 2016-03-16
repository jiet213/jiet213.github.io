/*************************************************
 *  Function  美食城
 *  Copyright frontEnd http://www.feiniu.com/
 *  Designed and built by frontEnd  @jie.tang
 *  Date 2016/02/23
 ************************************************/
;
(function($) {

    //兼容IE8以下indexOf写法
    if (!Array.prototype.indexOf) {

      Array.prototype.indexOf = function(searchElement, fromIndex) {

        var k;

        // 1. Let O be the result of calling ToObject passing
        //    the this value as the argument.
        if (this == null) {
          throw new TypeError('"this" is null or not defined');
        }

        var O = Object(this);

        // 2. Let lenValue be the result of calling the Get
        //    internal method of O with the argument "length".
        // 3. Let len be ToUint32(lenValue).
        var len = O.length >>> 0;

        // 4. If len is 0, return -1.
        if (len === 0) {
          return -1;
        }

        // 5. If argument fromIndex was passed let n be
        //    ToInteger(fromIndex); else let n be 0.
        var n = +fromIndex || 0;

        if (Math.abs(n) === Infinity) {
          n = 0;
        }

        // 6. If n >= len, return -1.
        if (n >= len) {
          return -1;
        }

        // 7. If n >= 0, then Let k be n.
        // 8. Else, n<0, Let k be len - abs(n).
        //    If k is less than 0, then let k be 0.
        k = Math.max(n >= 0 ? n : len - Math.abs(n), 0);

        // 9. Repeat, while k < len
        while (k < len) {
          // a. Let Pk be ToString(k).
          //   This is implicit for LHS operands of the in operator
          // b. Let kPresent be the result of calling the
          //    HasProperty internal method of O with argument Pk.
          //   This step can be combined with c
          // c. If kPresent is true, then
          //    i.  Let elementK be the result of calling the Get
          //        internal method of O with the argument ToString(k).
          //   ii.  Let same be the result of applying the
          //        Strict Equality Comparison Algorithm to
          //        searchElement and elementK.
          //  iii.  If same is true, return k.
          if (k in O && O[k] === searchElement) {
            return k;
          }
          k++;
        }
        return -1;
      };
    }

    var food_obj = {

        init: function() {

            //绑定所有时间
            this.bindEvent();

            //菜单导航
            this.navTabList();

            //tab切换
            this.tabFunc();

            //锚点初始化
            this.ctrlFloor();

            //资讯详情页右侧悬浮
            this.detailBarFixed();

        },

        //绑定其他事件
        bindEvent: function() {

            var self = this,

                time = null;

            $(window).on("scroll resize", function() {

                time && clearTimeout(time);

                time = setTimeout(function() {

                    //返回顶部
                    self.goToTop();

                    //楼层控制
                    self.ctrlFloor();

                }, 400);

            });

            //锚点点击跳转到相应楼层
            $(document).on('click', '.J-food-lift li', self.ctrlLift);

            //返回顶部
            $(document).on("click", ".J-go-top", function() {

                $('html,body').animate({

                    scrollTop: 0

                }, 500);

            });

            //分会场入口
            $(".J-f-sale").children('a').eq(0).addClass('z-select');

            $(document).on('mouseover', '.J-f-sale a', function() {

                var $self = $(this);

                time && clearTimeout(time);

                time = setTimeout(function() {

                    $self.stop(true, true).addClass('z-select').siblings().stop(true, true).removeClass('z-select');

                }, 200);

            }).on('mouseout', '.J-f-sale a', function() {
                clearTimeout(time);
            });


            //----------------主大图轮播--------------------//
            $('#slideMain').fn_slide({

                has_num: false,

                type: "fadeIn",

                time: 5000,

                auto: true,

                flip:false

            });

            // --------------------主大图轮播旁边的小图轮播-----------------//flo-slide
            $('#slideBar').fn_slide({

                has_num: false,

                type: "move",

                auto: true,

                flip: false

            });


            // --------------------楼层轮播-----------------//flo-slide
            $('.J-slideFloor').fn_slide({

                has_num: false,

                type: "move",

                auto: true,

                flip: false

            });

            // --------------------大banner轮播-----------------//flo-slide
            $('#slideBanner').fn_slide({

                has_num: false,

                type: "move",

                hide_page_btn: true

            });

        },

        //菜单导航
        navTabList: function() {

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

                //所有二级分类的盒子
                $cateBox = $(".J-cate-ncont"),

                //一级分类盒子 UL
                $ul = $(".J_import_list_ul");

            var $active = null;

            //二级三级菜单
            $(".J_all_import_box").each(function() {
                var $container = $(this),
                    $sublist = [];

                $(".J-cate-ncont > .J_cate_item").each(function() {
                    var $ele = $(this);
                    var index = parseInt($ele.index());

                    if (!isNaN(index)) {
                        $sublist[index] = $ele;
                    }
                });

                $container.menuAim({
                    rowSelector: '.J_import_list_ul > li',
                    subPanel: $sublist,
                    activate: function(li) {
                        var $li = $active = $(li);
                        var $sub = $sublist[$li.index()];
                        var nIndex = $li.index();
                        showModule($li);
                    },
                    deactivate: function(li) {

                        $active = null;

                        if (!li) return;

                        var $li = $(li);

                        var $sub = $sublist[$li.index()];

                        if (!$sub) return;

                        $(li).removeClass(oEle.li_cur);

                        $cateBox.hide();

                    },
                    exitMenu: function() {

                        $active && this.deactivate($active[0]);

                        return true;
                    }
                });
            });

            //显示对应的二级三级
            function showModule($obj) {

                $obj.addClass(oEle.li_cur).siblings().removeClass(oEle.li_cur);

                $cateBox.show().children(oEle.cate_item).eq($obj.index()).removeClass(oEle.c_hide).siblings().addClass(oEle.c_hide);

            }

        },

        //tab切换
        tabFunc: function(config) {

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
                time = null;

            $(J_tab).each(function() {

                var self = $(this),

                    self_menu = self.find(J_menu),

                    self_content = self.find(J_content);

                self_menu.on(J_event, 'li', function() {

                    var that = $(this),

                        index = that.index();

                    time && clearTimeout(time);

                    time = setTimeout(function() {

                        that.addClass(J_select).siblings().removeClass(J_select);

                        self_content.find(J_cont_child).eq(index).removeClass('hide').siblings(J_cont_child).addClass('hide');

                    }, 400);

                }).on("mouseleave", 'li', function() {

                    //鼠标离开清楚time，防止快速滑过时仍然触发事件
                    clearTimeout(time);

                });

            });

        },

        //返回顶部
        goToTop: function() {

            var $J_go_top = $(".J-go-top").parent(),

                nScrollTop = document.body.scrollTop || document.documentElement.scrollTop;

            nScrollTop >= 200 ? $J_go_top.show() : $J_go_top.hide();

        },

        //楼层1F ~ NF 锚点控制
        ctrlFloor: function() {

            var nScrollTop = document.body.scrollTop || document.documentElement.scrollTop,

                yCenter = $(window).height() / 2,

                $floor = $(".J-food-floor"),

                $lift = $(".J-food-lift"),

                liftHeight = $lift.outerHeight(),

                nDuration = 200,

                floorHeight = $floor.outerHeight() / 2,

                floorOffTop = [],

                minIndex = 0,

                floorOffTop_0 = $floor.eq(0).offset().top;

            //初始化锚点位置
            $lift.css("margin-top", (-liftHeight / 2) + 'px');

            if (nScrollTop + yCenter > floorOffTop_0) {

                $lift.show().stop(true, true).animate({
                    opacity: 1
                }, 100, function() {
                    $lift.addClass('m-lift-show')
                });

                $floor.each(function(index, el) {

                    var self = $(this),
                        f_top = self.offset().top;

                    floorOffTop[index] = Math.abs(nScrollTop + yCenter - f_top - floorHeight);

                });

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

                $lift.find("li").eq(minIndex).addClass('active').siblings('li').removeClass('active');

            } else {

                $lift.removeClass('m-lift-show').stop(true, true).animate({
                    opacity: 0
                }, 100, function() {
                    $lift.hide();
                });

                $lift.find("li").removeClass('active');

            }

        },

        //控制楼层锚点跳转
        ctrlLift: function() {

            var $floor = $(".J-food-floor"),

                $self = $(this),

                index = $self.index();

            $self.addClass('active').siblings("li").removeClass('active');

            $("html,body").stop(true, true).animate({

                scrollTop: $floor.eq(index).offset().top - 40

            }, 500);

        },

        //资讯详情页后侧悬浮
        detailBarFixed: function() {

            var $J_zx_bar = $(".J-zx-bar"),

                $J_zx_detail = $(".J-zx-detail");

            //资讯详情页后侧悬浮
            if ($J_zx_bar.length > 0) {

                var zx_bar_offT = $J_zx_bar.offset().top,

                    zx_detail_offT = $J_zx_detail.offset().top,

                    zx_height = $J_zx_detail.outerHeight();

                $(window).on("scroll resize", function() {

                    var wHeight = $(window).height(),

                        nScrollTop = document.body.scrollTop || document.documentElement.scrollTop;

                    if (nScrollTop >= zx_bar_offT) {

                        if (nScrollTop + wHeight >= zx_detail_offT + zx_height) {

                            $J_zx_bar.addClass('z-absolute').removeClass('z-fix');

                        } else {

                            $J_zx_bar.addClass('z-fix').removeClass('z-absolute');

                        }

                    } else {

                        $J_zx_bar.removeClass('z-fix').removeClass('z-absolute');
                    }

                });

            }

        }
    };

    (function($) {

        $.fn.menuAim = function(opts) {
            // Initialize menu-aim for all elements in jQuery collection
            this.each(function() {
                init.call(this, opts);
            });

            return this;
        };

        function init(opts) {
            var $menu = $(this),
                activeRow = null,
                mouseLocs = [],
                lastDelayLoc = null,
                timeoutId = null,
                subPanelMouseenter = false,
                options = $.extend({
                    rowSelector: "> li",
                    submenuSelector: "*",
                    submenuDirection: "right",
                    subPanel: null,
                    tolerance: 75, // bigger = more forgivey when entering submenu
                    enter: $.noop,
                    exit: $.noop,
                    activate: $.noop,
                    deactivate: $.noop,
                    exitMenu: $.noop
                }, opts);

            var MOUSE_LOCS_TRACKED = 3, // number of past mouse locations to track
                DELAY = 300; // ms delay when user appears to be entering submenu

            /**
             * Keep track of the last few locations of the mouse.
             */
            var mousemoveDocument = function(e) {
                mouseLocs.push({
                    x: e.pageX,
                    y: e.pageY
                });

                if (mouseLocs.length > MOUSE_LOCS_TRACKED) {
                    mouseLocs.shift();
                }
            };

            /**
             * Cancel possible row activations when leaving the menu entirely
             */
            var mouseleaveMenu = function() {
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }

                // If exitMenu is supplied and returns true, deactivate the
                // currently active row on menu exit.
                if (options.exitMenu(this)) {
                    if (activeRow) {
                        options.deactivate(activeRow);
                    }

                    activeRow = null;
                }
            };

            /**
             * Trigger a possible row activation whenever entering a new row.
             */
            var mouseenterRow = function() {
                    if (timeoutId) {
                        // Cancel any previous activation delays
                        clearTimeout(timeoutId);
                    }

                    options.enter(this);
                    possiblyActivate(this);
                },
                mouseleaveRow = function() {
                    options.exit(this);
                };

            /*
             * Immediately activate a row if the user clicks on it.
             */
            var clickRow = function() {
                activate(this);
            };

            /**
             * Activate a menu row.
             */
            var activate = function(row) {
                if (row == activeRow) {
                    return;
                }

                if (subPanelMouseenter) {
                    return;
                }

                if (activeRow) {
                    options.deactivate(activeRow);
                }

                options.activate(row);
                activeRow = row;
            };

            /**
             * Possibly activate a menu row. If mouse movement indicates that we
             * shouldn't activate yet because user may be trying to enter
             * a submenu's content, then delay and check again later.
             */
            var possiblyActivate = function(row) {
                var delay = activationDelay();

                if (delay) {
                    timeoutId = setTimeout(function() {
                        possiblyActivate(row);
                    }, delay);
                } else {
                    activate(row);
                }
            };

            /**
             * Return the amount of time that should be used as a delay before the
             * currently hovered row is activated.
             *
             * Returns 0 if the activation should happen immediately. Otherwise,
             * returns the number of milliseconds that should be delayed before
             * checking again to see if the row should be activated.
             */
            var activationDelay = function() {
                if (!activeRow || !$(activeRow).is(options.submenuSelector)) {
                    // If there is no other submenu row already active, then
                    // go ahead and activate immediately.
                    return 0;
                }

                var offset = $menu.offset(),
                    upperLeft = {
                        x: offset.left,
                        y: offset.top - options.tolerance
                    },
                    upperRight = {
                        x: offset.left + $menu.outerWidth(),
                        y: upperLeft.y
                    },
                    lowerLeft = {
                        x: offset.left,
                        y: offset.top + $menu.outerHeight() + options.tolerance
                    },
                    lowerRight = {
                        x: offset.left + $menu.outerWidth(),
                        y: lowerLeft.y
                    },
                    loc = mouseLocs[mouseLocs.length - 1],
                    prevLoc = mouseLocs[0];

                if (!loc) {
                    return 0;
                }

                if (!prevLoc) {
                    prevLoc = loc;
                }

                if (prevLoc.x < offset.left || prevLoc.x > lowerRight.x ||
                    prevLoc.y < offset.top || prevLoc.y > lowerRight.y) {
                    // If the previous mouse location was outside of the entire
                    // menu's bounds, immediately activate.
                    return 0;
                }

                if (lastDelayLoc &&
                    loc.x == lastDelayLoc.x && loc.y == lastDelayLoc.y) {
                    // If the mouse hasn't moved since the last time we checked
                    // for activation status, immediately activate.
                    return 0;
                }

                // Detect if the user is moving towards the currently activated
                // submenu.
                //
                // If the mouse is heading relatively clearly towards
                // the submenu's content, we should wait and give the user more
                // time before activating a new row. If the mouse is heading
                // elsewhere, we can immediately activate a new row.
                //
                // We detect this by calculating the slope formed between the
                // current mouse location and the upper/lower right points of
                // the menu. We do the same for the previous mouse location.
                // If the current mouse location's slopes are
                // increasing/decreasing appropriately compared to the
                // previous's, we know the user is moving toward the submenu.
                //
                // Note that since the y-axis increases as the cursor moves
                // down the screen, we are looking for the slope between the
                // cursor and the upper right corner to decrease over time, not
                // increase (somewhat counterintuitively).
                function slope(a, b) {
                    return (b.y - a.y) / (b.x - a.x);
                };

                var decreasingCorner = upperRight,
                    increasingCorner = lowerRight;

                // Our expectations for decreasing or increasing slope values
                // depends on which direction the submenu opens relative to the
                // main menu. By default, if the menu opens on the right, we
                // expect the slope between the cursor and the upper right
                // corner to decrease over time, as explained above. If the
                // submenu opens in a different direction, we change our slope
                // expectations.
                if (options.submenuDirection == "left") {
                    decreasingCorner = lowerLeft;
                    increasingCorner = upperLeft;
                } else if (options.submenuDirection == "below") {
                    decreasingCorner = lowerRight;
                    increasingCorner = lowerLeft;
                } else if (options.submenuDirection == "above") {
                    decreasingCorner = upperLeft;
                    increasingCorner = upperRight;
                }

                var decreasingSlope = slope(loc, decreasingCorner),
                    increasingSlope = slope(loc, increasingCorner),
                    prevDecreasingSlope = slope(prevLoc, decreasingCorner),
                    prevIncreasingSlope = slope(prevLoc, increasingCorner);

                if (decreasingSlope < prevDecreasingSlope &&
                    increasingSlope > prevIncreasingSlope) {
                    // Mouse is moving from previous location towards the
                    // currently activated submenu. Delay before activating a
                    // new menu row, because user may be moving into submenu.
                    lastDelayLoc = loc;
                    return DELAY;
                }

                lastDelayLoc = null;
                return 0;
            };

            /**
             * Hook up initial menu events
             */
            $menu
                .mouseleave(mouseleaveMenu)
                .find(options.rowSelector)
                .mouseenter(mouseenterRow)
                .mouseleave(mouseleaveRow)
                .click(clickRow);

            if (options.subPanel) {
                $(options.subPanel).each(function() {
                    $(this).mouseenter(function() {
                        subPanelMouseenter = true;
                    }).mouseleave(function() {
                        subPanelMouseenter = false;
                    })
                })

                /**/
            }

            $(document).mousemove(mousemoveDocument);

        };

        //轮播
        $.fn.fn_slide = function(options) {
            // build main options before element iteration
            var opts = $.extend({}, $.fn.fn_slide.defaults, options);
            // iterate and reformat each matched element
            return this.each(function() {

                var $this = $(this);

                // build element specific options
                var o = $.meta ? $.extend({}, opts, $this.data()) : opts;

                var active = opts.active || "z-select",
                    time = null;

                //?ù±??a??
                var ele = {

                    main: "slider-main",

                    num: "slider-nav",

                    num_li: "slider-item",

                    next_btn: "slider-next",

                    prev_btn: "slider-prev",

                    page_box: "J_page_box"

                };

                //get img contains
                var _ul = $this.children('.' + ele.main);

                //get li's length
                var _len = _ul.children("li").length;

                var _height = _ul.children("li").height();

                //create slide Ctrl
                var str = "";

                //init _index
                var _index = 0;

                var _width = $this.width();

                //set ul's width
                _ul.width(_width * _len);

                //set li's width
                //_ul.children("li").width(_width);

                //?ú2????ó
                var obj = {

                    is_flip: o.flip,

                    is_fade: (o.type === "fadeIn"),

                    is_move: (o.type === "move"),

                    is_up: (o.type === "up"),

                    throttle_t: 200,

                    init: function() {

                        //ctrl
                        o.has_ctrl && $this.append('<ul class="s-ctr ' + ele.num + '">' + showCtrl() + '</ul>');

                        //是否需要上一页下一页
                        obj.is_flip && showFlip();

                        //初始化渐变还是左右
                        if (obj.is_fade) {

                            _ul.children("li:first").addClass('z-select').css({
                                    "position": "absolute",
                                    "zIndex": 1,
                                    "opacity": 1
                                })
                                .siblings().removeClass('z-select').css({
                                    "position": "absolute",
                                    "zIndex": 0,
                                    "opacity": 0
                                });

                            //todo
                            $this.on('mouseenter', '.' + ele.num_li, function() {

                                var $this = $(this);

                                clearTimeout(time);

                                time = setTimeout(function() {

                                    _index = $this.index();

                                    _ul.children("li").eq(_index).addClass('z-select').css("zIndex", 1).siblings().removeClass('z-select').css("zIndex", 0);

                                    _ul.children("li").eq(_index).stop(true).animate({

                                        "opacity": 1

                                    }, {
                                        duration: o.duration,

                                        complete: function() {

                                            _ul.children("li").eq(_index).siblings().css({
                                                "opacity": 0
                                            });

                                        }

                                    });

                                    $this.addClass(active).siblings().removeClass(active);

                                }, obj.throttle_t);


                            }).on('mouseleave', '.' + ele.num_li, function() {

                                clearTimeout(time);

                            });


                        } else if (obj.is_move) {

                            //bind event on <li>
                            $this.on('mouseenter', '.' + ele.num_li, function() {

                                var $this = $(this);

                                clearTimeout(time);

                                time = setTimeout(function() {

                                    _index = $this.index();

                                    _ul.stop(true).animate({

                                        "marginLeft": -(_width * _index)

                                    }, o.duration);

                                    $this.addClass(active).siblings().removeClass(active);

                                }, obj.throttle_t);


                            }).on('mouseleave', '.' + ele.num_li, function() {

                                clearTimeout(time);

                            });


                        } else if (obj.is_up) {

                            _ul.width(_width);

                            _ul.height(_height * _len);

                            //bind event on <li>



                        }

                        //如果上下页切换按钮是隐藏的话

                        o.hide_page_btn && $this.on({

                            mouseenter: function() {

                                if ($(this).find("." + ele.page_box).is(":hidden") && $(this).find("." + ele.main + " >li").length > 1) {

                                    $(this).find("." + ele.page_box).show();

                                }

                            },

                            mouseleave: function() {

                                $(this).find("." + ele.page_box).hide();

                            }

                        });

                        //定时器
                        obj.timeFuc();

                    },

                    timeFuc: function() {

                        //auto 为true 表示可自动

                        if (o.auto) {

                            //setInterval
                            time = setInterval(showEffect, o.time);

                            // clearInterval
                            $this.on({

                                mouseenter: function() {

                                    clearInterval(time);

                                },
                                mouseleave: function() {

                                    time = setInterval(showEffect, o.time);

                                }

                            });

                        }



                    }


                };

                //初始化
                obj.init();


                //1->next 0->prev
                function showEffect() {


                    if (o.type === "fadeIn") {

                        arguments.length ? _index-- : _index++;

                        if (_index === -1) {

                            _index = _len - 1;

                        } else if (_index === _len) {

                            _index = 0;

                        }

                        _ul.children("li").eq(_index).addClass('z-select').css("zIndex", 1).siblings().removeClass('z-select').css("zIndex", 0);

                        _ul.children("li").eq(_index).stop(true).animate({

                            "opacity": 1

                        }, {
                            duration: o.duration,

                            complete: function() {

                                _ul.children("li").eq(_index).siblings().css({
                                    "opacity": 0
                                });

                            }

                        });

                        $this.find("." + ele.num_li).eq(_index).addClass(active).siblings().removeClass(active);

                    } else if (o.type === "move") {

                        if (arguments.length) {

                            if (_index === 0) {

                                _index--;

                                _ul.children("li:last").css({

                                    "position": "relative",

                                    "left": -_len * _width

                                });

                                _ul.stop(true).animate({

                                    "marginLeft": -_index * _width

                                }, {
                                    duration: o.duration,

                                    complete: function() {

                                        _ul.children("li:last").attr("style", "width:" + _width + "px");

                                        _ul.css("marginLeft", -_width * (_len - 1));
                                    }

                                });

                                $this.find("." + ele.num_li).eq(_len - 1).addClass(active).siblings().removeClass(active);

                                _index = _len - 1;

                            } else {

                                _index--;

                                _ul.stop(true).animate({

                                    "marginLeft": -_width * _index

                                }, o.duration);

                                $this.find("." + ele.num_li).eq(_index).addClass(active).siblings().removeClass(active);
                            }

                        } else {

                            if (_index === (_len - 1)) {

                                _index++;

                                _ul.children("li:first").css({

                                    "position": "relative",

                                    "left": _index * _width

                                });

                                _ul.stop(true).animate({
                                    "marginLeft": -_width * _index
                                }, {
                                    duration: o.duration,
                                    complete: function() {

                                        _ul.children("li:first").attr("style", "width:" + _width + "px");

                                        _ul.css("marginLeft", 0);
                                    }

                                });

                                $this.find("." + ele.num_li).eq(0).addClass(active).siblings().removeClass(active);

                                _index = 0;

                            } else {

                                _index++;

                                _ul.stop(true).animate({

                                    "marginLeft": -_width * _index

                                }, o.duration);

                                $this.find("." + ele.num_li).eq(_index).addClass(active).siblings().removeClass(active);
                            }

                        }

                    } else if (o.type === "up") {

                        if (_len > 2) {

                            if (arguments.length) {

                                if (_index === 0) {

                                    _index--;

                                    _ul.children("li:last").css({

                                        "position": "relative",

                                        "top": -_len * _height

                                    });

                                    _ul.stop(true).animate({

                                        "marginTop": -_index * _height

                                    }, {
                                        duration: o.duration,

                                        complete: function() {

                                            _ul.children("li:last").attr("style", "width:" + _width + "px");

                                            _ul.css("marginTop", -_height * (_len - 1));
                                        }

                                    });

                                    $this.find("." + ele.num_li).eq(_len - 1).addClass(active).siblings().removeClass(active);

                                    _index = _len - 1;

                                } else {

                                    _index--;

                                    _ul.stop(true).animate({

                                        "marginTop": -_height * _index

                                    }, o.duration);

                                    $this.find("." + ele.num_li).eq(_index).addClass(active).siblings().removeClass(active);
                                }

                            } else {

                                if (_index === (_len - 2)) {

                                    _index++;

                                    _ul.children("li:first").css({

                                        "position": "relative",

                                        "top": _len * _height

                                    });

                                    _ul.children("li").eq(1).css({

                                        "position": "relative",

                                        "top": (_len) * _height

                                    });

                                    _ul.stop(true).animate({
                                        "marginTop": -_height * _index
                                    }, o.duration);

                                    $this.find("." + ele.num_li).eq(0).addClass(active).siblings().removeClass(active);

                                } else if (_index === (_len - 1)) {

                                    _index++;

                                    _ul.stop(true).animate({
                                        "marginTop": -_height * _len
                                    }, {
                                        duration: o.duration,
                                        complete: function() {

                                            _ul.children("li:first").attr("style", "width:" + _width + "px");

                                            _ul.children("li").eq(1).attr("style", "width:" + _width + "px");

                                            _ul.css("marginTop", 0);
                                        }

                                    });

                                    $this.find("." + ele.num_li).eq(0).addClass(active).siblings().removeClass(active);

                                    _index = 0;

                                } else {

                                    _index++;

                                    _ul.stop(true).animate({

                                        "marginTop": -_height * _index

                                    }, o.duration);

                                    $this.find("." + ele.num_li).eq(_index).addClass(active).siblings().removeClass(active);
                                }

                            }

                        }


                    }


                }

                //function - foreach slideCtrl
                function showCtrl() {

                    var c_name = null;

                    if (_len == 1) {

                        return;

                    } else {

                        for (var i = 0, j = _len; i < j; i++) {

                            c_name = ele.num_li + (i === 0 ? " " + active + "" : "");

                            str += "<li class='" + c_name + "'>" + (o.has_num ? (i + 1) : "") + "</li>";

                        }

                        return str;
                    }
                }

                //is or not flip
                function showFlip() {

                    $this.append('<div class="s-pg ' + ele.page_box + '"><a href="javascript:;" class="s-prev ' + ele.prev_btn + '"><</a><a href="javascript:;" class="s-next ' + ele.next_btn + '">></a></div>');

                    if (o.hide_page_btn) {

                        $("." + ele.page_box).hide();

                    }

                    //é?ò?ò3
                    $this.on("click", "." + ele.prev_btn, throttle(function() {

                        clearInterval(time);

                        showEffect("prev");

                    }, obj.throttle_t));

                    //é?ò?ò3
                    $this.on("click", "." + ele.next_btn, throttle(function() {

                        clearInterval(time);

                        showEffect();

                    }, obj.throttle_t));

                }

                //event 节流
                function throttle(fn, interval) {
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
                }


            });
        };

        //this defaults
        $.fn.fn_slide.defaults = {

            //滚动间隔时间
            time: 3000,

            //过渡间隔
            duration: 300,

            //方向
            direction: 'left',

            //是否有数字
            has_num: true,

            //动画的效果
            type: "fadeIn", //move

            //是否有分页
            flip: true,

            //是否自动播放
            auto: false,

            //是否有数字控制
            has_ctrl: true,

            //是否需要隐藏左右点击按钮
            hide_page_btn: false

        };
    })(jQuery);


    food_obj.init();

})(jQuery);
