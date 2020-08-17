layui.use(['jquery', 'layer', 'form', 'table', 'laydate', 'list', 'dialog'], function () {
	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form,
		table = layui.table,
		laydate = layui.laydate,
		list = layui.list,
		dialog = layui.dialog;

	var productId = $('#productId').val();

	//初始化列表
	list.init({
		url: '/commissionRule/list/' + productId,
		//toolbar: '#toolbar',
		cols: [[
			//{ checkbox: true, fixed: 'left' },
			{ field: 'Id', title: 'ID', width: 60, sort: true, align: 'right', fixed: 'left' },
			{ field: 'Year', title: '年份', width: 75, sort: true },
			{ field: 'Month', title: '月份', width: 75, sort: true },
			{ field: 'AgentRate', title: '代理商比例', width: 115, sort: true, align: 'right', templet: function (d) { return d.AgentRate ? (d.AgentRate * 100).ToStringForFloat() + '%' : '--'; } },
			{ field: 'AgentAmount', title: '代理商金额', width: 115, sort: true, align: 'right', templet: function (d) { return d.AgentAmount ? d.AgentAmount.ToStringForFloat() : '--'; } },
			{ field: 'PersonalRate', title: '个人比例', width: 105, sort: true, align: 'right', templet: function (d) { return d.PersonalRate ? (d.PersonalRate * 100).ToStringForFloat() + '%' : '--'; } },
			{ field: 'PersonalAmount', title: '个人金额', width: 105, sort: true, align: 'right', templet: function (d) { return d.PersonalAmount ? d.PersonalAmount.ToStringForFloat() : '--'; } },
			{ field: 'Status', title: '状态', width: 75, sort: true, unresize: true, templet: function (d) { return d.StatusNote; } },
			{ field: 'CreateTime', title: '创建时间', width: 160, sort: true, templet: function (d) { return d.CreateTime.ToString(); } },
			{ field: 'UpdateTime', title: '修改时间', width: 160, sort: true, templet: function (d) { return d.UpdateTime.ToString(); } },
			{
				title: '操作', width: 160, align: 'center', fixed: 'right', templet: function (d) {
					var html = '';
					if (!d.IsEnabled) {
						if (HasRight('product/commissionRule/update')) {
							html += '<a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>';
						}
						if (HasRight('product/commissionRule/enable')) {
							html += '<a class="layui-btn layui-btn-xs layui-btn-warm" lay-event="enable">启用</a>';
						}
						if (HasRight('product/commissionRule/delete')) {
							html += '<a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del">删除</a>';
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

	//加载年份
	for (i = 2020; i < 2022; i++) {
		$('#year').CreateSelectOption(i + '年', i);
	}
	//加载月份
	for (i = 1; i < 13; i++) {
		$('#month').CreateSelectOption(i + '月', i);
	}
	form.render('select', 'search');

	//日历控件
	laydate.render({ elem: '#start' });
	laydate.render({ elem: '#end' });

	//事件
	var active = {
		/**
		 * 新增
		 */
		add: function () {
			active.edit(0, { ProductId: productId });
		},
		/**
		 * 修改
		 * @param {Number} id id
		 * @param {Object} data data
		 */
		edit: function (id, data) {
			dialog.open({
				title: (id > 0 ? '编辑' : '添加') + ' - ' + data.ProductId,
				url: '/product/commissionRule/edit/' + id + '/' + data.ProductId,
				width: '720px',
				height: '420px',
				btn: ['确定', '取消'],
				yes: function (index, layero) {
					layero.find('iframe').contents().find('#submit').trigger('click');
				}
			});
		},
		/**
		 * 启用
		 * @param {Number} id id
		 */
		enable: function (id) {
			layer.confirm('确定启用吗？启用后不可修改或删除！', function (index) {
				$.ajax('/commissionRule/enable/' + id, {
					type: 'put',
					dataType: 'json',
					success: function (json) {
						layer.msg('已启用');
						layui.list.reload();
						layer.close(index);
					}
				});
			});
		},
		/**
		 * 删除
		 * @param {Number} id id
		 */
		del: function (id) {
			layer.confirm('确定删除吗？', function (index) {
				$.ajax('/commissionRule/delete/' + id, {
					type: 'delete',
					dataType: 'json',
					success: function (json) {
						//obj.del();
						layer.msg('已删除');
						layui.list.reload();
						layer.close(index);
					}
				});
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

	//权限控制
	if (HasRight('product/commissionRule/add')) {
		$('.tools .layui-btn[data-type=add]').show();
	}
});
