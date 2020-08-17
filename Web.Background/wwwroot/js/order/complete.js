layui.use(['jquery', 'layer', 'form'], function () {
	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form;

	var id = $('#Id').val();

	/**
	 * 加载预览
	 * @param {Number} id id
	 */
	var loadPrevview = function (id) {
		$.ajax('/order/complete/preview/' + id, {
			type: 'put',
			contentType: 'application/json',
			dataType: 'json',
			success: function (json) {
				if (json.AccountCommission) {
					$('#divPromoter0,#divPromoter1').show();
					$('#PromoterUsername').text(json.AccountPromotion.Promoter.Username);
					$('#PromoterFullName').text(json.AccountPromotion.Promoter.FullName);
					$('#PromoterRate').text((json.AccountCommission.Rate * 100).ToStringForFloat() + '%');
					$('#PromoterAmount').text('￥' + json.AccountCommission.Amount.ToStringForFloat());
				}
				if (json.AgentUserCommission) {
					$('#divAgent0,#divAgent1').show();
					$('#AgentName').text(json.AccountPromotion.Agent.Name);
					if (json.AccountPromotion.Agent.Parent) {
						$('#AgentParentName').text(json.AccountPromotion.Agent.Parent.Name);
					} else {
						$('#AgentParentName').text('无');
					}
					$('#AgentUserUsername').text(json.AccountPromotion.AgentUser.Username);
					$('#AgentUserFullName').text(json.AccountPromotion.AgentUser.FullName);
					$('#AgentUserRate').text((json.AgentUserCommission.Rate * 100).ToStringForFloat() + '%');
					$('#AgentUserAmount').text('￥' + json.AgentUserCommission.Amount.ToStringForFloat());
				}
				form.render();
			}
		});
	};

	//加载信息
	$.ajax('/order/get/' + id, {
		type: 'get',
		dataType: 'json',
		success: function (json) {
			$('#Id').val(json.Id);
			$('#Number').text(json.Number);
			$('#TotalPrice').text('￥' + json.TotalPrice.ToStringForFloat());
			form.render();
		}
	});

	//加载预览
	loadPrevview(id);
	
	//监听提交
	form.on('submit(submit)', function (data) {
		$.ajax('/order/complete/' + id, {
			type: 'put',
			contentType: 'application/json',
			//data: JSON.stringify(data.field),
			dataType: 'json',
			success: function (json) {
				parent.layer.msg('已完成');
				parent.layui.list.reload();
				parent.layer.close(parent.layer.getFrameIndex(window.name));
			}
		});
	});
});
