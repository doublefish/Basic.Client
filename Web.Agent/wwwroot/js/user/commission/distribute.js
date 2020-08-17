layui.use(['jquery', 'layer', 'form'], function () {
	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form;

	var id = $('#Id').val();

	/**
	 * 加载预览
	 * @param {Number} id id
	 * @param {Object} data 佣金规则
	 */
	var loadPrevview = function (id, data) {
		$.ajax('/user/commission/distribute/preview/' + id, {
			type: 'put',
			contentType: 'application/json',
			data: JSON.stringify(data),
			dataType: 'json',
			success: function (json) {
				if (json) {
					$('#divAgent0,#divAgent1').show();
					$('#AgentName').text(json.Agent.Name);
					if (json.Agent.Parent) {
						$('#AgentParentName').text(json.Agent.Parent.Name);
					}
					$('#UserUsername').text(json.AgentUser.Username);
					$('#UserFullName').text(json.AgentUser.FullName);
					$('#UserRate').text((json.Rate * 100).ToStringForFloat() + '%');
					$('#UserAmount').text('￥' + json.Amount.ToStringForFloat());
				}
				form.render();
			}
		});
	};

	var Rate = 0, Amount = 0;

	//加载信息
	$.ajax('/user/commission/get/' + id, {
		type: 'get',
		dataType: 'json',
		success: function (json) {
			Rate = json.Rate * 100;
			Amount = json.Amount;
			$('#Id').val(json.Id);
			$('#OrderNumber').text(json.OrderNumber);
			$('#OrderAmount').text('￥' + json.OrderAmount.ToStringForFloat());
			$('#AgentRate').text((json.Rate * 100).ToStringForFloat() + '%');
			$('#AgentAmount').text('￥' + json.Amount.ToStringForFloat());
			if (json.OrderNumber.StartsWith('C')) {
				$('form').parent().show();
				//绑定事件
				$('#Rate,#Amount').on('blur', function () {
					var data = $('form').GetParams();
					//类型转换
					data.Rate = data.Rate ? data.Rate.ToFloat() / 100 : 0;
					data.Amount = data.Amount ? data.Amount.ToFloat() : 0;

					if (data.Rate <= 0 && data.Amount <= 0) {
						$('#UserRate').text('%');
						$('#UserAmount').text('￥');
						return;
					}

					loadPrevview(id, data);
				});
			} else {
				loadPrevview(id);
			}
			form.render();
		}
	});

	//自定义验证规则
	form.verify({
		rate: function (value) {
			if (value) {
				var error = form.config.verify['number'](value);
				if (error) {
					return error;
				}
				if (value < 0 || value > Rate) {
					return '比例超出范围：0%~' + Rate + '%';
				}

			}
		},
		amount: function (value) {
			if (value) {
				var error = form.config.verify['number'](value);
				if (error) {
					return error;
				}
				if (value < 0 || value > Amount) {
					return '金额超出范围：￥0~' + Amount.ToStringForFloat();
				}
			}
		}
	});

	//监听提交
	form.on('submit(submit)', function (data) {
		//类型转换
		data.field.Rate = data.field.Rate ? data.field.Rate.ToFloat() / 100 : 0;
		data.field.Amount = data.field.Amount ? data.field.Amount.ToFloat() : 0;

		$.ajax('/user/commission/distribute/' + id, {
			type: 'put',
			contentType: 'application/json',
			data: JSON.stringify(data.field),
			dataType: 'json',
			success: function (json) {
				parent.layer.msg('已分配');
				parent.layui.list.reload();
				parent.layer.close(parent.layer.getFrameIndex(window.name));
			}
		});
	});
});
