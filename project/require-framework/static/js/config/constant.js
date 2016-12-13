/**
 * 全站常量配置,可区分模块
 * @author jie.tang 2016-07-12
 */
define('config/constant', function() {

    return {

        common: {

            nophone:"亲！请输入手机号！",

            errorphone:"亲,请检查您的手机号格式！",

            errorvcode:"输入的验证码有误，请重新输入",

            errorsmscap:"短信验证码有误，请重新输入",

            cannotacess:"已禁止本次访问：您必须使用微信内置浏览器或手机QQ访问本页面！",

            1:"您的XXX密码已经短信给您喽~",

            2:"进入网站",

            3:"立即使用红包",

            4:"已放入帐号",

            5:"本次验证码将通过语音发送，请您注意接听手机。",

            6:"温馨提示：<br>亲，您已经领过咯！卡券已在账户中，快进站使用吧，谢谢~"

        },

        list:{

            btn_type:{
                1:"立即预定",
                2:"加入购物车",
                3:"查看详情",
                4:"到货通知"
            },

            search_empty:"很抱歉，没有找到您搜索的相关商品信息！",

            goods_empty:"商品库存不足，自动调整为",

            goods_unit:"件",

            goods_sensitive:"此商品为敏感商品，仅支持支付平台、网银支付，请半小时内付款成功，否则订单将自动取消。",

            cannot_send:"暂不支持配送",

            gift:"赠品",

            nohas_price:"暂无售价"

        }

    };
});