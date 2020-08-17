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
		url: '/agent/user/promotion/list',
		cols: [[
			{ checkbox: true, fixed: 'left' },
			{ field: 'Id', title: 'ID', width: 60, sort: true, align: 'right', fixed: 'left' },
			{ field: 'AccountUsername', title: '注册用户', width: 120, templet: function (d) { return d.Account.Username; } },
			{ field: 'AccountMobile', title: '注册手机', width: 120, templet: function (d) { return d.Account.Mobile; } },
			{ field: 'PromoterUsername', title: '推广人用户', width: 120, templet: function (d) { return d.Promoter ? d.Promoter.Username : ''; } },
			{ field: 'PromoterMobile', title: '推广人手机', width: 120, templet: function (d) { return d.Promoter ? d.Promoter.Mobile : ''; } },
			{ field: 'AgentUsername', title: '业务员用户', width: 120, templet: function (d) { return d.AgentUser ? d.AgentUser.Username : ''; } },
			{ field: 'AgentUserMobile', title: '业务员手机', width: 120, templet: function (d) { return d.AgentUser ? d.AgentUser.Mobile : ''; } },
			{ field: 'AgentName', title: '代理商名称', width: 120, templet: function (d) { return d.Agent ? d.Agent.Name : ''; } },
			{ field: 'AgentParentName', title: '上级名称', width: 120, templet: function (d) { return d.Agent.Parent ? d.Agent.Parent.Name : ''; } },
			{ field: 'Orders', title: '订单数量', width: 105, sort: true, align: 'right', templet: function (d) { return d.Orders.ToStringForInt(); } },
			{ field: 'OrderAmount', title: '订单金额', width: 120, sort: true, align: 'right', templet: function (d) { return d.OrderAmount.ToStringForFloat(); } },
			{ field: 'CreateTime', title: '注册时间', width: 160, sort: true, templet: function (d) { return d.CreateTime.ToString(); } }
		]],
		initSort: {
			field: 'Id',
			type: 'desc'
		}
	});
});
