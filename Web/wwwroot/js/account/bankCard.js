layui.use(['jquery', 'layer', 'form'], function () {
	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form;

	//加载银行
	$.ajax('/listBank', {
		type: 'get',
		dataType: 'json',
		success: function (json) {
			$('#BankId').CreateSelectOptions(json);
			form.render('select');
		}
	});

	//自定义验证规则
	form.verify({
		cardNumber: function (value) {
			if (value.length > 19) {
				return '请输入19位以内的银行卡号';
			}
		},
		cardholder: function (value) {
			if (value.length > 10) {
				return '请输入10个字符以内的持卡人姓名';
			}
		},
		branch: function (value) {
			if (value.length > 20) {
				return '请输入20个字符以内的支行名称';
			}
		}
	});

	//监听提交
	form.on('submit(submit)', function (data) {
		//类型转换
		data.field.BankId = data.field.BankId.ToInt();

		$.ajax('/account/bankCard/add', {
			type: 'post',
			contentType: 'application/json',
			data: JSON.stringify(data.field),
			dataType: 'json',
			success: function (json) {
				layer.msg('绑定成功', null, function () {
					window.location.href = '/account/security';
				});
			}
		});
	});
	//取消
	$('button.close').on('click', function () {
		window.location.href = '/account/security';
	});
});
