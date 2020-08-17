layui.use(['jquery', 'layer', 'form'], function () {
	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form;

	//加载状态
	$.ajax('/agent/listStatus', {
		type: 'get',
		async: false,
		dataType: 'json',
		success: function (json) {
			$('#Status').CreateSelectOptions(json);
		}
	});

	var id = $('#Id').val();
	if (id > 0) {
		//加载信息
		$.ajax('/agent/get/' + id, {
			type: 'get',
			dataType: 'json',
			success: function (json) {
				$('#Id').val(json.Id);
				$('#Name').val(json.Name);
				$('#Status').prop('checked', json.Status === Config.Status.Enabled);
				$('#Note').val(json.Note);
				form.render();
			}
		});
	} else {
		$('#Status').prop('checked', true);
		form.render();
	}

	//事件
	$('#Name').on('blur', function () {
		$.ajax('/agent/existByName/' + id + '?name=' + this.value, {
			type: 'get',
			async: false,
			dataType: 'json',
			success: function (json) {
				if (json) {
					return layer.msg('名称已存在', { icon: 5, time: 3000, anim: 6 });
				}
			}
		});
	});

	//新增验证规则
	$(form).AddVerifyConfig(['username']);
	//自定义验证规则
	form.verify({
		name: function (value) {
			if (value.length > 20) {
				return '请输入20个字符以内的名称';
			}
		},
		note: function (value) {
			if (value.length > 200) {
				return '请输入200个字符以内的描述';
			}
		}
	});

	//监听提交
	form.on('submit(submit)', function (data) {
		var action = 'add';
		var type = 'post';
		if (data.field.Id > 0) {
			action = 'update/' + data.field.Id;
			type = 'put';
		}

		//类型转换
		data.field.Code = '';
		data.field.Status = data.field.Status ? Config.Status.Enabled : Config.Status.Disabled;

		$.ajax('/agent/' + action, {
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
