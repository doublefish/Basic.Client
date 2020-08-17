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
		url: '/article/list',
		//toolbar: '#toolbar',
		cols: [[
			//{ checkbox: true, fixed: 'left' },
			{ field: 'Id', title: 'ID', width: 60, sort: true, align: 'right', fixed: 'left' },
			{ field: 'Title', title: '标题', width: 120, sort: true },
			{
				field: 'SectionNames', title: '版块', width: 120, unresize: true, templet: function (d) {
					var html = '';
					if (d.SectionNames.length > 0) {
						$.each(d.SectionNames, function (i, data) {
							html += ',' + data;
						});
						html = html.substr(1);
					}
					return html;
				}
			},
			{ field: 'Summary', title: '摘要', width: 200 },
			{ field: 'Author', title: '作者', width: 120, sort: true },
			{ field: 'Source', title: '来源', width: 120, sort: true },
			{ field: 'ReleaseTime', title: '发布时间', width: 105, sort: true, templet: function (d) { return d.ReleaseTime.ToStringForDate(); } },
			{
				field: 'Status', title: '状态', width: 95, sort: true, unresize: true, templet: function (d) {
					var html = '';
					if (HasRight('article/updateStatus')) {
						html += '<input type="checkbox" name="status" value="' + d.Id + '" lay-skin="switch" lay-text="发布|取消" lay-filter="status" ' + (d.IsReleased === true ? 'checked="checked"' : '') + ' />';
					} else {
						html += d.StatusNote;
					}
					return html;
				}
			},
			{ field: 'CreateTime', title: '创建时间', width: 160, sort: true, templet: function (d) { return d.CreateTime.ToString(); } },
			{ field: 'UpdateTime', title: '修改时间', width: 160, sort: true, templet: function (d) { return d.UpdateTime.ToString(); } },
			{
				title: '操作', width: 110, align: 'center', fixed: 'right', templet: function (d) {
					var html = '';
					if (HasRight('article/update')) {
						html += '<a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>';
					}
					if (HasRight('article/delete')) {
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

	//加载栏目
	$.ajax('/article/listSection', {
		type: 'get',
		dataType: 'json',
		success: function (json) {
			$('#section').CreateSelectOptions(json);
			form.render('select', 'search');
		}
	});

	//加载状态
	$.ajax('/article/listStatus', {
		type: 'get',
		dataType: 'json',
		success: function (json) {
			$('#status').CreateSelectOptions(json);
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
			parent.layui.index.openTabsPage('/article/edit/0', '添加文章');
		},
		/**
		 * 修改
		 * @param {Number} id id
		 * @param {Object} data data
		 */
		edit: function (id, data) {
			parent.layui.index.openTabsPage('/article/edit/' + id, '编辑文章 - ' + data.Title);
		},
		/**
		 * 修改状态
		 * @param {Number} id id
		 * @param {Number} status status
		 */
		updateStatus: function (id, status) {
			$.ajax('/article/updateStatus/' + id, {
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
				$.ajax('/article/delete/' + id, {
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
	if (HasRight('article/add')) {
		$('.tools .layui-btn[data-type=add]').show();
	}
	if (HasRight('article/delete')) {
		//$('.tools .layui-btn[data-type=batchDel]').show();
	}
});
