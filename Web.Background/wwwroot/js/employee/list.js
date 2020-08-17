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
		url: '/employee/list',
		cols: [[
			{ checkbox: true, fixed: 'left' },
			{ field: 'Id', title: 'ID', width: 60, sort: true, align: 'right', fixed: 'left' },
			{ field: 'FullName', title: '姓名', width: 90, sort: true },
			{ field: 'EntryTime', title: '入职时间', width: 100, sort: true },
			{ field: 'SexStr', title: '性别', width: 105 },
			{ field: 'IdNumber', title: '证件号码', width: 120, sort: true },
			{ field: 'Status', title: '状态', width: 120, },
			{ field: 'BuildingFloor', title: '负责楼层', width: 120 },
			{ field: 'OrdId', title: '所属机构', width: 120, },
			{ field: 'CreateTime', title: '创建时间', width: 160, sort: true, templet: function (d) { return d.CreateTime.ToString(); } },
			{
				title: '操作', width: 180, align: 'center', fixed: 'right', templet: function (d) {
					var html = '';
					if (HasRight('employee/account')) {
						html += '<a class="layui-btn layui-btn-xs layui-btn-warm" lay-event="openAccount">开通帐号</a>';
					}
					if (HasRight('employee/update')) {
						html += '<a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>';
					}
					if (HasRight('employee/delete')) {
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

	//加载机构
	$.ajax('/employee/orglist', {
		type: 'get',
		dataType: 'json',
		success: function (json) {
			$('#OrgId').CreateSelectOptions(json);
			form.render('select', 'search');
		}
	});

	//日历控件
	laydate.render({ elem: '#start' });
	laydate.render({ elem: '#end' });

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
				url: '/user/edit/' + id,
				height: '660px',
				btn: ['确定', '取消'],
				yes: function (index, layero) {
					layero.find('iframe').contents().find('#submit').trigger('click');
				}
			});
		},
		/**
		 * 删除
		 * @param {Number} id id
		 */
		del: function (id) {
			layer.confirm('确定删除吗？', function (index) {
				$.ajax('/employee/delete/' + id, {
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
		},
		/**
		 * 开通登录帐号
		 * @param {Number} id id
		 */
		openAccount: function (id) {

		},
		/**
		 * 导出Excel
		 */
		excel: function () {
			list.export('系统用户');
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
	if (HasRight('employee/add')) {
		$('.tools .layui-btn[data-type=add]').show();
	}
	if (HasRight('employee/excel')) {
		$('.tools .layui-btn[data-type=excel]').show();
	}
});
