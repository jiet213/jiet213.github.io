/*
 *  @name patibility.js
 *  @Designed @jie.tang
 *  @date 2016-09-06          //制作时间
 *  浏览器版本过低提示
 */
define(['jquery'],function($) {

	(function(patibility){

		if(navigator.appName == "Microsoft Internet Explorer" && (navigator.appVersion.split(";")[1].replace(/[ ]/g,"")=="MSIE6.0" || navigator.appVersion.split(";")[1].replace(/[ ]/g,"")=="MSIE7.0")){

			var html = '';

			html += '<div class="M_patibility">';
			html += '	<div class="M_bg"></div>';
			html += '	<div class="M_main">';
			html += '		<div class="M_bg_top"></div>';
			html += '		<div class="M_content">';
			html += '			<p class="title">Hi，您当前的浏览器版本过低，可能存在安全风险，建议升级浏览器</p>';
			html += '			<div class="browser">';
			html += '				<a class="chrome marginR8" href="http://rj.baidu.com/soft/detail/14744.html" target="_blank">谷歌 chrome</a>';
			html += '				<a class="uc marginL8" href="http://rj.baidu.com/soft/detail/14497.html" target="_blank">UC 浏览器</a>';
			html += '			</div>';
			html += '			<p class="app_choose">';
			html += '				或直接用<span class="marking">APP扫码浏览</span>';
			html += '			</p>';
			html += '			<div class="app_img">';
			html += '				<img class="marginR12" src="/static/img/patibility/app.png"/>';
			html += '				<img class="marginL12" src="/static/img/patibility/app2.png"/>';
			html += '			</div>';
			html += '		</div>';
			html += '		<div class="M_bg_bottom"></div>';
			html += '	</div>';
	        html += '</div>';

			patibility(html);

			return false;

		};

	}(function(_html){

		//扩展方法
		$("body").append(_html);

	}));

});