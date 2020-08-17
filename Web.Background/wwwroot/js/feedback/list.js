layui.use(['jquery', 'layer', 'form', 'table', 'laydate', 'list', 'dialog'], function () {
	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form,
		table = layui.table,
		laydate = layui.laydate,
		list = layui.list,
		dialog = layui.dialog;

	//初始化列表
	list.init({
		url: '/feedback/list',
		//toolbar: '#toolbar',
		cols: [[
			//{ checkbox: true, fixed: 'left' },
			{ field: 'Id', title: 'ID', width: 60, sort: true, align: 'right', fixed: 'left' },
			{ field: 'Score', title: '评分', width: 80, sort: true, templet: function (d) { return d.Score.ToStringForFloat(); } },
			{ field: 'Content', title: '内容', sort: true },
			{ field: 'Mobile', title: '手机号码', width: 120, sort: true },
			{ field: 'WeChat', title: '微信号', width: 120, sort: true },
			{ field: 'CreateTime', title: '创建时间', width: 160, sort: true, templet: function (d) { return d.CreateTime.ToString(); } },
			{ field: 'UpdateTime', title: '修改时间', width: 160, sort: true, templet: function (d) { return d.UpdateTime.ToString(); } }
		]],
		initSort: {
			field: 'Id',
			type: 'desc'
		}
	});

	//日历控件
	laydate.render({ elem: '#start' });
	laydate.render({ elem: '#end' });
});
