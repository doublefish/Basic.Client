layui.use(['jquery', 'layer', 'form'], function () {
	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form;

	var category = $('#Category').val();

	//加载信息
	$.ajax('/article/' + category + '/get', {
		type: 'get',
		async: false,
		dataType: 'json',
		success: function (json) {
			$('#Content').val(json);
		}
	});

	//初始化编辑器
	$('#Content').InitEditor();

	//监听提交
	form.on('submit(submit)', function (data) {
		data.field.Content = tinymce.get('Content').getContent();
		$.ajax('/article/' + category + '/update', {
			type: 'put',
			contentType: 'application/json',
			data: JSON.stringify(data.field.Content),
			dataType: 'json',
			success: function (json) {
				layer.msg('已保存');
			}
		});
	});

	//权限控制
	if (HasRight('article/' + category + '/update')) {
		$('#submit').show();
	}
});


