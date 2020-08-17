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
			{ field: 'DestinationNames', title: '目的地', width: 105, unresize: true, templet: function (d) { return d.DestinationNames.join('/'); } },
			{ field: 'DeparturenName', title: '出发地', width: 90, sort: true },
			{ field: 'Price', title: '价格', width: 105, sort: true, align: 'right', templet: function (d) { return d.Price.ToStringForFloat(); } },
			{ field: 'Recommends', title: '推荐人数', width: 105, sort: true, align: 'right', templet: function (d) { return d.Recommends.ToStringForInt(); } },
			{ field: 'Sequence', title: '顺序', width: 75, sort: true, align: 'right' },
			{ field: 'Status', title: '状态', width: 75, sort: true, unresize: true, templet: function (d) { return d.StatusNote; } },
			{ field: 'CreateTime', title: '创建时间', width: 160, sort: true, templet: function (d) { return d.CreateTime.ToString(); } },
			{ field: 'UpdateTime', title: '修改时间', width: 160, sort: true, templet: function (d) { return d.UpdateTime.ToString(); } },
			{
				title: '操作', width: 90, align: 'center', fixed: 'right', templet: function (d) {
					var html = '';
					if (HasRight('product/commissionRule/list')) {
						html += '<a class="layui-btn layui-btn-xs layui-btn-warm" lay-event="commissionRules">佣金规则</a>';
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
	//加载目的地
	$.ajax('/listDestination', {
		type: 'get',
		dataType: 'json',
		success: function (json) {
			var $container = $('#destination');
			$.each(json, function (i, data) {
				$container.append('<input type="checkbox" id="destination-' + data.Id + '" value="' + data.Id + '" lay-filter="destination" lay-skin="primary" title="' + data.Name + '" />');
			});
			form.render('checkbox', 'search');
			//监听事件
			form.on('checkbox(destination)', function (data) {
				$input = $('#destinations');
				var values = $input.val().split(',');
				data.elem.checked ? values.push(this.value) : values.remove(this.value);
				$input.val(values.join(','));
			});
		}
	});
	//加载出发地
	$.ajax('/listDeparture', {
		type: 'get',
		dataType: 'json',
		success: function (json) {
			var $container = $('#departure');
			$.each(json, function (i, data) {
				$container.append('<input type="checkbox" id="departure-' + data.Id + '" value="' + data.Id + '" lay-filter="departure" lay-skin="primary" title="' + data.Name + '" />');
			});
			form.render('checkbox', 'search');
			//监听事件
			form.on('checkbox(departure)', function (data) {
				$input = $('#departures');
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
				height: '370px',
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

	//权限控制
	if (HasRight('product/addCommissionRules')) {
		$('.tools .layui-btn[data-type=addCommissionRules]').show();
	}
});
