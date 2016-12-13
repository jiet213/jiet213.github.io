define('widget/slide', ['lib/jquery/1.11.1/jquery-1.11.1'], function(undefined) {

    (function($) {
        // 2??tμ??¨ò?
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

                    page_box:"J_page_box"

                };

                //get img contains
                var _ul = $this.children('.' + ele.main);

                //get li's length
                var _len = _ul.children("li").length;

                //create slide Ctrl
                var str = "";

                //init _index
                var _index = 0;

                var _height = _ul.children("li").height();

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

                        // 当前图片为1 圆点隐藏
                        if(_len <= 1) {
                            $this.find("." + ele.num).hide();
                        }

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

                                time = setTimeout(function(){

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

                                },obj.throttle_t);


                            }).on('mouseleave', '.' + ele.num_li, function() {

                                clearTimeout(time);

                            });


                        } else if (obj.is_move) {

                            //bind event on <li>
                            $this.on('mouseenter', '.' + ele.num_li, function() {

                                var $this = $(this);

                                clearTimeout(time);

                                time = setTimeout(function(){

                                    _index = $this.index();

                                    _ul.stop(true).animate({

                                        "marginLeft": -(_width * _index)

                                    }, o.duration);

                                    $this.addClass(active).siblings().removeClass(active);

                                },obj.throttle_t);


                            }).on('mouseleave', '.' + ele.num_li, function() {

                                clearTimeout(time);

                            });


                        } else if (obj.is_up) {//晒单向上滚动

                            _ul.width(_width);

                            _ul.height(_height * _len);

                        }

                        //如果上下页切换按钮是隐藏的话

                        o.hide_page_btn && $this.on({

                            mouseenter:function(){

                                if($(this).find("."+ele.page_box).is(":hidden") && $(this).find("."+ele.main+" >li").length >1){

                                    $(this).find("."+ele.page_box).show();

                                }

                            },

                            mouseleave:function(){

                                $(this).find("."+ele.page_box).hide();

                            }

                        });

                        //定时器
                        obj.timeFuc();

                    },

                    timeFuc: function() {

                        //auto 为true 表示可自动

                        if(o.auto && _len >1){

                            //setInterval
                            time = setInterval(showEffect, o.time);

                            // clearInterval
                            $this.on({

                                mouseenter: function() {

                                    clearInterval(time);

                                },
                                mouseleave: function() {

                                    clearInterval(time);

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

                    for (var i = 0, j = _len; i < j; i++) {

                        c_name = ele.num_li + (i === 0 ? " " + active + "" : "");

                        str += "<li class='" + c_name + "'>" + (o.has_num ? (i + 1) : "") + "</li>";

                    }

                    return str;
                }

                //is or not flip
                function showFlip() {

                    $this.append('<div class="s-pg '+ele.page_box+'"><a href="javascript:;" class="s-prev ' + ele.prev_btn + '"><</a><a href="javascript:;" class="s-next ' + ele.next_btn + '">></a></div>');

                    if(o.hide_page_btn){

                        $("."+ele.page_box).hide();

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
            type: "fadeIn",  //move

            //是否有分页
            flip: true,

            //是否自动播放
            auto:false,

            //是否有数字控制
            has_ctrl:true,

            //是否需要隐藏左右点击按钮
            hide_page_btn:false

        };

    })(jQuery);

});
