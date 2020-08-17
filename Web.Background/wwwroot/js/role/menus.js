layui.use(['jquery', 'layer', 'form'], function () {
	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form;

	var roleId = $('#RoleId').val();

	/**
	 * 查询子节点
	 * @param {Number} parentId 父节点Id
	 * @param {Array<Object>} json 数据源
	 * @returns {Array<Object>} 结果
	 */
	function listChidren(parentId, json) {
		var newJson = [];
		$.each(json, function (i, data) {
			if (data.ParentId === parentId) {
				data.Children = listChidren(data.Id, json);
				data.isParent = data.Children.length > 0;
				newJson.push(data);
			}
		});
		return newJson;
	}

	//初始化树
	var treeObj = $.fn.zTree.init($("#tree"), {
		treeId: 'tree',
		async: {
			enable: true,
			url: '/menu/listAll',
			type: 'get',
			dataType: 'json',
			dataFilter: function (treeId, parentNode, responseData) {
				return listChidren(Config.Menu.Root, responseData);
			}
		},
		check: { enable: true },
		data: {
			key: { name: 'Name', children: 'Children' },
			simpleData: { enable: true, idKey: 'Id', pIdKey: 'ParentId', rootPId: Config.Menu.Root }
		},
		callback: {
			onAsyncSuccess: function (event, treeId, treeNode, msg) {
				$.ajax('/role/get/' + roleId, {
					type: 'get',
					dataType: 'json',
					success: function (json) {
						$.each(json.MenuIds, function (i, data) {
							var node = treeObj.getNodeByParam('Id', data, null);
							if (node) {
								treeObj.checkNode(node, true, false);
							}
						});
					}
				});
			}
		}
	}, null);

	//监听提交
	form.on('submit(submit)', function (data) {
		var nodes = treeObj.getCheckedNodes(true);
		var menuIds = new Array();
		$.each(nodes, function (i, node) {
			menuIds.push(node.Id);
		});
		$.ajax('/role/updateMenus/' + data.field.RoleId, {
			type: 'put',
			contentType: 'application/json',
			data: JSON.stringify(menuIds),
			success: function () {
				parent.layer.msg('已保存');
				//parent.layui.list.reload();
				parent.layer.close(parent.layer.getFrameIndex(window.name));
			}
		});
	});
});
