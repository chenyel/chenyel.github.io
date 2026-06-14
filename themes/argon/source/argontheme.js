if (typeof(argonConfig) == "undefined"){
	var argonConfig = {};
}
if (typeof(argonConfig.wp_path) == "undefined"){
	argonConfig.wp_path = "/";
}
/* Cookies 操作 */
function setCookie(cname, cvalue, exdays) {
	var d = new Date();
	d.setTime(d.getTime() + (exdays*24*60*60*1000));
	var expires = "expires="+ d.toUTCString();
	document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}
function getCookie(cname) {
	var name = cname + "=";
	var decodedCookie = decodeURIComponent(document.cookie);
	var ca = decodedCookie.split(';');
	for(var i = 0; i <ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return c.substring(name.length, c.length);
		}
	}
	return "";
}

/* 多语言支持 */
var translation = {};
translation['en_US'] = {
	"确定": "OK",
	"清除": "Clear",
	"恢复博客默认": "Set To Default",
	"评论内容不能为空": "Comment content cannot be empty",
	"昵称不能为空": "Name cannot be empty",
	"邮箱或 QQ 号格式错误": "Incorrect email or QQ format",
	"邮箱格式错误": "Incorrect email format",
	"网站格式错误 (不是 http(s):// 开头)": "Website URL format error",
	"验证码未输入": "CAPTCHA cannot be empty",
	"验证码格式错误": "Incorrect CAPTCHA format",
	"评论格式错误": "Comment format error",
	"发送中": "Sending",
	"正在发送": "Sending",
	"评论正在发送中...": "Comment is sending...",
	"发送": "Send",
	"评论发送失败": "Comment failed",
	"发送成功": "Success",
	"您的评论已发送": "Your comment has been sent",
	"评论": "Comments",
	"未知原因": "Unknown Error",
	"评论内容不能为空": "Comment content cannot be empty",
	"编辑中": "Editing",
	"正在编辑": "Editing",
	"评论正在编辑中...": "Comment is editing",
	"编辑": "Edit",
	"评论编辑失败": "Comment editing failed",
	"已编辑": "Edited",
	"编辑成功": "Success",
	"您的评论已编辑": "Your comment has been edited",
	"评论 #": "Comment #",
	"的编辑记录": "- Edit History",
	"加载失败": "Failed to load",
	"展开": "Show",
	"没有更多了": "No more comments",
	"找不到该 Repo": "Can't find the repository",
	"获取 Repo 信息失败": "Failed to get repository information",
	"点赞失败": "Vote failed",
	"Hitokoto 获取失败": "Failed to get Hitokoto",
	"复制成功": "Copied",
	"代码已复制到剪贴板": "Code has been copied to the clipboard",
	"复制失败": "Failed",
	"请手动复制代码": "Please copy the code manually",
	"刚刚": "Now",
	"分钟前": "minutes ago",
	"小时前": "hours ago",
	"昨天": "Yesterday",
	"前天": "The day before yesterday",
	"天前": "days ago",
	"隐藏行号": "Hide Line Numbers",
	"显示行号": "Show Line Numbers",
	"开启折行": "Enable Break Line",
	"关闭折行": "Disable Break Line",
	"复制": "Copy",
	"全屏": "Fullscreen",
	"退出全屏": "Exit Fullscreen",
};
translation['ru_RU'] = {
	"确定": "ОК",
	"清除": "Очистить",
	"恢复博客默认": "Восстановить по умолчанию",
	"评论内容不能为空": "Содержимое комментария не может быть пустым",
	"昵称不能为空": "Имя не может быть пустым",
	"邮箱或 QQ 号格式错误": "Неверный формат электронной почты или QQ",
	"邮箱格式错误": "Неправильный формат электронной почты",
	"网站格式错误 (不是 http(s):// 开头)": "Сайт ошибка формата URL-адреса ",
	"验证码未输入": "Вы не решили капчу",
	"验证码格式错误": "Ошибка проверки капчи",
	"评论格式错误": "Неправильный формат комментария",
	"发送中": "Отправка",
	"正在发送": "Отправка",
	"评论正在发送中...": "Комментарий отправляется...",
	"发送": "Отправить",
	"评论发送失败": "Не удалось отправить комментарий",
	"发送成功": "Комментарий отправлен",
	"您的评论已发送": "Ваш комментарий был отправлен",
	"评论": "Комментарии",
	"未知原因": "Неизвестная ошибка",
	"评论内容不能为空": "Содержимое комментария не может быть пустым",
	"编辑中": "Редактируется",
	"正在编辑": "Редактируется",
	"评论正在编辑中...": "Комментарий редактируется",
	"编辑": "Редактировать",
	"评论编辑失败": "Не удалось отредактировать комментарий",
	"已编辑": "Изменено",
	"编辑成功": "Успешно",
	"您的评论已编辑": "Ваш комментарий был изменен",
	"评论 #": "Комментарий #",
	"的编辑记录": "- История изменений",
	"加载失败": "Ошибка загрузки",
	"展开": "Показать",
	"没有更多了": "Комментариев больше нет",
	"找不到该 Repo": "Невозможно найти репозиторий",
	"获取 Repo 信息失败": "Неудалось получить информацию репозитория",
	"点赞失败": "Ошибка голосования",
	"Hitokoto 获取失败": "Проблемы с вызовом Hitokoto",
	"复制成功": "Скопировано",
	"代码已复制到剪贴板": "Код скопирован в буфер обмена",
	"复制失败": "Неудалось",
	"请手动复制代码": "Скопируйте код вручную",
	"刚刚": "Сейчас",
	"分钟前": "минут назад",
	"小时前": "часов назад",
	"昨天": "Вчера",
	"前天": "Позавчера",
	"天前": "дней назад",
	"隐藏行号": "Скрыть номера строк",
	"显示行号": "Показать номера строк",
	"开启折行": "Включить перенос строк",
	"关闭折行": "Выключить перенос строк",
	"复制": "Скопировать",
	"全屏": "Полноэкранный режим",
	"退出全屏": "Выход из полноэкранного режима",
};
translation['zh_TW'] = {
	"确定": "確定",
	"清除": "清除",
	"恢复博客默认": "恢復博客默認",
	"评论内容不能为空": "評論內容不能為空",
	"昵称不能为空": "昵稱不能為空",
	"邮箱或 QQ 号格式错误": "郵箱或 QQ 號格式錯誤",
	"邮箱格式错误": "郵箱格式錯誤",
	"网站格式错误 (不是 http(s):// 开头)": "網站格式錯誤 (不是 http(s):// 開頭)",
	"验证码未输入": "驗證碼未輸入",
	"验证码格式错误": "驗證碼格式錯誤",
	"评论格式错误": "評論格式錯誤",
	"发送中": "發送中",
	"正在发送": "正在發送",
	"评论正在发送中...": "評論正在發送中...",
	"发送": "發送",
	"评论发送失败": "評論發送失敗",
	"发送成功": "發送成功",
	"您的评论已发送": "您的評論已發送",
	"评论": "評論",
	"未知原因": "未知原因",
	"评论内容不能为空": "評論內容不能為空",
	"编辑中": "編輯中",
	"正在编辑": "正在編輯",
	"评论正在编辑中...": "評論正在編輯中...",
	"编辑": "編輯",
	"评论编辑失败": "評論編輯失敗",
	"已编辑": "已編輯",
	"编辑成功": "編輯成功",
	"您的评论已编辑": "您的評論已編輯",
	"评论 #": "評論 #",
	"的编辑记录": "的編輯記錄",
	"加载失败": "加載失敗",
	"展开": "展開",
	"没有更多了": "沒有更多了",
	"找不到该 Repo": "找不到該 Repo",
	"获取 Repo 信息失败": "獲取 Repo 信息失敗",
	"点赞失败": "點贊失敗",
	"Hitokoto 获取失败": "Hitokoto 獲取失敗",
	"复制成功": "復制成功",
	"代码已复制到剪贴板": "代碼已復制到剪貼板",
	"复制失败": "復制失敗",
	"请手动复制代码": "請手動復制代碼",
	"刚刚": "剛剛",
	"分钟前": "分鐘前",
	"小时前": "小時前",
	"昨天": "昨天",
	"前天": "前天",
	"天前": "天前",
	"隐藏行号": "隱藏行號",
	"显示行号": "顯示行號",
	"开启折行": "開啟折行",
	"关闭折行": "關閉折行",
	"复制": "復制",
	"全屏": "全屏",
	"退出全屏": "退出全屏"
};
function __(text){
	let lang = argonConfig.language;
	if (typeof(translation[lang]) == "undefined"){
		return text;
	}
	if (typeof(translation[lang][text]) == "undefined"){
		return text;
	}
	return translation[lang][text];
}

/* 根据滚动高度改变顶栏透明度 */
function changeToolbarTransparency(){
	let toolbar = document.getElementById("navbar-main");
	let $bannerContainer = $("#banner_container");
	let $content = $("#content");
	if (!toolbar || $bannerContainer.length === 0 || $content.length === 0){
		return;
	}
	let startTransitionHeight = $bannerContainer.offset().top - 75;
	let endTransitionHeight = $content.offset().top - 75;
	let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
	if (scrollTop < startTransitionHeight){
		toolbar.style.setProperty('background-color', 'rgba(var(--toolbar-color), 0)', 'important');
		toolbar.style.setProperty('box-shadow', 'none');
		toolbar.classList.add("navbar-ontop");
		return;
	}
	if (scrollTop > endTransitionHeight){
		toolbar.style.setProperty('background-color', 'rgba(var(--toolbar-color), 0.85)', 'important');
		toolbar.style.setProperty('box-shadow', '');
		toolbar.classList.remove("navbar-ontop");
		return;
	}
	let transparency = (scrollTop - startTransitionHeight) / Math.max(endTransitionHeight - startTransitionHeight, 1) * 0.85;
	toolbar.style.setProperty('background-color', 'rgba(var(--toolbar-color), ' + transparency, 'important');
	toolbar.style.setProperty('box-shadow', '');
	toolbar.classList.remove("navbar-ontop");
}
changeToolbarTransparency();
document.addEventListener("scroll", changeToolbarTransparency, {passive: true});
$(window).resize(changeToolbarTransparency);

/* 顶栏搜索 */
$(document).on("click" , "#navbar_search_input_container" , function(){
	$(this).addClass("open");
	$("#navbar_search_input").focus();
});
$(document).on("blur" , "#navbar_search_input_container" , function(){
	$(this).removeClass("open");
});
$(document).on("keydown" , "#navbar_search_input_container #navbar_search_input" , function(e){
	if (e.keyCode != 13){
		return;
	}
	let word = $(this).val();
	if (word == ""){
		$("#navbar_search_input_container").blur();
		return;
	}
	let scrolltop = $(document).scrollTop();
	$.pjax({
		url: argonConfig.wp_path + "?s=" + encodeURI(word)
	});
});
/* 侧栏搜索 */
$(document).on("click" , "#leftbar_search_container" , function(){
	$(".leftbar-search-button").addClass("open");
	$("#leftbar_search_input").removeAttr("readonly").focus();
	$("#leftbar_search_input").focus();
	$("#leftbar_search_input").select();
	return false;
});
$(document).on("blur" , "#leftbar_search_container" , function(){
	$(".leftbar-search-button").removeClass("open");
	$("#leftbar_search_input").attr("readonly", "readonly");
});
$(document).on("keydown" , "#leftbar_search_input" , function(e){
	if (e.keyCode != 13){
		return;
	}
	let word = $(this).val();
	if (word == ""){
		$("#leftbar_search_container").blur();
		return;
	}
	$("html").removeClass("leftbar-opened");
	$.pjax({
		url: argonConfig.wp_path + "?s=" + encodeURI(word)
	});
});

