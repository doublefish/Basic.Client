layui.use(['jquery', 'layer', 'form'], function () {
	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form;

	$('.travel-top .tab-list span').click(function () {
		$(this).addClass('active').siblings().removeClass('active');
	});

	//加载精彩迪拜
	$.ajax('/recommend/listByTag?tagName=热门项目&take=5', {
		type: 'get',
		//async: false,
		dataType: 'json',
		success: function (json) {
			$.each(json, function (i, data) {
				var html = '';
				html += '<div class="swiper-slide">';
				html += '	<div class="fl img"><img src="' + (data.Cover ? data.Cover : '#') + '" /></div>';
				html += '	<div class="fr wenzi">';
				html += '		<small class="font12 color9">7天6晚游</small>';
				html += '		<h4>' + data.Name + '</h4>';
				html += '		<p>' + data.Overview + '</p>';
				html += '		<a href="/recommend/detail/' + data.Id + '">查看详情</a>';
				html += '	</div>';
				html += '</div>';
				$('#recommends').append(html);
			});
			var swiper = new Swiper('.swiper-container', {
				navigation: {
					nextEl: '.arrow-right',
					prevEl: '.arrow-left'
				}
			});
		}
	});

	//加载甄选旅程
	$.ajax('/product/listByTag?tagName=甄选旅程&take=6', {
		type: 'get',
		//async: false,
		dataType: 'json',
		success: function (json) {
			$.each(json, function (i, data) {
				var html = '';
				html += '<div class="tab-center tab-' + (i % 4 === 0 ? 'lager' : 'small') + '">';
				html += '	<a href="/product/detail/' + data.Id + '"><img src="' + (data.Cover1 ? data.Cover1 : data.Cover) + '"></a>';
				html += '	<div class="tab-padding">';
				html += '		<a href="/product/detail/' + data.Id + '" title="' + data.Name + '">' + data.Name + '</a>';
				html += '		<p>';
				if (data.HasDiscount) {
					html += '			<span class="original">原价￥' + data.Price.ToStringForFloat() + '</span>';
					html += '			<span>￥<b>' + data.DiscountPrice.ToStringForFloat() + '</b>起</span>';
				} else {
					html += '			<span>￥<b>' + data.Price.ToStringForFloat() + '</b>起</span>';
				}
				html += '		</p>';
				html += '	</div>';
				html += '</div>';
				$('#products').append(html);
			});
		}
	});

	/**
	 * 加载产品
	 * @param {String} container 容器
	 * @param {String} tag 标签
	 */
	var loadProducts = function (container, tag) {
		$.ajax('/product/listByTag?tagName=' + tag + '&take=6', {
			type: 'get',
			//async: false,
			dataType: 'json',
			success: function (json) {
				var html = '';
				$.each(json, function (i, data) {
					html += '<div class="col1">';
					html += '	<div class="cms-item minipackage">';
					html += '		<a href="/product/detail/' + data.Id + '" class="link" title="' + data.Name + '" target="_blank">';
					html += '			<div class="image-wrapper relative">';
					html += '				<div class="sale-tag-wrapper js-sale-tag-wrapper">';

					html += '					<div class="sale-tag-countdown js-sale-tag-countdown">';
					if (data.HasDiscount) {
						if (data.Discount.Remainings > 0) {
							html += '						<div class="line1 margin-top-10">限时特惠<span>仅<span class="count">' + data.Discount.Remainings + '</span> 套</span></div>';
							html += '						<div class="line2"></div>';
						} else if (data.Discount.RemainingDays > 0) {
							html += '						<div class="line1">限时特惠</div>';
							html += '						<div class="line2 margin-top-5"><div>剩余' + data.Discount.RemainingDays + '天</div></div>';
						} else {
							html += '						<div class="line1 margin-top-10">限时特惠</div>';
							html += '						<div class="line2"></div>';
						}
					} else if (data.TagNames.indexOf('独家定制')) {
						html += '						<div class="line1 margin-top-10">独家定制</div>';
						html += '						<div class="line2"></div>';
					} else {
						html += '						<div class="line1 end">限时特惠<span>已结束</span></div>';
						html += '						<div class="line2"></div>';
					}
					html += '					</div>';

					if (data.TagNames.indexOf('独家专享')) {
						html += '					<div class="sale-tag-second hotel">独家专享</div>';
					}

					html += '				</div>';
					html += '				<img src="' + (data.Cover ? data.Cover : '#') + '" class="main-img scroll-loading" width="320" height="240">';

					if (data.RecommendRate > 0.8) {
						html += '				<div class="percent-recommended">';
						html += '					<div class="cover"></div>';
						html += '					<div class="recommended"><span>' + Math.round(data.RecommendRate * 100) + '</span>%<p>会员推荐</p></div>';
						html += '				</div>';
					}

					html += '				<div class="sub-title-full">' + data.Overview + '</div>';
					html += '			</div>';
					html += '			<div class="detail">';
					html += '				<div class="caption">';
					html += '					<h3 class="title">' + data.Name + '</h3>';
					html += '				</div>';
					html += '				<div class="extra"></div>';
					if (tag === '境外') {
						html += '				<div class="icons">';
						html += '					<div class="round-icon left" title="机票"><span class="icon-airplane"></span></div>';
						html += '					<div class="round-icon left margin-left-5" title="住宿"><span class="icon-sig-trip"></span></div>';
						html += '					<div class="round-icon left margin-left-5" title="餐饮"><span class="icon-foot"></span></div>';
						html += '					<div class="round-icon left margin-left-5" title="交通"><span class="icon-car"></span></div>';
						html += '					<div class="round-icon left margin-left-5" title="导游"><span class="icon-daoy"></span></div>';
						html += '				</div>';
					}
					html += '			</div>';
					html += '		</a>';
					html += '	</div>';
					html += '</div>';
				});
				$('#products-' + container).html(html);
			}
		});
	};
	loadProducts('jingwai', '境外');
	loadProducts('jingnei', '境内');

	$('#video').bind('contextmenu', function () { return false; });
});
