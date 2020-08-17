layui.define(['jquery', 'layer'], function (exports) {
	var $ = layui.jquery,
		layer = layui.layer;
	exports('dialog', {
		/**
		 * 弹出窗口
		 * @param {Object} option 配置
		 * @returns {Number} index
		 */
		open: function (option) {
			var setting = {
				url: null,
				width: '600px',
				//height: '400px',
				full: false,
				type: 1,//0（信息框，默认）1（页面层）2（iframe层）3（加载层）4（tips层
				area: '',
				fix: false, //不固定
				maxmin: true,
				shadeClose: true,
				shade: 0.4,
				title: false,
				content: null,
				success: function (layero, index) {
					layero.find('iframe').contents().find('html').css('background-color', '#fff');
				}
			};
			$.extend(setting, option || {});

			if (setting.full) {
				setting.width = $(window).width() + 'px';
				setting.height = $(window).height() + 'px';
				setting.area = [setting.width, setting.height];
				setting.maxmin = false;
			} else if (!setting.area) {
				if (!setting.width) {
					setting.width = $(window).width() * 0.9 + 'px';
				}
				if (!setting.height) {
					setting.height = $(window).height() - 50 + 'px';
				}
				setting.area = [setting.width, setting.height];
			}

			if (setting.url) {
				setting.type = 2;
				setting.content = setting.url;
				setting.url = null;
			} else {
				//
			}

			return layer.open(setting);
		}
	});
});
