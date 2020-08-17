layui.use(['jquery', 'layer', 'form'], function () {
	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form;

	//链接参数
	var UrlParams = $.GetUrlParams();

	//查询条件
	var Params = {
		name: '',
		type: null,
		typeName: null,
		tags: [],
		tagNames: [],
		themes: [],
		destinations: [],
		departures: [],
		sortName: 'Id',
		sortType: 0
	};

	if (UrlParams.type) {
		data.type = UrlParams.type;
	}
	if (UrlParams.typeName) {
		data.typeName = UrlParams.typeName;
	}
	if (UrlParams.tagNames) {
		Params.tagNames = UrlParams.tagNames.split(',');
	}

	/**
	 * 加载列表
	 * @param {Object} urlParams 链接参数
	 */
	var list = function (urlParams) {
		var data = {
			name: Params.name,
			type: Params.type,
			typeName: Params.typeName,
			tags: Params.tags.join(','),
			tagNames: Params.tagNames.join(','),
			themes: Params.themes.join(','),
			destinations: Params.destinations.join(','),
			departures: Params.departures.join(','),
			sortName: Params.sortName,
			sortType: Params.sortType
		};

		if (urlParams) {
		}

		$('.composite-center').hide();

		//加载列表
		$.ajax('/product/list', {
			type: 'get',
			dataType: 'json',
			data: data,
			success: function (json) {
				//bg-l/bg-g/bg-o
				$('#list').empty();
				$.each(json.Results, function (i, data) {
					var html = '';
					html += '<li>';
					html += '		<a href="/product/detail/' + data.Id + '">';
					html += '	      <div class="fl pai-img"><img src="' + (data.Cover ? data.Cover : '/img/undefined.png') + '" /></div>';
					html += '		  <div class="fl pai-center">';
					html += '             <h4>' + data.Name + '</h4>';
					html += '		      <p class="clear mudi"><span class="fl">出发地：' + '<b class="color3">' + data.DeparturenName + '</b>' + '</span ><small class="fr qinzi">' + data.ThemeNames.join('/') + '</small></p>';
					html += '             <p class="prace"><span>￥<b class="txt-s20">' + data.Price.ToStringForFloat() + '</b></span>起</p>';
					html += '         </div>';
					html += '       </a>';
					html += '</li>';
					$('#list').append(html);
				});
			}
		});
	};

	//加载主题
	$.ajax('/product/listTheme', {
		type: 'get',
		async: false,
		dataType: 'json',
		success: function (json) {
			var $container = $('#themes');
			$.each(json, function (i, data) {
				$container.append('<dd id="theme-' + data.Id + '" data-id="' + data.Id + '" data-name="' + data.Name + '"><span>' + data.Name + '</span></dd>');
			});
			$('#themes dd').on('click', function () {
				$this = $(this);
				var checked = $this.data('checked');
				var id = $this.data('id');
				if (checked) {
					Params.themes.remove(id);
					$this.removeClass('active');
					$this.data('checked', false);
				} else {
					Params.themes.push(id);
					$this.addClass('active');
					$this.data('checked', true);
				}
				//设置选中状态
				var $tab = $('.composite-list li').eq(1);
				Params.themes.length > 0 ? $tab.addClass('active') : $tab.removeClass('active');
				list();
			});
		}
	});
	//加载出发地
	$.ajax('/listDeparture', {
		type: 'get',
		async: false,
		dataType: 'json',
		success: function (json) {
			var $container = $('#departures');
			$.each(json, function (i, data) {
				$container.append('<dd id="departure-' + data.Id + '" data-id="' + data.Id + '" data-name="' + data.Name + '"><span>' + data.Name + '</span></dd>');
			});
			$('#departures dd').on('click', function () {
				$this = $(this);
				var checked = $this.data('checked');
				var id = $this.data('id');
				if (checked) {
					Params.departures.remove(id);
					$this.removeClass('active');
					$this.data('checked', false);
				} else {
					Params.departures.push(id);
					$this.addClass('active');
					$this.data('checked', true);
				}
				//设置选中状态
				var $tab = $('.composite-list li').eq(2);
				Params.departures.length > 0 ? $tab.addClass('active') : $tab.removeClass('active');
				list();
			});
		}
	});
	//加载目的地
	$.ajax('/listDestination', {
		type: 'get',
		async: false,
		dataType: 'json',
		success: function (json) {
			var $container = $('#destinations');
			$.each(json, function (i, data) {
				$container.append('<dd id="destination-' + data.Id + '" data-id="' + data.Id + '" data-name="' + data.Name + '"><span>' + data.Name + '</span></dd>');
			});
			$('#destinations dd').on('click', function () {
				$this = $(this);
				var checked = $this.data('checked');
				var id = $this.data('id');
				if (checked) {
					Params.destinations.remove(id);
					$this.removeClass('active');
					$this.data('checked', false);
				} else {
					Params.destinations.push(id);
					$this.addClass('active');
					$this.data('checked', true);
				}
				//设置选中状态
				var $tab = $('.composite-list li').eq(3);
				Params.destinations.length > 0 ? $tab.addClass('active') : $tab.removeClass('active');
				list();
			});
		}
	});

	//排序
	$('#sort dd').on('click', function () {
		var $this = $(this);
		$this.addClass('active').siblings().removeClass('active');
		var name = $this.data('name');
		switch (name) {
			case 'comprehensive': Params.sortName = 'Id'; break;
			case 'popularity': Params.sortName = 'Clicks'; break;
			case 'sales': Params.sortName = 'Orders'; break;
			case 'aPrice': Params.sortName = 'Price'; Params.sortType = 1; break;
			case 'dPrice': Params.sortName = 'Price'; Params.sortType = 0; break;
			default: break;
		}
		list();
	});

	$('.composite-list li').each(function (i, e) {
		$(this).on('click', i, function (e) {
			$('.composite-center dl').eq(e.data).show().parent().show().end().siblings().hide();
			$('.shade-zonghe').show();
		});
	});

	var lastTime = 0, value = null;
	$('input[type=search]').on('keyup', function (e) {
		lastTime = e.timeStamp;
		value = $(this).val();
		setTimeout(function () {
			if (lastTime - e.timeStamp === 0) {
				Params.name = value;
				list();
			}
		}, 1000);
	});

	$('.shade-zonghe').click(function () {
		$(this).hide();
		$('.composite-center').hide();
	});

	list(UrlParams);
});