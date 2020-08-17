layui.use(['jquery', 'layer', 'form', 'laydate'], function () {
	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form,
		laydate = layui.laydate;

	//加载栏目
	$.ajax('/article/listSection', {
		type: 'get',
		async: false,
		dataType: 'json',
		success: function (json) {
			var $container = $('#Sections');
			$.each(json, function (i, data) {
				var disabled = data.IsEnabled ? '' : ' disabled="disabled" ';
				$container.append('<input type="checkbox" name="Section" id="Section-' + data.Id + '"' + disabled + 'value="' + data.Id + '" lay-skin="primary" title="' + data.Name + '" />');
			});
		}
	});

	//加载状态
	$.ajax('/article/listStatus', {
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
		$.ajax('/article/get/' + id, {
			type: 'get',
			async: false,
			dataType: 'json',
			success: function (json) {
				$('#Id').val(json.Id);
				$('#Title').val(json.Title);
				$.each(json.ArticleSections, function (i, data) {
					$('#SectionId-' + data.SectionId).prop('checked', true);
				});
				$('#Summary').val(json.Summary);
				$('#Author').val(json.Author);
				$('#Source').val(json.Source);
				$('#Content').val(json.Content);
				$('#ReleaseTime').val(json.ReleaseTime.ToStringForDate());
				$('#IsStick').prop('checked', json.IsStick);
				$('#Status').val(json.Status);
				form.render();
			}
		});
	} else {
		form.render();
	}
	

	//初始化编辑器
	$('#Content').InitEditor();

	//日历控件
	laydate.render({ elem: '#ReleaseTime' });

	//自定义验证规则
	form.verify({
		title: function (value) {
			if (value.length > 50) {
				return '请输入50个字符以内的标题';
			}
		},
		summary: function (value) {
			if (value.length > 200) {
				return '请输入200个字符以内的摘要';
			}
		},
		author: function (value) {
			if (value.length > 20) {
				return '请输入20个字符以内的作者';
			}
		},
		source: function (value) {
			if (value.length > 20) {
				return '请输入20个字符以内的来源';
			}
		}
	});

	//监听提交
	form.on('submit(submit)', function (data) {
		data.field.SectionIds = $('input[name=Section]').GetCheckedValues();
		if (data.field.SectionIds.length === 0) {
			return layer.msg('请选择版块', { icon: 5, time: 3000, anim: 6 });
		}
		data.field.Content = tinymce.get('Content').getContent();
		var action = 'add';
		var type = 'post';
		if (data.field.Id > 0) {
			action = 'update/' + data.field.Id;
			type = 'put';
		}
		$.ajax('/article/' + action, {
			type: type,
			contentType: 'application/json',
			data: JSON.stringify(data.field),
			dataType: 'json',
			success: function (json) {
				layer.msg('已保存');
			}
		});
	});
});


