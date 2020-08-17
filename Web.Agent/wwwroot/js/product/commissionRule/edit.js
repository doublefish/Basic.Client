layui.use(['jquery', 'layer', 'form'], function () {
	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form;

	//加载年份
	for (i = 2020; i < 2022; i++) {
		$('#Year').CreateSelectOption(i + '年', i);
	}
	//加载月份
	for (i = 1; i < 13; i++) {
		$('#Month').CreateSelectOption(i + '月', i);
	}
	var now = new Date();
	$('#Year').val(now.getFullYear());
	$('#Month').val(now.getMonth() + 1);

	var productIds = $('#ProductIds').val().split(',');
	if (productIds.length > 1) {
		//批量添加
		form.render();
	} else {
		productId = productIds[0];
		$('#ProductId').val(productId);
		$('#divMine').show();
		$('#Year,#Month').on('change', function () {
			var year = $('#Year').val();
			var month = $('#Month').val();
			if (!year || !month) {
				$('#Mine').text('');
				return;
			}

			$.ajax('/commissionRule/getMine/' + productId, {
				type: 'get',
				data: { year: year, month: month },
				dataType: 'json',
				success: function (json) {
					if (json) {
						$('#Mine').text('比例：' + (json.AgentRate * 100) + '%，金额：￥' + json.AgentAmount.ToStringForFloat());
					} else {
						$('#Mine').text('未设置');
					}
				}
			});
		});

		var id = $('#Id').val();
		if (id > 0) {
			//加载信息
			$.ajax('/commissionRule/get/' + id, {
				type: 'get',
				dataType: 'json',
				success: function (json) {
					$('#Id').val(json.Id);
					$('#ProductId').val(json.ProductId);
					$('#Year').val(json.Year);
					$('#Month').val(json.Month);
					$('#Year,#Month').prop('disabled', true);
					if (json.Rate) $('#Rate').val(json.Rate * 100);
					if (json.Amount) $('#Amount').val(json.Amount);
					form.render();
					$('#Year').trigger('change');
				}
			});
		} else {
			$.ajax('/commissionRule/getLastest/' + productId, {
				type: 'get',
				dataType: 'json',
				success: function (json) {
					if (json) {
						var year = json.Year, month = json.Month;
						if (json.Month < 12) {
							month++;
						} else {
							year++;
							month = 1;
						}
						$('#Year').val(year);
						$('#Month').val(month);
						//$('#Year,#Month').prop('disabled', true);
					}
					form.render();
					$('#Year').trigger('change');
				}
			});
		}

		//监听事件
		form.on('select()', function (data) {
			$('#' + data.elem.id).trigger('change');
		});
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
		var action = 'add/' + productIds;
		var type = 'post';
		if (data.field.Id > 0) {
			action = 'update/' + data.field.Id;
			type = 'put';
		}

		//类型转换
		data.field.Year = data.field.Year.ToInt();
		data.field.Month = data.field.Month.ToInt();
		data.field.Rate = data.field.Rate.ToFloat() / 100;
		data.field.Amount = data.field.Amount.ToFloat();

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