/* 左侧栏随页面滚动浮动 */
!function(){
	let $leftbarPart1 = $('#leftbar_part1');
	let $leftbarPart2 = $('#leftbar_part2');
	let leftbarPart1 = document.getElementById('leftbar_part1');
	let leftbarPart2 = document.getElementById('leftbar_part2');

	if (!$leftbarPart1.length || !$leftbarPart2.length || !leftbarPart1 || !leftbarPart2){
		return;
	}

	let part1OffsetTop = $('#leftbar_part1').offset().top;
	let part1OuterHeight = $('#leftbar_part1').outerHeight();

	function changeLeftbarStickyStatus(){
		let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
		if( part1OffsetTop + part1OuterHeight + 10 - scrollTop <= 90 ){
			// 滚动条在页面中间浮动状态
			leftbarPart2.classList.add('sticky');
		}else{
			// 滚动条在顶部 不浮动状态
			leftbarPart2.classList.remove('sticky');
		}
		if( part1OffsetTop + part1OuterHeight + 10 - scrollTop <= 20 ){// 侧栏下部分是否可以随 Headroom 一起向上移动
			document.body.classList.add('leftbar-can-headroom');
		}else{
			document.body.classList.remove('leftbar-can-headroom');
		}
	}
	changeLeftbarStickyStatus();
	document.addEventListener("scroll", changeLeftbarStickyStatus, {passive: true});
	$(window).resize(function(){
		part1OffsetTop = $('#leftbar_part1').offset().top;
		part1OuterHeight = $('#leftbar_part1').outerHeight();
		changeLeftbarStickyStatus();
	});
	new MutationObserver(function(){
		part1OffsetTop = $('#leftbar_part1').offset().top;
		part1OuterHeight = $('#leftbar_part1').outerHeight();
		changeLeftbarStickyStatus();
	}).observe(leftbarPart1, {attributes: true, childList: true, subtree: true});
}();

/* Headroom */
if (argonConfig.headroom){
	var headroom = new Headroom(document.querySelector("body"),{
		"tolerance" : {
			up : 0,
			down : 0
		},
		"offset": 0,
			"classes": {
			"initial": "with-headroom",
			"pinned": "headroom---pinned",
			"unpinned": "headroom---unpinned",
			"top": "headroom---top",
			"notTop": "headroom---not-top",
			"bottom": "headroom---bottom",
			"notBottom": "headroom---not-bottom",
			"frozen": "headroom---frozen"
		}
	}).init();
}

/* 浮动按钮栏相关 （回顶等） */
!function(){
	let $fabtns = $('#float_action_buttons');
	let $backToTopBtn = $('#fabtn_back_to_top');
	let $toggleSidesBtn = $('#fabtn_toggle_sides');
	let $toggleDarkmode = $('#fabtn_toggle_darkmode');
	let $toggleAmoledMode = $('#blog_setting_toggle_darkmode_and_amoledarkmode');
	let $toggleBlogSettings = $('#fabtn_toggle_blog_settings_popup');
	let $goToComment = $('#fabtn_go_to_comment');

	let $readingProgressBar = $('#fabtn_reading_progress_bar');
	let $readingProgressDetails = $('#fabtn_reading_progress_details');

	let isScrolling = false;
	$backToTopBtn.on("click" , function(){
		if (!isScrolling){
			isScrolling = true;
			setTimeout(function(){
				isScrolling = false;
			} , 600);
			$("body,html").animate({
				scrollTop: 0
			}, 600);
		}
	});

	$toggleDarkmode.on("click" , function(){
		toggleDarkmode();
	});

	$toggleAmoledMode.on("click" , function(){
		toggleAmoledDarkMode();
	})

	if ($("#post_comment").length > 0){
		$("#fabtn_go_to_comment").removeClass("d-none");
	}else{
		$("#fabtn_go_to_comment").addClass("d-none");
	}
	$goToComment.on("click" , function(){
		gotoHash("#post_comment" , 600);
		$("#post_comment_content").focus();
	});

	if (localStorage['Argon_fabs_Floating_Status'] == "left"){
		$fabtns.addClass("fabtns-float-left");
	}
	$toggleSidesBtn.on("click" , function(){
		$fabtns.addClass("fabtns-unloaded");
		setTimeout(function(){
			$fabtns.toggleClass("fabtns-float-left");
			if ($fabtns.hasClass("fabtns-float-left")){
				localStorage['Argon_fabs_Floating_Status'] = "left";
			}else{
				localStorage['Argon_fabs_Floating_Status'] = "right";
			}
			$fabtns.removeClass("fabtns-unloaded");
		} , 300);
	});
	// 博客设置
	$toggleBlogSettings.on("click" , function(){
		$("#float_action_buttons").toggleClass("blog_settings_opened");
	});
	$("#close_blog_settings").on("click" , function(){
		$("#float_action_buttons").removeClass("blog_settings_opened");
	});
	$("#blog_setting_darkmode_switch .custom-toggle-slider").on("click" , function(){
		toggleDarkmode();
	});
	// 字体
	$("#blog_setting_font_sans_serif").on("click" , function(){
		$("html").removeClass("use-serif");
		localStorage['Argon_Use_Serif'] = "false";
	});
	$("#blog_setting_font_serif").on("click" , function(){
		$("html").addClass("use-serif");
		localStorage['Argon_Use_Serif'] = "true";
	});
	if (localStorage['Argon_Use_Serif'] == "true"){
		$("html").addClass("use-serif");
	}else if (localStorage['Argon_Use_Serif'] == "false"){
		$("html").removeClass("use-serif");
	}
	// 阴影
	$("#blog_setting_shadow_small").on("click" , function(){
		$("html").removeClass("use-big-shadow");
		localStorage['Argon_Use_Big_Shadow'] = "false";
	});
	$("#blog_setting_shadow_big").on("click" , function(){
		$("html").addClass("use-big-shadow");
		localStorage['Argon_Use_Big_Shadow'] = "true";
	});
	if (localStorage['Argon_Use_Big_Shadow'] == "true"){
		$("html").addClass("use-big-shadow");
	}else if (localStorage['Argon_Use_Big_Shadow'] == "false"){
		$("html").removeClass("use-big-shadow");
	}
	// 滤镜
	function setBlogFilter(name){
		if (name == undefined || name == ""){
			name = "off";
		}
		if (!$("html").hasClass("filter-" + name)){
			$("html").removeClass("filter-sunset filter-darkness filter-grayscale");
			if (name != "off"){
				$("html").addClass("filter-" + name);
			}
		}
		$("#blog_setting_filters .blog-setting-filter-btn").removeClass("active");
		$("#blog_setting_filters .blog-setting-filter-btn[filter-name='" + name + "']").addClass("active");
		localStorage['Argon_Filter'] = name;
	}
	setBlogFilter(localStorage['Argon_Filter']);
	$(".blog-setting-filter-btn").on("click" , function(){
		setBlogFilter(this.getAttribute("filter-name"));
	});

	function changefabtnDisplayStatus(){
		// 阅读进度
		let readingProgress = $(window).scrollTop() / Math.max($(document).height() - $(window).height(), 0.01);
		$readingProgressDetails.html((readingProgress * 100).toFixed(0) + "%");
		$readingProgressBar.css("width" , (readingProgress * 100).toFixed(0) + "%");
		// 是否显示回顶
		if ($(window).scrollTop() >= 400 || readingProgress >= 0.5){
			$backToTopBtn.removeClass("fabtn-hidden");
		}else{
			$backToTopBtn.addClass("fabtn-hidden");
		}
	}
	changefabtnDisplayStatus();
	$(window).scroll(function(){
		changefabtnDisplayStatus();
	});
	$fabtns.removeClass("fabtns-unloaded");
}();

/* 卡片圆角大小调整 */
!function(){
	function setCardRadius(radius, save){
		document.documentElement.style.setProperty('--card-radius', radius + "px");
		if (save){
			localStorage["argon_card_radius"] = radius;
		}
	}
	let slider = document.getElementById('blog_setting_card_radius');
	noUiSlider.create(slider, {
		start: [localStorage["argon_card_radius"] == undefined ? $("meta[name='theme-card-radius']").attr("content") : localStorage["argon_card_radius"]],
		step: 0.5,
		connect: [true, false],
		range: {
			'min': [0],
			'max': [30]
		}
	});
	slider.noUiSlider.on('update', function (values){
		let value = values[0];
		setCardRadius(value, false);
	});
	slider.noUiSlider.on('set', function (values){
		let value = values[0];
		setCardRadius(value, true);
	});
	$(document).on("click" , "#blog_setting_card_radius_to_default" , function(){
		slider.noUiSlider.set($("meta[name='theme-card-radius']").attr("content"));
		setCardRadius($("meta[name='theme-card-radius']").attr("content"), false);
		localStorage.removeItem("argon_card_radius");
	});
	if (localStorage["argon_card_radius"] != undefined){
		setCardRadius(localStorage["argon_card_radius"], false);
	}
}();
/* 需要密码的文章加载 */
$(document).on("submit" , ".post-password-form" , function(){
	$("input[type='submit']", this).attr("disabled", "disabled");
	let url = $(this).attr("action");
	$.pjax.form(this, {
		push: false,
		replace: false
	});
	return false;
});
/* URL 中 # 根据 ID 定位 */
function gotoHash(hash , durtion){
	if (hash.length == 0){
		return;
	}
	if ($(hash).length == 0){
		return;
	}
	if (durtion == null){
		durtion = 200;
	}
	$("body,html").animate({
		scrollTop: $(hash).offset().top - 80
	}, durtion);
}
function getHash(url){
	return url.substring(url.indexOf('#'));
}
!function(){
	$(window).on("hashchange" , function(){
		hash = window.location.hash;
		gotoHash(hash);
	});
	$(window).trigger("hashchange");
}();

/* 显示文章过时信息 Toast */
function showPostOutdateToast(){
	if ($("#primary #post_outdate_toast").length > 0){
		iziToast.show({
			title: '',
			message: $("#primary #post_outdate_toast").data("text"),
			class: 'shadow-sm',
			position: 'topRight',
			backgroundColor: 'var(--themecolor)',
			titleColor: '#ffffff',
			messageColor: '#ffffff',
			iconColor: '#ffffff',
			progressBarColor: '#ffffff',
			icon: 'fa fa-info',
			close: false,
			timeout: 8000
		});
		$("#primary #post_outdate_toast").remove();
	}
}
showPostOutdateToast();

/* Zoomify */
function zoomifyInit(){
	if (argonConfig.zoomify == false){
		return;
	}
	$("article img").zoomify(argonConfig.zoomify);
}
zoomifyInit();

/* Lazyload */
function lazyloadInit(){
	if (argonConfig.lazyload == false){
		return;
	}
	if (argonConfig.lazyload.effect == "none"){
		delete argonConfig.lazyload.effect;
	}
	$("article img.lazyload:not(.lazyload-loaded) , .post-thumbnail.lazyload:not(.lazyload-loaded) , .related-post-thumbnail.lazyload:not(.lazyload-loaded)").lazyload(Object.assign(argonConfig.lazyload, {load: function(){$(this).addClass("lazyload-loaded")}}));
	$(".comment-item-text .comment-sticker.lazyload").lazyload(Object.assign(argonConfig.lazyload, {load: function(){$(this).removeClass("lazyload")}}));
}
lazyloadInit();

/* Pangu.js */
function panguInit(){
	if (argonConfig.pangu == true){
		pangu.spacingElementById('post_content');
	}
}
panguInit();

/* Clamp.js */
function clampInit(){
	$(".clamp").each(function(index, dom) {
		$clamp(dom, {clamp: dom.getAttribute("clamp-line")});
	});
}
clampInit();

