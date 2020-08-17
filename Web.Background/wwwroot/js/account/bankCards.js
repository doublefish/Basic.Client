layui.use(['jquery', 'layer', 'form', 'table', 'list'], function () {
	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form,
		table = layui.table,
		list = layui.list;

	//初始化列表
	list.init({
		url: '/account/bankCard/list',
		//toolbar: '#toolbar',
		cols: [[
			{ checkbox: true, fixed: 'left' },
			{ field: 'Id', title: 'ID', width: 60, sort: true, align: 'right', fixed: 'left' },
			{ field: 'Username', title: '用户名', width: 120, templet: function (d) { return d.Account.Username; } },
			{ field: 'BankId', title: '开户银行', width: 105, sort: true, templet: function (d) { return d.BankName; } },
			{ field: 'CardNumber', title: '卡号', width: 175, sort: true },
			{ field: 'Cardholder', title: '持卡人', width: 90, sort: true },
			{ field: 'Branch', title: '支行名称', width: 200, sort: true },
			{ field: 'CreateTime', title: '创建时间', width: 160, sort: true, templet: function (d) { return d.CreateTime.ToString(); } },
			{ field: 'UpdateTime', title: '修改时间', width: 160, sort: true, templet: function (d) { return d.UpdateTime.ToString(); } }
		]],
		initSort: {
			field: 'Id',
			type: 'desc'
		}
	});

	//加载银行
	$.ajax('/listBank', {
		type: 'get',
		dataType: 'json',
		success: function (json) {
			$('#bankId').CreateSelectOptions(json);
			form.render('select', 'search');
		}
	});
});
