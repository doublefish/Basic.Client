/**
 * 当前登录用户信息
 */
var User = null;

/**
 * 获取当前登录用户信息
 * @returns {Object} 用户信息
 */
var GetUser = function () {
	$.ajax('/account/get', {
		type: 'get',
		async: false,
		dataType: 'json',
		success: function (json) {
			User = json;
		}
	});
	return User;
};

/**
 * jQuery 扩展方法
 */
(function ($) {
	/**
 * 生成分页
 * @param {Object} option 配置
 */
	$.fn.Pagination = function (option) {
		var setting = {
			elm: '#pagination',
			url: '',
			type: 'get',
			dataType: 'json',
			pageNumber: 0,
			pageSize: 10,
			data: null,
			count: 0,
			callback: function (json) { },
			changePage: function (pageNumber) {
				var option = $(setting.elm).data('setting');
				option.pageNumber = pageNumber;
				$(setting.elm).Pagination(option);
			}
		};
		$.extend(setting, option || {});

		if (!setting.data) {
			setting.data = {};
		}
		setting.data.pageNumber = setting.pageNumber;
		setting.data.pageSize = setting.pageSize;

		$.ajax(setting.url, {
			type: setting.type,
			data: setting.data,
			dataType: setting.dataType,
			success: function (json) {
				if (setting.callback) {
					setting.callback(json);
				}

				var totalCount = json.TotalCount;
				var totalPage = parseInt(totalCount / json.PageSize);
				if (totalCount % json.PageSize > 0) {
					totalPage++;
				}
				var pageNumber = json.PageNumber + 1;
				var pageSize = json.PageSize;

				var html = '';
				//html += '<div class="pagination">';
				html += '共 ' + totalCount + ' 条 ' + totalPage + ' 页&nbsp;';
				html += '当前第&nbsp;' + pageNumber + '&nbsp;页&nbsp;&nbsp;';
				if (pageNumber > 1) {
					//html += '<a href="javascript:;" data-page="1">首页</a>';
					html += '<a href="javascript:;" data-page="' + (pageNumber - 1) + '">上一页</a>';
				}

				var pages = null, i = 0;
				if (totalPage < 10) {
					pages = [];
					for (i = 0; i < totalPage; i++) {
						pages.push(i + 1);
					}
				} else {
					pages = GetNumArrayByMedian(pageNumber, 10);
					while (pages[0] < 1) {
						for (i = 0; i < pages.length; i++) {
							pages[i] = pages[i] + 1;
						}
					}
				}
				for (i = 0; i < pages.length; i++) {
					var page = pages[i];
					if (page === pageNumber) {
						html += '<a href="javascript:;" class="active">' + page + '</a>';
					} else {
						html += '<a href="javascript:;" data-page="' + page + '">' + page + '</a>';
					}
				}
				if (pageNumber < totalPage) {
					html += '<a href="javascript:;" data-page="' + (pageNumber + 1) + '">下一页</a>';
				}
				//html += ' 转到&nbsp;<input type="text" value="' + pageNumber + '" />&nbsp;页&nbsp;&nbsp;';
				//html += '<a href="javascript:;" class="go">确定</a>';
				//html += '</div>';

				var $container = $(setting.elm);
				$container.html(html);

				//存储查询条件
				$container.data('setting', setting);
				$container.find('a').on('click', { setting }, function (e) {
					var $this = $(this);
					var pageNumber = $this.data('page');
					if (pageNumber > 0) {
						e.data.setting.changePage(pageNumber);
					}
				});
				$container.find('a').on('click', { setting }, function (e) {

				});
				$container.find('a.go').on('click', { setting: setting }, function (e) {
					var pageNumber = $('#pagination input[type=text]').val();
					if (pageNumber) {
						e.data.setting.changePage(pageNumber);
					}
				});
			}
		});
	};
})(jQuery);

layui.use(['jquery', 'layer', 'form'], function () {
	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form;

	$('#_nav li a').each(function (i, e) {
		var $this = $(e);
		var href = $this.attr('href').substr(1);
		if (href.startsWith(Path)) {
			$this.parent().addClass('active');
			return false;
		}
	});

	if (Token) {
		$('#nav_account').show();
		$wellcome = $('#wellcome');
		$wellcome.show();
		$wellcome.find('span').text('欢迎您：' + Token.Data.Username);
		$wellcome.next().hide();
	}
});
