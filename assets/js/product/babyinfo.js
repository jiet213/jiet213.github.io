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
    },
    isHasSpace: function(value,errorMsg) {
        var index = value.indexOf(' ');
        if (index != -1) {
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

var baby_info = (function() {

    /*保存宝宝数据的变量*/
    var data = [];

    var url=[];/*保存的链接地址*/

    var tpl_b_li = [
        '{{~it :value:index }}',
        '<li class="{{= index === 0 ?"z-select":"" }}"><a href="javascript:void(0)">{{= value.hasBaby == 1 ?value.nickname:value.mothername}}</a></li>',
        '{{~}}',
    ].join("");
    var tpl_b_info = [
        '<div class="u-info-ipt J-info-ipt">',
        '{{~it :value:index }}',
        '<div class="{{= value.hasBaby == 1 ?"u-hbb":"u-dbb" }} J-read J-panel {{= index === 0 ?"":"hide" }}">',
        '<div class="u-read">',
        '<div class="u-item">',
        '<p class="title">{{= value.hasBaby == 1 ?"宝宝姓名":"妈妈姓名" }}：</p>',
        '<p class="detail name">{{= value.hasBaby == 1 ?value.nickname:value.mothername}}</p>',
        '</div>',
        '<div class="u-item">',
        '<p class="title">{{= value.hasBaby == 1 ?"生日":"预产期" }}：</p>',
        '<p class="detail birth">{{=value.birthday}}</p>',
        '</div>',
        '<div class="u-item">',
        '<p class="title">性别：</p>',
        '<p class="detail sex">',
        '{{? value.sex == 1}}',
        '王子',
        '{{?? value.sex == 2}}',
        '公主',
        '{{?? value.sex == 3}}',
        '未知',
        '{{?}}',
        '</p>',
        '</div>',
        '<a class="u-submit {{= value.hasBaby == 1 ?"J-bc":"J-mc" }}" href="#">{{= value.hasBaby == 1 ?"进入宝宝中心":"进入孕妈中心" }}</a>',
        '<a href="javascript:void(0)" class="u-btn u-add oh J-baby-add" {{? it.length >=3}}disabled{{?}}></a>',
        '<a href="javascript:void(0)" class="u-btn u-modify {{= value.hasBaby == 1 ?"J-h-mody":"J-d-mody" }} oh"></a>',
        '</div>',
        '</div>',
        '{{~}}',
        '</div>',
    ].join("");
    var tpl_b_modify = [
        '<div class="u-info-radio J-baby-rd">',
        '<label class="u-radio u-radio-before">',
        '<input type="radio" name="baby" value="1" id="havebaby" {{? it.hasBaby ==1}}checked{{?}}>已有宝宝',
        '</label>',
        '<label class="u-radio">',
        '<input type="radio" name="baby" value="2" id="duebaby" {{? it.hasBaby ==2}}checked{{?}} {{? it.hasBaby ==1}}disabled{{?}}>待产宝宝',
        '</label>',
        '</div>',
        '<div class="u-info-ipt J-info-ipt">',
        '<div class="{{= it.hasBaby == 1 ?"u-hbb":"u-dbb" }} {{= it.hasBaby == 1 ?"J-hbb":"J-dbb" }}">',
        '<div class="J-write">',
        '<div class="u-item">',
        '<p class="title">{{= it.hasBaby == 1 ?"宝宝姓名":"妈妈姓名" }}：</p>',
        '<input class="u-ipt" type="text" name="b_name" maxlength="6" value={{= it.hasBaby == 1 ?it.nickname:it.mothername}}>',
        '</div>',
        '<div class="error-msg J-error-name"><span class="hide"></span></div>',
        '<div class="u-item">',
        '<p class="title">{{= it.hasBaby == 1 ?"生日":"预产期" }}：</p>',
        '<input class="u-ipt u-data-cal J-cal" type="text" name="b_birth" value={{=it.birthday}}> ',
        '</div>',
        '<div class="error-msg J-error-date"><span class="hide"></span></div>',
        '<div class="u-item u-sex">',
        '<p class="title">性别：</p>',
        '<label class="u-radio u-radio-before">',
        '<input type="radio" name="{{= it.hasBaby == 1 ?"h_sex":"d_sex"}}" value="1" {{? it.sex ==1}}checked{{?}}>王子',
        '</label>',
        '<label class="u-radio {{= it.hasBaby == 1 ?"":"u-radio-before" }}">',
        '<input type="radio" name="{{= it.hasBaby == 1 ?"h_sex":"d_sex"}}" value="2" {{? it.sex ==2}}checked{{?}}>公主',
        '</label>',
        '<label class="u-radio {{= it.hasBaby == 1 ?"hide":"" }}">',
        '<input type="radio" name="d_sex" value="3" {{? it.sex ==3}}checked{{?}}>未知',
        '</label>',
        '</div>',
        '<a href="javascript:void(0)" class="u-submit {{= it.hasBaby == 1 ?"J-h-sbt":"J-d-sbt" }} oh">提 交</a>',
        '</div>',
        '</div>',
        '</div>',
    ].join("");
    var tpl_b_write = [
        '<div class="u-info-radio J-baby-rd">',
        '<label class="u-radio u-radio-before">',
        '<input type="radio" name="baby" value="1" id="havebaby" checked>已有宝宝',
        '</label>',
        '<label class="u-radio">',
        '<input type="radio" name="baby" value="2" id="duebaby">待产宝宝',
        '</label>',
        '</div>',
        '<div class="u-info-ipt J-info-ipt">',
        '<div class="u-hbb J-hbb">',
        '<div class="J-write">',
        '<div class="u-item">',
        '<p class="title">宝宝小名：</p>',
        '<input class="u-ipt" type="text" name="b_name" maxlength="6">',
        '</div>',
        '<div class="error-msg J-error-name"><span class="hide"></span></div>',
        '<div class="u-item">',
        '<p class="title">生日：</p>',
        '<input class="u-ipt u-data-cal J-cal" type="text" name="b_birth"> ',
        '</div>',
        '<div class="error-msg J-error-date"><span class="hide"></span></div>',
        '<div class="u-item u-sex">',
        '<p class="title">性别：</p>',
        '<label class="u-radio u-radio-before">',
        '<input type="radio" name="h_sex" value="1" checked>王子',
        '</label>',
        '<label class="u-radio">',
        '<input type="radio" name="h_sex" value="2">公主',
        '</label>',
        '</div>',
        '<a href="javascript:void(0)" class="u-submit J-h-sbt oh">提 交</a>',
        '</div>',
        '</div>',
        '<div class="u-dbb J-dbb hide">',
        '<div class="J-write">',
        '<div class="u-item">',
        '<p class="title">妈妈姓名：</p>',
        '<input class="u-ipt" type="text" name="b_name" maxlength="6">',
        '</div>',
        '<div class="error-msg J-error-name"><span class="hide"></span></div>',
        '<div class="u-item">',
        '<p class="title">预产期：</p>',
        '<input class="u-ipt u-data-cal J-cal" type="text" name="b_birth"> ',
        '</div>',
        '<div class="error-msg J-error-date"><span class="hide"></span></div>',
        '<div class="u-item u-sex">',
        '<p class="title">性别：</p>',
        '<label class="u-radio u-radio-before">',
        '<input type="radio" name="d_sex" value="1" checked>王子',
        '</label>',
        '<label class="u-radio u-radio-before">',
        '<input type="radio" name="d_sex" value="2">公主',
        '</label>',
        '<label class="u-radio">',
        '<input type="radio" name="d_sex" value="3">未知',
        '</label>',
        '</div>',
        '<a href="javascript:void(0)" class="u-submit J-d-sbt oh">提 交</a>',
        '</div>',
        '</div>',
        '</div>',
    ].join("");
    var tpl_bm_center = [
        '{{~it :value:index }}',
        '<dl class="J-panel {{= index === 0 ?"":"hide" }}">',
        '<dt>',
        '<img src="{{= value.sex == 1 ?"../assets/images/bboy.png":"../assets/images/bgirl.png"}}" height="58" width="58" alt="" title="">',
        '</dt>',
        '<dd>',
        '<span>小名：</span>{{= value.hasBaby == 1 ?value.nickname:value.mothername}}',
        '</dd>',
        '<dd>',
        '<span>性别：</span>',
        '{{? value.sex == 1}}',
        '王子',
        '{{?? value.sex == 2}}',
        '公主',
        '{{?? value.sex == 3}}',
        '未知',
        '{{?}}',
        '</dd>',
        '<dd>',
        '<span>生日：</span>{{=value.birthday}}',
        '</dd>',
        '</dl>',
        '{{~}}',
    ].join("");

    function setUrl(arr) {
        url = url.concat(arr);
    }

    function setData(arr) {
        data = data.concat(arr);
    }

    function getData(index) {
        return data[index];
    }

    /*修改已有的数据*/
    function modifyData(index, arr) {

        if (data[index].hasBaby == 1) {

            data[index].nickname = arr.name;
        } else {
            if (arr.hasBaby == 1) {
                data[index].nickname = arr.name;
            } else {
                data[index].mothername = arr.name;
            }
            data[index].hasBaby = arr.hasBaby;
        }
        data[index].sex = arr.sex;

        data[index].birthday = arr.birthday;

    }

    /*将数据分为已有和待产两个*/
    function splitData(hasbaby){

        var temData = [];
        for (var i = 0; i < data.length; i++) {
            if (data[i].hasBaby == hasbaby) {
                temData = temData.concat(data[i]);
            };
        };

        return temData;
    }

    /*表单验证函数*/
    function validataFuc(obj, errorArr) {

        var b_hb = $(".J-baby-rd").find("input[type='radio']:checked").val(),
            b_name = $(obj).children('.J-write').find("input[name='b_name']").val(),
            b_birth = $(obj).children('.J-write').find("input[name='b_birth']").val(),
            b_sex = $(obj).children('.J-write').find("input[type='radio']:checked").val();

        var validator = new Validator();

        validator.add(b_name, [{
            strategy: 'isNonEmpty',
            errorMsg: errorArr[0]
        }]);

        validator.add(b_birth, [{
            strategy: 'isNonEmpty',
            errorMsg: errorArr[1]
        }]);

        validator.add(b_name, [{
            strategy: 'isHasSpace',
            errorMsg: errorArr[2]
        }]);

        var errorMsg = validator.start();

        var Msg = {
            'errorMsg': errorMsg,
            'hasBaby': b_hb,
            'name': b_name,
            'birthday': b_birth,
            'sex': b_sex
        };

        return Msg;
    };

    /*渲染宝宝列表事件*/
    function getBabyList(tmpData) {

        var b_list = doT.template(tpl_b_li);

        $(".J-baby-item ul").html(b_list(tmpData||data));

        var b_item_li = $(".J-baby-item ul").children("li"),
            b_li_len = b_item_li.length;

        b_item_li.css("width", Math.round(100 / b_li_len) + "%");
    }

    /*登录后 如果有宝宝档案记录，渲染页面*/
    function getBabyInfo() {

        var b_info = doT.template(tpl_b_info);

        $(".J-baby-lst").html(b_info(data));

        $(".J-baby-item").removeClass("hide");

    }

    /*登录后 如果没有宝宝档案记录，进入宝宝填写界面*/
    function setBabyInfo() {

        var b_write = doT.template(tpl_b_write);

        $(".J-baby-lst").html(b_write());


        $(".J-baby-item").addClass("hide");

    }

    /*第一次新建宝宝档案时，radio切换*/
    function hasBabyTab() {

        var b_radio = $(".J-baby-rd");

        b_radio.on('click', 'label', function() {

            var self = $(this),
                index = self.index(),
                is_show = 0;

            $(".J-info-ipt").children('div').eq(index).removeClass('hide').siblings().addClass('hide');

        });
    }

    /*修改宝宝信息事件*/
    function modify() {

        var b_modify = doT.template(tpl_b_modify);

        var index = $(".J-baby-item").find('li[class="z-select"]').index();

        $(".J-baby-lst").html(b_modify(data[index]));

        //$(".J-baby-rd").removeClass("hide");

        $(".J-baby-item").addClass("hide");
    }

    /*提交表单验证事件*/
    function loginFun(obj, errorArr, is_add) {

        var error_name = $(obj).find(".J-error-name").children(),
            error_date = $(obj).find(".J-error-date").children();

        var Msg = validataFuc(obj, errorArr),
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

            if (data.length == 0 || is_add) { //首次新建宝宝档案

                var tmpData = [];
                tmpData[0] = {
                    'mem_guid': '',
                    'hasBaby': Msg.hasBaby,
                    'birthday': Msg.birthday,
                    'sex': Msg.sex
                };

                if (tmpData[0].hasBaby == 1) {

                    tmpData[0].nickname = Msg.name;
                } else {
                    tmpData[0].mothername = Msg.name;
                }

                setData(tmpData);

                baby_info.getBabyInfo();

                baby_info.getBabyList();

            } else {

                var index = $(".J-baby-item").find('li[class="z-select"]').index();

                modifyData(index, Msg);

                /*ajax请求，执行成功之后才会进行下面的操作、、、*/

                $(".J-baby-item").find("li").eq(index).children('a').html(Msg.name);

                var b_info = doT.template(tpl_b_info);

                $(".J-baby-lst").html(b_info(data));

                $(".J-info-ipt").children('.J-read').eq(index).removeClass('hide').siblings().addClass('hide');

            }

            $(".J-baby-rd").remove();

            $(".J-baby-item").removeClass("hide");

            return true;

        }

    }

    /*宝宝中心、孕妈中心宝宝档案渲染模板*/
    function bcBabyInfo(){

        var bc_info = doT.template(tpl_bm_center);

        getBabyList(data);

        $(".J-bc-info").html(bc_info(data));
    }



    /*绑定其他事件*/
    function bindEvent() {

        $(document).on('click', '.J-h-mody', modify);
        $(document).on('click', '.J-d-mody', modify);

        $(document).on('click', '.J-h-sbt', function() {
            loginFun('.J-hbb', ["宝宝名字还没填哦:1", "宝宝生日还没填哦:2","宝宝名字还没填哦:1"], 0);
        });
        $(document).on('click', '.J-d-sbt', function() {
            loginFun('.J-dbb', ["妈妈名字还没填哦:1", "宝宝预产期还没填哦:2"], 0);
        });

        /*进入宝宝中心*/
        $(document).on('click', '.J-bc', function(){
            var dataTempB = splitData(1);
            $.cookie("dataB", JSON.stringify(dataTempB));
            window.location.href="baby_center.html";
        });

        /*进入孕妈中心*/
        $(document).on('click', '.J-mc', function(){
            var dataTempM = splitData(2);
            $.cookie("dataM", JSON.stringify(dataTempM));
            window.location.href="mum_center.html";
        });

        /*新增宝宝档案*/
        $(document).on('click', ".J-baby-add", function() {

            var add_baby = '<div id="u-add-baby"><div class="u-a-item u-a-radio J-baby-rd"><label class="u-radio u-radio-before"><input type="radio" name="baby-add" value="1" checked="">已有宝宝</label><label class="u-radio"><input type="radio" name="baby-add" value="2">待产宝宝</label></div><div class="J-write"><div class="u-a-item"><p class="title">宝宝小名：</p><input class="ipt" type="text" name="b_name" maxlength="6" placeholder="填写宝宝姓名"></div><div class="error-msg J-error-name"><span class="hide"></span></div><div class="u-a-item"><p class="title">生日：</p><input class="ipt u-b-birth J-ab-cal" type="text" name="b_birth" maxlength="6" placeholder="填写宝宝生日"></div><div class="error-msg J-error-date"><span class="hide"></span></div><div class="u-a-item u-a-sex J-a-sex"><p class="title">性别：</p><label class="u-radio u-radio-before"><input type="radio" name="sex-add" value="1" checked="">王子</label><label class="u-radio u-radio-before"><input type="radio" name="sex-add" value="2">公主</label><label class="u-radio hide"><input type="radio" name="sex-add" value="3">未知</label></div></div></div>';

            if (data.length > 2) {
                return false;
            } else {
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

                            var is_ok = loginFun('#u-add-baby', ["请填写宝宝姓名！:1", "请填写宝宝生日！:2","请填写宝宝姓名！:1"], 1);

                            if (is_ok) {
                                //继续操作。。。
                            } else {
                                return false;
                            }
                        },
                        autofocus: true
                    }]
                }, function() {
                    //新增宝宝日期选择
                    $(".J-ab-cal").on('click', function() {
                        WdatePicker({
                            readOnly: true
                        });
                    });

                    ///*性别区分显示

                    $(".J-baby-rd").on('click', 'label', function() {

                        var self = $(this),
                            val = self.children("input[type='radio']").val();

                        if (val == 1) {
                            $(".J-a-sex").children('label:last').addClass('hide');
                        }else {
                            $(".J-a-sex").children('label:last').removeClass('hide');
                        }

                    });


                });

            }

        });
    }
    return {
        getBabyInfo: getBabyInfo,
        setBabyInfo: setBabyInfo,
        getBabyList: getBabyList,
        hasBabyTab: hasBabyTab,
        bcBabyInfo:bcBabyInfo,
        modify: modify,
        loginFun: loginFun,
        bindEvent: bindEvent,
        setData: setData,
        splitData:splitData
    }

})($, doT);

