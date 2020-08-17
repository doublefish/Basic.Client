layui.use(['jquery', 'layer', 'form', 'table', 'laydate', 'list'], function () {
	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form,
		table = layui.table,
		laydate = layui.laydate,
		list = layui.list;

	//初始化列表
	list.init({
		url: '/account/commission/list',
		cols: [[
			{ checkbox: true, fixed: 'left' },
			{ field: 'Id', title: 'ID', width: 60, sort: true, align: 'right', fixed: 'left' },
			{ field: 'Username', title: '用户名', width: 120, templet: function (d) { return d.Account.Username; } },
			{ field: 'Mobile', title: '手机号码', width: 120, templet: function (d) { return d.Account.Mobile; } },
			{ field: 'OrderNumber', title: '订单编号', width: 165 },
			{ field: 'OrderAmount', title: '订单金额', width: 105, align: 'right', templet: function (d) { return d.OrderAmount.ToStringForFloat(); } },
			{ field: 'Rate', title: '佣金比例', width: 105, sort: true, align: 'right', templet: function (d) { return (d.Rate * 100).ToStringForFloat() + '%'; } },
			{ field: 'Amount', title: '佣金金额', width: 105, sort: true, align: 'right', templet: function (d) { return d.Amount.ToStringForFloat(); } },
			{ field: 'Status', title: '状态', width: 80, sort: true, templet: function (d) { return d.StatusNote; } },
			{ field: 'CreateTime', title: '创建时间', width: 160, sort: true, templet: function (d) { return d.CreateTime.ToString(); } },
			{ field: 'UpdateTime', title: '修改时间', width: 160, sort: true, templet: function (d) { return d.UpdateTime.ToString(); } },
			{ field: 'Note', title: '描述', width: 200 }
		]],
		initSort: {
			field: 'Id',
			type: 'desc'
		}
	});

	//日历控件
	laydate.render({ elem: '#start' });
	laydate.render({ elem: '#end' });

	//加载状态
	$.ajax('/account/commission/listStatus', {
		type: 'get',
		dataType: 'json',
		success: function (json) {
			$('#status').CreateSelectOptions(json);
			form.render('select', 'search');
		}
	});
});
