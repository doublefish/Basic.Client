layui.use(['jquery', 'layer', 'form'], function () {
	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form;

	//加载年份
	for (i = 2020; i < 2022; i++) {
		$('#Year').CreateSelectOption(i + '年', i);
		$('#Year').val(new Date().getFullYear());
	}
	//加载月份
	for (i = 1; i < 13; i++) {
		$('#Month').CreateSelectOption(i + '月', i);
		$('#Month').val(new Date().getMonth() + 1);
	}

	var productIds = $('#ProductIds').val().split(',');
	var id = $('#Id').val();
	if (id > 0) {
		//加载信息
		$.ajax('/commissionRule/get/' + id, {
			type: 'get',
			dataType: 'json',
			success: function (json) {
				$('#Id').val(json.Id);
				$('#ProductIds').val(json.ProductId);
				$('#Year').val(json.Year);
				$('#Month').val(json.Month);
				$('#Year,#Month').prop('disabled', true);
				if (json.AgentRate) $('#AgentRate').val(json.AgentRate * 100);
				if (json.AgentAmount) $('#AgentAmount').val(json.AgentAmount);
				if (json.PersonalRate) $('#PersonalRate').val(json.PersonalRate * 100);
				if (json.PersonalAmount) $('#PersonalAmount').val(json.PersonalAmount);
				form.render();
			}
		});
	} else {
		if (productIds.length === 1) {
			$.ajax('/commissionRule/getLastest/' + productIds[0], {
				type: 'get',
				dataType: 'json',
				success: function (json) {
					if (json) {
						if (json.Month < 12) {
							$('#Year').val(json.Year);
							$('#Month').val(json.Month + 1);
						} else {
							$('#Year').val(json.Year + 1);
							$('#Month').val(1);
						}
						//$('#Year,#Month').prop('disabled', true);
						form.render();
					}
				}
			});
		}
		form.render();
	}

	//自定义验证规则
	form.verify({
		rate: function (value) {
			if (value) {
				var error = form.config.verify['number'](value);
				if (error) {
					return error;
				}
				if (value < 0 || value > 100) {
					return '比例超出范围：0~100';
				}
			}
		},
		amount: function (value) {
			if (value) {
				var error = form.config.verify['number'](value);
				if (error) {
					return error;
				}
				if (value < 0) {
					return '金额不能小于零';
				}
			}
		},
		note: function (value) {
			if (value.length > 200) {
				return '请输入200个字符以内的标题';
			}
		}
	});

	//监听提交
	form.on('submit(submit)', function (data) {
		var action = 'add/' + data.field.ProductIds;
		var type = 'post';
		if (data.field.Id > 0) {
			action = 'update/' + data.field.Id;
			type = 'put';
		}

		//类型转换
		data.field.Year = data.field.Year.ToInt();
		data.field.Month = data.field.Month.ToInt();
		data.field.AgentRate = data.field.AgentRate ? data.field.AgentRate.ToFloat() / 100 : 0;
		data.field.AgentAmount = data.field.AgentAmount ? data.field.AgentAmount.ToFloat() : 0;
		data.field.PersonalRate = data.field.PersonalRate ? data.field.PersonalRate.ToFloat() / 100 : 0;
		data.field.PersonalAmount = data.field.PersonalAmount ? data.field.PersonalAmount.ToFloat() : 0;

		$.ajax('/commissionRule/' + action, {
			type: type,
			contentType: 'application/json',
			data: JSON.stringify(data.field),
			dataType: 'json',
			success: function (json) {
				parent.layer.msg('已保存');
				parent.layui.list.reload();
				parent.layer.close(parent.layer.getFrameIndex(window.name));
			}
		});
	});
});