/* Pjax */
$.pjax.defaults.timeout = 10000;
$.pjax.defaults.container = ['#banner', '#primary', '#leftbar_part1_menu', '#leftbar_part2_inner', '.page-information-card-container', '#wpadminbar'];
$.pjax.defaults.fragment = ['#banner', '#primary', '#leftbar_part1_menu', '#leftbar_part2_inner', '.page-information-card-container', '#wpadminbar'];
$(document).pjax("a[href]:not([no-pjax]):not(.no-pjax):not([target='_blank']):not([download])")
.on('pjax:click', function(e, f, g){
	if (argonConfig.disable_pjax == true){
		e.preventDefault();
		return;
	}
	NProgress.remove();
	NProgress.start();
}).on('pjax:afterGetContainers', function(e, f, g) {
	if (g.is("#main article.post-preview a.post-title")){
		let $card = $(g.parents("article.post-preview")[0]);
		$card.append("<div class='loading-css-animation'><div class='loading-dot loading-dot-1' ></div><div class='loading-dot loading-dot-2' ></div><div class='loading-dot loading-dot-3' ></div><div class='loading-dot loading-dot-4' ></div><div class='loading-dot loading-dot-5' ></div><div class='loading-dot loading-dot-6' ></div><div class='loading-dot loading-dot-7' ></div><div class='loading-dot loading-dot-8' ></div></div></div>");
		$card.addClass("post-pjax-loading");
		$("#main").addClass("post-list-pjax-loading");
		let offsetTop = $($card).offset().top - $("#main").offset().top;
		$card.css("transform" , "translateY(-" + offsetTop + "px)");
		$("body,html").animate({
			scrollTop: 0
		}, 450);
	}
}).on('pjax:send', function() {
	NProgress.set(0.618);
}).on('pjax:beforeReplace', function(e, dom) {
	if ($("#post_comment", dom[0]).length > 0){
		$("#fabtn_go_to_comment").removeClass("d-none");
	}else{
		$("#fabtn_go_to_comment").addClass("d-none");
	}
}).on('pjax:complete', function() {
	NProgress.inc();
	try{
		if (MathJax != undefined){
			MathJax.typeset();
		}
	}catch (err){}
	try{
		if ($("script#mathjax_v2_script" , $vdom).length > 0){
			MathJax.Hub.Typeset();
		}
	}catch (err){}
	try{
		if (renderMathInElement != undefined){
			renderMathInElement(document.body,{
				delimiters: [
					{left: "$$", right: "$$", display: true},
					{left: "$", right: "$", display: false},
					{left: "\\(", right: "\\)", display: false}
				]
			});
		}
	}catch (err){}

	lazyloadInit();
	zoomifyInit();
	highlightJsRender();
	panguInit();
	clampInit();
	getGithubInfoCardContent();
	showPostOutdateToast();
	calcHumanTimesOnPage();

	if (typeof(window.pjaxLoaded) == "function"){
		try{
			window.pjaxLoaded();
		}catch (err){
			console.error(err);
		}
	}

	NProgress.done();
}).on('pjax:end', function() {
	lazyloadInit();
});


/* Tags Dialog pjax 加载后自动关闭 */
$(document).on("click" , "#blog_tags .tag" , function(){
	$("#blog_tags button.close").trigger("click");
});
$(document).on("click" , "#blog_categories .tag" , function(){
	$("#blog_categories button.close").trigger("click");
});

/* 侧栏 & 顶栏菜单手机适配 */
!function(){
	$(document).on("click" , "#fabtn_open_sidebar" , function(){
		$("html").addClass("leftbar-opened");
	});
	$(document).on("click" , "#sidebar_mask" , function(){
		$("html").removeClass("leftbar-opened");
	});
	$(document).on("click" , "#leftbar a[href]:not([no-pjax]):not([href^='#'])" , function(){
		$("html").removeClass("leftbar-opened");
	});
	$(document).on("click" , "#navbar_global.show .navbar-nav a[href]:not([no-pjax]):not([href^='#'])" , function(){
		$("#navbar_global .navbar-toggler").click();
	});
	$(document).on("click" , "#navbar_global.show #navbar_search_btn_mobile" , function(){
		$("#navbar_global .navbar-toggler").click();
	});
}();

/* 折叠区块小工具 */
$(document).on("click" , ".collapse-block .collapse-block-title" , function(){
	let id = this.getAttribute("collapse-id");
	let selecter = ".collapse-block[collapse-id='" + id +"']";
	$(selecter).toggleClass("collapsed");
	if ($(selecter).hasClass("collapsed")){
		$(selecter + " .collapse-block-body").stop(true , false).slideUp(200);
	}else{
		$(selecter + " .collapse-block-body").stop(true , false).slideDown(200);
	}
	$("html").trigger("scroll");
});

/* 获得 Github Repo Shortcode 信息卡内容 */
function getGithubInfoCardContent(){
	$(".github-info-card").each(function(){
		(function($this){
			if ($this.attr("data-getdata") == "backend"){
				$(".github-info-card-description" , $this).html($this.attr("data-description"));
				$(".github-info-card-stars" , $this).html($this.attr("data-stars"));
				$(".github-info-card-forks" , $this).html($this.attr("data-forks"));
				return;
			}
			$(".github-info-card-description" , $this).html("Loading...");
			$(".github-info-card-stars" , $this).html("-");
			$(".github-info-card-forks" , $this).html("-");
			author = $this.attr("data-author");
			project = $this.attr("data-project");
			$.ajax({
				url : "https://api.github.com/repos/" + author + "/" + project,
				type : "GET",
				dataType : "json",
				success : function(result){
					description = result.description;
					if (result.homepage != ""){
						description += " <a href='" + result.homepage + "' target='_blank' no-pjax>" + result.homepage + "</a>"
					}
					$(".github-info-card-description" , $this).html(description);
					$(".github-info-card-stars" , $this).html(result.stargazers_count);
					$(".github-info-card-forks" , $this).html(result.forks_count);
					// console.log(result);
				},
				error : function(xhr){
					if (xhr.status == 404){
						$(".github-info-card-description" , $this).html(__("找不到该 Repo"));
					}else{
						$(".github-info-card-description" , $this).html(__("获取 Repo 信息失败"));
					}
				}
			});
		})($(this));
	});
}
getGithubInfoCardContent();

// 颜色计算
function rgb2hsl(R,G,B){
	let r = R / 255;
	let g = G / 255;
	let b = B / 255;

	let var_Min = Math.min(r, g, b);
	let var_Max = Math.max(r, g, b);
	let del_Max = var_Max - var_Min;

	let H, S, L = (var_Max + var_Min) / 2;

	if (del_Max == 0){
		H = 0;
		S = 0;
	}else{
		if (L < 0.5){
			S = del_Max / (var_Max + var_Min);
		}else{
			S = del_Max / (2 - var_Max - var_Min);
		}

		del_R = (((var_Max - r) / 6) + (del_Max / 2)) / del_Max;
		del_G = (((var_Max - g) / 6) + (del_Max / 2)) / del_Max;
		del_B = (((var_Max - b) / 6) + (del_Max / 2)) / del_Max;

		if (r == var_Max){
			H = del_B - del_G;
		}
		else if (g == var_Max){
			H = (1 / 3) + del_R - del_B;
		}
		else if (b == var_Max){
			H = (2 / 3) + del_G - del_R;
		}
		if (H < 0) H += 1;
		if (H > 1) H -= 1;
	}
	return {
		'h': H, // 0~1
		's': S,
		'l': L
	};
}
function Hue_2_RGB(v1,v2,vH){
	if (vH < 0) vH += 1;
	if (vH > 1) vH -= 1;
	if ((6 * vH) < 1) return (v1 + (v2 - v1) * 6 * vH);
	if ((2 * vH) < 1) return v2;
	if ((3 * vH) < 2) return (v1 + (v2 - v1) * ((2 / 3) - vH) * 6);
	return v1;
}
function hsl2rgb(h,s,l){
	let r, g, b, var_1, var_2;
	if (s == 0){
		r = l;
		g = l;
		b = l;
	}
	else{
		if (l < 0.5){
			var_2 = l * (1 + s);
		}
		else{
			var_2 = (l + s) - (s * l);
		}
		var_1 = 2 * l - var_2;
		r = Hue_2_RGB(var_1, var_2, h + (1 / 3));
		g = Hue_2_RGB(var_1, var_2, h);
		b = Hue_2_RGB(var_1, var_2, h - (1 / 3));
	}
	return {
		'R': Math.round(r * 255), // 0~255
		'G': Math.round(g * 255),
		'B': Math.round(b * 255),
		'r': r, // 0~1
		'g': g,
		'b': b
	};
}
function rgb2hex(r,g,b){
	let hex = new Array('0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F');
	let rh, gh, bh;
	rh = "", gh ="", bh="";
	while (rh.length < 2){
		rh = hex[r%16] + rh;
		r = Math.floor(r / 16);
	}
	while (gh.length < 2){
		gh = hex[g%16] + gh;
		g = Math.floor(g / 16);
	}
	while (bh.length < 2){
		bh = hex[b%16] + bh;
		b = Math.floor(b / 16);
	}
	return "#" + rh + gh + bh;
}
function hex2rgb(hex){
	// hex: #XXXXXX
	let dec = {
		'0': 0, '1': 1, '2': 2, '3': 3, '4': 4, '5': 5, '6': 6, '7': 7, '8': 8, '9': 9, 'A': 10, 'B': 11, 'C': 12, 'D': 13, 'E': 14, 'F': 15
	};
	return {
		'R': (dec[hex.substr(1,1)] * 16 + dec[hex.substr(2,1)]), // 0~255
		'G': (dec[hex.substr(3,1)] * 16 + dec[hex.substr(4,1)]),
		'B': (dec[hex.substr(5,1)] * 16 + dec[hex.substr(6,1)]),
		'r': (dec[hex.substr(1,1)] * 16 + dec[hex.substr(2,1)]) / 255, // 0~1
		'g': (dec[hex.substr(3,1)] * 16 + dec[hex.substr(4,1)]) / 255,
		'b': (dec[hex.substr(5,1)] * 16 + dec[hex.substr(6,1)]) / 255
	};
}
function rgb2gray(R,G,B){
	return Math.round(R * 0.299 + G * 0.587 + B * 0.114);
}
function hex2gray(hex){
	let rgb_array = hex2rgb(hex);
	return hex2gray(rgb_array['R'], rgb_array['G'], rgb_array['B']);
}
function rgb2str(rgb){
	return rgb['R'] + "," + rgb['G'] + "," + rgb['B'];
}
function hex2str(hex){
	return rgb2str(hex2rgb(hex));
}
// 颜色选择器 & 切换主题色
if ($("meta[name='argon-enable-custom-theme-color']").attr("content") == 'true'){
	let themeColorPicker = new Pickr({
		el: '#theme-color-picker',
		container: 'body',
		theme: 'monolith',
		closeOnScroll: false,
		appClass: 'theme-color-picker-box',
		useAsButton: false,
		padding: 8,
		inline: false,
		autoReposition: true,
		sliders: 'h',
		disabled: false,
		lockOpacity: true,
		outputPrecision: 0,
		comparison: false,
		default: localStorage["argon_custom_theme_color"] == undefined ? ($("meta[name='theme-color']").attr("content")) : localStorage["argon_custom_theme_color"],
		swatches: ['#5e72e4', '#fa7298', '#009688', '#607d8b', '#2196f3', '#3f51b5', '#ff9700', '#109d58', '#dc4437', '#673bb7', '#212121', '#795547'],
		defaultRepresentation: 'HEX',
		showAlways: false,
		closeWithKey: 'Escape',
		position: 'top-start',
		adjustableNumbers: false,
		components: {
			palette: true,
			preview: true,
			opacity: false,
			hue: true,
			interaction: {
				hex: true,
				rgba: true,
				hsla: false,
				hsva: false,
				cmyk: false,
				input: true,
				clear: false,
				cancel: true,
				save: true
			}
		},
		strings: {
			save: __('确定'),
			clear: __('清除'),
			cancel: __('恢复博客默认')
		}
	});
	themeColorPicker.on('change', instance => {
		updateThemeColor(pickrObjectToHEX(instance), true);
	})
	themeColorPicker.on('save', (color, instance) => {
		updateThemeColor(pickrObjectToHEX(instance._color), true);
		themeColorPicker.hide();
	})
	themeColorPicker.on('cancel', instance => {
		themeColorPicker.hide();
		themeColorPicker.setColor($("meta[name='theme-color-origin']").attr("content").toUpperCase());
		updateThemeColor($("meta[name='theme-color-origin']").attr("content").toUpperCase(), false);
		localStorage.removeItem("argon_custom_theme_color");
	});
}
function pickrObjectToHEX(color){
	let HEXA = color.toHEXA();
	return ("#" + HEXA[0] + HEXA[1] + HEXA[2]).toUpperCase();
}
function updateThemeColor(color, save){
	let themecolor = color;
	let themecolor_rgbstr = hex2str(themecolor);
	let RGB = hex2rgb(themecolor);
	let HSL = rgb2hsl(RGB['R'], RGB['G'], RGB['B']);

	let RGB_dark0 = hsl2rgb(HSL['h'], HSL['s'], Math.max(HSL['l'] - 0.025, 0));
	let themecolor_dark0 = rgb2hex(RGB_dark0['R'],RGB_dark0['G'],RGB_dark0['B']);

	let RGB_dark = hsl2rgb(HSL['h'], HSL['s'], Math.max(HSL['l'] - 0.05, 0));
	let themecolor_dark = rgb2hex(RGB_dark['R'], RGB_dark['G'], RGB_dark['B']);

	let RGB_dark2 = hsl2rgb(HSL['h'], HSL['s'], Math.max(HSL['l'] - 0.1, 0));
	let themecolor_dark2 = rgb2hex(RGB_dark2['R'],RGB_dark2['G'],RGB_dark2['B']);

	let RGB_dark3 = hsl2rgb(HSL['h'], HSL['s'], Math.max(HSL['l'] - 0.15, 0));
	let themecolor_dark3 = rgb2hex(RGB_dark3['R'],RGB_dark3['G'],RGB_dark3['B']);

	let RGB_light = hsl2rgb(HSL['h'], HSL['s'], Math.min(HSL['l'] + 0.1, 1));
	let themecolor_light = rgb2hex(RGB_light['R'],RGB_light['G'],RGB_light['B']);

	document.documentElement.style.setProperty('--themecolor', themecolor);
	document.documentElement.style.setProperty('--themecolor-dark0', themecolor_dark0);
	document.documentElement.style.setProperty('--themecolor-dark', themecolor_dark);
	document.documentElement.style.setProperty('--themecolor-dark2', themecolor_dark2);
	document.documentElement.style.setProperty('--themecolor-dark3', themecolor_dark3);
	document.documentElement.style.setProperty('--themecolor-light', themecolor_light);
	document.documentElement.style.setProperty('--themecolor-rgbstr', themecolor_rgbstr);

	if (rgb2gray(RGB['R'], RGB['G'], RGB['B']) < 50){
		$("html").addClass("themecolor-toodark");
	}else{
		$("html").removeClass("themecolor-toodark");
	}

	$("meta[name='theme-color']").attr("content", themecolor);
	$("meta[name='theme-color-rgb']").attr("content", themecolor_rgbstr);

	if (save){
		localStorage["argon_custom_theme_color"] = themecolor;
	}
}
if (localStorage["argon_custom_theme_color"] != undefined){
	updateThemeColor(localStorage["argon_custom_theme_color"], false);
}

