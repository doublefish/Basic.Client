layui.use(['jquery', 'layer', 'form'], function () {
	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form;

	$('#Mobile-Show').text(Token.Data.Mobile);

	//新增验证规则
	$(form).AddVerifyConfig(['password']);
	//自定义验证规则
	form.verify({
		password: function (value) {
			if (!/^[a-zA-Z0-9]{6,16}$/.test(value)) {
				return '请输入由字母和数字组成且长度是6到16位的密码';
			}
		},
		repassword: function (value) {
			if (value !== $('#Password').val()) {
				return '两次密码输入不一致';
			}
		}
	});

	//监听提交
	form.on('submit(submit)', function (data) {
		$.ajax('/personal/password/change', {
			type: 'put',
			contentType: 'application/json',
			data: JSON.stringify(data.field),
			dataType: 'json',
			success: function (json) {
				layer.msg('修改成功', { end: function () { Logout(); } });
			}
		});
		return false;
	});

	//绑定生成图片验证码
	$('#VCodeImg').InitVCode();
	//发送短信验证码
	$('#sendSmsCode').InitSmsCode({ type: 'changePassword' });
});
