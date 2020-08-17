layui.use(['jquery', 'layer', 'form', 'laydate'], function () {
	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form,
		laydate = layui.laydate;

	var id = $('#Id').val();

	laydate.render({ elem: '#date' });

	$.ajax('/product/get/' + id, {
		type: 'get',
		//async: false,
		dataType: 'json',
		success: function (json) {
			$('#Name').text(json.Name ? json.Name : '');
			$('#DestinationNames').text(json.DestinationNames ? json.DestinationNames : '');
			$('#DeparturenName').text(json.DeparturenNames ? json.DeparturenNames : '');
			$('#Price').text(json.Price.ToStringForFloat() ? json.Price.ToStringForFloat() : '');
			$('#Overview').html(json.Overview ? json.Overview.replace(/\n/g, '<br />') : '');
			$('#Stay').text(json.Stay ? json.Stay : '');
			$('#Traffic').text(json.Traffic ? json.Traffic : '');
			$('#Attraction').text(json.Attraction ? json.Attraction : '');
			$('#Meal').text(json.Meal ? json.Meal : '');
			$('#FreeTime').text(json.FreeTime ? json.FreeTime : '');
			$('#ServiceLanguage').text(json.ServiceLanguage ? json.ServiceLanguage : '');
			//$('#Feature').html(json.Feature ? json.Feature : '');
			//$('#Cost').html(json.Cost ? json.Cost : '');
			//$('#Notice').html(json.Notice ? json.Notice : '');
			//$('#Visa').html(json.Visa ? json.Notice : '');
			//$('#Book').html(json.Book ? json.Notice : '');
			$('#Title').html(json.Title ? json.Title : '');
			$('.spDes').html(json.DeparturenName ? json.DeparturenName : '');
			$('.spDep').html(json.DestinationNames ? json.DestinationNames : '');

			$.each(json.Images, function (i, data) {
				$('.swiper-wrapper').append('<div class="swiper-slide"><img src="' + data + '" /></div>');
			});
			var swiper = new Swiper('.swiper-container', {
				loop: true, //是否循环，false不循环
				effect: 'none',//切换效果，不要可删除
				pagination: {
					el: '.swiper-pagination',
					type: 'fraction'
				}
			});


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
				if (data.Day !== day) {
					day = data.Day;
					html += '<ul class="layui-timeline" id="Route-Day' + data.Day + '">';
					html += '<li class="layui-timeline-item">';
					html += '<i class="layui-icon layui-timeline-axis top-title"><b>D' + data.Day + '</b></i>';
					html += '<div class="layui-timeline-content layui-text">';
					html += '	<h3 class="layui-timeline-title font22 mb30 pt10">' + data.Title + '</h3>';
					html += '</div>';
					html += '</li>';
					html += '</ul>';
					$('#Routes').append(html);
				} else {
					var img = '';
					var note = '';
					switch (data.Type) {
						case 1: img = 'nr_qc'; break;
						case 2: img = 'nr_yc'; note = '用餐'; break;
						case 3: img = 'nr_yw'; note = '活动'; break;
						case 4: img = 'nr_yc'; break;
						case 9: img = 'nr_yw'; break;
						default: break;
					}
					html += '<li class="layui-timeline-item">';
					html += '<i class="layui-icon layui-timeline-axis"><img src="/img/' + img + '.png" /></i>';
					html += '<div class="layui-timeline-content layui-text">';
					if (data.Title) {
						html += '<h3 class="layui-timeline-title font22 mb30 pt10">' + data.Title + '</h3>';
					}
					if (data.Content) {
						html += '<p>' + data.Content + '</p>';
					}
					if (data.Minutes > 0) {
						html += '<small class="txt-s12">' + note + '时间约' + data.Minutes + '分钟</small>';
					}
					html += '</div>';
					html += '</li>';
					$('#Route-Day' + data.Day).append(html);
				}
			});
		}
	});
	form.render();
});
