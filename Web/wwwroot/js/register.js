layui.use(['jquery', 'layer', 'form'], function () {
	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form;

	//推荐代码和推荐人Id
	var promoCode = $.GetUrlParam('promoCode');
	var promoterId = $.GetUrlParam('promoterId');

	//事件
	$('#Mobile').on('blur', function (e) {
		if (this.value.length !== 11) {
			return;
		}
		$.ajax('/existByMobile/' + this.value, {
			type: 'get',
			async: false,
			dataType: 'json',
			success: function (json) {
				if (json) {
					$('#' + e.target.id).css('color', '#FF0000');
					return layer.msg('手机号码已注册', { icon: 5, time: 3000, anim: 6 });
				} else {
					$('#' + e.target.id).css('color', '#000');
				}
			}
		});
	});

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
			if (value !== $('#Password').val()) {
				$('#ConfirmPassword').next('i').show();
				return '两次密码输入不一致';
			}
		}
	});

	//监听提交
	form.on('submit(submit)', function (data) {
		//推荐信息
		data.field.PromoCode = promoCode;
		if (promoterId) {
			data.field.PromoterId = promoterId.ToInt();
		}

		$.ajax('/signUp', {
			type: 'post',
			contentType: 'application/json',
			data: JSON.stringify(data.field),
			dataType: 'json',
			beforeSend: function (XMLHttpRequest) {
				$('#VCode').AddVCodeHeader(XMLHttpRequest, 'VCodeImg');
			},
			success: function (json) {
				layer.msg('注册成功', {
					icon: 1, time: 3000, anim: 0
				}, function () {
					window.location.href = '/login';
				});
			}
		});
	});

	//绑定生成图片验证码
	$('#VCodeImg').InitVCode();
	$('#VCodeChange').on('click', function () { $('#VCodeImg').trigger('click'); });
	//发送短信验证码
	$('#sendSmsCode').InitSmsCode({ type: 'signUp', mobileId: 'Mobile' });
});
