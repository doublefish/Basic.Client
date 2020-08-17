/*
 * jQuery Extend Plugin
 * version: 1.0.0-2017.09.30
 * @requires doublefish.js
 * @requires jQuery v1.10 or later
 * Copyright (c) 2015 DoubleFish
 * Author DoubleFish
 */

/* jQuery 扩展方法 */
(function ($) {
	$.df = $.extend({}, $.df);

	if (!$.messager) {
		$.messager = {
			alert: function (title, message, icon, callback) {
				alert(message);
				if (callback) {
					callback();
				}
			},
			confirm: function (title, message, callback) {
				message = message.toString();
				var result = confirm(message);
				if (callback) {
					callback(result);
				}
			}
		};
	} else {
		//
	}

	$.messager.tip = function (message, callback) {
		$.messager.alert('提示', message, 'info', callback, 3000);
	};
	$.messager.success = function (message, callback) {
		$.messager.alert('成功', message, 'success', callback);
	};
	$.messager.warning = function (message, callback) {
		$.messager.alert('警告', message, 'warning', callback);
	};
	$.messager.error = function (message, callback) {
		$.messager.alert('错误', message, 'error', callback);
	};

	/**
	 * 加入收藏
	 */
	$.AddFavourite = function () {
		var url = window.location;
		var title = document.title;
		var ua = navigator.userAgent.toLowerCase();
		if (ua.indexOf('msie 8') > -1) {
			window.external.AddToFavoritesBar(url, title); //IE8
		} else if (document.all) {
			window.external.addFavorite(url, title);
		} else if (window.sidebar) {
			window.sidebar.addPanel(title, url, '');
		} else {
			$.messager.warning('您的浏览器不支持,请按 Ctrl+D 手动收藏！');
		}
	};

	/**
	 * 把指定对象转换为QueryString格式
	 * @param {Object} obj 要转换的对象
	 */
	$.ConvertToUrl = function (obj) {
		var query = '';
		if (obj) {
			$.each(obj, function (n, v) {
				query += '&' + n + '=' + v;
			});
			if (query.length > 0) {
				query.substr(1);
			}
		}
		return query;
	};

	/**
	 * 把指定文本复制到粘贴板
	 * @param {String} text 要复制的文本
	 * @returns {Boolean} 是否成功
	 */
	$.CopyToClipBoard = function (text) {
		if (window.clipboardData) {
			window.clipboardData.clearData();
			window.clipboardData.setData('Text', text);
		} else if (navigator.userAgent.indexOf('Opera') != -1) {
			window.location = text;
		} else if (window.netscape) {
			try {
				netscape.security.PrivilegeManager.enablePrivilege("UniversalXPConnect");
			}
			catch (e) {
				$.messager.tip('被浏览器拒绝！\n请在浏览器地址栏输入"about:config"并回车\n然后将 "signed.applets.codebase_principal_support"设置为"true"');
				return false;
			}
			var clip = Components.classes['@mozilla.org/widget/clipboard;1'].createInstance(Components.interfaces.nsIClipboard);
			if (!clip) {
				return false;
			}
			var trans = Components.classes['@mozilla.org/widget/transferable;1'].createInstance(Components.interfaces.nsITransferable);
			if (!trans) {
				return false;
			}
			trans.addDataFlavor('text/unicode');
			var str = new Object();
			var str = Components.classes["@mozilla.org/supports-string;1"].createInstance(Components.interfaces.nsISupportsString);
			str.data = text;
			trans.setTransferData("text/unicode", str, text.length * 2);
			var clipid = Components.interfaces.nsIClipboard;
			if (!clip) {
				return false;
			}
			clip.setData(trans, null, clipid.kGlobalClipboard);
		} else if (copy) {
			copy(text);
		} else {
			$.messager.tip('该浏览器暂不支持此功能，请手动复制');
			return false;
		}
		$.messager.tip('复制成功');
		return true;
	};

	/**
	 * 格式化字符串
	 * @param {String} source 源
	 * @param {Array} arguments 参数
	 * @returns {String} 格式化后的字符串
	 */
	$.Formate = function (source, arguments) {
		if (arguments.length === 1) {
			return function () {
				var args = $.makeArray(arguments);
				args.unshift(source);
				return $.validator.format.apply(this, args);
			};
		}
		if (arguments === undefined) {
			return source;
		}
		if (arguments.length > 2 && arguments.constructor !== Array) {
			arguments = $.makeArray(arguments).slice(1);
		}
		if (arguments.constructor !== Array) {
			arguments = [arguments];
		}
		$.each(arguments, function (i, n) {
			source = source.replace(new RegExp('\\{' + i + '\\}', 'g'), function () {
				return n;
			});
		});
		return source;
	};

	/**
	 * 转换文件大小单位
	 * @param {Number} size 大小
	 * @returns {String} 转换后的字符串
	 */
	$.GetFileSize = function (size) {
		size = parseFloat(size);
		var units = ['B', 'KB', 'MB', 'GB', 'TB'];
		var unit = units[0];

		for (var i = 0; i < units.length; i++) {
			if (size < 100) {
				break;
			}

			size = size / 1024;
			unit = units[i + 1];
		}
		size = size.toFixed(2);
		return size + unit;
	};

	/**
	 * 获取对象的类型
	 * @param {Object} obj 要获取类型的对象
	 * @returns {String} 类型信息
	 */
	$.GetType = function (obj) {
		return Object.prototype.toString.call(object);
	};

	/**
	 * 获取Url中指定参数名称的值
	 * @param {String} name 参数名称
	 * @param {String} url Url，默认：window.location.search
	 * @returns {String} 参数名称是 name 的值
	 */
	$.GetUrlParam = function (name, url) {
		if (!url) {
			url = window.location.search.substr(1);
		}
		name = name.toLowerCase();
		url = url.toLowerCase();
		var matches = url.match('(^|&)' + name + '=([^&]*)(&|$)');
		if (!matches || matches.length < 3) {
			return '';
		}
		return unescape(matches[2]);
	};

	/**
	 * 把Url中的参数转换为对象
	 * @param {String} query 链接中的参数，默认：window.location.search
	 * @returns {String} 转换后的对象
	 */
	$.GetUrlParams = function (query) {
		if (!query) {
			query = window.location.search.substr(1);
		}
		var data = {};
		if (query && query.length > 0) {
			var array = query.split('&');
			for (var i = 0; i < array.length; i++) {
				var kv = array[i].split('=');
				var key = decodeURIComponent(kv[0]);
				var val = decodeURIComponent(kv[1]);
				if (data[key]) {
					//多个同名参数，转换为数组
					data[key] = [data[key]];
					data[key].push(val);
				} else {
					data[key] = val;
				}
			}
		}
		return data;
	};

	/**
	 * 把对象转换为Url参数
	 * @param {Object} data 对象
	 * @param {String} key 键名
	 */
	$.ParseUrlParams = function (data, key) {
		var params = "";
		if (data instanceof String || data instanceof Number || data instanceof Boolean) {
			params += "&" + key + "=" + encodeURIComponent(data);
		} else {
			$.each(data, function (param) {
				var k = key == null ? param : key + (data instanceof Array ? "[" + param + "]" : "." + param);
				params += '&' + $.ParseUrlParams(this, k);
			});
		}
		return params.substr(1);
	}

	/**
	 * 获取指定对象的指定名称的属性的值
	 * @param {Object} data 指定对象
	 * @param {String} propertyName 指定属性名称
	 * @returns {String} 指定名称的属性的值
	 */
	$.GetValue = function (data, propertyName) {
		if (!propertyName) {
			return null;
		}
		var propertyNames = propertyName.split('.');
		for (var i = 0; i < propertyNames.length; i++) {
			value = value[propertyNames[i]];
			if (value === null || value === undefined) {
				break;
			}
		}
		return value;
	};

	/**
	 * 回到顶部
	 */
	$.fn.BackTop = function () {
		var $backTopElement = $(this);
		$backTopElement.on('click', function () {
			$('html, body').animate({ scrollTop: 0 }, 120);
		});
		var backToTop = function () {
			var scrollTop = $(document).scrollTop();
			var winHeight = $(window).height();
			scrollTop > winHeight / 2 ? $backTopElement.show() : $backTopElement.hide();
			//IE6下的定位
			if (!window.XMLHttpRequest) {
				var top = scrollTop + winHeight - 166;
				$backTopElement.css('top', top);
			}
		};

		$(window).on('scroll', backToTop);
		backToTop();
	};

	/**
	 * 为当前控件绑定（根据name）全选事件
	 * @param {Object} option 配置
	 */
	$.fn.CheckAll = function (option) {
		var setting = {
			selector: this.selector,
			name: this.value,
			iframe: null,
			document: window.document
		};
		$.extend(setting, option || {});

		var $this = $(this);
		if (setting.iframe) {
			setting.document = window.frames[iframe].document;
		}
		/* 绑定点击事件 */
		$this.on('click', { name: setting.name, document: setting.document }, function (e) {
			var checked = $(this).prop('checked');
			$(e.data.document).find('input[type=checkbox][name=' + e.data.name + ']').each(function (i, e) {
				this.checked = checked;
			});
		});
		/* 根据子节点选中状态设置全选选项的选中状态 */
		$(setting.document).find('input[type=checkbox][name=' + setting.name + ']').each(function (i, e) {
			$(this).on('click', { selector: setting.selector, document: setting.document }, function (e) {
				var $checkAll = $(e.data.selector);
				if (!this.checked) {
					$checkAll.prop('checked', false);
					return;
				}
				var checkedAll = true;
				$(e.data.document).find('input[type=checkbox][name=' + this.name + ']').each(function (i, e) {
					if (!this.checked) {
						checkedAll = false;
						return false;
					}
				});
				if (checkedAll) {
					$checkAll.prop('checked', true);
				}
			});
		});
	};

	/**
	 * 为当前控件绑定点击复制指定控件的值到粘贴板事件
	 * @param {Object} option 配置
	 */
	$.fn.CopyToClipBoard = function (option) {
		var setting = {
			target: null,
			success: function (e) {
				$.messager.tip('复制成功');
			},
			error: function (e) {
				$.messager.tip('复制失败');
			}
		};
		$.extend(setting, option || {});

		var $this = $(this);

		if (ClipboardJS) {
			$this.attr('data-clipboard-action', 'copy');
			$this.attr('data-clipboard-target', setting.target);
			var clipboard = new ClipboardJS(this.selector);
			clipboard.on('success', function (e) {
				setting.success(e);
			});
			clipboard.on('error', function (e) {
				setting.error(e);
			});
		} else {
			$this.on('click', function () {
				$.CopyToClipBoard($(setting.target).val());
			});
		}
	};

	/**
	 * 为当前下拉菜单创建选项
	 * @param {String} text 文本
	 * @param {String} value 值
	 * @param {Element} select 下拉菜单对象，可空
	 */
	$.fn.CreateSelectOption = function (text, value, select) {
		if (!select) {
			select = document.getElementById(this[0].id);
		}
		var option = document.createElement('OPTION');
		select.appendChild(option);
		option.innerText = text;
		option.value = value;
	};

	/**
	 * 为当前下拉菜单创建选项
	 * @param {Object} json 数据源
	 * @param {Object} option 配置
	 */
	$.fn.CreateSelectOptions = function (json, option) {
		var setting = {
			selected: null,
			textField: 'Name',
			valueField: 'Id',
			defaultText: '请选择',
			defaultValue: ''
		};
		$.extend(setting, option || {});

		var $these = $(this);
		$these.empty();

		var type = Object.prototype.toString.call(json);
		if (type === '[object Object]') {
			$.each($these, function (i, e) {
				var $this = $(e);
				var select = document.getElementById(this.id);
				$this.CreateSelectOption(setting.defaultText, setting.defaultValue, select);

				$.each(json, function (name, value) {
					$this.CreateSelectOption(value, name, select);
				});

				if (setting.selected) {
					$this.val(setting.selected);
				}
			});
		} else if (type === '[object Array]') {
			$.each($these, function (i, e) {
				var $this = $(e);
				var select = document.getElementById(this.id);
				$this.CreateSelectOption(setting.defaultText, setting.defaultValue, select);

				$.each(json, function (i, data) {
					var text = data[setting.textField];
					var value = data[setting.valueField];
					$this.CreateSelectOption(text, value, select);
				});

				if (setting.selected) {
					$this.val(setting.selected);
				}
			});
		} else if (json) {
			$.messager.tip('无法识别的json类型');
		} else {
			//无操作
		}
	};

	/**
	 *  获取所有选中项
	 *  @returns {Array} 所有选中项
	 */
	$.fn.GetCheckeds = function () {
		var array = new Array();
		$(this).each(function (i, e) {
			if (this.checked) {
				array.push(this);
			}
		});
		return array;
	};

	/**
	 *  获取选中项的值
	 *  @returns {Array} 所有选中项的值
	 */
	$.fn.GetCheckedValues = function () {
		var array = new Array();
		$(this).each(function (i, e) {
			if (this.checked) {
				array.push(this.value);
			}
		});
		return array;
	};

	/**
	 *  把表单中所有控件的值转换为对象
	 *  @returns {Array} 所有选中项的值
	 */
	$.fn.GetParams = function () {
		var params = $(this).serialize();
		return $.GetUrlParams(params);
	};

	/**
	 *  获取绝对坐标
	 *  @returns {Object} 坐标
	 */
	$.fn.GetPosition = function () {
		var e = this[0];
		var position = { left: 0, top: 0, width: e.offsetWidth, height: e.offsetHeight };
		while (e !== null && e !== document.body) {
			position.left += e.offsetLeft;
			position.top += e.offsetTop;
			e = e.offsetParent;
		}
		return position;
	};

	/**
	 *  获取下拉菜单选中项的文本
	 *  @returns {String} 选中项的文本
	 */
	$.fn.GetSelectedText = function () {
		return $(this).find('option:selected').text();
	};

	/**
	 * 是否在指定坐标内
	 * @param {Object} coordinate 指定坐标
	 * @returns {Boolean} 是否在指定坐标内
	 */
	$.fn.IsInArea = function (coordinate) {
		/*获取当前对象的位置信息*/
		var position = $(this).GetPosition();
		if (!position) { return true; }
		if (position.left < coordinate.X && coordinate.X < position.left + position.width
			&& position.top < coordinate.Y && coordinate.Y < position.top + position.height) {
			return true;
		} else {
			return false;
		}
	};

	/**
	 * 把请求链接中的参数的值赋值给绑定容器中的对应名称的控件
	 * @param {Object} option 配置
	 */
	$.fn.RestoreFromSearch = function (option) {
		var $this = $(this);
		if ($this.length > 1) {
			for (var i = 0; i < $this.length; i++) {
				$('#' + $this[i].id).RestoreFromSearch(option);
			}
			return;
		}

		var setting = {
			prefix: '_' /* 控件id 前缀 */
		};
		$.extend(setting, option || {});

		/* 赋值 */
		var data = $.GetUrlParams(window.location.search);
		$.each(data, function (name, value) {
			$this.find('[name=' + name + ']').each(function (i, e) {
				if (this.type === 'radio') {
					this.checked = value === this.value;
				} else if (this.type === 'checkbox') {
					if (Array.isArray(value)) {
						this.checked = value.indexOf(this.value) > -1;
					} else {
						this.checked = value === this.value;
					}
				} else {
					this.value = value;
				}
			});
		});
	};

	/**
	 * 根据指定的值设置选中项
	 * @param {String} value 要选中的项的值
	 */
	$.fn.SetChecked = function (value) {
		$(this).each(function (i, e) {
			$(this).prop('checked', this.value === value);
		});
	};

	/**
	 * 根据指定的值设置选中项
	 * @param {Array} values 要选中的项的值
	 */
	$.fn.SetCheckeds = function (values) {
		$(this).each(function (i, e) {
			$(this).prop('checked', values.indexOf(this.value) > -1);
		});
	};

	/**
	 * 设置光标位置
	 * @param {Number} position 指定位置
	 */
	$.fn.SetCursorPosition = function (position) {
		$(this).SetSelection(position, position);
	};

	/**
	 * 设置选中项
	 */
	$.fn.SetSelected = function () {
		$(this).each(function (i, e) {
			var $this = $(this);
			var selected = $this.attr('data-selected');
			if (selected) {
				$this.val(selected);
			}
		});
	};

	/**
	 * 设置选中内容
	 * @param {Number} start 开始位置
	 * @param {Number} end 结束位置
	 */
	$.fn.SetSelection = function (start, end) {
		if (this.setSelectionRange) {
			// Modern browsers
			this.focus();
			this.setSelectionRange(start, end);
		} else if (this.createTextRange) {
			// IE8 and below
			var range = this.createTextRange();
			range.collapse(true);
			range.moveEnd('character', end);
			range.moveStart('character', start);
			range.select();
		}
	};

	/**
	 * 计算所有控件的值的综合
	 */
	$.fn.SumValue = function () {
		var total = 0;
		$(this).each(function (i, e) {
			if (this.value && !isNaN(this.value)) {
				total += parseFloat(this.value);
			}
		});
		return total;
	};

})(jQuery);
