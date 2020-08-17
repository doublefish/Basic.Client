layui.use(['jquery', 'layer', 'form', 'table', 'laydate', 'list'], function () {
	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form,
		table = layui.table,
		laydate = layui.laydate,
		list = layui.list;

	//初始化列表
	list.init({
		url: '/account/sms/list',
		cols: [[
			{ checkbox: true, fixed: 'left' },
			{ field: 'Id', title: 'ID', width: 60, sort: true, align: 'right', fixed: 'left' },
			{ field: 'Username', title: '用户名', width: 120, templet: function (d) { return d.Account.Username; } },
			{ field: 'Mobile', title: '手机号码', width: 120, sort: true },
			{ field: 'Type', title: '类型', width: 120, sort: true, templet: function (d) { return d.TypeNote; } },
			{ field: 'Content', title: '内容', width: 250 },
			{ field: 'CheckCode', title: '验证码', width: 80 },
			{ field: 'CreateTime', title: '发送时间', width: 160, sort: true, templet: function (d) { return d.CreateTime.ToString(); } }
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
	$.ajax('/account/sms/listType', {
		type: 'get',
		dataType: 'json',
		success: function (json) {
			$('#type').CreateSelectOptions(json);
			form.render('select', 'search');
		}
	});

	//加载状态
	$.ajax('/account/sms/listStatus', {
		type: 'get',
		dataType: 'json',
		success: function (json) {
			$('#status').CreateSelectOptions(json);
			form.render('select', 'search');
		}
	});
});
