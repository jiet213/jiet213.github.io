/*************************************************
 *  Function  muyin
 *  Update 2015/07/22

 ************************************************/
;
(function(window, document, body, $, undefined) {

    var opt = {

        J_animateSlider: ".J_animateSlider",
        J_pictureArea: ".J_pictureArea",
        J_controlArea: ".J_controlArea",
        J_rightArea: ".J_rightArea",
        J_leftArea: ".J_leftArea",
        J_btnArea: ".J_btnArea",

        arrowstatus: "data-arrow", //箭头状态0 1 2 3；  0为不显示 1,3滑动动画显示（位置不一样） 2初始显示
        animatestatus: "data-animate",//point是否动画状态0 1； 0为没有动画 1有动画
        autostatus: "data-auto",//是否自动轮播状态0 1； 0手动控制 1手动自动均可控制
        controlposition: "data-position",//point左中右状态0 1 2 3; 0为不显示 1为居左 2为居中 3为居右
        sliderstatus: "data-slider",

        ul_child: " ul",
        li_child: " li",

        bgcolor: "#bgcolor",
        bgcolorvalue: "data-bgcolor"

    };

    var animateSlider = {

        init: function() {
            this.func();
        },

        func: function() {

            var J_animateSlider = opt.J_animateSlider,
                J_pictureArea = opt.J_pictureArea,
                J_controlArea = opt.J_controlArea,
                J_rightArea = opt.J_rightArea,
                J_leftArea = opt.J_leftArea,
                J_btnArea = opt.J_btnArea,

                arrowstatus = opt.arrowstatus,
                animatestatus = opt.animatestatus,
                autostatus = opt.autostatus,
                controlposition = opt.controlposition,
                sliderstatus = opt.sliderstatus,

                ul_child = opt.ul_child,
                li_child = opt.li_child,

                bgcolor = opt.bgcolor,
                bgcolorvalue = opt.bgcolorvalue;

            $(J_animateSlider).each(function() {

                var self = $(this),
                    self_picture = self.find(J_pictureArea),
                    self_control = self.find(J_controlArea),

                    self_arrowstatus = parseInt($.trim(self.attr(arrowstatus))),
                    self_animatestatus = parseInt($.trim(self.attr(animatestatus))),
                    self_autostatus = parseInt($.trim(self.attr(autostatus))),
                    self_controlposition = parseInt($.trim(self.attr(controlposition))),
                    self_sliderstatus = parseInt($.trim(self.attr(sliderstatus))),

                    self_picture_width = self_picture.outerWidth(true),
                    self_ul = self_picture.find(ul_child),
                    self_li = self_picture.find(li_child),
                    self_lilen = self_li.length,
                    self_lifirst = self_li.first(),
                    self_lilast = self_li.last();

                if (self_control.length) {
                    var self_control_ul = self_control.find(ul_child),
                        self_control_li = self_control.find(li_child),
                        self_control_li_width = self_control_li.outerWidth(true);
                }

                if (self_autostatus == 0 && self_animatestatus != 0) {

                    self.attr(animatestatus, 0);

                    self_animatestatus = parseInt($.trim(self.attr(animatestatus)));

                }

                if (!!self_arrowstatus) {
                    var self_right = self.find(J_rightArea),
                        self_left = self.find(J_leftArea),
                        self_btn = self.find(J_btnArea),
                        self_btn_width = self_btn.outerWidth(true);
                }

                if (self_li.attr(bgcolorvalue)) {

                    $(bgcolor).css("background",self_li.eq(0).attr(bgcolorvalue));

                }

                //判断是否为IE7浏览器 是隐藏point
                if (navigator.appName == "Microsoft Internet Explorer" && navigator.appVersion.indexOf("MSIE 7.0") != -1 || self_lilen<=1) {

                    self_control.hide();

                }

                var timer = null, setTimer = null, flag = false;

                if (!self_sliderstatus) {

                    self_lifirst.before(self_lilast.clone());

                    self_ul.css({

                        'width': self_picture_width * (self_lilen + 1) + 'px',

                        'left': -self_picture_width + 'px'

                    });

                }

                self_li.eq(0).find("img[data-src]").each(function(key, item) {

                    $(item).attr("src", $(item).attr("data-src"));

                });

                if (self_control.length) {

                    var control_total_width = self_control_li_width * self_lilen,
                        control_position = 5;

                }

                switch (self_controlposition) {

                    case 0:

                        self_control.hide();

                        break;

                    case 1:

                        control_position = 5;

                        break;

                    case 3:

                        control_position = self_picture_width - control_total_width - 5;

                        break;

                    default:

                        control_position = (self_picture_width - control_total_width) / 2;

                }

                if (self_control.length) {

                    self_control_ul.css({

                        'width': control_total_width + "px",

                        'paddingLeft': control_position + "px"

                    }).show();

                }

                if (self_arrowstatus == 1|| self_arrowstatus == 3) {

                    self_btn.eq(1).css({

                        'left': -self_btn_width + 'px',

                        'opacity': 0

                    }).prev().css({

                        'right': -self_btn_width + 'px',

                        'opacity': 0

                    });

                } else if (self_arrowstatus == 2) {

                    self_btn.css({

                        'opacity': 0.25

                    }).show();

                }

                //鼠标滑到轮播区域
                self.on({

                    mouseenter: function() {

                        var that = $(this),
                            thatChild = that.children(J_btnArea);

                        if (self_lilen > 1) {

                            if (!!self_arrowstatus) {

                                thatChild.show();

                            }

                        } else {

                            thatChild.hide();
                            fnBtnStop();

                        }

                        if (self_arrowstatus == 1) {

                            thatChild.eq(1).stop(true, true).animate({

                                'left': 10 + 'px',

                                'opacity': 0.25

                            }).prev().stop(true, true).animate({

                                'right': 10 + 'px',

                                'opacity': 0.25

                            });

                        } else if (self_arrowstatus == 2) {

                            thatChild.css({

                                'opacity': 0.25

                            });

                        }else if (self_arrowstatus == 3) {

                            thatChild.eq(1).stop(true, true).animate({

                                'left': 0 + 'px',

                                'opacity': 0.25

                            }).prev().stop(true, true).animate({

                                'right': 0 + 'px',

                                'opacity': 0.25

                            });

                        }

                        clearInterval(timer);

                        fnStop();

                        flag = true;

                    },

                    mouseleave: function() {

                        var that = $(this),
                            thatChild = that.children(J_btnArea);

                        if (self_arrowstatus == 1||self_arrowstatus == 3) {

                            thatChild.eq(1).stop(true, true).animate({

                                left: -self_btn_width + 'px',

                                opacity: 0

                            }).prev().stop(true, true).animate({

                                right: -self_btn_width + 'px',

                                opacity: 0

                            });

                        } else if (self_arrowstatus == 2) {

                            thatChild.css({

                                'opacity': 0.25

                            });

                        }

                        if (!!self_autostatus) {

                            clearInterval(timer);

                            timer = setInterval(function() {

                                fnImgCont(fnIndex(), true);

                            }, 3000);

                        }

                        fnStopGo();

                        flag = false;

                    }

                });

                //鼠标划过单击左右按钮效果
                if (!!self_arrowstatus) {

                    self.on({

                        mouseenter: function() {

                            $(this).css('opacity', '0.5');

                        },

                        mouseleave: function() {

                            $(this).css('opacity', '0.25');

                        },

                        click: function() {

                            var fn_index = fnIndex();

                            if (self_ul.is(":animated")) {

                                return;

                            }

                            if ($(this).hasClass("J_leftArea")) {

                                if (self_li.attr(bgcolorvalue)) {

                                    if (fn_index > 0) {

                                        $(bgcolor).css("background",self_li.eq(fn_index-1).attr(bgcolorvalue));

                                    } else {

                                        if (fn_index == 0) {

                                            $(bgcolor).css("background",self_li.eq(-1).attr(bgcolorvalue));

                                        }

                                    }

                                }

                                if (!self_sliderstatus) {

                                    self_ul.animate({

                                        left: "+=" + self_picture_width + "px"

                                    }, 360, function() {

                                        if (fn_index > 0) {

                                            if (self_control.length) {

                                                self_control_li.eq(fn_index - 1).addClass("cur").siblings().removeClass("cur");

                                            }

                                        } else {

                                            if (fn_index == 0) {

                                                self_ul.css("left", "-" + self_picture_width * self_lilen + "px");

                                                if (self_control.length) {

                                                    self_control_li.eq(-1).addClass("cur").siblings().removeClass("cur");

                                                }

                                            }

                                        }

                                        fnBtnStop();

                                    })

                                } else {

                                    if (fn_index > 0) {

                                        self_li.eq(fn_index - 1).stop(true,true).fadeIn(360).siblings().hide();

                                        if (self_control.length) {

                                            self_control_li.eq(fn_index - 1).addClass("cur").siblings().removeClass("cur");

                                        }

                                    } else {

                                        if (fn_index == 0) {

                                            self_li.eq(self_lilen - 1).stop(true,true).fadeIn(360).siblings().hide();

                                            if (self_control.length) {

                                                self_control_li.eq(self_lilen - 1).addClass("cur").siblings().removeClass("cur");

                                            }

                                        }

                                    }

                                    fnBtnStop();

                                }

                            } else {

                                fnImgCont(fn_index);

                            }

                            return false;

                        }

                    }, J_btnArea);

                }

                //自动轮播
                if (!!self_autostatus) {

                    timer = setInterval(function() {

                        fnImgCont(fnIndex(), true);

                    }, 3000);

                }

                if (self_lilen > 1) {

                    fnAutoGo();

                } else {

                    fnStop();
                    fnBtnStop();

                }

                //鼠标滑过焦点
                self.on({

                    mouseenter: function() {

                        var ts = this;

                        if (self_control.length) {

                            var fn_index = self_control_li.index(ts);

                        }

                        setTimer = setTimeout(function() {

                            $(ts).addClass("cur").siblings().removeClass("cur");

                            if (!self_sliderstatus) {

                                self_ul.stop(true,true).animate({

                                    left: "-" + (fn_index + 1) * self_picture_width + "px"

                                }, 360);

                            } else {

                                self_li.eq(fn_index).stop(true,true).fadeIn(360).siblings().hide();

                            }

                            fnBtnStop();

                            if (self_li.attr(bgcolorvalue)) {

                                $(bgcolor).css("background",self_li.eq(fn_index).attr(bgcolorvalue));

                            }

                        }, 100);

                    },

                    mouseleave: function() {

                        if (setTimer) {

                            clearTimeout(setTimer);

                        }

                    }

                }, J_controlArea + li_child);

                //自动轮播时调用
                function fnAutoGo() {

                    if (self_control.length) {

                        var self_control_ul_li_cur = self_control_ul.find("li.cur");

                        self_control_ul_li_cur.siblings().find("span").css("width", 0);

                        if (!!self_animatestatus) {

                            self_control_ul_li_cur.find("span").width(0).animate({

                                width: "100%"

                            }, 2640, function() {

                                $(this).width(0);

                            });

                        } else {

                            self_control_ul_li_cur.find("span").width("100%");

                        }

                    }

                }

                //单击左右按钮时和滑到焦点时调用
                function fnBtnStop() {

                    if (self_control.length) {

                        var self_control_ul_li_cur = self_control_ul.find("li.cur");

                        self_control_ul_li_cur.siblings().find("span").stop().css("width", 0);

                        self_control_ul_li_cur.find("span").stop().width("100%");

                    }

                }

                //鼠标滑到轮播区域停止
                function fnStop() {

                    if (self_control.length) {

                        var self_control_ul_li_cur = self_control_ul.find("li.cur");

                        self_control_ul_li_cur.siblings().find("span").stop().css("width", 0);

                        self_control_ul_li_cur.find("span").stop();

                    }

                }

                //鼠标滑到区域停止滑出继续
                function fnStopGo() {

                    if (self_control.length) {

                        var self_control_ul_li_cur = self_control_ul.find("li.cur");

                        var self_control_ul_li_cur_width = self_control_ul_li_cur.find("span").width();

                        self_control_ul_li_cur.siblings().find("span").css("width", 0);

                        if (!!self_animatestatus) {

                            if (self_control_ul_li_cur_width != self_control_ul_li_cur.width()) {

                                self_control_ul_li_cur.find("span").animate({

                                    width: "100%"

                                }, 2640, function() {

                                    $(this).width(0);

                                });

                            }

                        } else {

                            self_control_ul_li_cur.find("span").width("100%");

                        }

                    }

                }

                //索引函数
                function fnIndex() {

                    if (self_control.length) {

                        return self_control_ul.find("li.cur").index();

                    }

                }

                //轮播内容的切换判断
                function fnImgCont(curIndex, curFlag) {

                    if (curIndex == self_lilen - 1) {

                        if (!self_sliderstatus) {

                            self_lifirst.addClass("cur").css("left", self_picture_width * self_lilen  + "px");

                        } else {

                            self_li.eq(0).addClass("cur").stop(true,true).fadeIn(360).siblings().hide();

                        }

                    }

                    if (self_lilen > 1) {

                        if (self_li.attr(bgcolorvalue)) {

                            $(bgcolor).css("background",self_li.eq(curIndex + 1).attr(bgcolorvalue));

                        }

                        if (curIndex == self_lilen - 1) {

                            if (!self_sliderstatus) {

                                self_ul.css("left", 0);

                            } else {

                                self_li.eq(0).addClass("cur").stop(true,true).fadeIn(360).siblings().hide();

                            }

                            if (self_control.length) {

                                self_control_li.eq(0).addClass("cur").siblings().removeClass("cur");

                            }

                            if (self_li.attr(bgcolorvalue)) {

                                $(bgcolor).css("background",self_li.eq(0).attr(bgcolorvalue));

                            }

                        }

                        if (!self_sliderstatus) {

                            self_ul.stop(true, true).animate({

                                left: "-=" + self_picture_width + "px"

                            }, 360, function() {

                                if (curIndex < self_lilen - 1) {

                                    if (self_control.length) {

                                        self_control_li.eq(curIndex + 1).addClass("cur").siblings().removeClass("cur");

                                    }

                                } else {

                                    self_lifirst.removeClass("cur").css("left", -self_picture_width + "px");

                                }

                                if (curFlag && !flag) {

                                    fnAutoGo();

                                } else {

                                    fnBtnStop();

                                }

                            })

                        } else {

                            if (curIndex < self_lilen - 1) {

                                self_li.eq(curIndex + 1).stop(true,true).fadeIn(360).siblings().hide();

                                if (self_control.length) {

                                    self_control_li.eq(curIndex + 1).addClass("cur").siblings().removeClass("cur");

                                }

                            } else {

                                self_li.eq(0).removeClass("cur").stop(true,true).fadeIn(360).siblings().hide();

                            }

                            if (curFlag && !flag) {

                                fnAutoGo();

                            } else {

                                fnBtnStop();

                            }

                        }

                    }

                }

            });

        }

    };

    window.animateSlider = animateSlider;

    window.animateSlider.init();

})(window, window.document, window.document.body, jQuery);

//dom加载完遍历赋值轮播图片src
$(function() {

    $(".J_pictureArea").each(function() {

        var self = $(this);

        self.find("li img[data-src]").each(function(key,item) {

            $(item).attr("src", $(item).attr("data-src")).removeAttr("data-src");

        });

    });

});