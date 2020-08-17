layui.use(['jquery', 'layer', 'form', 'laydate', 'slider'], function () {
	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form,
		laydate = layui.laydate,
		slider = layui.slider;

	var id = $('#Id').val();

	laydate.render({ elem: '#Date' });
	slider.render({
		elem: '#ContactTime',
		value: [9, 18],
		range: true,
		theme: '#247FFF',//主题色
		max: '24',
		change: function (value) {
			var $elem = $(this.elem);
			$elem.data('min', value[0]);
			$elem.data('max', value[1]);
		}
	});
	$('#ContactTime').data('min', 9);
	$('#ContactTime').data('max', 18);

	//数字控件
	$('input[type=number]').each(function (i, e) {
		$(this).next().on('click', function () {
			var $input = $(this).prev();
			var num = $input.val().ToInt();
			$input.val(num + 1);
			if (num === 0) {
				$input.prev().addClass('left-l');
			}
		});
		$(this).prev().on('click', function () {
			var $input = $(this).next();
			var num = $input.val().ToInt();
			if (num > 0) {
				$input.val(num - 1);
			}
			if (num === 1) {
				$input.prev().removeClass('left-l');
			}
		});
	});

	//提交
	$('.tj-btn').on('click', function () {
		var data = $('#form').GetParams();
		if (!data.Mobile) {
			return layer.msg('请填写手机号码', { icon: 5, time: 3000, anim: 6 });
		}
		if (data.Mobile && !$.formVerify['mobilePhone'][0].test(data.Mobile)) {
			return layer.msg('手机号码格式不正确', { icon: 5, time: 3000, anim: 6 });
		}
		if (!data.Date) {
			return layer.msg('请选择出发日期', { icon: 5, time: 3000, anim: 6 });
		}

		//类型转换
		data.ProductId = id.ToInt();
		data.Adults = data.Adults.ToInt();
		data.Children = data.Children.ToInt();

		$.ajax('/order/add', {
			type: 'post',
			contentType: 'application/json',
			data: JSON.stringify(data),
			dataType: 'json',
			success: function (json) {
				layer.msg('已提交');
				//$('#form').empty();
			}
		});
	});
});