/* 评论区图片链接点击处理 */
!function(){
	let invid = 0;
	let activeImg = null;
	$(document).on("click" , ".comment-item-text .comment-image" , function(){
		$(".comment-image-preview", this).attr("data-easing", "cubic-bezier(0.4, 0, 0, 1)");
		$(".comment-image-preview", this).attr("data-duration", "500");
		if (!$(this).hasClass("comment-image-preview-zoomed")){
			activeImg = this;
			$(this).addClass("comment-image-preview-zoomed");
			if (!$(this).hasClass("loaded")){
				$(".comment-image-preview", this).attr('src', $(this).attr("data-src"));
			}
			$(".comment-image-preview", this).zoomify('zoomIn');
			if (!$(this).hasClass("loaded")){
				invid = setInterval(function(){
					if (activeImg.width != 0){
						$("html").trigger("scroll");
						$(activeImg).addClass("loaded");
						clearInterval(invid);
						activeImg = null;
					}
				}, 50);
			}
		}else{
			clearInterval(invid);
			activeImg = null;
			$(this).removeClass("comment-image-preview-zoomed");
			$(".comment-image-preview", this).zoomify('zoomOut');
		}
	});
}();

/* 打字效果 */
function prefersReducedMotion() {
	return !!(window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches);
}

function splitGraphemes(text) {
	if (typeof text !== "string" || text.length === 0) {
		return [];
	}
	if (typeof Intl !== "undefined" && typeof Intl.Segmenter === "function") {
		try {
			const segmenter = new Intl.Segmenter(undefined, { granularity: "grapheme" });
			return Array.from(segmenter.segment(text), segment => segment.segment);
		} catch (error) {
			/* Fall back to code-point splitting below. */
		}
	}
	return Array.from(text);
}

/* 一言 */
if ($(".hitokoto").length > 0){
	$.ajax({
		type: 'GET',
		url: "https://v1.hitokoto.cn",
		success: function(result){
			$(".hitokoto").text(result.hitokoto);
		},
		error: function(result){
			$(".hitokoto").text(__("Hitokoto 获取失败"));
		}
	});
}

/* Highlight.js */
function randomString(len) {
	len = len || 32;
	let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let res = "";
	for (let i = 0; i < len; i++) {
		res += chars.charAt(Math.floor(Math.random() * chars.length));
	}
	return res;
}
var codeOfBlocks = {};
function getCodeFromBlock(block){
	if (codeOfBlocks[block.id] != undefined){
		return codeOfBlocks[block.id];
	}
	let lines = $(".hljs-ln-code", block);
	let res = "";
	for (let i = 0; i < lines.length - 1; i++){
		res += lines[i].innerText;
		res += "\n";
	}
	res += lines[lines.length - 1].innerText;
	codeOfBlocks[block.id] = res;
	return res;
}
function highlightJsRender(){
	if (typeof(hljs) == "undefined"){
		return;
	}
	if (typeof(argonEnableCodeHighlight) == "undefined"){
		return;
	}
	if (!argonEnableCodeHighlight){
		return;
	}
	$("article pre.code").each(function(index, block) {
		if ($(block).hasClass("no-hljs")){
			return;
		}
		$(block).html("<code>" + $(block).html() + "</code>");
	});
	$("article pre > code").each(function(index, block) {
		if ($(block).hasClass("no-hljs")){
			return;
		}
		$(block).parent().attr("id", randomString());
		hljs.highlightBlock(block);
		hljs.lineNumbersBlock(block, {singleLine: true});
		$(block).parent().addClass("hljs-codeblock");
		$(block).attr("hljs-codeblock-inner", "");
		let copyBtnID = "copy_btn_" + randomString();
		$(block).parent().append(`<div class="hljs-control hljs-title">
				<div class="hljs-control-btn hljs-control-toggle-linenumber" tooltip-hide-linenumber="` + __("隐藏行号") + `" tooltip-show-linenumber="` + __("显示行号") + `">
					<i class="fa fa-list"></i>
				</div>
				<div class="hljs-control-btn hljs-control-toggle-break-line" tooltip-enable-breakline="` + __("开启折行") + `" tooltip-disable-breakline="` + __("关闭折行") + `">
					<i class="fa fa-align-left"></i>
				</div>
				<div class="hljs-control-btn hljs-control-copy" id=` + copyBtnID + ` tooltip="` + __("复制") + `">
					<i class="fa fa-clipboard"></i>
				</div>
				<div class="hljs-control-btn hljs-control-fullscreen" tooltip-fullscreen="` + __("全屏") + `" tooltip-exit-fullscreen="` + __("退出全屏") + `">
					<i class="fa fa-arrows-alt"></i>
				</div>
			</div>`);
		let clipboard = new ClipboardJS("#" + copyBtnID, {
			text: function(trigger) {
				return getCodeFromBlock($(block).parent()[0]);
			}
		});
		clipboard.on('success', function(e) {
			iziToast.show({
				title: __("复制成功"),
				message: __("代码已复制到剪贴板"),
				class: 'shadow',
				position: 'topRight',
				backgroundColor: '#2dce89',
				titleColor: '#ffffff',
				messageColor: '#ffffff',
				iconColor: '#ffffff',
				progressBarColor: '#ffffff',
				icon: 'fa fa-check',
				timeout: 5000
			});
		});
		clipboard.on('error', function(e) {
			iziToast.show({
				title: __("复制失败"),
				message: __("请手动复制代码"),
				class: 'shadow',
				position: 'topRight',
				backgroundColor: '#f5365c',
				titleColor: '#ffffff',
				messageColor: '#ffffff',
				iconColor: '#ffffff',
				progressBarColor: '#ffffff',
				icon: 'fa fa-close',
				timeout: 5000
			});
		});
	});
}
$(document).ready(function(){
	highlightJsRender();
});
$(document).on("click" , ".hljs-control-fullscreen" , function(){
	let block = $(this).parent().parent();
	block.toggleClass("hljs-codeblock-fullscreen");
	if (block.hasClass("hljs-codeblock-fullscreen")){
		$("html").addClass("noscroll codeblock-fullscreen");
	}else{
		$("html").removeClass("noscroll codeblock-fullscreen");
	}
});
$(document).on("click" , ".hljs-control-toggle-break-line" , function(){
	let block = $(this).parent().parent();
	block.toggleClass("hljs-break-line");
});
$(document).on("click" , ".hljs-control-toggle-linenumber" , function(){
	let block = $(this).parent().parent();
	block.toggleClass("hljs-hide-linenumber");
});

/* 时间差计算 */
function addPreZero(num, n) {
	var len = num.toString().length;
	while(len < n) {
		num = "0" + num;
		len++;
	}
	return num;
}
function humanTimeDiff(time){
	let now = new Date();
	time = new Date(time);
	let delta = now - time;
	if (delta < 0){
		delta = 0;
	}
	if (delta < 1000 * 60){
		return __("刚刚");
	}
	if (delta < 1000 * 60 * 60){
		return parseInt(delta / (1000 * 60)) + " " + __("分钟前");
	}
	if (delta < 1000 * 60 * 60 * 24){
		return parseInt(delta / (1000 * 60 * 60)) + " " + __("小时前");
	}
	let yesterday = new Date(now - 1000 * 60 * 60 * 24);
	yesterday.setHours(0);
	yesterday.setMinutes(0);
	yesterday.setSeconds(0);
	yesterday.setMilliseconds(0);
	if (time > yesterday){
		return __("昨天") + " " + time.getHours() + ":" + addPreZero(time.getMinutes(), 2);
	}
	let theDayBeforeYesterday = new Date(now - 1000 * 60 * 60 * 24 * 2);
	theDayBeforeYesterday.setHours(0);
	theDayBeforeYesterday.setMinutes(0);
	theDayBeforeYesterday.setSeconds(0);
	theDayBeforeYesterday.setMilliseconds(0);
	if (time > theDayBeforeYesterday && argonConfig.language.indexOf("zh") == 0){
		return __("前天") + " " + time.getHours() + ":" + addPreZero(time.getMinutes(), 2);
	}
	if (delta < 1000 * 60 * 60 * 24 * 30){
		return parseInt(delta / (1000 * 60 * 60 * 24)) + " " + __("天前");
	}
	let theFirstDayOfThisYear = new Date(now);
	theFirstDayOfThisYear.setMonth(0);
	theFirstDayOfThisYear.setDate(1);
	theFirstDayOfThisYear.setHours(0);
	theFirstDayOfThisYear.setMinutes(0);
	theFirstDayOfThisYear.setSeconds(0);
	theFirstDayOfThisYear.setMilliseconds(0);
	if (time > theFirstDayOfThisYear){
		if (argonConfig.dateFormat == "YMD" || argonConfig.dateFormat == "MDY"){
			return (time.getMonth() + 1) + "-" + time.getDate();
		}else{
			return time.getDate() + "-" + (time.getMonth() + 1);
		}
	}
	if (argonConfig.dateFormat == "YMD"){
		return time.getFullYear() + "-" + (time.getMonth() + 1) + "-" + time.getDate();
	}else if (argonConfig.dateFormat == "MDY"){
		return time.getDate() + "-" + (time.getMonth() + 1) + "-" + time.getFullYear();
	}else if (argonConfig.dateFormat == "DMY"){
		return time.getDate() + "-" + (time.getMonth() + 1) + "-" + time.getFullYear();
	}
}
function calcHumanTimesOnPage(){
	$(".human-time").each(function(){
		$(this).text(humanTimeDiff(parseInt($(this).data("time")) * 1000));
	});
}
calcHumanTimesOnPage();
setInterval(function(){
	calcHumanTimesOnPage()
}, 15000);

