layui.use(['jquery', 'layer', 'form', 'upload'], function () {
	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form,
		upload = layui.upload;

	var productId = $('#productId').val();

	//删除项
	var delItem = function (ids) {
		$.each(ids, function (i, data) {
			$('#li-' + data).remove();
		});
	};

	//加载列表
	var list = function () {
		$.ajax('/product/image/list/' + productId, {
			type: 'get',
			dataType: 'json',
			success: function (json) {
				$('#list').empty();
				$.each(json, function (i, data) {
					var html = '<li class="layui-col-md2" id="li-' + data.Id + '"><img src="' + data.ImageUrl + '" /></li>';
					$('#list').append(html);
					$('#li-' + data.Id).on('click', function () {
						var $this = $(this);
						var checked = $this.data('checked');
						if (checked) {
							$this.data('checked', false);
							$this.css('border-color', 'white');
						} else {
							$this.data('checked', true);
							$this.css('border-color', 'blue');
						}
					}).data('data', JSON.stringify(data));
				});
				$('#list').sortable({
					stop: function (event, ui) {
						var ids = [];
						$('#list li').each(function (i, e) {
							ids.push($(this).attr('id').substr(3).ToInt());
						});
						$.ajax('/product/image/sort', {
							type: 'put',
							contentType: 'application/json',
							data: JSON.stringify(ids),
							dataType: 'json',
							success: function (json) {
								layer.msg('已保存');
							}
						});
					}
				}).disableSelection();

			}
		});
	};
	list();

	//获取选中项
	var getCheckeds = function () {
		var checkeds = [];
		$('#list li').each(function () {
			var $this = $(this);
			if ($this.data('checked')) {
				var data = $this.data('data');
				checkeds.push(JSON.parse(data));
			}
		});
		return checkeds;
	};

	//加载上传控件
	var urls = [];
	var uploadInst = upload.render({
		elem: '#btnUpload',
		url: Config.CommonApiUrl + '/api/file/upload',
		size: 4000,
		multiple: true,
		before: function (obj) {
			this.headers = $.GetHeaders();
			layer.load();
		},
		allDone: function (obj) {
			if (urls.length > 0) {
				$.ajax('/product/image/add/' + productId, {
					type: 'post',
					contentType: 'application/json',
					data: JSON.stringify(urls),
					dataType: 'json',
					success: function (json) {
						list();
						layer.msg('已保存');
					},
					complete: function () {
						urls = [];
					}
				});
			}
		},
		done: function (res, index, upload) {
			layer.closeAll('loading');
			if (res.Code !== 0) {
				return layer.msg('上传失败：' + res.Message);
			}
			var url = Config.CommonApiUrl + '/' + res.Content.VirtualPath;
			urls.push(url);
		},
		error: function (index, upload) {
			layer.closeAll('loading');
		}
	});
	form.render();

	//事件
	var active = {
		/**
		 * 修改封面
		 * @param {Number} i 索引
		 * @returns {Number} 非零失败
		 */
		updateCover: function (i) {
			var checkeds = getCheckeds();
			if (checkeds.length === 0) {
				return layer.msg('请选择数据', { icon: 5, time: 3000, anim: 6 });
			}
			var data = checkeds[0];
			$.ajax('/product/updateCover' + (i > 0 ? i : '') + '/' + productId, {
				type: 'put',
				contentType: 'application/json',
				data: JSON.stringify(data.ImageUrl),
				dataType: 'json',
				success: function (json) {
					layer.msg('已设置');
					layui.list.reload();
				}
			});
		},
		/**
		 * 修改首页封面
		 * @returns {Number} 非零失败
		 */
		updateCover1: function () {
			return active.updateCover(1);
		},
		/**
		 * 批量删除
		 * @returns {Number} 非零失败
		 */
		batchDel: function () {
			var checkeds = getCheckeds();
			if (checkeds.length === 0) {
				return layer.msg('请选择数据', { icon: 5, time: 3000, anim: 6 });
			}
			var ids = [];
			$.each(checkeds, function (i, data) { ids.push(data.Id); });
			layer.confirm('确定删除吗？', function (index) {
				$.ajax('/product/image/delete', {
					type: 'delete',
					contentType: 'application/json',
					data: JSON.stringify(ids),
					dataType: 'json',
					success: function (json) {
						layer.msg('已删除');
						delItem(ids);
					}
				});
			});
		}
	};

	//监听工具栏事件
	$('.tools .layui-btn').on('click', function () {
		var type = $(this).data('type');
		active[type] ? active[type].call(this) : '';
	});

	//权限控制
	if (HasRight('product/images/add')) {
		$('.tools .layui-btn[data-type=upload]').show();
	}
	if (HasRight('product/images/updateCover')) {
		$('.tools .layui-btn[data-type=updateCover]').show();
	}
	if (HasRight('product/images/updateCover1')) {
		$('.tools .layui-btn[data-type=updateCover1]').show();
	}
	if (HasRight('product/images/delete')) {
		$('.tools .layui-btn[data-type=batchDel]').show();
	}
});


