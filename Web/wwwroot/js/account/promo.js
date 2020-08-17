layui.use(['jquery', 'layer', 'form'], function () {
	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form;

	var url = '/register?promoterId=' + Token.Id;
	$('#qrCode').qrcode({
		width: 120,
		height: 120,
		text: Config.WapSiteUrl + url
	});
	$('#btnDownload').on('click', function (e) {
		var canvas = $('#qrCode').find("canvas").get(0);
		try {
			//解决IE转base64时缓存不足，canvas转blob下载
			var blob = canvas.msToBlob();
			navigator.msSaveBlob(blob, 'qrcode.jpg');
		} catch (e) {//如果为其他浏览器，使用base64转码下载
			var url = canvas.toDataURL('image/jpeg');
			$("#downloadLink").attr('href', url).attr("download", "qrcode.png").get(0).click();
		}
		return false;
	});
	$('#url').text(Config.WebSiteUrl + url);
	$('#btnCopy').CopyToClipBoard({
		target: '#url',
		success: function (e) {
			layer.msg('复制成功');
		},
		error: function (e) {
			layer.msg('复制失败');
		}
	});

	//读取我推广的会员信息
	$.ajax('/account/promotion/list', {
		type: 'get',
		contentType: 'application/json',
		dataType: 'json',
		success: function (json) {
			var html = '';
			if (json.Results.length > 0) {
				$.each(json.Results, function (i, data) {
					html += '<tr>';
					html += '	<td>' + data.Account.Mobile + '</td>';
					html += '	<td>' + data.CreateTime.ToString() + '</td>';
					html += '	<td>' + data.Orders.ToStringForInt() + '</td>';
					html += '	<td>' + data.OrderAmount.ToStringForFloat() + '元</td>';
					html += '</tr>';
				});
			} else {
				html += '<tr>';
				html += '	<td colspan="4" class="zanuw">暂无记录</td>';
				html += '</tr>';
			}
			$('#tbody').html(html);
		}
	});

});
