/**
 * 每个页面需要用到的doT模板文件
 * @ author jie.tang 2016-07-12
 * ------------------------------------------------------------------
 */
define('tpl/demo', function() {

    //推荐热卖
    var sHotRecommend = ['<div class="u-hot-cont">',
    '   <h3 class="tt">推荐热卖</h3>',
        '<ul>',
        '  {{~it.list:value:index}}',
        '   <li class="prod">',
        '      <div class="p-img">',
        '         <a href="{{=value.item_url}}" title="{{=value.name}}" target="_blank">',
        '            <img src="{{=value.pic}}" height="160" width="160" alt="" title="{{=value.name}}">',
        '         </a>',
        '      </div>',
        '      <div class="p-name">',
        '          <a href="{{=value.item_url}}" title="{{=value.name}}" target="_blank">{{=value.name}}</a>',
        '      </div>',
        '      <div class="p-price" rehot="{{=value.show_id}}">',
        '          <span class="now"></span>',
        '          <span class="old"></span>',
        '      </div>',
        '      <div class="p-shop">',
        '           <a href="{{=value.store_url}}">{{=value.store_name}}</a>',
        '      </div>',
        '   </li>',
        '   {{~}}',
        '</ul>',
        '</div>',
    ].join("");

    return {

        list_hrd: sHotRecommend

    };
});