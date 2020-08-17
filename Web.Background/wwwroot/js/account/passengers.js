layui.use(['jquery', 'layer', 'form', 'table', 'list'], function () {
	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form,
		table = layui.table,
		list = layui.list;

	//初始化列表
	list.init({
		url: '/account/passenger/list',
		//toolbar: '#toolbar',
		cols: [[
			{ checkbox: true, fixed: 'left' },
			{ field: 'Id', title: 'ID', width: 60, sort: true, align: 'right', fixed: 'left' },
			{ field: 'Username', title: '用户名', width: 120, templet: function (d) { return d.Account.Username; } },
			{ field: 'CnFullName', title: '中文姓名', width: 105 },
			{ field: 'EnFullName', title: '英文姓名', width: 120 },
			{ field: 'Mobile', title: '手机号码', width: 120, sort: true },
			{ field: 'IdNumber', title: '身份证号码', width: 150, sort: true },
			{ field: 'PassportNumber', title: '护照号码', width: 150, sort: true },
			{ field: 'Birthday', title: '出生日期', width: 105, sort: true, templet: function (d) { return d.Birthday.ToStringForDate(); } },
			{ field: 'CreateTime', title: '创建时间', width: 160, sort: true, templet: function (d) { return d.CreateTime.ToString(); } },
			{ field: 'UpdateTime', title: '修改时间', width: 160, sort: true, templet: function (d) { return d.UpdateTime.ToString(); } }
		]],
		initSort: {
			field: 'Id',
			type: 'desc'
		}
	});
});