/* 搜索 */
// https://github.com/PaicHyperionDev/hexo-generator-search
var searchFunc = function(path, search_id, content_id) {
	'use strict';
	$.ajax({
		url: path,
		dataType: "xml",
		success: function( xmlResponse ) {
			var datas = $( "entry", xmlResponse ).map(function() {
				return {
					title: $( "title", this ).text(),
					content: $("content",this).text(),
					url: $( "url" , this).text()
				};
			}).get();
			var $input = document.getElementById(search_id);
			if (!$input) return;
			var $resultContent = document.getElementById(content_id);
			if ($("#local-search-input").length > 0) {
				$input.addEventListener('input', function () {
					var str = '<ul class=\"search-result-list\">';
					var keywords = this.value.trim().toLowerCase().split(/[\s\-]+/);
					$resultContent.innerHTML = "";
					if (this.value.trim().length <= 0) {
						return;
					}
					datas.forEach(function (data) {
						var isMatch = true;
						var content_index = [];
						if (!data.title || data.title.trim() === '') {
							data.title = "Untitled";
						}
						var data_title = data.title.trim().toLowerCase();
						var data_content = data.content.trim().replace(/<[^>]+>/g, "").toLowerCase();
						var data_url = data.url;
						var index_title = -1;
						var index_content = -1;
						var first_occur = -1;
						if (data_content !== '') {
							keywords.forEach(function (keyword, i) {
								index_title = data_title.indexOf(keyword);
								index_content = data_content.indexOf(keyword);

								if (index_title < 0 && index_content < 0) {
									isMatch = false;
								} else {
									if (index_content < 0) {
										index_content = 0;
									}
									if (i == 0) {
										first_occur = index_content;
									}
								}
							});
						} else {
							isMatch = false;
						}
						if (isMatch) {
							str += "<li><a href='" + data_url + "' class='search-result-title'>" + data_title + "</a>";
							var content = data.content.trim().replace(/<[^>]+>/g, "");
							if (first_occur >= 0) {
								var start = first_occur - 20;
								var end = first_occur + 80;
								if (start < 0) {
									start = 0;
								}
								if (start == 0) {
									end = 100;
								}
								if (end > content.length) {
									end = content.length;
								}
								var match_content = content.substring(start, end);
								keywords.forEach(function (keyword) {
									var regS = new RegExp(keyword, "gi");
									match_content = match_content.replace(regS, "<em class=\"search-keyword\">" + keyword + "</em>");
								});
								str += "<p class=\"search-result\">" + match_content + "...</p>"
							}
							str += "</li>";
						}
					});
					str += "</ul>";
					$resultContent.innerHTML = str;
				});
			}
		}
	});
}
var search_path = $("#local-search-input").data("search.path");
if (search_path.length == 0) {
	search_path = "search.xml";
}
searchFunc($("#local-search-input").data("config.root") + search_path, 'local-search-input', 'local-search-result');

$(document).on("click" , ".search-result-title" , function(){
	$("#argon_search_modal button[data-dismiss='modal']").click();
});


/* Console */
!function(){
	console.log('%cTheme: %cArgon%c-Hexo%c By solstice23', 'color: rgba(255,255,255,.6); background: #5e72e4; font-size: 15px;border-radius:5px 0 0 5px;padding:10px 0 10px 20px;','color: rgba(255,255,255,1); background: #5e72e4; font-size: 15px;border-radius:0;padding:10px 0 10px 0px;', 'color: rgba(255,255,255,.6); background: #5e72e4; font-size: 15px;padding:10px 15px 10px 0px;','color: #fff; background: #92A1F4; font-size: 15px;border-radius:0 5px 5px 0;padding:10px 20px 10px 15px;');
	console.log('%cVersion%c' + $("meta[name='theme-version']").attr("content"), 'color:#fff; background: #5e72e4;font-size: 12px;border-radius:5px 0 0 5px;padding:3px 10px 3px 10px;','color:#fff; background: #92a1f4;font-size: 12px;border-radius:0 5px 5px 0;padding:3px 10px 3px 10px;');
	console.log('%chttps://github.com/solstice23/hexo-theme-argon', 'font-size: 12px;border-radius:5px;padding:3px 10px 3px 10px;border:1px solid #5e72e4;');
}();

function lqFormatTime(totalSeconds) {
	totalSeconds = Number.isFinite(totalSeconds) ? Math.floor(totalSeconds) : 0;
	const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, "0");
	const seconds = String(totalSeconds % 60).padStart(2, "0");
	return `${minutes}:${seconds}`;
}

function initLqHeroScroll() {
	document.querySelectorAll(".lq-hero-scroll").forEach(button => {
		if (button.dataset.bound === "true") {
			return;
		}
		button.dataset.bound = "true";
		button.addEventListener("click", () => {
			const shell = document.querySelector(".lq-shell");
			if (shell) {
				shell.scrollIntoView({ behavior: "smooth", block: "start" });
			}
		});
	});
}

function isLqLoaderBlockingMotion() {
	const html = document.documentElement;
	const loader = document.getElementById("lq-divergence-loader");
	if (html?.classList?.contains("lq-loader-active")) {
		return true;
	}
	if (!loader) {
		return false;
	}
	const state = String(loader.dataset.loaderState || "");
	return state !== "hidden" && state !== "complete";
}

function initHeroTitleMotion() {
	const title = document.querySelector('.banner-title[data-title-motion]');
	if (!title || title.dataset.motionReady === "true" || title.dataset.motionQueued === "true") {
		return;
	}

	const mode = title.getAttribute("data-title-motion");
	const titleInner = title.querySelector(".banner-title-inner");
	const subtitle = title.querySelector(".banner-subtitle");

	if (!titleInner || mode !== "chars") {
		title.dataset.motionReady = "true";
		return;
	}

	const text = titleInner.textContent || "";
	if (!text) {
		title.dataset.motionReady = "true";
		return;
	}

	if (isLqLoaderBlockingMotion()) {
		title.dataset.motionQueued = "true";
		const resumeMotion = () => {
			if (isLqLoaderBlockingMotion()) {
				return;
			}
			delete title.dataset.motionQueued;
			window.removeEventListener("lq:loader-hidden", resumeMotion);
			initHeroTitleMotion();
		};
		window.addEventListener("lq:loader-hidden", resumeMotion);
		return;
	}

	if (prefersReducedMotion()) {
		title.dataset.motionReady = "true";
		titleInner.classList.remove("is-pending-motion");
		if (subtitle) {
			subtitle.classList.remove("is-pending-motion", "is-pending", "is-in");
		}
		return;
	}

	title.dataset.motionReady = "true";
	const interval = Math.max(Number(title.getAttribute("data-title-motion-interval") || 90), 0);
	const subtitleDelay = Math.max(Number(title.getAttribute("data-subtitle-reveal-delay") || 680), 0);
	const graphemes = splitGraphemes(text);

	titleInner.classList.remove("is-pending-motion");
	titleInner.setAttribute("aria-label", text);
	titleInner.textContent = "";

	graphemes.forEach((char, index) => {
		const span = document.createElement("span");
		span.className = "lq-title-char";
		span.textContent = char === " " ? "\u00A0" : char;
		span.setAttribute("aria-hidden", "true");
		titleInner.appendChild(span);
		window.setTimeout(() => {
			span.classList.add("is-in");
		}, index * interval);
	});

	if (subtitle) {
		subtitle.classList.remove("is-pending-motion");
		subtitle.classList.add("is-pending");
		window.setTimeout(() => {
			subtitle.classList.add("is-in");
			subtitle.classList.remove("is-pending");
		}, graphemes.length * interval + subtitleDelay);
	}
}

let lqTabTitleTimer = 0;
const lqTabTitleState = {
	blurTitle: "\u79bb\u5f00\u4e86\u2026\u2026",
	focusTitle: "\u56de\u6765\u5566~",
	canonicalTitle: "",
	restoreTitle: "",
	bound: false
};

function clearLqTabTitleTimer() {
	if (lqTabTitleTimer) {
		window.clearTimeout(lqTabTitleTimer);
		lqTabTitleTimer = 0;
	}
}

function syncLqTabTitleRestoreTitle(nextTitle) {
	const banner = document.getElementById("banner");
	const canonicalTitle = banner
		? String(banner.getAttribute("data-page-title") || "").trim()
		: "";
	const candidateTitle = typeof nextTitle === "string" ? nextTitle.trim() : "";
	const currentTitle = candidateTitle || String(document.title || "").trim();
	const resolvedTitle = canonicalTitle || currentTitle;
	if (!resolvedTitle) {
		return;
	}
	if (!canonicalTitle && (
		currentTitle === lqTabTitleState.blurTitle ||
		currentTitle === lqTabTitleState.focusTitle
	)) {
		return;
	}
	lqTabTitleState.canonicalTitle = canonicalTitle;
	lqTabTitleState.restoreTitle = resolvedTitle;
}

function handleLqTabTitleVisibilityChange() {
	clearLqTabTitleTimer();
	if (document.hidden) {
		syncLqTabTitleRestoreTitle();
		document.title = lqTabTitleState.blurTitle;
		return;
	}
	document.title = lqTabTitleState.focusTitle;
	lqTabTitleTimer = window.setTimeout(() => {
		document.title = lqTabTitleState.restoreTitle || document.title;
		lqTabTitleTimer = 0;
	}, 900);
}

function initLqTabTitleState() {
	if (typeof document.hidden === "undefined") {
		return;
	}

	const banner = document.getElementById("banner");
	if (!banner) {
		return;
	}

	const blurTitle = String(banner.getAttribute("data-tab-blur-title") || "").trim();
	const focusTitle = String(banner.getAttribute("data-tab-focus-title") || "").trim();
	lqTabTitleState.blurTitle = blurTitle || "\u79bb\u5f00\u4e86\u2026\u2026";
	lqTabTitleState.focusTitle = focusTitle || "\u56de\u6765\u5566~";
	lqTabTitleState.canonicalTitle = String(banner.getAttribute("data-page-title") || "").trim();

	clearLqTabTitleTimer();
	syncLqTabTitleRestoreTitle(lqTabTitleState.canonicalTitle || document.title);

	if (!lqTabTitleState.bound) {
		document.addEventListener("visibilitychange", handleLqTabTitleVisibilityChange);
		lqTabTitleState.bound = true;
	}

	if (!document.hidden && (
		document.title === lqTabTitleState.blurTitle ||
		document.title === lqTabTitleState.focusTitle
	)) {
		document.title = lqTabTitleState.restoreTitle || lqTabTitleState.canonicalTitle || document.title;
	}
}

function initLqPageState() {
	const banner = document.getElementById("banner");
	const shell = document.getElementById("lq-page-shell");
	if (banner) {
		const bodyClass = banner.dataset.pageBodyClass;
		if (bodyClass) {
			document.body.classList.remove("lq-home-page", "lq-post-page", "lq-inner-page");
			document.body.classList.add("lq-shell-page", bodyClass);
		}
	}
	if (banner && shell) {
		const shellClass = banner.dataset.pageShellClass;
		if (shellClass) {
			shell.classList.remove("lq-home-shell", "lq-shell-wrap");
			shell.classList.add(shellClass);
		}
	}
	changeToolbarTransparency();
}

function initLqPlayer() {
	document.querySelectorAll(".lq-player").forEach(player => {
		if (player.dataset.bound === "true") {
			return;
		}
		player.dataset.bound = "true";

		const toggleButton = player.querySelector(".lq-player-toggle");
		const playButton = player.querySelector(".lq-player-play");
		const audio = player.querySelector(".lq-player-audio");
		const progress = player.querySelector(".lq-player-progress");
		const time = player.querySelector(".lq-player-time");
		const status = player.querySelector(".lq-player-status");
		const source = audio ? audio.querySelector("source") : null;

		toggleButton?.addEventListener("click", () => {
			player.classList.toggle("is-collapsed");
		});

		if (!audio || !playButton || !progress || !time || !source) {
			return;
		}

		const refreshTime = () => {
			const current = lqFormatTime(audio.currentTime);
			const duration = lqFormatTime(audio.duration);
			progress.value = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
			time.textContent = `${current} / ${duration}`;
		};

		playButton.addEventListener("click", async () => {
			try {
				if (audio.paused) {
					await audio.play();
				} else {
					audio.pause();
				}
			} catch (error) {
				if (status) {
					status.textContent = "播放失败，请检查音频地址";
				}
			}
		});

		progress.addEventListener("input", event => {
			if (!audio.duration) {
				return;
			}
			audio.currentTime = audio.duration * (Number(event.target.value) / 100);
		});

		audio.addEventListener("play", () => {
			playButton.innerHTML = '<i class="fa fa-pause" aria-hidden="true"></i>';
			if (status) {
				status.textContent = "正在播放";
			}
		});

		audio.addEventListener("pause", () => {
			playButton.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
			if (status) {
				status.textContent = "暂停中";
			}
		});

		audio.addEventListener("loadedmetadata", refreshTime);
		audio.addEventListener("timeupdate", refreshTime);
		audio.addEventListener("ended", () => {
			playButton.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
			progress.value = 0;
			if (status) {
				status.textContent = "播放结束";
			}
		});
	});
}

