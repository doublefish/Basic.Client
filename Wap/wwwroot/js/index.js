layui.use(['jquery', 'layer', 'form'], function () {
	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form;

	var swiper = new Swiper('.swiper-container', {
		autoplay: {
			stopOnLastSlide: true
		},
		pagination: {
			el: '.swiper-pagination',
			clickable: true,
		}
	});

	//驴友推荐
	$.ajax('/product/listByRecommends?take=11', {
		type: 'get',
		//async: false,
		dataType: 'json',
		success: function (json) {
			var html = '';
			$.each(json, function (i, data) {
				html += '<div class="swiper-slide">';
				html += '	<a href="/product/detail/' + data.Id + '" class="slide-center">';
				html += '		<div class="slide-img"><img src="' + (data.Cover ? data.Cover : '/img/undefined.png') + '" /></div>';
				html += '		<h4>' + data.Name + '</h4>';
				if (data.HasDiscount) {
					html += '		<p><span><b>￥' + data.DiscountPrice.ToStringForFloat() + '</b></span>原价<i>¥' + data.Price.ToStringForFloat() + '</i></p>';
				} else {
					html += '		<p><span><b>￥' + data.Price.ToStringForFloat() + '</b></span></p>';
				}
				html += '	</a>';
				html += '</div>';
			});
			$('#products-tuijian > div.swiper-wrapper').html(html);
			var swiper = new Swiper('#products-tuijian', {
				pagination: {
					el: '.swiper-pagination1',
					clickable: true,
					renderBullet: function (index, className) {
						return '<span class="' + className + '">' + (index + 1) + '</span>';
					}
				}
			});
		}
	});

	//热门目的地
	$.ajax('/listHotDestination?take=10', {
		type: 'get',
		//async: false,
		dataType: 'json',
		success: function (json) {
			var html = '';
			$.each(json, function (i, data) {
				html += '<div class="swiper-slide destinations-section">';
				html += '	<a href="/product/list/?destination=' + data.Id + '" class="hot-img">';
				html += '		<div class="img"><img src="' + (data.Cover ? data.Cover : '/img/undefined.png') + '" /></div>';
				html += '		<div class="css-table name">';
				html += '			<div class="css-cell">' + data.Region.Name + '</div>';
				html += '		</div>';
				html += '	</a>';
				html += '</div>';
			});
			$('#destinations-hot > div.swiper-wrapper').html(html);
			var swiper = new Swiper('#destinations-hot', {
				slidesPerView: 2,
				spaceBetween: 5,
				freeMode: true
			});
		}
	});

	/**
	 * 加载产品
	 * @param {String} container 容器
	 * @param {Number} typeName 类型名称
	 * @param {String} tagName 标签名称
	 */
	var loadProducts = function (container, typeName, tagName) {
		$.ajax('/product/listByTag?tagName=' + tagName + '&take=6', {
			type: 'get',
			//async: false,
			dataType: 'json',
			success: function (json) {
				var html = '';
				$.each(json, function (i, data) {
					html += '<div class="swiper-slide jingnei">';
					html += '	<a href="/product/detail/' + data.Id + '" class="jingnei-img">';
					html += '		<div class="img"><img src="' + (data.Cover ? data.Cover : '/img/undefined.png') + '" /><div class="sub-name">' + data.ThemeNames.join('/') + '</div></div>';
					html += '		<h4>' + data.Name + '</h4>';
					html += '		<div class="price"><b>￥' + (data.HasDiscount ? data.DiscountPrice : data.Price).ToStringForFloat() + '</b>/人起</div>';
					html += '	</a>';
					html += '</div>';
				});
				$('#products-' + container + '> div.swiper-wrapper').html(html);
				var swiper = new Swiper('#products-' + container, {
					slidesPerView: 'auto',
					spaceBetween: 10,
					freeMode: true
				});
			}
		});
	};
	loadProducts('jingwai', null, '境外');
	loadProducts('jingnei', null, '境内');

	/**
	 * 加载精彩推荐
	 * @param {String} container 容器
	 * @param {Number} typeName 类型名称
	 * @param {String} tagName 标签名称
	 */
	var loadRecommends = function (container, typeName, tagName) {
		$.ajax('/recommend/listByTag?typeName=' + typeName + '&tagName=' + tagName + '&take=6', {
			type: 'get',
			//async: false,
			dataType: 'json',
			success: function (json) {
				var html = '';
				$.each(json, function (i, data) {
					html += '<div class="swiper-slide jingnei">';
					html += '	<a href="/product/detail/' + data.Id + '" class="jingnei-img">';
					html += '		<div class="img"><img src="' + (data.Cover ? data.Cover : '/img/undefined.png') + '" /></div>';
					html += '		<h4>' + data.Name + '</h4>';
					html += '	</a>';
					html += '</div>';
				});
				$('#recommends-' + container + '> div.swiper-wrapper').html(html);
				var swiper = new Swiper('#recommends-' + container, {
					slidesPerView: 'auto',
					spaceBetween: 10,
					freeMode: true
				});
			}
		});
	};
	loadRecommends('jingdian', '景点', null);
	loadRecommends('jiudian', '酒店', null);

	//list();
	$('input[type=search]').on('keyup', function (e) {
		lastTime = e.timeStamp;
		var value = $(this).val();
		setTimeout(function () {
			if (lastTime - e.timeStamp == 0) {
				Params.name = value;
				console.log(Params.name);
				//list();
			}
		}, 800);
	});

	$('.to-desktop').attr('href', Config.WebSiteUrl);
});
