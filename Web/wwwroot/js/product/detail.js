layui.use(['jquery', 'layer', 'form', 'laydate'], function () {
	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form,
		laydate = layui.laydate;

	laydate.render({ elem: '#Date' });

	$(window).scroll(function () {
		var sc = $(document).scrollTop();
		//if (sc > 1150) {
		//	$('.number-list').addClass('active');
		//	$('.feature-top').addClass('active');
		//} else {
		//	$('.number-list').removeClass('active');
		//	$('.feature-top').removeClass('active');
		//}
		if (sc > 1150 && sc < 2500) {
			$('.feature-wrap').addClass('active');
			//$('.program_ul').addClass('active');
		} else if (sc > 2500 && sc < 3500) {
			$('.feature-wrap').addClass('active');
			//$('.program_ul').addClass('active');
			$('.circle').addClass('active');
		} else {
			$('.feature-wrap').removeClass('active');
			//$('.program_ul').removeClass('active');
			$('.circle').removeClass('active');
		}
	});
	$('.feature-top li').click(function () {
		$(this).addClass('active').siblings().removeClass('active');
	});

	$('.feature-top li,.program_ul .service li').click(function () {
		$(this).addClass('active').siblings().removeClass('active')
	});
	$('.circle .program_nav li').click(function () {
		$(this).addClass('actived').siblings().removeClass('actived')
	});

	//数字控件
	$('input[type=number]').each(function (i, e) {
		$(this).next().find('i').on('click', function () {
			var $this = $(this);
			var $input = $this.parent().prev();
			var num = $input.val().ToInt();
			if ($this.attr('class') === 'up') {
				$input.val(num + 1);
			} else if (num > 0) {
				$input.val(num - 1);
			}
		});
	});

	var id = $('#Id').val();
	$.ajax('/product/get/' + id, {
		type: 'get',
		//async: false,
		dataType: 'json',
		success: function (json) {
			$('#Name0,#Name1').text(json.Name);
			$('#Name').html(json.Name + '<span>' + json.TypeNote + '</span>');
			$('#DestinationNames').html(json.DestinationNames.join('&nbsp;'));
			$('#DeparturenName').text(json.DeparturenName);
			$('#Price,#Price0').text(json.Price.ToStringForFloat());
			$('#Overview,#Overview0').html(json.Overview.replace(/\n/g, '<br />'));
			$('#Stay').text(json.Stay);
			$('#Traffic').text(json.Traffic);
			$('#Attraction').text(json.Attraction);
			$('#Meal').text(json.Meal);
			$('#FreeTime').text(json.FreeTime);
			$('#ServiceLanguage').text(json.ServiceLanguage);
			//$('#Feature').html(json.Feature);
			//$('#Cost').html(json.Cost);
			//$('#Notice').html(json.Notice);
			//$('#Visa').html(json.Visa);
			//$('#Book').html(json.Book);
			$.each(json.Images, function (i, data) {
				$('.swiper-wrapper').append('<div class="swiper-slide"><img src="' + data + '" /></div>');
			});

			var galleryThumbs = new Swiper('.gallery-thumbs', {
				spaceBetween: 10,
				slidesPerView: 4,
				touchRatio: 0.2,
				loop: true,
				loopedSlides: 5, //looped slides should be the same
				slideToClickedSlide: true
			});
			var galleryTop = new Swiper('.gallery-top', {
				spaceBetween: 10,
				loop: true,
				loopedSlides: 5, //looped slides should be the same
				navigation: {
					nextEl: '.swiper-button-next',
					prevEl: '.swiper-button-prev',
				}
			});
			galleryTop.controller.control = galleryThumbs;
			galleryThumbs.controller.control = galleryTop;
			form.render();
		}
	});
	//内容
	var properties = ['Feature', 'Notice', 'Cost', 'Visa', 'Book'];
	$.each(properties, function (i, data) {
		$.ajax('/product/getDetail/' + id + '/' + data, {
			type: 'get',
			dataType: 'json',
			success: function (json) {
				$('#' + data).html(json ? json : '');
			}
		});
	});
	//行程
	$.ajax('/product/listRoute/' + id, {
		type: 'get',
		dataType: 'json',
		success: function (json) {
			var day = 0;
			$.each(json, function (i, data) {
				var html = '';
				$('.program_nav').append('<li class="day_sym" id="d' + data.Day + '"><a href="#"><div class="day_sym_div"><span></span></div>D' + data.Day + '</a></li>');
				$('#d' + data.Day).on('click', function () {
					$('html,body').animate({ scrollTop: $('#Route-Day').offset().top - 8 }, 200)
				});
				if (data.Day !== day) {
					day = data.Day;
					html += '<ul class="layui-timeline" id="Route-Day' + data.Day + '">';
					html += '	<li class="layui-timeline-item">';
					html += '		<i class="layui-icon layui-timeline-axis d1"><b>D' + data.Day + '</b></i>';
					html += '		<div class="layui-timeline-content layui-text title-h3">';
					html += '			<h3 class="layui-timeline-title font22 mb30 pt10">' + data.Title + '</h3>';
					html += '		</div>';
					html += '	</li>';
					html += '</ul>';
					$('#Routes').append(html);
				} else {
					var img = '';
					var note = '';
					switch (data.Type) {
						case 1: img = 'xq_banji'; break;
						case 2: img = 'xq_cy'; note = '用餐'; break;
						case 3: img = 'xq_yw'; note = '活动'; break;
						case 4: img = 'xq_zs'; break;
						case 9: img = 'xq_ts'; break;
						default: break;
					}
					html += '<li class="layui-timeline-item">';
					html += '	<i class="layui-icon layui-timeline-axis"><img src="/img/' + img + '.png" /></i>';
					html += '	<div class="layui-timeline-content layui-text">';
					if (data.Title) {
						//html += '	<h3 class="layui-timeline-title">08:30</h3>';
						//html += '	<h3 class="font22">前往：首都之门（车观）</h3>';
						html += '	<h3 class="layui-timeline-title">' + data.Title + '</h3>';
					}
					if (data.Content) {
						html += '	<p>' + data.Content + '</p>';
					}
					if (data.Minutes > 0) {
						html += '	<p class="date">' + note + '时间约' + data.Minutes + '分钟</p>';
					}
					html += '	</div>';
					html += '</li>';
					$('#Route-Day' + data.Day).append(html);
				}
			});
		}
	});

	//监听提交
	form.on('submit(submit)', function (data) {
		//类型转换
		data.field.ProductId = id.ToInt();
		data.field.Adults = data.field.Adults.ToInt();
		data.field.Children = data.field.Children.ToInt();

		$.ajax('/order/add', {
			type: 'post',
			contentType: 'application/json',
			data: JSON.stringify(data.field),
			dataType: 'json',
			success: function (json) {
				layer.msg('预定成功，请等待客服与您联系！', { icon: 1, time: 3000, anim: 0 });
				$('#Mobile').val('');
			}
		});
	});
});