function initLqPlaylistPlayer() {
	const core = getLqMusicCore();

	document.querySelectorAll(".lq-player").forEach(player => {
		if (player.dataset.playlistBound === "true") {
			return;
		}
		player.dataset.playlistBound = "true";

		const toggleButton = player.querySelector(".lq-player-toggle");
		const prevButton = player.querySelector(".lq-player-prev");
		const playButton = player.querySelector(".lq-player-play");
		const nextButton = player.querySelector(".lq-player-next");
		const audio = player.querySelector(".lq-player-audio");
		const cover = player.querySelector(".lq-player-cover img");
		const title = player.querySelector(".lq-player-title");
		const artist = player.querySelector(".lq-player-artist");
		const progress = player.querySelector(".lq-player-progress");
		const time = player.querySelector(".lq-player-time");
		const status = player.querySelector(".lq-player-status");
		const trackIndex = player.querySelector(".lq-player-track-index");
		const autoplay = player.dataset.autoplay === "true";
		const playlistId = String(player.dataset.playlistId || "").trim();
		const playlistApiBase = String(player.dataset.playlistApiBase || "").trim();
		let playlist = (() => {
			try {
				const parsed = JSON.parse(player.dataset.playlist || "[]");
				return Array.isArray(parsed)
					? parsed.filter(track => track && (track.audio || track.src || track.url))
					: [];
			} catch (error) {
				return [];
			}
		})();

		toggleButton?.addEventListener("click", () => {
			player.classList.toggle("is-collapsed");
		});

		if (!audio || !playButton || !progress || !time) {
			return;
		}

		let currentIndex = 0;

		const setStatus = text => {
			if (status) {
				status.textContent = text;
			}
		};

		const refreshTime = () => {
			const current = lqFormatTime(audio.currentTime);
			const duration = lqFormatTime(audio.duration);
			progress.value = audio.duration ? (audio.currentTime / audio.duration) * 100 : 0;
			time.textContent = `${current} / ${duration}`;
		};

		const updateTrackIndex = () => {
			if (!trackIndex) {
				return;
			}
			trackIndex.textContent = playlist.length ? `${currentIndex + 1} / ${playlist.length}` : "0 / 0";
		};

		const syncPlayerAvailability = () => {
			const hasPlaylist = playlist.length > 0;
			const hasPlaylistFallback = !hasPlaylist && Boolean(playlistId);
			player.classList.toggle("is-ready", hasPlaylist);
			player.classList.toggle("is-loading", hasPlaylistFallback);
			player.classList.toggle("is-empty", !hasPlaylist && !hasPlaylistFallback);
			playButton.disabled = !hasPlaylist;
			progress.disabled = !hasPlaylist;
			if (prevButton) {
				prevButton.disabled = playlist.length < 2;
			}
			if (nextButton) {
				nextButton.disabled = playlist.length < 2;
			}
			updateTrackIndex();
		};

		const updateMeta = track => {
			if (cover && track.cover) {
				cover.src = track.cover;
			}
			if (title) {
				title.textContent = track.title || "";
			}
			if (artist) {
				artist.textContent = track.artist || "";
			}
			updateTrackIndex();
		};

		const loadTrack = async (index, shouldAutoplay) => {
			if (!playlist.length) {
				return;
			}
			currentIndex = (index + playlist.length) % playlist.length;
			const track = playlist[currentIndex];
			audio.src = track.audio || track.src || track.url || "";
			if (!audio.src) {
				setStatus("播放失败，请检查音频地址");
				return;
			}
			audio.load();
			updateMeta(track);
			progress.value = 0;
			time.textContent = "00:00 / 00:00";
			setStatus("准备播放");
			if (shouldAutoplay) {
				try {
					await audio.play();
				} catch (error) {
					setStatus("无法自动播放，请点击播放");
				}
			}
		};

		syncPlayerAvailability();

		playButton.addEventListener("click", async () => {
			try {
				if (audio.paused) {
					await audio.play();
				} else {
					audio.pause();
				}
			} catch (error) {
				setStatus("播放失败，请检查音频地址");
			}
		});

		prevButton?.addEventListener("click", () => {
			loadTrack(currentIndex - 1, true);
		});

		nextButton?.addEventListener("click", () => {
			loadTrack(currentIndex + 1, true);
		});

		progress.addEventListener("input", event => {
			if (!audio.duration) {
				return;
			}
			audio.currentTime = audio.duration * (Number(event.target.value) / 100);
		});

		audio.addEventListener("play", () => {
			playButton.innerHTML = '<i class="fa fa-pause" aria-hidden="true"></i>';
			setStatus("正在播放");
		});

		audio.addEventListener("pause", () => {
			playButton.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
			if (!audio.ended) {
				setStatus("暂停中");
			}
		});

		audio.addEventListener("loadedmetadata", refreshTime);
		audio.addEventListener("timeupdate", refreshTime);
		audio.addEventListener("ended", () => {
			playButton.innerHTML = '<i class="fa fa-play" aria-hidden="true"></i>';
			progress.value = 0;
			if (playlist.length > 1) {
				loadTrack(currentIndex + 1, true);
				return;
			}
			setStatus("播放结束");
		});

		if (playlist.length) {
			updateMeta(playlist[0]);
			loadTrack(0, autoplay);
			return;
		}

		if (!playlistId) {
			refreshTime();
			return;
		}

		setStatus("歌单载入中");
		refreshTime();

		fetchLqPlaylistTracks(playlistId, {
			apiBase: playlistApiBase,
			core
		}).then(tracks => {
			playlist = tracks.map(track => ({
				...track,
				audio: track.audio || track.src || track.url || ""
			}));
			syncPlayerAvailability();

			if (!playlist.length) {
				setStatus("歌单暂时无法播放");
				return;
			}

			updateMeta(playlist[0]);
			loadTrack(0, autoplay);
		}).catch(() => {
			syncPlayerAvailability();
			setStatus("歌单暂时无法播放");
		});
	});
}

function readLqMusicCardData(card) {
	const readText = selector => String(card.querySelector(selector)?.textContent || "").trim();

	return {
		id: String(card.dataset.playlistId || "").trim(),
		title: String(card.dataset.playlistTitle || readText(".lq-music-card__title")).trim(),
		tag: String(card.dataset.playlistTag || readText(".lq-music-card__eyebrow")).trim(),
		description: String(card.dataset.playlistDescription || readText(".lq-music-card__desc")).trim(),
		trackCount: String(card.dataset.trackCount || "").trim(),
		cover: String(card.dataset.playlistCover || "").trim()
	};
}

function renderLqMusicPlayerMeta(host, item) {
	if (!host) {
		return;
	}

	const chips = [];
	if (item.tag) {
		chips.push(`<span class="lq-music-player-chip">${item.tag}</span>`);
	}
	if (item.trackCount) {
		chips.push(`<span class="lq-music-player-chip">${item.trackCount} tracks</span>`);
	}
	if (item.id) {
		chips.push(`<span class="lq-music-player-chip">ID ${item.id}</span>`);
	}

	host.innerHTML = chips.join("");
}

function applyLqMusicSelection(hero, item, options = {}) {
	if (!hero || !item) {
		return;
	}

	const label = hero.querySelector(".lq-music-player-label");
	const title = hero.querySelector(".lq-music-player-title");
	const copy = hero.querySelector(".lq-music-player-copy");
	let meta = hero.querySelector("[data-music-player-meta]");
	const jump = hero.querySelector("[data-music-player-jump]") || hero.querySelector(".lq-music-player-jump");

	if (!meta) {
		meta = document.createElement("div");
		meta.className = "lq-music-player-meta";
		meta.setAttribute("data-music-player-meta", "");
		copy?.insertAdjacentElement("afterend", meta);
	}

	if (label) {
		label.textContent = options.label || "正在播放";
	}
	if (title) {
		title.textContent = item.title || "把今天想听的歌放在这里";
	}
	if (copy) {
		copy.textContent = item.description || "切歌、看歌词、整理最近循环的声音，都在这一页完成。";
	}
	renderLqMusicPlayerMeta(meta, item);

	if (jump) {
		jump.textContent = options.jumpLabel || "切换到这张歌单";
		jump.setAttribute("href", options.jumpHref || "#music-playlists");
	}
}

function renderLqMusicCards(host, items) {
	if (!host) {
		return;
	}

	host.innerHTML = items.map((item, index) => {
		const title = String(item.title || `歌单 ${index + 1}`).trim();
		const tag = String(item.tag || (index === 0 ? "常听" : "歌单")).trim();
		const description = String(item.description || "把收藏的歌单慢慢铺开，给这一页一点能反复回来的理由。").trim();
		const trackCountAttr = item.trackCount ? ` data-track-count="${String(item.trackCount).replace(/"/g, "&quot;")}"` : "";
		const coverAttr = item.cover ? ` data-playlist-cover="${String(item.cover).replace(/"/g, "&quot;")}"` : "";

		return `<a class="lq-music-card${index === 0 ? " is-active" : ""}" href="#music-playlists" data-playlist-id="${String(item.id || "").replace(/"/g, "&quot;")}" data-playlist-title="${title.replace(/"/g, "&quot;")}" data-playlist-tag="${tag.replace(/"/g, "&quot;")}" data-playlist-description="${description.replace(/"/g, "&quot;")}"${trackCountAttr}${coverAttr}><div class="lq-music-card__eyebrow">${tag}</div><h2 class="lq-music-card__title">${title}</h2><p class="lq-music-card__desc">${description}</p><span class="lq-music-card__action">播放这张歌单</span></a>`;
	}).join("");
}

function normalizeLqMusicItems(data) {
	if (Array.isArray(data)) {
		return data;
	}
	if (data && Array.isArray(data.playlists)) {
		return data.playlists;
	}
	return [];
}

function getLqMusicCore() {
	const fallbackNormalize = payload => {
		const list = Array.isArray(payload)
			? payload
			: payload && Array.isArray(payload.playlist)
				? payload.playlist
				: [];
		return list
			.map((item, index) => {
				const src = String(item?.url || item?.src || item?.audio || "").trim();
				if (!src) {
					return null;
				}
				return {
					id: String(item?.id || index + 1),
					title: String(item?.name || item?.title || "Untitled Track").trim(),
					artist: Array.isArray(item?.artist) ? item.artist.join(" / ") : String(item?.artist || item?.author || "Unknown Artist").trim(),
					cover: String(item?.pic || item?.cover || "").trim(),
					src: src,
					lyric: typeof item?.lyric === "string" ? item.lyric : "",
					lrcUrl: String(item?.lrc || item?.lrcUrl || "").trim()
				};
			})
			.filter(Boolean);
	};
	const fallbackParse = input => {
		if (!input) {
			return [];
		}
		return String(input)
			.split(/\r?\n/)
			.reduce((result, line) => {
				const matches = Array.from(line.matchAll(/\[(\d{2,}):(\d{2})(?:\.(\d{2,3}))?\]/g));
				const text = String(line.replace(/\[\d{2,}:\d{2}(?:\.\d{2,3})?\]/g, "")).trim();
				if (!matches.length || !text) {
					return result;
				}
				matches.forEach(match => {
					const minutes = Number(match[1] || 0);
					const seconds = Number(match[2] || 0);
					const fraction = String(match[3] || "");
					const divisor = fraction.length === 3 ? 1000 : 100;
					result.push({
						time: minutes * 60 + seconds + (fraction ? Number(fraction) / divisor : 0),
						text: text
					});
				});
				return result;
			}, [])
			.sort((left, right) => left.time - right.time);
	};
	const fallbackFindActiveLyricIndex = (lyrics, currentTime) => {
		if (!Array.isArray(lyrics) || !lyrics.length) {
			return -1;
		}
		for (let index = lyrics.length - 1; index >= 0; index -= 1) {
			if (currentTime >= Number(lyrics[index].time || 0)) {
				return index;
			}
		}
		return -1;
	};
	const core = window.LqMusicCore || {};

	return {
		findLqActiveLyricIndex: typeof core.findLqActiveLyricIndex === "function" ? core.findLqActiveLyricIndex : fallbackFindActiveLyricIndex,
		normalizeLqPlaylist: typeof core.normalizeLqPlaylist === "function" ? core.normalizeLqPlaylist : fallbackNormalize,
		parseLqLyrics: typeof core.parseLqLyrics === "function" ? core.parseLqLyrics : fallbackParse
	};
}

