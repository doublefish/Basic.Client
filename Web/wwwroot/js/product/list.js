layui.use(['jquery', 'layer', 'form'], function () {
	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form;

	//链接参数
	var UrlParams = $.GetUrlParams();

	//查询条件
	var Params = {
		type: null,
		typeName: null,
		tags: [],
		tagNames: [],
		themes: [],
		destinations: [],
		departures: [],
		pageNumber: 0,
		pageSize: 6,
		sortName: 'Id',
		sortType: 0
	};

	if (UrlParams.tagNames) {
		Params.tagNames = UrlParams.tagNames.split(',');
	}

	/**
	 * 加载列表
	 * @param {Object} urlParams 链接参数
	 */
	var list = function (urlParams) {
		var data = {
			type: Params.type,
			typeName: Params.typeName,
			tags: Params.tags.join(','),
			tagNames: Params.tagNames.join(','),
			themes: Params.themes.join(','),
			destinations: Params.destinations.join(','),
			departures: Params.departures.join(','),
			pageNumber: Params.pageNumber,
			pageSize: Params.pageSize,
			sortName: Params.sortName,
			sortType: Params.sortType
		};

		if (urlParams) {
			if (urlParams.type) {
				data.type = urlParams.type;
			}
			if (urlParams.typeName) {
				data.typeName = urlParams.typeName;
			}
		}

		$(null).Pagination({
			url: '/product/list',
			pageSize: data.pageSize,
			data: data,
			callback: function (json) {
				$('#list').empty();
				$.each(json.Results, function (i, data) {
					var iconClass = '';
					switch (data.Type) {
						case 1: iconClass = 'bg-g'; break;
						case 2: iconClass = 'bg-l'; break;
						case 9: iconClass = 'bg-o'; break;
						default: iconClass = 'bg-l'; break;
					}
					var html = '';
					html += '<li>';
					html += '	<a href="/product/detail/' + data.Id + '"><img src="' + (data.Cover ? data.Cover : '/img/undefined.png') + '" /></a>';
					html += '	<a href="/product/detail/' + data.Id + '">' + data.Name + '</a>';
					html += '	<p>';
					html += '		<span class="fl mt5"><small class="' + iconClass + '">' + data.TypeNote + '</small>' + data.DestinationNames.join('&nbsp;') + '</span>';
					html += '		<span class="fr font10">￥<b class="font24 red">' + data.Price.ToStringForFloat() + '</b>起</span>';
					html += '	</p>';
					html += '</li>';
					$('#list').append(html);
				});
			}
		});
	};

	//加载类型
	$.ajax('/product/listType', {
		type: 'get',
		//async: false,
		dataType: 'json',
		success: function (json) {
			var $container = $('#types');
			$.each(json, function (k, v) {
				$container.append('<input type="checkbox" name="type" id="type-' + k + '" value="' + k + '" lay-skin="primary" title="' + v + '" />');
			});
			if (UrlParams.type) {
				$('#types input[value=' + UrlParams.type + ']').prop('checked', true);
			} else if (UrlParams.typeName) {
				$('#types input[title=' + UrlParams.typeName + ']').trigger('click');
			}
			form.render('checkbox');
		}
	});
	//加载主题
	$.ajax('/product/listTheme', {
		type: 'get',
		//async: false,
		dataType: 'json',
		success: function (json) {
			var $container = $('#themes');
			$.each(json, function (i, data) {
				$container.append('<input type="checkbox" name="theme" id="theme-' + data.Id + '" value="' + data.Id + '" lay-skin="primary" title="' + data.Name + '" />');
			});
			form.render('checkbox');
		}
	});
	//加载目的地
	$.ajax('/listDestination', {
		type: 'get',
		//async: false,
		dataType: 'json',
		success: function (json) {
			var $container = $('#destinations');
			$.each(json, function (i, data) {
				$container.append('<input type="checkbox" name="destination" id="destination-' + data.Id + '" value="' + data.Id + '" lay-skin="primary" title = "' + data.Name + '" /> ');
			});
			form.render('checkbox');
		}
	});
	//加载出发地
	$.ajax('/listDeparture', {
		type: 'get',
		//async: false,
		dataType: 'json',
		success: function (json) {
			var $container = $('#departures');
			$.each(json, function (i, data) {
				$container.append('<input type="checkbox" name="departure" id="departure-' + data.Id + '" value="' + data.Id + '" lay-skin="primary" title="' + data.Name + '" />');
			});
			form.render('checkbox');
		}
	});

	//监听事件
	form.on('checkbox()', function (data) {
		if (data.elem.name === 'type') {
			Params.type = this.checked ? this.value : null;
			$('input[name=type]:checked').each(function () {
				if (this.id !== data.elem.id) {
					$(this).prop('checked', false);
				}
			});
			form.render('checkbox');
		} else if (data.elem.name === 'theme') {
			this.checked ? Params.themes.push(this.value) : Params.themes.remove(this.value);
		} else if (data.elem.name === 'destination') {
			this.checked ? Params.destinations.push(this.value) : Params.destinations.remove(this.value);
		} else if (data.elem.name === 'departure') {
			this.checked ? Params.departures.push(this.value) : Params.departures.remove(this.value);
			$('input[name=departure]:checked').each(function () {
				if (this.id !== data.elem.id) {
					$(this).prop('checked', false);
				}
			});
			form.render('checkbox');
		}
		list();
	});
	$('#sort li').on('click', function () {
		var $this = $(this);
		$this.addClass('active').siblings().removeClass('active');
		var name = $this.data('name');
		switch (name) {
			case 'comprehensive': Params.sortName = 'Id'; break;
			case 'popularity': Params.sortName = 'Clicks'; break;
			case 'sales': Params.sortName = 'Orders'; break;
			case 'price': Params.sortName = 'Price'; break;
			default: break;
		}
		if (name === 'price') {
			var type = $this.data('type');
			if (type === 0) {
				$this.removeClass('down').addClass('up').siblings().removeClass('down').removeClass('up');
				$this.data('type', 1);
				Params.sortType = 1;
			} else {
				$this.removeClass('up').addClass('down').siblings().removeClass('down').removeClass('up');
				$this.data('type', 0);
				Params.sortType = 0;
			}
		} else {
			$this.siblings().removeClass('up').removeClass('down');
			$this.data('type', 0);
			Params.sortType = 0;
		}
		list();
	});

	list(UrlParams);
});
