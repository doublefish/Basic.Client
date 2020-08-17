layui.use(['jquery', 'layer', 'form'], function () {
	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form;

	//监听提交
	form.on('submit(submit)', function (data) {
		$.ajax('/signIn', {
			type: 'post',
			contentType: 'application/json',
			data: JSON.stringify(data.field),
			dataType: 'json',
			beforeSend: function (XMLHttpRequest) {
				$('#VCode').AddVCodeHeader(XMLHttpRequest, 'VCodeImg');
			},
			success: function (json) {
				SetToken(json);
				if ($('#Remember').prop('checked')) {
					$.cookie('x-remember-agent', JSON.stringify({
						Username: data.field.Username,
						Password: data.field.Password
					}), { expires: 7, path: '/' });
				}
				//登入成功的提示与跳转
				layer.msg('登录成功', {
					offset: '15px'
					, icon: 1
					, time: 1000
				}, function () {
					window.location.href = '/index';
				});
			}
		});
	});

	//绑定生成图片验证码
	$('#VCodeImg').InitVCode();
	//发送短信验证码
	$('#sendSmsCode').InitSmsCode({ type: 'signIn', mobileId: 'Username' });

	var jsonString = $.cookie('x-remember-agent');
	if (jsonString) {
		var json = JSON.parse(jsonString);
		$('#Remember').prop('checked', true);
		$('#Username').val(json.Username);
		$('#Password').val(json.Password);
		$('#VCode').focus();
	}
	else {
		$('#Username').focus();
	}

	form.render();
});
