layui.use(['jquery', 'layer', 'form'], function () {
	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form;

	var $reset = $('input[type=reset]');
	$reset.on('click', function () {
		$('#Username').val(Token.Data.Username);
		$('#Nickname').val(Token.Data.Nickname);
		$('#Mobile').val(Token.Data.Mobile);
		return false;
	});
	$reset.trigger('click');

	//监听提交
	form.on('submit(submit)', function (data) {
		$.ajax('/personal/modify/', {
			type: 'put',
			contentType: 'application/json',
			data: JSON.stringify(data.field),
			dataType: 'json',
			success: function (json) {
				layer.msg('修改成功', {
					end: function () { top.location.reload(); }
				});
			}
		});
		return false;
	});
});
