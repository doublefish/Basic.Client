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
		url: '/order/list',
		//toolbar: '#toolbar',
		cols: [[
			//{ checkbox: true, fixed: 'left' },
			{ field: 'Id', title: 'ID', width: 60, sort: true, align: 'right', fixed: 'left' },
			{ field: 'Number', title: '编号', width: 165, sort: true },
			{ field: 'ProductName', title: '产品名称', width: 200, templet: function (d) { return d.Product.Name; } },
			{ field: 'ProductPrice', title: '产品价格', width: 105, align: 'right', templet: function (d) { return d.Product.Price.ToStringForFloat(); } },
			{ field: 'Date', title: '出行日期', width: 105, sort: true, templet: function (d) { return d.Date.ToStringForDate(); } },
			{ field: 'Mobile', title: '手机号码', width: 120, sort: true },
			{ field: 'AccountFullName', title: '用户姓名', width: 105, templet: function (d) { return d.Account.FullName; } },
			{ field: 'TotalPrice', title: '成交总价', width: 105, sort: true, align: 'right', templet: function (d) { return d.TotalPrice ? d.TotalPrice.ToStringForFloat() : ''; } },
			{ field: 'Status', title: '状态', width: 80, sort: true, templet: function (d) { return d.StatusNote; } },
			{ field: 'CreateTime', title: '创建时间', width: 160, sort: true, templet: function (d) { return d.CreateTime.ToString(); } },
			{ field: 'UpdateTime', title: '修改时间', width: 160, sort: true, templet: function (d) { return d.UpdateTime.ToString(); } },
			{ field: 'Note', title: '描述', width: 200 },
			{
				title: '操作', width: 180, align: 'center', fixed: 'right', templet: function (d) {
					var html = '';
					if (HasRight('order/get')) {
						html += '<a class="layui-btn layui-btn-xs layui-btn-primary" lay-event="detail">详情</a>';
					}
					if (d.IsSubmitted) {
						if (HasRight('order/updatePrice')) {
							html += '<a class="layui-btn layui-btn-xs layui-btn-normal" lay-event="updatePrice">修改价格</a>';
						}
						if (HasRight('order/complete')) {
							html += '<a class="layui-btn layui-btn-xs layui-btn-warm" lay-event="complete">完成</a>';
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
	laydate.render({ elem: '#dateBegin' });
	laydate.render({ elem: '#dateEnd' });

	//加载状态
	$.ajax('/order/listStatus', {
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
		 * 详情
		 * @param {Number} id id
		 * @param {Object} data data
		 */
		detail: function (id, data) {
			dialog.open({
				title: '详情 - ' + id + ' - ' + data.Number + ' - ' + data.Product.Name,
				url: '/order/detail/' + id,
				width: '1080px',
				height: '500px',
				btn: ['完成', '关闭'],
				yes: function (index, layero) {
					active.complete(id, data);
				}
			});
		},
		/**
		 * 修改价格
		 * @param {Number} id id
		 * @param {Object} data data
		 */
		updatePrice: function (id, data) {
			dialog.open({
				title: '修改价格 - ' + id + ' - ' + data.Number + ' - ' + data.Product.Name,
				url: '/order/edit/' + id,
				width: '780px',
				height: '650px',
				btn: ['确定', '取消'],
				yes: function (index, layero) {
					layero.find('iframe').contents().find('#submit').trigger('click');
				}
			});
		},
		/**
		 * 完成
		 * @param {Number} id id
		 * @param {Object} data data
		 */
		complete: function (id, data) {
			if (!data.TotalPrice || data.TotalPrice <= 0) {
				return layer.msg('请先设置成交价格', { icon: 5, time: 3000, anim: 6 });
			}
			dialog.open({
				title: '完成 - ' + id + ' - ' + data.Number + ' - ' + data.Product.Name,
				url: '/order/complete/' + id,
				width: '780px',
				height: '650px',
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
