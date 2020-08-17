layui.use(['jquery', 'layer', 'laytpl', 'element', 'setter', 'view', 'admin'], function () {
	var $ = layui.jquery,
		layer = layui.layer,
		laytpl = layui.laytpl,
		element = layui.element,
		setter = layui.setter,
		view = layui.view,
		admin = layui.admin;

	admin.screen() < 2 && admin.sideFlexible();
	layui.config({ base: setter.base });
	//加载第三方插件
	layui.each(setter.extend, function (a, i) {
		var n = {}; n[i] = "{/}" + setter.base + "lib/" + i, layui.extend(n);
	});
	view().autoRender();
	layui.index = {
		openTabsPage: function (url, title) {
			if (!title) {
				title = '新标签页';
			}
			var exist = false;
			var $tabs = $('#LAY_app_tabsheader>li').each(function (i, e) {
				var id = $(this).attr('lay-id');
				if (id === url) {
					exist = true;
					admin.tabsPage.index = i;
				}
			});
			if ($tabs, setter.pageTabs) {
				if (!exist) {
					$('#LAY_app_body').append(['<div class="layadmin-tabsbody-item layui-show">', '<iframe src="' + url + '" frameborder="0" class="layadmin-iframe"></iframe>', '</div>'].join(''));
					admin.tabsPage.index = $tabs.length;
					element.tabAdd('layadmin-layout-tabs', {
						title: '<span>' + title + '</span>',
						id: url,
						attr: url.replace(/(^http(s*):)|(\?[\s\S]*$)/g, '')
					});
				}
				else {
					//已存在的刷新
					var $iframes = $('#LAY_app_body iframe');
					$iframes[admin.tabsPage.index].contentWindow.location.reload(true);
				}
			}
			else {
				var u = admin.tabsBody(admin.tabsPage.index).find('.layadmin-iframe');
				u[0].contentWindow.location.href = url;
			}
			element.tabChange('layadmin-layout-tabs', url);
			admin.tabsBodyChange(admin.tabsPage.index, { url: url, text: title });
		}
	};

	/**
	 * 加载左侧菜单
	 * @param {Array} json json
	 * @param {Number} parentId 父节点Id
	 */
	var loadNav = function (json, parentId) {
		$.each(json, function (i, data) {
			if (data.ParentId !== parentId || data.Type === Config.Menu.Type.Function) {
				return;
			}
			var html = '';
			if (data.ParentId === Config.Menu.Root) {
				html += '<li data-name="nav-' + data.Id + '" class="layui-nav-item" id="nav-' + data.Id + '">';
				if (data.PageUrl) {
					html += '<a href="javascript:;" lay-href="/' + data.PageUrl + '" lay-tips="' + data.Name + '" lay-direction="2"><i class="layui-icon layui-icon-' + data.Icon + '"></i><cite>' + data.Name + '</cite></a>';
				}
				else {
					html += '<a href="javascript:;" lay-tips="' + data.Name + '" lay-direction="2"><i class="layui-icon layui-icon-' + data.Icon + '"></i><cite>' + data.Name + '</cite></a>';
				}
				html += '</li>';
				$('#LAY-system-side-menu').append(html);
			}
			else {
				html += '<dd data-name="nav-' + data.Id + '" id="nav-' + data.Id + '">';
				if (data.PageUrl) {
					html += '<a lay-href="/' + data.PageUrl + '">' + data.Name + '</a>';
				}
				else {
					html += '<a>' + data.Name + '</a>';
				}
				html += '</dd>';
				$('#nav-child-' + data.ParentId).append(html);
			}
			if (data.Type === Config.Menu.Type.Directory) {
				$('#nav-' + data.Id).append('<dl class="layui-nav-child" id="nav-child-' + data.Id + '"></dl>');
			}
			loadNav(data.Children, data.Id);
		});
	};

	$('#login').html('<cite>' + Token.Data.Username + '</cite>');
	//获取权限
	ListRight();
	//加载左侧菜单
	loadNav(UserRights, Config.Menu.Root);
	//渲染左侧菜单
	element.init();
});

