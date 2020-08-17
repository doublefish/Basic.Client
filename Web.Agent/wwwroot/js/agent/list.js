layui.use(['jquery', 'layer', 'form', 'table', 'list', 'dialog'], function () {
	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form,
		table = layui.table,
		list = layui.list,
		dialog = layui.dialog;

	//初始化列表
	list.init({
		url: '/agent/list',
		//toolbar: '#toolbar',
		cols: [[
			{ checkbox: true, fixed: 'left' },
			{ field: 'Id', title: 'ID', width: 60, sort: true, align: 'right', fixed: 'left' },
			{ field: 'Name', title: '名称', width: 120, sort: true },
			{ field: 'Level', title: '等级', width: 75, sort: true },
			{ field: 'Balance', title: '账户余额', width: 120, sort: true, align: 'right', templet: function (d) { return d.Balance.ToStringForFloat(); } },
			{ field: 'Freeze', title: '冻结金额', width: 120, sort: true, align: 'right', templet: function (d) { return d.Freeze.ToStringForFloat(); } },
			{
				field: 'Status', title: '状态', width: 95, sort: true, unresize: true, templet: function (d) {
					var html = '';
					if (HasRight('agent/updateStatus')) {
						html += '<input type="checkbox" name="status" value="' + d.Id + '" lay-skin="switch" lay-text="启用|禁用" lay-filter="status" ' + (d.IsEnabled === true ? 'checked="checked"' : '') + ' />';
					} else {
						html += d.StatusNote;
					}
					return html;
				}
			},
			{ field: 'CreateTime', title: '创建时间', width: 165, templet: function (d) { return d.CreateTime.ToString(); } },
			{ field: 'UpdateTime', title: '修改时间', width: 165, templet: function (d) { return d.UpdateTime.ToString(); } },
			{ field: 'Note', title: '描述', width: 200 },
			{
				title: '操作', width: 120, align: 'center', fixed: 'right', templet: function (d) {
					var html = '';
					if (HasRight('agent/update')) {
						html += '<a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>';
					}
					if (HasRight('agent/delete')) {
						html += '<a class="layui-btn layui-btn-xs layui-btn-danger" lay-event="del">删除</a>';
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

	//加载状态
	$.ajax('/agent/listStatus', {
		type: 'get',
		dataType: 'json',
		success: function (json) {
			$('#Status').CreateSelectOptions(json);
			form.render('select', 'search');
		}
	});

	//事件
	var active = {
		/**
		 * 新增
		 */
		add: function () {
			active.edit(0);
		},
		/**
		 * 修改
		 * @param {Number} id id
		 */
		edit: function (id) {
			dialog.open({
				title: id > 0 ? '编辑' : '添加',
				height: '420px',
				url: '/agent/edit/' + id,
				btn: ['确定', '取消'],
				yes: function (index, layero) {
					layero.find('iframe').contents().find('#submit').trigger('click');
				}
			});
		},
		/**
		 * 修改状态
		 * @param {Number} id id
		 * @param {Number} status status
		 */
		updateStatus: function (id, status) {
			$.ajax('/agent/updateStatus/' + id, {
				type: 'put',
				contentType: 'application/json',
				data: JSON.stringify(status),
				dataType: 'json',
				success: function (json) {
					layer.msg('已修改');
					layui.list.reload();
				}
			});
		},
		/**
		 * 删除
		 * @param {Number} id id
		 */
		del: function (id) {
			layer.confirm('确定删除吗？', function (index) {
				$.ajax('/agent/delete/' + id, {
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
		},
		/**
		 * 批量删除
		 * @returns {Number} 非零失败
		 */
		batchDel: function () {
			var checkStatus = table.checkStatus('list');

			if (checkStatus.data.length === 0) {
				return layer.msg('请选择数据', { icon: 5, time: 3000, anim: 6 });
			}

			layer.confirm('确定删除吗？', function (index) {
				layer.msg('不可执行此操作', { icon: 5, time: 3000, anim: 6 });
			});
		}
	};

	//监听状态操作
	form.on('switch(status)', function (obj) {
		var status = obj.elem.checked ? Config.Status.Enabled : Config.Status.Disabled;
		active.updateStatus(obj.value, status);
	});

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
	if (HasRight('agent/add')) {
		$('.tools .layui-btn[data-type=add]').show();
	}
	if (HasRight('agent/delete')) {
		$('.tools .layui-btn[data-type=batchDel]').show();
	}
});
