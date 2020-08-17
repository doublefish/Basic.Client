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
		url: '/product/list',
		//toolbar: '#toolbar',
		cols: [[
			{ checkbox: true, fixed: 'left' },
			{ field: 'Id', title: 'ID', width: 60, sort: true, align: 'right', fixed: 'left' },
			{ field: 'Name', title: '名称', width: 200, sort: true },
			{ field: 'Type', title: '类型', width: 75, sort: true, templet: function (d) { return d.TypeNote; } },
			{ field: 'TagNames', title: '标签', width: 120, unresize: true, templet: function (d) { return d.TagNames.join('/'); } },
			{ field: 'ThemeNames', title: '主题', width: 150, unresize: true, templet: function (d) { return d.ThemeNames.join('/'); } },
			{ field: 'Price', title: '价格', width: 105, sort: true, align: 'right', templet: function (d) { return d.Price.ToStringForFloat(); } },
			{ field: 'Recommends', title: '推荐人数', width: 105, sort: true, align: 'right', templet: function (d) { return d.Recommends.ToStringForInt(); } },
			{ field: 'Sequence', title: '顺序', width: 75, sort: true, align: 'right' },
			{
				field: 'Status', title: '状态', width: 95, sort: true, unresize: true, templet: function (d) {
					var html = '';
					if (HasRight('product/updateStatus')) {
						html += '<input type="checkbox" name="status" value="' + d.Id + '" lay-skin="switch" lay-text="启用|禁用" lay-filter="status" ' + (d.IsEnabled === true ? 'checked="checked"' : '') + ' />';
					} else {
						html += d.StatusNote;
					}
					return html;
				}
			},
			{ field: 'CreateTime', title: '创建时间', width: 160, sort: true, templet: function (d) { return d.CreateTime.ToString(); } },
			{ field: 'UpdateTime', title: '修改时间', width: 160, sort: true, templet: function (d) { return d.UpdateTime.ToString(); } },
			{
				title: '操作', width: 270, align: 'center', fixed: 'right', templet: function (d) {
					var html = '';
					if (HasRight('product/update')) {
						html += '<a class="layui-btn layui-btn-xs" lay-event="edit">编辑</a>';
					}
					if (HasRight('product/images')) {
						html += '<a class="layui-btn layui-btn-xs" lay-event="images">图片</a>';
					}
					if (HasRight('product/discount/list')) {
						html += '<a class="layui-btn layui-btn-xs layui-btn-warm" lay-event="discounts">折扣</a>';
					}
					if (HasRight('product/commissionRule/list')) {
						html += '<a class="layui-btn layui-btn-xs layui-btn-warm" lay-event="commissionRules">佣金规则</a>';
					}
					if (HasRight('product/delete')) {
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

	//加载类型
	$.ajax('/product/listType', {
		type: 'get',
		dataType: 'json',
		success: function (json) {
			$('#type').CreateSelectOptions(json);
			form.render('select', 'search');
		}
	});
	//加载标签
	$.ajax('/product/listTag', {
		type: 'get',
		dataType: 'json',
		success: function (json) {
			var $container = $('#tag');
			$.each(json, function (i, data) {
				$container.append('<input type="checkbox" id="tag-' + data.Id + '" value="' + data.Id + '" lay-filter="tag" lay-skin="primary" title="' + data.Name + '" />');
			});
			form.render('checkbox', 'search');
			//监听事件
			form.on('checkbox(tag)', function (data) {
				var $input = $('#tags');
				var values = $input.val().split(',');
				data.elem.checked ? values.push(this.value) : values.remove(this.value);
				$input.val(values.join(','));
			});
		}
	});
	//加载主题
	$.ajax('/product/listTheme', {
		type: 'get',
		dataType: 'json',
		success: function (json) {
			var $container = $('#theme');
			$.each(json, function (i, data) {
				$container.append('<input type="checkbox" id="theme-' + data.Id + '" value="' + data.Id + '" lay-filter="theme" lay-skin="primary" title="' + data.Name + '" />');
			});
			form.render('checkbox', 'search');
			//监听事件
			form.on('checkbox(theme)', function (data) {
				$input = $('#themes');
				var values = $input.val().split(',');
				data.elem.checked ? values.push(this.value) : values.remove(this.value);
				$input.val(values.join(','));
			});
		}
	});
	//加载状态
	$.ajax('/product/listStatus', {
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
			active.edit(0);
		},
		/**
		 * 修改
		 * @param {Number} id id
		 * @param {Object} data data
		 */
		edit: function (id, data) {
			dialog.open({
				title: id > 0 ? '编辑' : '添加',
				url: '/product/edit/' + id,
				width: '1080px',
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
			$.ajax('/product/updateStatus/' + id, {
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
				$.ajax('/product/delete/' + id, {
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
		 * 图片管理
		 * @param {Number} id id
		 * @param {Object} data data
		 */
		images: function (id, data) {
			dialog.open({
				title: '图片管理 - ' + data.Name,
				url: '/product/images/' + id,
				width: '1080px',
				btn: ['确定']
			});
		},
		/**
		 * 折扣管理
		 * @param {Number} id id
		 * @param {Object} data data
		 */
		discounts: function (id, data) {
			dialog.open({
				title: '折扣管理 - ' + data.Name,
				url: '/product/discount/list/' + id,
				width: '1080px',
				btn: ['确定']
			});
		},
		/**
		 * 佣金规则管理
		 * @param {Number} id id
		 * @param {Object} data data
		 */
		commissionRules: function (id, data) {
			dialog.open({
				title: '佣金规则管理 - ' + data.Name,
				url: '/product/commissionRule/list/' + id,
				width: '1080px',
				btn: ['确定']
			});
		},
		/**
		 * 批量新增佣金规则
		 */
		addCommissionRules: function () {
			var checkStatus = table.checkStatus('list');
			if (checkStatus.data.length === 0) {
				return layer.msg('请选择数据', { icon: 5, time: 3000, anim: 6 });
			}

			var ids = [];
			$.each(checkStatus.data, function (i, data) {
				ids.push(data.Id);
			});
			var idsStr = ids.join(',');

			dialog.open({
				title: '批量新增佣金规则 - ' + idsStr,
				url: '/product/commissionRule/edit/0/' + idsStr,
				width: '720px',
				height: '420px',
				btn: ['确定', '取消'],
				yes: function (index, layero) {
					layero.find('iframe').contents().find('#submit').trigger('click');
				}
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
	if (HasRight('product/add')) {
		$('.tools .layui-btn[data-type=add]').show();
	}
	if (HasRight('product/addCommissionRules')) {
		$('.tools .layui-btn[data-type=addCommissionRules]').show();
	}
	if (HasRight('product/delete')) {
		//$('.tools .layui-btn[data-type=batchDel]').show();
	}
});