async function fetchLqPlaylistTracks(playlistId, options = {}) {
	const normalizedPlaylistId = String(playlistId || "").trim();
	if (!normalizedPlaylistId) {
		return [];
	}

	const apiBase = String(options.apiBase || "").trim().replace(/\/$/, "");
	const core = options.core || getLqMusicCore();
	const requestUrls = apiBase
		? [
			`${apiBase}/player/playlist/${encodeURIComponent(normalizedPlaylistId)}`,
			`${apiBase}/playlist/${encodeURIComponent(normalizedPlaylistId)}`
		]
		: [
			`https://api.injahow.cn/meting/?server=netease&type=playlist&id=${encodeURIComponent(normalizedPlaylistId)}`
		];

	for (const requestUrl of requestUrls) {
		try {
			const response = await fetch(requestUrl);
			if (!response.ok) {
				continue;
			}
			const payload = await response.json();
			const tracks = core.normalizeLqPlaylist(payload);
			if (tracks.length) {
				return tracks;
			}
		} catch (error) {
			continue;
		}
	}

	return [];
}

function escapeLqMusicHtml(text) {
	return String(text || "")
		.replace(/&/g, "&amp;")
		.replace(/</g, "&lt;")
		.replace(/>/g, "&gt;")
		.replace(/"/g, "&quot;")
		.replace(/'/g, "&#39;");
}

function setLqMusicTabState(page, tabName) {
	if (!page) {
		return;
	}
	page.querySelectorAll("[data-music-tab]").forEach(tab => {
		tab.classList.toggle("is-active", tab.dataset.musicTab === tabName);
	});
	page.querySelectorAll("[data-music-panel]").forEach(panel => {
		panel.classList.toggle("is-active", panel.dataset.musicPanel === tabName);
	});
}

function initLqMusicPage() {
	const core = getLqMusicCore();

	document.querySelectorAll(".lq-music-page").forEach(page => {
		if (page.dataset.musicBound === "true") {
			return;
		}
		page.dataset.musicBound = "true";

		const hero = page.querySelector(".lq-music-hero");
		const stateHost = page.querySelector("[data-lq-music-state]");
		const playlistsHost = page.querySelector("[data-music-playlists]");
		const lyricsHost = page.querySelector("[data-music-lyrics]");
		const tracklistHost = page.querySelector("[data-music-tracklist]");
		const audio = page.querySelector("[data-music-audio]");
		const progress = page.querySelector("[data-music-progress]");
		const currentTimeHost = page.querySelector("[data-music-current-time]");
		const durationHost = page.querySelector("[data-music-duration]");
		const playButton = page.querySelector('[data-music-action="toggle"]');
		const prevButton = page.querySelector('[data-music-action="prev"]');
		const nextButton = page.querySelector('[data-music-action="next"]');

		if (!hero || !stateHost || !playlistsHost || !lyricsHost || !tracklistHost || !audio || !progress || !playButton) {
			return;
		}

		const apiBase = String(hero.getAttribute("data-music-api-base") || "").trim().replace(/\/$/, "");
		const defaultPlaylistId = String(hero.getAttribute("data-default-playlist-id") || "").trim();
		const playerCover = stateHost.querySelector("[data-music-cover]");
		const playerLabel = stateHost.querySelector(".lq-music-player-label");
		const playerTitle = stateHost.querySelector(".lq-music-player-title");
		const playerCopy = stateHost.querySelector(".lq-music-player-copy");
		const playerJump = stateHost.querySelector(".lq-music-player-jump");
		const playlistCache = new Map();
		const state = {
			activeLyricIndex: -1,
			currentIndex: 0,
			lyricToken: 0,
			playlistId: "",
			playlistMeta: null,
			tracks: []
		};

		const getCards = () => Array.from(playlistsHost.querySelectorAll(".lq-music-card[data-playlist-id]"));
		const getActiveCard = () => playlistsHost.querySelector(".lq-music-card.is-active[data-playlist-id]") || getCards()[0] || null;
		const updatePlayButton = isPlaying => {
			playButton.innerHTML = isPlaying
				? '<i class="fa fa-pause" aria-hidden="true"></i>'
				: '<i class="fa fa-play" aria-hidden="true"></i>';
			playButton.setAttribute("aria-label", isPlaying ? "Pause playback" : "Play current track");
		};
		const updateProgress = () => {
			const current = Number(audio.currentTime || 0);
			const duration = Number(audio.duration || 0);
			progress.value = duration ? ((current / duration) * 100).toFixed(3) : 0;
			if (currentTimeHost) {
				currentTimeHost.textContent = lqFormatTime(current);
			}
			if (durationHost) {
				durationHost.textContent = lqFormatTime(duration);
			}
		};
		const setHeroState = (item, options = {}) => {
			if (!item) {
				return;
			}
			applyLqMusicSelection(hero, item, {
				label: options.label || "正在播放",
				jumpHref: options.jumpHref || "#music-playlists",
				jumpLabel: options.jumpLabel || "切换到这张歌单"
			});
			if (playerCover && options.cover) {
				playerCover.src = options.cover;
			}
			if (playerTitle && options.title) {
				playerTitle.textContent = options.title;
			}
			if (playerCopy && options.copy) {
				playerCopy.textContent = options.copy;
			}
			if (playerLabel && options.label) {
				playerLabel.textContent = options.label;
			}
			if (playerJump && options.jumpLabel) {
				playerJump.textContent = options.jumpLabel;
			}
		};
		const setActiveCard = playlistId => {
			getCards().forEach(card => {
				card.classList.toggle("is-active", String(card.dataset.playlistId || "") === String(playlistId || ""));
			});
		};
		const renderTracklist = () => {
			if (!state.tracks.length) {
				tracklistHost.innerHTML = '<p class="lq-music-tracklist__placeholder">这一张歌单还没有可播放的曲目。</p>';
				return;
			}

			tracklistHost.innerHTML = state.tracks.map((track, index) => {
				const isActive = index === state.currentIndex;
				return `<button class="lq-music-track${isActive ? " is-active" : ""}" type="button" data-track-index="${index}"><span class="lq-music-track__meta"><span class="lq-music-track__title">${escapeLqMusicHtml(track.title)}</span><span class="lq-music-track__artist">${escapeLqMusicHtml(track.artist)}</span></span><span class="lq-music-track__index">${String(index + 1).padStart(2, "0")}</span></button>`;
			}).join("");
		};
		const renderLyrics = message => {
			if (message) {
				lyricsHost.innerHTML = `<p class="lq-music-lyrics__placeholder">${escapeLqMusicHtml(message)}</p>`;
				return;
			}
			if (!state.tracks.length) {
				lyricsHost.innerHTML = '<p class="lq-music-lyrics__placeholder">先选择一张歌单，再从这里看歌词。</p>';
				return;
			}
			if (!state.tracks[state.currentIndex]?.lyrics?.length) {
				lyricsHost.innerHTML = '<p class="lq-music-lyrics__placeholder">这首歌暂时没有拿到歌词，先听旋律也很好。</p>';
				return;
			}
			lyricsHost.innerHTML = state.tracks[state.currentIndex].lyrics.map((line, index) => {
				const isActive = index === state.activeLyricIndex;
				return `<button class="lq-music-lyrics__line${isActive ? " is-active lq-music-lyrics-stage__line--active" : ""}" type="button" data-lyric-index="${index}" data-lyric-time="${Number(line.time || 0)}">${escapeLqMusicHtml(line.text)}</button>`;
			}).join("");
		};
		const scrollActiveLyricIntoView = () => {
			const activeLine = lyricsHost.querySelector(".lq-music-lyrics__line.is-active");
			if (!activeLine) {
				return;
			}
			const offset = activeLine.offsetTop - (lyricsHost.clientHeight / 2) + (activeLine.clientHeight / 2);
			lyricsHost.scrollTo({
				top: Math.max(offset, 0),
				behavior: "smooth"
			});
		};
		const syncActiveLyric = () => {
			const currentTrack = state.tracks[state.currentIndex];
			const lyrics = currentTrack?.lyrics || [];
			const nextIndex = core.findLqActiveLyricIndex(lyrics, Number(audio.currentTime || 0));
			if (nextIndex === state.activeLyricIndex) {
				return;
			}
			state.activeLyricIndex = nextIndex;
			renderLyrics();
			scrollActiveLyricIntoView();
		};
		const setTrackMeta = track => {
			const playlistMeta = state.playlistMeta || readLqMusicCardData(getActiveCard() || document.createElement("div"));
			setHeroState({
				id: state.playlistId,
				tag: playlistMeta.tag,
				title: playlistMeta.title || "把今天想听的歌放在这里",
				description: playlistMeta.description,
				trackCount: String(state.tracks.length || "")
			}, {
				cover: track.cover || playlistMeta.cover || "/img/nav_logo.png",
				copy: `${track.artist}${playlistMeta.description ? " · " + playlistMeta.description : ""}`,
				jumpLabel: "切换到这张歌单",
				label: audio.currentTime > 0 && !audio.ended ? "已暂停" : "点击播放就开始",
				title: track.title
			});
		};
		const ensureTrackLyrics = async track => {
			if (!track) {
				return [];
			}
			if (Array.isArray(track.lyrics)) {
				return track.lyrics;
			}
			if (track.lyric) {
				track.lyrics = core.parseLqLyrics(track.lyric);
				if (track.lyrics.length) {
					return track.lyrics;
				}
			}
			if (track.lrcUrl) {
				const response = await fetch(track.lrcUrl);
				if (!response.ok) {
					throw new Error("lyric fetch failed");
				}
				track.lyric = await response.text();
				track.lyrics = core.parseLqLyrics(track.lyric);
				return track.lyrics;
			}
			track.lyrics = [];
			return track.lyrics;
		};
		const loadTrack = async (index, options = {}) => {
			if (!state.tracks.length) {
				return;
			}
			const normalizedIndex = (index + state.tracks.length) % state.tracks.length;
			const track = state.tracks[normalizedIndex];
			state.currentIndex = normalizedIndex;
			state.activeLyricIndex = -1;
			audio.src = track.src;
			audio.load();
			updateProgress();
			renderTracklist();
			renderLyrics("歌词加载中...");
			setTrackMeta(track);

			const lyricToken = state.lyricToken + 1;
			state.lyricToken = lyricToken;
			try {
				await ensureTrackLyrics(track);
				if (state.lyricToken !== lyricToken || state.currentIndex !== normalizedIndex) {
					return;
				}
				renderLyrics();
				syncActiveLyric();
			} catch (error) {
				if (state.lyricToken !== lyricToken || state.currentIndex !== normalizedIndex) {
					return;
				}
				track.lyrics = [];
				renderLyrics();
			}

			if (options.autoplay) {
				try {
					await audio.play();
				} catch (error) {
					updatePlayButton(false);
					if (playerLabel) {
						playerLabel.textContent = "点击播放就开始";
					}
				}
			} else {
				audio.pause();
				updatePlayButton(false);
				if (playerLabel) {
					playerLabel.textContent = "点击播放就开始";
				}
			}
		};
		const loadPlaylist = async (playlistId, options = {}) => {
			if (!playlistId) {
				return;
			}

			const card = options.card || playlistsHost.querySelector(`.lq-music-card[data-playlist-id="${playlistId}"]`);
			const cardData = card ? readLqMusicCardData(card) : {
				id: playlistId,
				title: "把今天想听的歌放在这里",
				tag: "歌单",
				description: "歌单已经切过来了，准备开始播放。",
				trackCount: "",
				cover: ""
			};
			state.playlistId = String(playlistId);
			state.playlistMeta = cardData;
			setActiveCard(playlistId);
			setHeroState(cardData, {
				copy: cardData.description || "歌单已经切过来了，准备开始播放。",
				jumpLabel: "切换到这张歌单",
				label: "歌单载入中",
				title: cardData.title || "把今天想听的歌放在这里"
			});

			if (!playlistCache.has(state.playlistId)) {
				const tracks = await fetchLqPlaylistTracks(state.playlistId, {
					apiBase,
					core
				});
				playlistCache.set(state.playlistId, tracks);
			}

			state.tracks = playlistCache.get(state.playlistId) || [];
			if (!state.tracks.length) {
				renderTracklist();
				renderLyrics("这张歌单暂时没有拿到可播放曲目。");
				if (playerLabel) {
					playerLabel.textContent = "这张歌单暂时还播不了";
				}
				return;
			}

			hero.classList.toggle("is-fallback", false);
			const nextIndex = Math.min(options.trackIndex ?? 0, state.tracks.length - 1);
			await loadTrack(nextIndex, {
				autoplay: options.autoplay === true
			});
		};
		const hydratePlaylistCards = async () => {
			if (!apiBase) {
				return;
			}
			try {
				const response = await fetch(`${apiBase}/playlists`);
				if (!response.ok) {
					throw new Error("playlist list fetch failed");
				}
				const items = normalizeLqMusicItems(await response.json()).filter(item => item && item.id);
				if (!items.length) {
					throw new Error("empty playlist payload");
				}
				renderLqMusicCards(playlistsHost, items);
			} catch (error) {
				hero.classList.add("is-fallback");
			}
		};

		playlistsHost.addEventListener("click", event => {
			const card = event.target.closest(".lq-music-card[data-playlist-id]");
			if (!card || !playlistsHost.contains(card)) {
				return;
			}
			event.preventDefault();
			setLqMusicTabState(page, "playlist");
			loadPlaylist(String(card.dataset.playlistId || ""), {
				autoplay: true,
				card: card
			});
		});

		playerJump?.addEventListener("click", () => {
			setLqMusicTabState(page, "playlist");
		});

		tracklistHost.addEventListener("click", event => {
			const trackButton = event.target.closest("[data-track-index]");
			if (!trackButton || !tracklistHost.contains(trackButton)) {
				return;
			}
			loadTrack(Number(trackButton.dataset.trackIndex || 0), {
				autoplay: true
			});
		});

		lyricsHost.addEventListener("click", event => {
			const line = event.target.closest("[data-lyric-time]");
			if (!line || !lyricsHost.contains(line)) {
				return;
			}
			audio.currentTime = Number(line.dataset.lyricTime || 0);
			updateProgress();
			syncActiveLyric();
		});

		playButton.addEventListener("click", async () => {
			if (!audio.src && defaultPlaylistId) {
				await loadPlaylist(defaultPlaylistId, {
					autoplay: true
				});
				return;
			}
			try {
				if (audio.paused) {
					await audio.play();
				} else {
					audio.pause();
				}
			} catch (error) {
				if (playerLabel) {
					playerLabel.textContent = "点击播放就开始";
				}
			}
		});

		prevButton?.addEventListener("click", () => {
			loadTrack(state.currentIndex - 1, {
				autoplay: true
			});
		});

		nextButton?.addEventListener("click", () => {
			loadTrack(state.currentIndex + 1, {
				autoplay: true
			});
		});

		progress.addEventListener("input", event => {
			if (!audio.duration) {
				return;
			}
			audio.currentTime = audio.duration * (Number(event.target.value || 0) / 100);
			updateProgress();
			syncActiveLyric();
		});

		audio.addEventListener("play", () => {
			updatePlayButton(true);
			if (playerLabel) {
				playerLabel.textContent = "正在播放";
			}
		});

		audio.addEventListener("pause", () => {
			updatePlayButton(false);
			if (playerLabel && audio.currentTime > 0 && !audio.ended) {
				playerLabel.textContent = "已暂停";
			}
		});

		audio.addEventListener("loadedmetadata", updateProgress);
		audio.addEventListener("timeupdate", () => {
			updateProgress();
			syncActiveLyric();
		});
		audio.addEventListener("ended", () => {
			loadTrack(state.currentIndex + 1, {
				autoplay: true
			});
		});
		audio.addEventListener("error", () => {
			updatePlayButton(false);
			if (playerLabel) {
				playerLabel.textContent = "播放时出了点小状况";
			}
		});

		hydratePlaylistCards()
			.finally(() => {
				const firstCard = getActiveCard();
				if (firstCard) {
					const item = readLqMusicCardData(firstCard);
					setActiveCard(item.id);
					loadPlaylist(item.id, {
						autoplay: false,
						card: firstCard
					});
				} else if (defaultPlaylistId) {
					loadPlaylist(defaultPlaylistId, {
						autoplay: false
					});
				}
			});
	});
}

function initLqMusicConsoleTabs() {
	document.querySelectorAll(".lq-music-page").forEach(page => {
		if (page.dataset.musicTabsBound === "true") {
			return;
		}
		page.dataset.musicTabsBound = "true";

		const tabs = Array.from(page.querySelectorAll("[data-music-tab]"));
		if (!tabs.length) {
			return;
		}

		tabs.forEach(tab => {
			tab.addEventListener("click", () => {
				setLqMusicTabState(page, tab.dataset.musicTab || "playlist");
			});
		});

		setLqMusicTabState(page, "playlist");
	});
}

function initLqLive2d() {
	const bubble = document.querySelector(".lq-live2d-bubble");
	if (!bubble || bubble.dataset.personalized === "true") {
		return;
	}
	bubble.dataset.personalized = "true";
	const hour = new Date().getHours();
	if (hour < 11) {
		bubble.textContent = "早上好！";
	} else if (hour < 18) {
		bubble.textContent = "下午也要继续推进呀。";
	} else {
		bubble.textContent = "晚上好，记得收尾和休息。";
	}
}

function initLqLive2dDock() {
	document.querySelectorAll("[data-live2d-root]").forEach(root => {
		if (root.dataset.live2dDockBound === "true") {
			return;
		}
		root.dataset.live2dDockBound = "true";

		const compactStorageKey = "Argon_Live2D_Compact";
		const bubble = root.querySelector("[data-live2d-bubble]");
		const avatar = root.querySelector("[data-live2d-avatar]");
		const themeButton = root.querySelector('[data-live2d-action="theme"]');
		const compactButton = root.querySelector('[data-live2d-action="compact"]');
		const idleMessages = [
			"把鼠标靠过来，我会把四个功能键亮出来。",
			"想回主页或者回顶部，点我旁边的小按钮就好。",
			"如果我有点挡视线，也可以先把我缩成小头像。"
		];
		let bubbleTimer = null;

		const getTimeGreeting = () => {
			const hour = new Date().getHours();
			if (hour < 11) {
				return "早上好，今天也一起慢慢推进。";
			}
			if (hour < 18) {
				return "下午好，要不要顺手切个模式或者回主页看看？";
			}
			return "晚上好，我在右下角陪你收尾。";
		};

		const setBubble = (text, timeout = 0) => {
			if (!bubble) {
				return;
			}
			window.clearTimeout(bubbleTimer);
			bubble.textContent = text;
			if (timeout > 0) {
				bubbleTimer = window.setTimeout(() => {
					bubble.textContent = root.classList.contains("is-compact")
						? "我先变成小头像在这里陪你。"
						: getTimeGreeting();
				}, timeout);
			}
		};

		const syncThemeButton = () => {
			if (!themeButton) {
				return;
			}
			const icon = themeButton.querySelector("i");
			if (!icon) {
				return;
			}
			if (document.documentElement.classList.contains("darkmode")) {
				icon.className = "fa fa-lightbulb-o";
				themeButton.setAttribute("aria-label", "切换到白天模式");
				themeButton.setAttribute("title", "切换到白天模式");
			} else {
				icon.className = "fa fa-moon-o";
				themeButton.setAttribute("aria-label", "切换到夜间模式");
				themeButton.setAttribute("title", "切换到夜间模式");
			}
		};

		const syncCompactButton = isCompact => {
			if (compactButton) {
				const label = isCompact ? "展开板娘" : "缩小板娘";
				compactButton.setAttribute("aria-label", label);
				compactButton.setAttribute("title", label);
			}
			if (avatar) {
				avatar.setAttribute("aria-label", isCompact ? "展开板娘" : "板娘头像");
				avatar.setAttribute("title", isCompact ? "展开板娘" : "板娘头像");
			}
		};

		const setCompact = isCompact => {
			root.classList.toggle("is-compact", isCompact);
			document.documentElement.classList.toggle("lq-live2d-compact", isCompact);
			localStorage.setItem(compactStorageKey, isCompact ? "true" : "false");
			syncCompactButton(isCompact);
			setBubble(
				isCompact ? "我先变成小头像在这里陪你。" : "我回来啦，鼠标靠近我就能看到小按钮。",
				2400
			);
		};

		root.querySelectorAll("[data-live2d-action]").forEach(button => {
			button.addEventListener("click", () => {
				const action = button.dataset.live2dAction;
				if (action === "theme") {
					toggleDarkmode();
					syncThemeButton();
					setBubble(document.documentElement.classList.contains("darkmode") ? "已经切到夜间模式。" : "已经回到白天模式。", 2000);
					return;
				}
				if (action === "home") {
					setBubble("带你回主页。", 1200);
					window.location.href = argonConfig.wp_path || "/";
					return;
				}
				if (action === "top") {
					setBubble("已经帮你回到顶部。", 1800);
					if (window.jQuery) {
						$("body,html").stop().animate({ scrollTop: 0 }, 500);
					} else {
						window.scrollTo({ top: 0, behavior: "smooth" });
					}
					return;
				}
				if (action === "compact") {
					setCompact(!root.classList.contains("is-compact"));
				}
			});
		});

		avatar?.addEventListener("click", () => {
			if (root.classList.contains("is-compact")) {
				setCompact(false);
				return;
			}
			setBubble(getTimeGreeting(), 1800);
		});

		root.addEventListener("mouseenter", () => {
			const message = root.classList.contains("is-compact")
				? "现在是小头像模式，点我就能展开。"
				: idleMessages[Math.floor(Math.random() * idleMessages.length)];
			setBubble(message, 2600);
		});

		if (localStorage.getItem(compactStorageKey) === "true") {
			root.classList.add("is-compact");
			document.documentElement.classList.add("lq-live2d-compact");
		}

		syncThemeButton();
		syncCompactButton(root.classList.contains("is-compact"));
		setBubble(root.classList.contains("is-compact") ? "我先变成小头像在这里陪你。" : getTimeGreeting());
	});
}

function initLqTagTree() {
	document.querySelectorAll("[data-tag-tree]").forEach(treeRoot => {
		if (treeRoot.dataset.treeBound === "true") {
			return;
		}
		treeRoot.dataset.treeBound = "true";

		const leaves = Array.from(treeRoot.querySelectorAll(".lq-tag-leaf"));
		const panels = Array.from(treeRoot.querySelectorAll("[data-tag-panel]"));
		const branches = Array.from(treeRoot.querySelectorAll("[data-branch-id]"));
		const detailShell = treeRoot.querySelector(".lq-tag-tree-detail");
		const initialLeaf = leaves.find(leaf => leaf.classList.contains("is-active")) || leaves[0];

		const selectTag = slug => {
			let activeLeaf = null;

			leaves.forEach(leaf => {
				const isActive = leaf.dataset.tagTarget === slug;
				leaf.classList.toggle("is-active", isActive);
				leaf.setAttribute("aria-pressed", isActive ? "true" : "false");
				if (isActive) {
					activeLeaf = leaf;
				}
			});

			panels.forEach(panel => {
				panel.classList.toggle("is-active", panel.dataset.tagPanel === slug);
			});

			const branchId = activeLeaf ? activeLeaf.dataset.branchTarget : "";
			branches.forEach(branch => {
				branch.classList.toggle("is-active", branch.dataset.branchId === branchId);
			});

			if (detailShell) {
				detailShell.dataset.activeBranch = branchId;
			}
		};

		leaves.forEach(leaf => {
			const slug = leaf.dataset.tagTarget;
			leaf.addEventListener("mouseenter", () => {
				selectTag(slug);
			});
			leaf.addEventListener("focus", () => {
				selectTag(slug);
			});
			leaf.addEventListener("click", () => {
				selectTag(slug);
			});
		});

		if (initialLeaf) {
			selectTag(initialLeaf.dataset.tagTarget);
		}
	});
}

function initLqEnhancements() {
	initLqPageState();
	initHeroTitleMotion();
	initLqTabTitleState();
	initLqHeroScroll();
	initLqPlaylistPlayer();
	initLqMusicPage();
	initLqMusicConsoleTabs();
	initLqCalendar();
	if (typeof window.initLqTechConstellation === "function") {
		window.initLqTechConstellation();
	}
	initLqLive2dDock();
	initLqTagTree();
}

if (document.readyState === "loading") {
	document.addEventListener("DOMContentLoaded", initLqEnhancements);
} else {
	initLqEnhancements();
}

$(document).on("pjax:complete", function () {
	initLqEnhancements();
});
