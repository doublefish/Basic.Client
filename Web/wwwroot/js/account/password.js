layui.use(['jquery', 'layer', 'form'], function () {
	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form;

	$('#Mobile').text(Token.Data.Mobile);

	//新增验证规则
	$(form).AddVerifyConfig(['password']);
	//自定义验证规则
	form.verify({
		password: function (value) {
			if (!/^[a-zA-Z0-9]{6,16}$/.test(value)) {
				return '请输入6到16位由字母和数字组成的密码';
			}
		},
		repassword: function (value) {
			if (value !== $('#NewPassword').val()) {
				$('#ConfirmPassword').next('i').show();
				return '两次密码输入不一致';
			}
		}
	});

	//监听提交
	form.on('submit(submit)', function (data) {
		$.ajax('/account/password/change', {
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
