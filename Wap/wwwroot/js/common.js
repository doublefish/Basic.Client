/**
 * 当前登录用户信息
 */
var User = null;

/**
 * 获取当前登录用户信息
 * @returns {Object} 用户信息
 */
var GetUser = function () {
	$.ajax('/account/get', {
		type: 'get',
		async: false,
		dataType: 'json',
		success: function (json) {
			User = json;
		}
	});
	return User;
};

(function (doc, win) {
	var docEl = doc.documentElement,
		resizeEvt = 'orientationchange' in window ? 'orientationchange' : 'resize', recalc = function () {
			var clientWidth = docEl.clientWidth;
			if (!clientWidth) return;
			clientWidth = clientWidth > 768 ? 768 : clientWidth; docEl.style.fontSize = 100 * (clientWidth / 375) + 'px';
		};
	if (!doc.addEventListener) return; win.addEventListener(resizeEvt, recalc, false);
	recalc();
})(document, window);

$(function () {
	//首页
	$('header .nav-btn').click(function () {
		$('.nav-left').addClass('trans0');
	});
	$('.shade-center').click(function () {
		$('.nav-left').removeClass('trans0');
	});
	//产品详情
	$('.toggle-btn').click(function () {
		$(this).toggleClass('active');
		$('.light-img').slideToggle(1000);
	});
	//滚动监听
	$(window).scroll(function () {
		var sc = $(document).scrollTop();
		if (sc > 380 && sc < 700) {
			$('.product-nav').show();
			$('.product-nav-list ul li:eq(0)').addClass('active').siblings().removeClass('active');
		} else if (sc > 700 && sc < 1500) {
			$('.product-nav').show();
			$('.detail-nav').show();
			$('.detail-nav-list ul li:eq(0)').addClass('active').siblings().removeClass('active');
			$('.product-nav-list ul li:eq(1)').addClass('active').siblings().removeClass('active');
		} else if (sc > 1500 && sc < 2000) {
			$('.product-nav').show();
			$('.detail-nav').show();
			$('.detail-nav-list ul li:eq(1)').addClass('active').siblings().removeClass('active');
		} else if (sc < 380) {
			$('.product-nav').hide();
			$('.detail-nav').hide();
		}

		if (sc > 45) {
			$('.detial-fixed').show();
		} else {
			$('.detial-fixed').hide();
		}
	});
	$('.detail-nav-list li').click(function () {
		$(this).addClass('active').siblings().removeClass('active');
	});
	//底部栏切换
	$('footer li a').each(function (i, e) {
		var $this = $(e);
		var href = $this.attr('href').substr(1);
		if (href.startsWith(Path)) {
			$this.parent().addClass('active');
			return false;
		}
	});

	//返回
	$('#back').click(function () {
		window.location = document.referrer;
	});

	$('#backSrdz').click(function () {
		//var isPageHide = false;
		//window.addEventListener('pageshow', function () {
		//	if (isPageHide) { window.location.reload(); }
		//});
		//window.addEventListener('pagehide', function () {
		//	isPageHide = true;
		//});
		window.history.go(-1);
	});

	//客服
	$('#chatQQ').click(function () {
		window.location.href = "http://wpa.qq.com/msgrd?v=3&uin=000000&site=qq&menu=yes";
	});
});
