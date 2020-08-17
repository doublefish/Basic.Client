layui.use(['jquery', 'layer','form'], function () {
	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form;

	//绑定事件 
	$('#stars i').each(function (i, e) {
		var $this = $(e);
		$this.data('i', i);
		$this.on('mouseenter', function () {
			$(this).addClass('full')
				.prevAll().addClass('full').end()
				.nextAll().removeClass('full');
		}).on('mouseleave', function () {
			$('#stars i.active').addClass('full')
				.prevAll().addClass('full').end()
				.nextAll().removeClass('full');
		}).on('click', function () {
			var $this = $(this);
			$this.trigger('mouseenter');
			$this.addClass("active").siblings().removeClass("active");
			var star = $this.data('i') + 1;
			$('#Score').html(star + '分');
			$('#Score').data('value', star);
		});
	});
	$('#stars i').eq(4).trigger('click');

	//提交
	$('.bth-tij').on('click', function () {
		var data = $('#form').GetParams();
		data.Score = $('#Score').data('value');
		if (!data.Mobile) {
			return layer.msg('请填写手机号码', { icon: 5, time: 3000, anim: 6 });
		}
		if (!$.formVerify['mobilePhone'][0].test(data.Mobile)) {
			return layer.msg('手机号码格式不正确', { icon: 5, time: 3000, anim: 6 });
		}
		if (!data.Content) {
			return layer.msg('请填写反馈内容', { icon: 5, time: 3000, anim: 6 });
		}
		if (data.Content.length > 1000) {
			return layer.msg('反馈内容超出最大长度：1000，请精简一下', { icon: 5, time: 3000, anim: 6 });
		}

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
