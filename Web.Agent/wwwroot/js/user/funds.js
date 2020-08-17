layui.use(['jquery', 'layer', 'form', 'table', 'laydate', 'list'], function () {
	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form,
		table = layui.table,
		laydate = layui.laydate,
		list = layui.list;

	//初始化列表
	list.init({
		url: '/user/fund/list',
		cols: [[
			{ checkbox: true, fixed: 'left' },
			{ field: 'Id', title: 'ID', width: 60, sort: true, align: 'right', fixed: 'left' },
			{ field: 'Username', title: '用户名', width: 120, templet: function (d) { return d.AgentUser.Username; } },
			{ field: 'Number', title: '流水编号', width: 165, sort: true },
			{ field: 'Type', title: '类型', width: 75, sort: true, templet: function (d) { return d.TypeNote; } },
			{
				field: 'Amount', title: '发生金额', width: 105, sort: true, align: 'right', templet: function (d) {
					return '<span style="color:' + (d.Amount > 0 ? 'green' : 'red') + ';">' + d.Amount.ToStringForFloat() + '</span>';
				}
			},
			{ field: 'Balance', title: '账户余额', width: 105, sort: true, align: 'right', templet: function (d) { return d.Balance.ToStringForFloat(); } },
			{ field: 'Freeze', title: '冻结金额', width: 105, sort: true, align: 'right', templet: function (d) { return d.Freeze.ToStringForFloat(); } },
			{ field: 'CreateTime', title: '发生时间', width: 160, sort: true, templet: function (d) { return d.CreateTime.ToString(); } },
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

	//加载类型
	$.ajax('/user/fund/listType', {
		type: 'get',
		dataType: 'json',
		success: function (json) {
			var $select = $('#type');
			var html = '';
			$.each(json, function (k, v) {
				html += '<optgroup label="' + k + '">';
				$.each(v, function (k, v) {
					html += '<option value="' + k + '">' + v + '</option>';
				});
				html += '</optgroup>';
			});
			$select.append(html);
			form.render('select', 'search');
		}
	});
});
