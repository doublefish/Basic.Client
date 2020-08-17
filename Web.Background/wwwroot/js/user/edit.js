layui.use(['jquery', 'layer', 'form'], function () {
	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form;

	//加载角色
	$.ajax('/role/listAll', {
		type: 'get',
		async: false,
		dataType: 'json',
		success: function (json) {
			var $container = $('#Roles');
			$.each(json, function (i, data) {
				var disabled = data.IsEnabled ? '' : ' disabled="disabled" ';
				$container.append('<input type="checkbox" name="Role" id="Role-' + data.Id + '"' + disabled + 'value="' + data.Id + '" lay-skin="primary" title="' + data.Name + '" />');
			});
		}
	});

	//加载状态
	$.ajax('/user/listStatus', {
		type: 'get',
		async: false,
		dataType: 'json',
		success: function (json) {
			$('#Status').CreateSelectOptions(json);
		}
	});

	var id = $('#Id').val();
	if (id > 0) {
		$('#Username').prop('disabled', true);
		//加载信息
		$.ajax('/user/get/' + id, {
			type: 'get',
			dataType: 'json',
			success: function (json) {
				$('#Id').val(json.Id);
				$('#Username').val(json.Username);
				$('#Nickname').val(json.Nickname);
				$('#FirstName').val(json.FirstName);
				$('#LastName').val(json.LastName);
				$('#Email').val(json.Email);
				$('#Mobile').val(json.Mobile);
				$('#Tel').val(json.Tel);
				$('#Status').prop('checked', json.Status === Config.Status.Enabled);
				$('#Note').val(json.Note);
				$.each(json.RoleIds, function (i, data) {
					$('#Role-' + data).prop('checked', true);
				});
				form.render();
			}
		});
	} else {
		$('#Status').prop('checked', true);
		form.render();
	}

	//事件
	$('#Username').on('blur', function () {
		$.ajax('/user/existByUsername/' + id + '/' + this.value, {
			type: 'get',
			async: false,
			dataType: 'json',
			success: function (json) {
				if (json) {
					return layer.msg('用户名已存在', { icon: 5, time: 3000, anim: 6 });
				}
			}
		});
	});

	//新增验证规则
	$(form).AddVerifyConfig(['username', 'mobilePhone', 'telephone']);
	//自定义验证规则
	form.verify({
		mail: function (value) {
			if (value && !form.config.verify['email'][0].test(value)) {
				return form.config.verify['email'][1];
			}
		},
		mobile: function (value) {
			if (value && !form.config.verify['mobilePhone'][0].test(value)) {
				return form.config.verify['mobilePhone'][1];
			}
		},
		tel: function (value) {
			if (value && !form.config.verify['telephone'][0].test(value)) {
				return form.config.verify['telephone'][1];
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
		data.field.RoleIds = $('input[name=Role]').GetCheckedValues();
		if (data.field.RoleIds.length === 0) {
			return layer.msg('请选择角色', { icon: 5, time: 3000, anim: 6 });
		}

		var action = 'add';
		var type = 'post';
		if (data.field.Id > 0) {
			action = 'update/' + data.field.Id;
			type = 'put';
		}

		//类型转换
		data.field.Status = data.field.Status ? Config.Status.Enabled : Config.Status.Disabled;

		$.ajax('/user/' + action, {
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
