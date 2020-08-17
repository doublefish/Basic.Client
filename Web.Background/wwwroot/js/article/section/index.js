layui.use(['jquery', 'layer', 'form'], function () {
	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form;

	//初始化树
	var treeObj = $.fn.zTree.init($('#tree'), {
		treeId: 'tree',
		async: {
			enable: true,
			url: '/article/section/list',
			autoParam: ['Id=parentId'],
			type: 'get',
			dataType: 'json',
			dataFilter: function (treeId, parentNode, responseData) {
				$.each(responseData, function (i, data) {
					data.ParentName = parentNode ? parentNode.Name : '';
					data.isParent = data.HasChild;
				});
				return responseData;
			}
		},
		data: {
			key: { name: 'Name' },
			simpleData: { enable: true, idKey: 'Id', pIdKey: 'ParentId', rootPId: Config.Article.Section.Root }
		},
		callback: {
			beforeAsync: function (treeId, treeNode) {
				var treeObj = this.getZTreeObj('tree');
				if (treeNode) {
					treeObj.setting.async.url = '/article/section/list/' + treeNode.Id;
				} else {
					treeObj.setting.async.url = '/article/section/list/' + Config.Article.Section.Root;
				}
				return true;
			},
			onClick: function (event, treeId, treeNode, clickFlag) {
				//刷新子节点
				treeObj.reAsyncChildNodes(treeNode, 'refresh');
				load(treeNode);
			},
			onExpand: function (event, treeId, treeNode) {
				//刷新子节点
				treeObj.reAsyncChildNodes(treeNode, 'refresh');
			},
			onRightClick: function (event, treeId, treeNode) {
				if (!treeNode) {
					return false;
				}
				load(treeNode);
				var $updateStatus = $('#updateStatus');
				$updateStatus.off('click');
				var status = 0;
				if (treeNode.IsEnabled === true) {
					status = Config.Status.Disabled;
					$updateStatus.text('禁用');
				} else {
					status = Config.Status.Enabled;
					$updateStatus.text('启用');
				}
				//绑定修改状态事件
				$updateStatus.on('click', { id: treeNode.Id, status: status }, function (e) {
					$('#rMenu').hide();
					var node = treeObj.getSelectedNodes()[0];
					if (!node) {
						return false;
					}
					if (status === Config.Status.Disabled && node.children.length > 0) {
						return layer.msg('当前节点有子节点，无法禁用！', { icon: 5, time: 3000, anim: 6 });
					}

					$.ajax('/article/section/updateStatus/' + node.Id, {
						type: 'put',
						contentType: 'application/json',
						data: JSON.stringify(status),
						success: function () {
							layer.msg(status === Config.Status.Enabled ? '已启用' : '已禁用');
							//刷新子节点
							treeObj.reAsyncChildNodes(node.getParentNode(), 'refresh');
						}
					});
				});

				if (event.target.tagName.toLowerCase() !== 'button' && $(event.target).parents('a').length === 0) {
					treeObj.cancelSelectedNode();
				} else {
					treeObj.selectNode(treeNode);
				}
				$('#rMenu').show();
				$('#rMenu').css({ 'top': event.clientY + 'px', 'left': event.clientX + 'px' });
			}
		}
	}, null);

	//加载状态
	$.ajax('/article/section/listStatus', {
		type: 'get',
		dataType: 'json',
		success: function (json) {
			$('#Status').CreateSelectOptions(json);
			form.render('select');
		}
	});

	//自定义验证规则
	form.verify({
		code: function (value) {
			if (value.length > 30) {
				return '请输入30个字符以内的编码';
			}
		},
		name: function (value) {
			if (value.length > 20) {
				return '请输入20个字符以内的名称';
			}
		},
		sequence: function (value) {
			if (value < 0) {
				return '请输入一个不小于零的排序数字';
			}
		},
		note: function (value) {
			if (value.length > 200) {
				return '请输入200个字符以内的描述';
			}
		}
	});

	//监听提交
	form.on('submit', function (data) {
		var url = '/article/section/add';
		var type = 'post';
		if (data.field.Id > 0) {
			url = '/article/section/update/' + data.field.Id;
			type = 'put';
		}
		data.field.ParentId = data.field.ParentId.ToInt();
		data.field.Sequence = data.field.Sequence.ToInt();
		data.field.Status = data.field.Status ? Config.Status.Enabled : Config.Status.Disabled;

		$.ajax(url, {
			type: type,
			contentType: 'application/json',
			data: JSON.stringify(data.field),
			dataType: 'json',
			success: function (json) {
				layer.msg('已保存');
				//刷新子节点
				var node = treeObj.getSelectedNodes()[0];
				if (node) {
					//判断当前操作是否添加子级节点
					if (node.Id === $('#ParentId').val().ToInt()) {
						node.isParent = true;
					} else {
						node = node.getParentNode();
					}
				}
				treeObj.reAsyncChildNodes(node, 'refresh');
			}
		});
		return false;
	});

	//重置点按钮击事件
	$('.layui-form button[type="reset"]').on('click', function () {
		var node = treeObj.getSelectedNodes()[0];
		if (node) {
			return false;
		}
		load({ Id: 0, Name: '', ParentId: node.ParentId, ParentName: node.ParentName });
		return false;
	});

	//左键点击隐藏右键菜单
	$('body').on('mousedown', function (e) {
		if (!(e.target.id === 'rMenu' || $(e.target).parents('#rMenu').length > 0)) {
			$('#rMenu').hide();
		}
	});

	//添加子节点
	$('#addChild').on('click', function () {
		$('#rMenu').hide();
		var node = treeObj.getSelectedNodes()[0];
		if (!node) {
			return false;
		}
		load({ Id: 0, Name: '', ParentId: node.Id, ParentName: node.Name, Sequence: 99, Status: Config.Status.Enabled });
	});

	//添加兄弟节点
	$('#addBrother').on('click', function () {
		$('#rMenu').hide();
		var node = treeObj.getSelectedNodes()[0];
		if (!node) {
			return false;
		}
		load({ Id: 0, Name: '', ParentId: node.ParentId, ParentName: node.ParentName, Sequence: 99, Status: Config.Status.Enabled });
	});

	//删除
	$('#del').on('click', function () {
		$('#rMenu').hide();
		var node = treeObj.getSelectedNodes()[0];
		if (!node) {
			return false;
		}
		if (node.children && node.children.length > 0) {
			return layer.msg('当前节点有子节点，无法删除！', { icon: 5, time: 3000, anim: 6 });
		}
		var message = '确认删除节点：' + node.Name + '！';
		layer.confirm(message, function () {
			$.ajax('/article/section/delete/' + node.Id, {
				type: 'delete',
				success: function () {
					layer.msg('已删除');
					//刷新子节点
					treeObj.reAsyncChildNodes(node.getParentNode(), 'refresh');
				}
			});
		});
	});

	//刷新缓存
	$('#btnRefreshCache').on('click', function () {
		$.ajax('/article/section/refreshCache', {
			type: 'put',
			success: function () {
				layer.msg('已刷新');
			}
		});
	});

	//权限控制
	if (HasRight('dict/add')) {
		$('#addChild').show();
		$('#addBrother').show();
		$('#btnSave').show();
		$('#btnReset').show();
	}
	if (HasRight('dict/update')) {
		$('#btnSave').show();
		$('#btnReset').show();
	}
	if (HasRight('dict/updateStatus')) {
		$('#updateStatus').show();
	}
	if (HasRight('dict/delete')) {
		$('#del').show();
	}
	if (HasRight('dict/refreshcache')) {
		$('#btnRefreshCache').show();
	}
});

/**
 * 加载
 * @param {Object} json json
 */
function load(json) {
	$('#Id').val(json.Id);
	$('#ParentId').val(json.ParentId);
	$('#Code').val(json.Code);
	$('#Name').val(json.Name);
	$('#ParentName').val(json.ParentName);
	$('#Sequence').val(json.Sequence);
	$('#Status').prop('checked', json.Status === Config.Status.Enabled);
	$('#Note').val(json.Note);
	layui.form.render();
}
