layui.use(['jquery', 'layer', 'form'], function () {
	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form;

	//监听提交
	form.on('submit(submit)', function (data) {
		$.ajax('/account/updateEmail', {
			type: 'put',
			contentType: 'application/json',
			data: JSON.stringify(data.field),
			dataType: 'json',
			beforeSend: function (XMLHttpRequest) {
				$('#VCode').AddVCodeHeader(XMLHttpRequest, 'VCodeImg');
			},
			success: function (json) {
				layer.msg('修改成功', null, function () {
					window.location.href = '/account/security';
				});
			}
		});
	});
	//取消
	$('button.close').on('click', function () {
		window.location.href = '/account/security';
	});

	//绑定生成图片验证码
	$('#VCodeImg').InitVCode();
	$('#VCodeChange').on('click', function () { $('#VCodeImg').trigger('click'); });
	//发送短信验证码
	$('#sendSmsCode').InitSmsCode({ type: 'changePassword', mobile: Token.Data.Mobile });
});
