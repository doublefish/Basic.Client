layui.use(['jquery', 'layer', 'form', 'laydate', 'dialog'], function () {
	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form,
		laydate = layui.laydate,
		dialog = layui.dialog;

	//加载类型
	$.ajax('/product/listType', {
		type: 'get',
		async: false,
		dataType: 'json',
		success: function (json) {
			$('#Type').CreateSelectOptions(json);
		}
	});
	//加载标签
	$.ajax('/product/listTag', {
		type: 'get',
		async: false,
		dataType: 'json',
		success: function (json) {
			var $container = $('#Tags');
			$.each(json, function (i, data) {
				var disabled = data.IsEnabled ? '' : ' disabled="disabled" ';
				$container.append('<input type="checkbox" name="Tag" id="Tag-' + data.Id + '"' + disabled + 'value="' + data.Id + '" lay-skin="primary" title="' + data.Name + '" />');
			});
		}
	});
	//加载主题
	$.ajax('/product/listTheme', {
		type: 'get',
		async: false,
		dataType: 'json',
		success: function (json) {
			var $container = $('#Themes');
			$.each(json, function (i, data) {
				var disabled = data.IsEnabled ? '' : ' disabled="disabled" ';
				$container.append('<input type="checkbox" name="Theme" id="Theme-' + data.Id + '"' + disabled + 'value="' + data.Id + '" lay-skin="primary" title="' + data.Name + '" />');
			});
		}
	});
	//加载状态
	$.ajax('/product/listStatus', {
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
		$.ajax('/product/get/' + id, {
			type: 'get',
			async: false,
			dataType: 'json',
			success: function (json) {
				$('#Id').val(json.Id);
				$('#Name').val(json.Name);
				$('#Type').val(json.Type);
				$.each(json.TagIds, function (i, data) {
					$('#Tag-' + data).prop('checked', true);
				});
				$.each(json.ThemeIds, function (i, data) {
					$('#Theme-' + data).prop('checked', true);
				});
				$.each(json.DestinationIds, function (i, data) {
					$('#Destination-' + data).prop('checked', true);
				});
				$('#Departure-' + json.Departure).prop('checked', true);
				$('#Price').val(json.Price);
				$('#Stay').val(json.Stay);
				$('#Traffic').val(json.Traffic);
				$('#Attraction').val(json.Attraction);
				$('#Meal').val(json.Meal);
				$('#FreeTime').val(json.FreeTime);
				$('#ServiceLanguage').val(json.ServiceLanguage);
				$('#Overview').val(json.Overview);
				//$('#Feature').val(json.Feature);
				//$('#Notice').val(json.Notice);
				//$('#Cost').val(json.Cost);
				//$('#Visa').val(json.Visa);
				//$('#Book').val(json.Book);
				$('#Recommends').val(json.Recommends);
				$('#Sequence').val(json.Sequence);
				$('#Status').val(json.Status);
			}
		});

		$('#contents').show();
		//监听内容按钮事件
		$('#contents .layui-btn').on('click', function () {
			var type = $(this).data('type');
			dialog.open({
				title: '编辑 - ' + this.value,
				url: '/product/editContent/' + id + '/' + type,
				width: '1024px',
				height: '680px',
				btn: ['确定', '取消'],
				yes: function (index, layero) {
					layero.find('iframe').contents().find('#submit').trigger('click');
				}
			});
		});
	} else {
		$('#Sequence').val(99);
	}
	form.render();


	//自定义验证规则
	form.verify({
		name: function (value) {
			if (value.length > 100) {
				return '请输入100个字符以内的名称';
			}
		},
		overview: function (value) {
			if (value.length > 500) {
				return '请输入500个字符以内的概要';
			}
		},
		sequence: function (value) {
			if (value < 0) {
				return '请输入一个不小于零的排序数字';
			}
		}
	});

	//监听提交
	form.on('submit(submit)', function (data) {
		data.field.TagIds = $('input[name=Tag]').GetCheckedValues();
		if (data.field.TagIds.length === 0) {
			//return layer.msg('请选择标签', { icon: 5, time: 3000, anim: 6 });
		}
		data.field.ThemeIds = $('input[name=Theme]').GetCheckedValues();
		if (data.field.ThemeIds.length === 0) {
			return layer.msg('请选择主题', { icon: 5, time: 3000, anim: 6 });
		}
		data.field.DestinationIds = $('input[name=Destination]').GetCheckedValues();
		if (data.field.DestinationIds.length === 0) {
			return layer.msg('请选择目的地', { icon: 5, time: 3000, anim: 6 });
		}
		data.field.Departure = $('input[name=Departure]:checked').val();
		if (!data.field.Departure) {
			return layer.msg('请选择目的地', { icon: 5, time: 3000, anim: 6 });
		}

		var action = 'add';
		var type = 'post';
		if (data.field.Id > 0) {
			action = 'update/' + data.field.Id;
			type = 'put';
		}

		//类型转换
		data.field.Type = data.field.Type.ToInt();
		data.field.TagIds = data.field.TagIds.ToInt();
		data.field.ThemeIds = data.field.ThemeIds.ToInt();
		data.field.DestinationIds = data.field.DestinationIds.ToInt();
		data.field.Departure = data.field.Departure.ToInt();
		data.field.Price = data.field.Price.ToFloat();
		data.field.Recommends = data.field.Recommends.ToInt();
		data.field.Sequence = data.field.Sequence.ToInt();
		data.field.Status = data.field.Status.ToInt();

		$.ajax('/product/' + action, {
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


