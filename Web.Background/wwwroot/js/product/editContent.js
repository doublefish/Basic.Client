layui.use(['jquery', 'layer', 'form'], function () {
	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form;

	var id = $('#Id').val();
	var property = $('#Property').val();
	//加载信息
	$.ajax('/product/getDetailt/' + id + '/' + property, {
		type: 'get',
		async: false,
		dataType: 'json',
		success: function (json) {
			$('#Content').val(json);
		}
	});
	form.render();

	//初始化编辑器
	$('#Content').InitEditor();

	//监听提交
	form.on('submit(submit)', function (data) {
		data.field.Content = tinymce.get('Content').getContent();

		$.ajax('/product/update/' + data.field.Id + '/' + data.field.Property, {
			type: 'put',
			contentType: 'application/json',
			data: JSON.stringify(data.field.Content),
			dataType: 'json',
			success: function (json) {
				parent.layer.msg('已保存');
				parent.layer.close(parent.layer.getFrameIndex(window.name));
			}
		});
	});
});


