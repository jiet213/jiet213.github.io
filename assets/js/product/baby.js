/*************************************************
 *  Function  mumbaby
 *  Designed and built by frontEnd  @jie.tang
 *  Date 2015/07/15
 *  Update 2015/12/28
 ************************************************/
;
(function(window) {

    /**************策略对象******************/
    var strategies = {
        isNonEmpty: function(value, errorMsg) {
            if (value === '') {
                return errorMsg;
            }
        },
        minLength: function(value, length, errorMsg) {
            if (value.length < length) {
                return errorMsg;
            }
        }
    };

    /**************Validator 类******************/
    var Validator = function() {
        this.cache = [];
    };

    Validator.prototype.add = function(dom, rules) {

        var self = this;

        for (var i = 0, rule; rule = rules[i++];) {

            (function(rule) {

                var strategyAry = rule.strategy.split(':');

                var errorMsg = rule.errorMsg;

                self.cache.push(function() {

                    var strategy = strategyAry.shift();

                    strategyAry.unshift(dom);

                    strategyAry.push(errorMsg);

                    return strategies[strategy].apply(dom, strategyAry);
                });

            })(rule);

        };
    };

    Validator.prototype.start = function() {
        for (var i = 0, validatorFuc; validatorFuc = this.cache[i++];) {
            var errorMsg = validatorFuc();
            if (errorMsg) {
                return errorMsg;
            }
        }
    };


    var m_b_obj = {


        init: function() {

            //绑定所有事件
            this.bindEvent();

            //锚点初始化
            this.ctrlFloor();

            this.navTabList();

            this.babyGrow();

            this.calDate();

            this.brandCateList();

            //this.mumBabyCenter();

            this.babyGift();

            //click触发tab事件
            this.tabFunc({

                main: ".J-tab-c",

                eventtype: "click"
            });

            this.tabFunc();

        },

        //其他事件
        bindEvent: function() {

            var self = this,

                time = null;

            $(window).on("scroll resize", function() {

                time && clearTimeout(time);

                time = setTimeout(function() {

                    self.ctrlFloor();

                }, 400);

            });

            //锚点点击跳转到相应楼层
            $(document).on('click', '.J-mum-lift li', self.ctrlLift);

            //返回顶部
            $(document).on("click", ".J-go-top", function() {

                $('html,body').animate({

                    scrollTop: 0

                }, 500);

            });

            //点击锚点上注册有礼跳转到注册板块
            $(document).on("click", ".J-go-reg", function() {

                $('html,body').animate({

                    scrollTop: $(".J-info-cont").offset().top

                }, 500);

            });

            //点击会员中心左侧注册有礼关闭按钮
            $(document).on('click', '.J-reg-close', function() {

                $(this).parent().remove();

            });

            //精选推荐自定义鼠标hover背景色
            function axisColor() {

                var $axisTabItem = $(".J-axis-tab").children("ul"),

                    hg_color = $axisTabItem.attr("data-hover-bg");

                if (hg_color) {

                    $axisTabItem.children("li.z-select").css("background-color", hg_color);

                    $axisTabItem.on('mouseover', 'li', function() {

                        $(this).css("background-color", hg_color).siblings().removeAttr("style");

                    });

                }

            }

            axisColor();

            //楼层自定义鼠标hover背景色
            function floorColor() {

                var $floormenu = $(".J-floor-menu");

                $floormenu.each(function() {

                    var $self = $(this),

                        hg_color = $self.attr("data-hover-bg");

                    if (hg_color) {

                        $self.children("li.z-select").children("a").css("background-color", hg_color);

                        $self.on('mouseover', 'li', function() {

                            $(this).children("a").css("background-color", hg_color).parent().siblings().children("a").removeAttr("style");

                        });

                    }


                });

            }

            floorColor();

        },

        /*菜单导航栏*/
        navTabList: function() {

            $(".J-nav-tab").on({

                mouseenter: function() {

                    var self = $(this),

                        index = self.index();

                    self.addClass("z-hd").siblings().removeClass("z-hd");

                    $(".J-nav-list").removeClass('hide')

                    .children().eq(index).removeClass('hide').siblings().addClass('hide');

                    $(".J-nav-list").on({

                        mouseenter: function() {

                            $(this).removeClass('hide');

                        },

                        mouseleave: function() {

                            $(this).parent().addClass('hide');

                            self.removeClass("z-hd");

                        }

                    }, 'div');

                }

            }, 'li');

            $('.J-nav-tab').parent().on('mouseleave', function() {

                $(".J-nav-tab li").removeClass("z-hd");

                $(".J-nav-list").addClass('hide');

            });

        },

        /*宝宝成长之路*/
        babyGrow: function() {

            var $J_gr_pic = $(".J-gr-pic"),

                $J_tab_content = $(".J-gr-pro");

            $J_gr_pic.children("a.u-gr-im:eq(0)").addClass("z-select");

            $J_gr_pic.on('click', 'a', function() {

                var $self = $(this),

                    index = $self.index();

                $self.addClass('z-select').siblings('a.u-gr-im').removeClass('z-select');

                $J_tab_content.children(".J-panel").eq(index).removeClass("hide").siblings('.J-panel').addClass('hide');
            });
            /*J_pic_a.on({
                mouseover: function() {
                    var $this = $(this);
                    if ($this.parent().css("margin-top") == "-39px") {
                        $this.data("status", "1");
                    } else {
                        $this.parent().stop(true, true).animate({
                            "margin-top": "-39px"
                        }, 300);

                        $this.data("status", "0");
                    }
                },
                mouseout: function() {
                    var $this = $(this);
                    if ($this.data("status") == "0") {

                        $this.parent().stop(true, true).animate({
                            "margin-top": "0"
                        }, 300);

                    }
                },
                click: function() {
                    var $this = $(this),
                        index = $this.parent().index();
                    $this.data("status", "1");
                    $this.parent().siblings().children("a").data("status", "0");

                    $this.parent().stop(true, true).animate({
                        "margin-top": "-39px"
                    }, 300).siblings().stop(true, true).animate({
                        "margin-top": "0"
                    }, 300);

                    J_gr_tt.children("li").eq(index).addClass("z-select").siblings().removeClass("z-select");

                    J_tab_content.children(".J-panel").eq(index).removeClass("hide").siblings('.J-panel').addClass('hide');

                }
            });*/

            /*J_gr_tt.on('click', "li", function() {

                var self = $(this),

                    index = self.index();

                self.addClass('z-select').siblings('li').removeClass('z-select');

                J_gr_pic.children('li').eq(index).stop(true, true).animate({
                    "margin-top": "-39px"
                }, 300).siblings('li').stop(true, true).animate({
                    "margin-top": "0"
                }, 300);

                J_gr_pic.children('li').eq(index).children('a').data("status", "1");
                J_gr_pic.children('li').eq(index).siblings().children("a").data("status", "0");
                J_tab_content.children(".J-panel").eq(index).removeClass("hide").siblings('.J-panel').addClass('hide');

            });*/

        },

        /*日期选择*/
        calDate: function() {

            $(document).on('click', '.J-cal', function(event) {
                WdatePicker({
                    readOnly: true
                });
            });

            /*宝宝生日选择，只能选择今天之前的
            $(document).on('click', '.J-hbb .J-cal', function(event) {
                WdatePicker({
                    readOnly: true,
                    maxDate: '%y-%M-%d'
                });
            });*/

            /*待产宝宝日期选择，只能选择今天之后
            $(document).on('click', '.J-dbb .J-cal', function(event) {
                WdatePicker({
                    readOnly: true,
                    minDate: '%y-%M-%d'
                });
            });*/
        },

        /*品牌墙效果*/
        brandCateList: function() {

            var b_cate = $(".J-b-cate"),
                b_list = $(".J-b-list"),
                b_a_Li = $(".J-b-cate li"),
                b_c_Li = $(".J-b-list li"),
                animateLine = $(".J-b-cate .animate_line"),
                brandFold = $("a.brand_fold"),
                brandUnfold = $("a.brand_unfold"),
                brand_cont_child = $(".J-b-list").children("div").eq(0),
                liAFirst = b_a_Li.eq(0).children("a").outerWidth(),
                labelW = b_a_Li.parent().prev().outerWidth();

            /*品牌墙鼠标划过显示阴影*/
            b_list.on({

                mouseenter: function() {

                    $(this).children('.brandSale').show();
                },

                mouseleave: function() {

                    $(this).children('.brandSale').hide();
                }
            }, 'li');

            /*cate列表最后一个无右边框*/
            b_cate.find('li:last').addClass("z-no-br");

            animateLine.css({
                "width": liAFirst + "px",
                "left": labelW + "px"
            });

            b_li_auto(brand_cont_child);

            b_cate.on('mouseover', 'li', function() {

                var self = $(this),
                    index = self.index(),
                    this_A_W = self.children("a").outerWidth(),
                    this_B_W = 0;

                if (index != 0) {

                    for (var i = 0; i < index; i++) {
                        this_B_W += b_a_Li.eq(i).children('a').outerWidth();
                    }
                };

                animateLine.css({

                    "width": this_A_W + "px"

                }).stop().animate({

                    "left": labelW + this_B_W + "px"

                }, 200);

                b_list.children('div').eq(index).show().siblings("div").hide();

                b_li_auto(b_list.children('div').eq(index));

            });

            function b_li_auto(obj) {

                var b_ul = obj.children('ul'),

                    b_li = obj.find('li'),

                    u_hgt = Math.ceil(b_li.length / 8) * b_li.eq(0).outerHeight(true);

                if (b_li.length > 16) {

                    b_ul.css('height', '164px');

                    brandFold.show();

                    brandUnfold.hide();

                } else {

                    b_ul.css('height', u_hgt);

                    brandFold.hide();

                    brandUnfold.hide();

                };

                brandFold.on('click', function() {

                    b_ul.stop().animate({
                        "height": u_hgt,
                        "overflow": "visible"
                    }, 200);

                    $(this).hide();

                    brandUnfold.show();
                });

                brandUnfold.on('click', function() {

                    b_ul.stop().animate({
                        "height": '164px',
                        "overflow": "hidden"
                    }, 200);

                    $(this).hide();

                    brandFold.show();
                });
            }

        },

        /*母婴会员中心表单*/
        mumBabyCenter: function() {

            var b_radio = $(".J-baby-rd"),
                b_info_wrt = $(".J-info-wrt"),
                b_info_read = $(".J-info-read"),
                b_item = $(".J-baby-item"),
                h_bb = $(".J-hbb"),
                d_bb = $(".J-dbb");

            b_radio.on('click', 'label', function() {

                var self = $(this),
                    index = self.index(),
                    is_show = 0;

                b_info_wrt.children('div').eq(index).removeClass('hide').siblings().addClass('hide');

            });

            b_item_li_w();

            /*宝宝列表自适应宽度*/
            function b_item_li_w() {

                var b_item_li = b_item.find("li"),

                    b_li_len = b_item_li.length;

                b_item_li.css("width", Math.round(100 / b_li_len) + "%");
            }

            /*表单验证函数*/
            function validataFuc(obj, arr) {

                var b_name, b_birth;

                var validator = new Validator();

                b_name = obj.children('.J-write').find("input[name='b_name']").val(),
                    b_birth = obj.children('.J-write').find("input[name='b_birth']").val();

                validator.add(b_name, [{
                    strategy: 'isNonEmpty',
                    errorMsg: arr[0]
                }]);

                validator.add(b_birth, [{
                    strategy: 'isNonEmpty',
                    errorMsg: arr[1]
                }]);

                var errorMsg = validator.start();

                var Msg = {
                    'errorMsg': errorMsg,
                    'b_name': b_name,
                    'b_birth': b_birth
                };

                return Msg;
            };

            /*母婴会员中心提交信息事件*/
            function loginFun(obj, arr, is_add, is_hb) {

                var error_name = obj.find(".J-error-name").children(),
                    error_date = obj.find(".J-error-date").children(),
                    b_write = obj.children(".J-write");

                var Msg = validataFuc(obj, arr),
                    errorMsg = Msg.errorMsg;

                /*验证不通过*/
                if (errorMsg) {

                    var errorMsgArr = errorMsg.split(':');

                    switch (errorMsgArr[1]) {

                        case '1':
                            error_date.addClass("hide");
                            error_name.html(errorMsgArr[0]).removeClass('hide');
                            break;
                        case '2':
                            error_name.addClass("hide");
                            error_date.html(errorMsgArr[0]).removeClass('hide');
                            break;
                    }

                    return false;

                } else { //验证通过

                    error_date.addClass("hide");

                    error_name.addClass("hide");

                    var sexval = b_write.find("input[type='radio']:checked").val(),
                        sex = "";

                    switch (sexval) {
                        case '1':
                            sex = "王子";
                            break;
                        case '2':
                            sex = "公主";
                            break;
                        case '3':
                            sex = "未知";
                            break;
                    };

                    if (!is_add) { //不是新增宝宝

                        var b_read = "";

                        if (b_item.find("li").length == 0) { //首次新建宝宝档案

                            var a_li = "",

                                read_dom = "";

                            b_read = (is_hb == 1 ? b_info_read.children("div.u-hbb") : b_info_read.children("div.u-dbb"));

                            a_li = "<li class='z-select'><a href='javascript:void(0)'>" + Msg.b_name + "</a></li>";

                            b_read.addClass('J-read').removeClass('hide');

                            b_item.children("ul").append(a_li);

                        } else { //对已有宝宝档案修改提交

                            var index = b_item.find('li[class="z-select"]').index();

                            b_read = b_info_read.children(".J-read").eq(index);

                            b_read.removeClass('hide');

                            b_item.find('li').eq(index).children('a').html(Msg.b_name);

                        };

                        b_item_li_w();

                        b_item.removeClass("hide");

                        b_radio.addClass("hide");

                        b_info_read.removeClass("hide");

                        b_info_wrt.addClass("hide");

                        b_read.find("p.name").html(Msg.b_name);

                        b_read.find("p.birth").html(Msg.b_birth);

                        b_read.find("p.sex").html(sex);

                    };

                    //alert(Msg.b_name + " " + Msg.b_birth + " " + sex);
                    //插入数据库操作。。。。
                    return true;

                };

            };

            /*修改信息事件*/
            function modifyFun(obj, is_hb) {

                var index = b_item.find('li[class="z-select"]').index(),

                    b_read = b_info_read.children(".J-read").eq(index),

                    b_write = $(obj).children(".J-write"),

                    b_sexval = "",

                    sex_radio = b_write.find("input[type='radio']"),

                    b_rdo = b_radio.find("input[type='radio']"),

                    b_name = b_read.find("p.name").html(),

                    b_birth = b_read.find("p.birth").html(),

                    b_sex = b_read.find("p.sex").html();

                switch (b_sex) {
                    case '王子':
                        b_sexval = "1";
                        break;
                    case '公主':
                        b_sexval = "2";
                        break;
                    case '未知':
                        b_sexval = "3";
                        break;
                };

                /*性别自动绑定*/
                $(sex_radio).each(function() {

                    var self = $(this);

                    if (self.val() == b_sexval) {

                        self.attr('checked', true);

                    };
                });

                /*宝宝切换按钮自动绑定*/
                $(b_rdo).each(function() {

                    var self = $(this);

                    if (self.val() == is_hb) {

                        self.attr('checked', true);

                        self.click();

                    }

                });

                b_radio.off('click', 'label');

                b_write.find("input[name='b_name']").val(b_name);

                b_write.find("input[name='b_birth']").val(b_birth);

                b_item.addClass("hide");

                b_info_wrt.removeClass("hide");

                b_info_wrt.children(obj).removeClass('hide').siblings().addClass('hide');

                b_info_read.addClass("hide");

                b_radio.removeClass("hide");

            };


            /*绑定登录事件*/
            $("body").on('click', '.J-h-sbt', function() {

                loginFun(h_bb, ["宝宝名字还没填哦:1", "宝宝生日还没填哦:2"], 0, 1);
            });

            $("body").on('click', '.J-d-sbt', function() {

                loginFun(d_bb, ["妈妈名字还没填哦:1", "宝宝预产期还没填哦:2"], 0, 0);
            });

            /*绑定修改信息事件*/
            $("body").on('click', '.J-h-mody', function() {
                modifyFun(".u-hbb", "1");
            });
            $("body").on('click', '.J-d-mody', function() {

                modifyFun(".u-dbb", "2");
            });

            /*新增宝宝档案*/
            $("body").on('click', ".J-baby-add", function() {

                var add_baby = '<div id="u-add-baby"><div class="u-a-item u-a-radio"><label class="u-radio u-radio-before"><input type="radio" name="baby-add" value="1" checked="">已有宝宝</label><label class="u-radio"><input type="radio" name="baby-add" value="2">待产宝宝</label></div><div class="J-write"><div class="u-a-item"><p class="title">宝宝小名：</p><input class="ipt" type="text" name="b_name" maxlength="6" placeholder="填写宝宝姓名"></div><div class="error-msg J-error-name"><span class="hide"></span></div><div class="u-a-item"><p class="title">生日：</p><input class="ipt u-b-birth J-ab-cal" type="text" name="b_birth" maxlength="6" placeholder="填写宝宝生日"></div><div class="error-msg J-error-date"><span class="hide"></span></div><div class="u-a-item u-a-sex"><p class="title">性别：</p><label class="u-radio u-radio-before"><input type="radio" name="sex-add" value="1" checked="">王子</label><label class="u-radio"><input type="radio" name="sex-add" value="2">公主</label></div></div></div>';

                m_b_obj.dialog({
                    title: '新增宝宝档案',
                    content: add_baby,
                    button: [{
                        value: '取消',
                        callback: function() {},
                        autofocus: false
                    }, {
                        value: '提交',
                        callback: function() {

                            var is_ok = loginFun($('#u-add-baby'), ["请填写宝宝姓名！:1", "请填写宝宝生日！:2"], 1);

                            if (is_ok) {
                                alert("成功了！");
                                //继续操作。。。
                            } else {
                                return false;
                            }
                        },
                        autofocus: true
                    }]
                }, function() {
                    /*新增宝宝日期选择*/
                    $(".J-ab-cal").on('click', function() {
                        WdatePicker({
                            readOnly: true
                        });
                    });


                });
            });

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
                J_select = option.select;

            $(J_tab).each(function() {

                var self = $(this),

                    self_menu = self.find(J_menu),

                    self_content = self.find(J_content);

                self_menu.on(J_event, 'li', function() {

                    var that = $(this),

                        index = that.index();

                    that.addClass(J_select).siblings().removeClass(J_select);

                    self_content.find(J_cont_child).eq(index).removeClass('hide').siblings(J_cont_child).addClass('hide');

                });

            });

        },

        //宝宝新手礼
        babyGift: function() {

            var J_bc_g = $(".J-bc-g");

            J_bc_g.on('click', function() {

                //giftRule(0);//领取失败

                giftRule(1); //领取成功

            });

            function giftRule(type) {

                var gift_ok = '<div id="u-bg-ok"><p>恭喜您领取成功，请至购物车查看</p></div>',

                    gift_fail = '<div id="u-bg-fail"><p>您已经领取过了哦</p></div>';

                if (type) { //领取成功

                    m_b_obj.dialog({
                        content: gift_ok,
                        button: [{
                            value: '查看购物车',
                            callback: function() {},
                            autofocus: true
                        }, {
                            value: '关闭',
                            callback: function() {},
                            autofocus: true
                        }]
                    });
                } else { //领取失败

                    m_b_obj.dialog({
                        content: gift_fail,
                        button: [{
                            value: '确定',
                            callback: function() {},
                            autofocus: true
                        }]
                    });
                }

            }
        },

        //弹层公用
        dialog: function(obj, fun) {

            var _default = {
                fixed: true,
                width: '440px',
                height: 'auto',
                title: '温馨提示',
                content: '',
                quickClose: true,
                opacity: 0.4,
                button: [{}]
            };

            var option = $.extend(true, _default, obj);

            var d = dialog(option);

            d.showModal();

            d.show();

            //判断是否需要外部执行函数
            if (typeof arguments[1] === "function") {

                arguments[1]();

            }

        },

        //楼层1F ~ NF 锚点控制
        ctrlFloor: function() {

            var nScrollTop = document.body.scrollTop || document.documentElement.scrollTop,

                yCenter = $(window).height() / 2,

                $floor = $(".J-mum-floor"),

                $lift = $(".J-mum-lift"),

                liftHeight = $lift.outerHeight(),

                nDuration = 200,

                floorHeight = $floor.outerHeight() / 2,

                floorOffTop = [],

                minIndex = 0;

            //初始化锚点位置
            $lift.css("margin-top", (-liftHeight / 2) + 'px');

            if (nScrollTop > 550) {

                $lift.show();

                $floor.each(function(index, el) {

                    var self = $(this),
                        f_top = self.offset().top;

                    floorOffTop[index] = Math.abs(nScrollTop + yCenter - f_top - floorHeight);

                });

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

                $lift.find("li").eq(minIndex).addClass('active').siblings('li').removeClass('active');

            } else {

                $lift.hide();

                $lift.find("li").removeClass('active');

            }

        },

        //控制楼层锚点跳转
        ctrlLift: function() {

            var $floor = $(".J-mum-floor"),

                $self = $(this),

                index = $self.index();

            $self.addClass('active').siblings("li").removeClass('active');

            $("html,body").stop(true, true).animate({

                scrollTop: $floor.eq(index).offset().top - 40

            }, 500);

        }

    };

    window.m_b_obj = m_b_obj;

    m_b_obj.init();


})(window);
