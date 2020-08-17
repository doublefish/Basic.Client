layui.use(['jquery', 'layer', 'form'], function () {
	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form;

	//提交
	$('.btn-tj').on('click', function () {
		var data = $('#form').GetParams();
		if (!data.Mobile) {
			return layer.msg('请填写手机号码', { icon: 5, time: 3000, anim: 6 });
		}
		if (!$.formVerify['mobilePhone'][0].test(data.Mobile)) {
			return layer.msg('手机号码格式不正确', { icon: 5, time: 3000, anim: 6 });
		}
		if (data.Score > 5) {
			return layer.msg('评分最高5分', { icon: 5, time: 3000, anim: 6 });
		}
		if (!data.Content) {
			return layer.msg('请填写反馈内容', { icon: 5, time: 3000, anim: 6 });
		}
		if (data.Content.length > 1000) {
			return layer.msg('反馈内容超出最大长度：1000，请精简一下', { icon: 5, time: 3000, anim: 6 });
		}

		//类型转换
		data.Score = data.Score.ToInt();

		$.ajax('/feedback/add', {
			type: 'post',
			contentType: 'application/json',
			data: JSON.stringify(data),
			dataType: 'json',
			success: function (json) {
				layer.msg('已提交');
				$('#Content').empty();
			}
		});
	});

});
