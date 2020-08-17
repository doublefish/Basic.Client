layui.use(['jquery', 'layer', 'form'], function () {
	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form;

	if (!Token.Data.IsAdminOfAgent) {
		$('#divPromo').show();
		$.ajax('/personal/get', {
			type: 'get',
			dataType: 'json',
			success: function (json) {
				var url = '/register?promoCode=' + json.PromoCode;
				$('#qrCode').qrcode({
					width: 200,
					height: 200,
					text: Config.WapSiteUrl + url
				});
				$('#url').text(Config.WebSiteUrl + url);
			}
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
		$('#btnCopy').CopyToClipBoard({
			target: '#url',
			success: function (e) {
				layer.msg('复制成功');
			},
			error: function (e) {
				layer.msg('复制失败');
			}
		});
	}
});
