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
		url: '/user/commission/list',
		cols: [[
			{ checkbox: true, fixed: 'left' },
			{ field: 'Id', title: 'ID', width: 60, sort: true, align: 'right', fixed: 'left' },
			{ field: 'Username', title: '业务员用户', width: 120, templet: function (d) { return d.AgentUser ? d.AgentUser.Username : ''; } },
			{ field: 'FullName', title: '业务员姓名', width: 100, templet: function (d) { return d.AgentUser ? d.AgentUser.FullName : ''; } },
			{ field: 'Mobile', title: '业务员手机', width: 120, templet: function (d) { return d.AgentUser ? d.AgentUser.Mobile : ''; } },
			{ field: 'OrderNumber', title: '订单编号', width: 165 },
			{ field: 'OrderAmount', title: '订单金额', width: 105, align: 'right', templet: function (d) { return d.OrderAmount.ToStringForFloat(); } },
			{ field: 'Rate', title: '佣金比例', width: 105, sort: true, align: 'right', templet: function (d) { return (d.Rate * 100).ToStringForFloat() + '%'; } },
			{ field: 'Amount', title: '佣金金额', width: 105, sort: true, align: 'right', templet: function (d) { return d.Amount.ToStringForFloat(); } },
			{ field: 'Status', title: '状态', width: 80, sort: true, templet: function (d) { return d.StatusNote; } },
			{ field: 'CreateTime', title: '创建时间', width: 160, sort: true, templet: function (d) { return d.CreateTime.ToString(); } },
			{ field: 'UpdateTime', title: '修改时间', width: 160, sort: true, templet: function (d) { return d.UpdateTime.ToString(); } },
			{ field: 'Note', title: '描述', width: 200 },
			{
				title: '操作', width: 70, align: 'center', fixed: 'right', templet: function (d) {
					var html = '';
					if (d.IsPaid) {
						if (HasRight('user/commission/distribute')) {
							html += '<a class="layui-btn layui-btn-xs layui-btn-warm" lay-event="distribute">分配</a>';
						}
					}
					return html;
				}
			}
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
	$.ajax('/user/commission/listStatus', {
		type: 'get',
		dataType: 'json',
		success: function (json) {
			$('#status').CreateSelectOptions(json);
			form.render('select', 'search');
		}
	});

	//事件
	var active = {
		/**
		 * 分配
		 * @param {Number} id id
		 * @param {Object} data data
		 */
		distribute: function (id, data) {
			dialog.open({
				title: '分配 - ' + id + ' - ' + data.OrderNumber,
				url: '/user/commission/distribute/' + id,
				width: '750px',
				height: '630px',
				btn: ['确定', '取消'],
				yes: function (index, layero) {
					layero.find('iframe').contents().find('#submit').trigger('click');
				}
			});
		}
	};

	//监听行工具栏事件
	table.on('tool', function (obj) {
		var data = obj.data;
		var type = obj.event;
		active[type] ? active[type].call(this, data.Id, data) : '';
	});

	//监听工具栏事件
	$('.tools .layui-btn').on('click', function () {
		var type = $(this).data('type');
		active[type] ? active[type].call(this) : '';
	});
});
