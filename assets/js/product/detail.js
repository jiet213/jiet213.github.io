/*************************************************
 *  Function  美食城
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

                }, 400);

            });

        },

        //返回顶部
        goToTop: function() {

            var $J_go_top = $(".J-go-top").parent(),

                nScrollTop = document.body.scrollTop || document.documentElement.scrollTop;

            nScrollTop >= 200 ? $J_go_top.show() : $J_go_top.hide();

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
    
    food_obj.init();

})(jQuery);
