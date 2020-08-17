layui.use(['jquery', 'layer', 'form', 'upload', 'dialog'], function () {
	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form,
		upload = layui.upload,
		dialog = layui.dialog;

	//加载上传控件
	var uploadInst = upload.render({
		elem: '#btnUpload',
		url: Config.CommonApiUrl + '/api/file/upload',
		size: 4000,
		multiple: true,
		auto: false,
		bindAction: '#btnUpload1',
		choose: function (obj) {
			//读取本地文件
			obj.preview(function (index, file, result) {
				$('.photo-list img').attr('src', result);//图片链接（base64）
			});
		},
		before: function (obj) {
			this.headers = $.GetHeaders();
			layer.load();
		},
		done: function (res, index, upload) {
			layer.closeAll('loading');
			if (res.Code !== 0) {
				return layer.msg('上传失败：' + res.Message);
			}
			var url = Config.CommonApiUrl + '/' + res.Content.VirtualPath;
			$.ajax('/account/updateAvatar/', {
				type: 'put',
				contentType: 'application/json',
				data: JSON.stringify(url),
				dataType: 'json',
				success: function (json) {
					layer.msg('上传成功');
					$('#Avatar').attr('src', url);
				}
			});
		},
		error: function (index, upload) {
			layer.closeAll('loading');
		}
	});
	form.render();

	$.ajax('/account/get', {
		type: 'get',
		dataType: 'json',
		success: function (json) {
			if (json.Avatar) {
				$('#Avatar').attr('src', json.Avatar);
			}
			$('#Nickname').text(json.Nickname ? json.Nickname : '');
			$('#Mobile').text(json.Mobile);
			$('#Balance').text(json.Balance.ToStringForFloat());
			$('#nickname').val(json.Nickname);
		}
	});

	$('#changeAvatar').on('click', function () {
		var $imgs = $('.photo-list img');
		$imgs.eq(0).attr('src', '/img/self/gr_mrtx_70.png');
		$imgs.eq(1).attr('src', '/img/self/gr_mrtx_50.png');
		$imgs.eq(2).attr('src', '/img/self/gr_mrtx_30.png');

		dialog.open({
			type: 1,
			title: '个人头像',
			shade: 0,
			offset: '190px',
			height: 'auto',
			content: $('#divAvatar'),
			btn: ['确定', '取消'],
			yes: function (index, layero) {
				$('#btnUpload1').trigger('click');
				layer.close(index);
			}
		});
	});

	$('#changeNickname').on('click', function () {
		dialog.open({
			type: 1,
			title: '修改昵称',
			shade: 0,
			offset: '250px',
			width: '480px',
			height: 'auto',
			content: $('#divNickname'),
			btn: ['确定', '取消'],
			yes: function (index, layero) {
				var nickname = $('#nickname').val();
				$.ajax('/account/updateNickname/', {
					type: 'put',
					contentType: 'application/json',
					data: JSON.stringify(nickname),
					dataType: 'json',
					success: function (json) {
						layer.msg('修改成功');
						$('#Nickname').text(nickname);
						layer.close(index);
					}
				});
			}
		});
	});

	$('#withdraw').on('click', function () {
		dialog.open({
			type: 1,
			title: '提现',
			shade: 0,
			offset: '250px',
			width: '400px',
			height: 'auto',
			content: $('#divWithdraw'),
			btn: ['确定', '取消'],
			yes: function (index, layero) {
				layer.close(index);
				var dialog0 = dialog.open({
					type: 1,
					title: '提现',
					shade: 0,
					offset: '250px',
					width: '400px',
					height: 'auto',
					content: $('#divWithdrawSuccess'),
					yes: function (index, layero) {

					}
				});
				$('#divWithdrawSuccess button.know').on('click', function () {
					layer.close(dialog0);
				});
			}
		});
	});

});
