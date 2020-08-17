/*
 * JavaScript Extend
 * version: 1.0.0-2017.09.30
 * @requires jQuery v1.10 or later
 * Copyright (c) 2015 DoubleFish
 * Author DoubleFish
 */
if (!Array.isArray) {
	/**
	 * 是否数组。
	 * @param {any} arg arg
	 * @returns {Boolean} 是否数组
	 */
	Array.isArray = function (arg) {
		return Object.prototype.toString.call(arg) === '[object Array]';
	};
}

if (!Array.indexOf) {
	/**
	 * 查找指定元素索引
	 * @param {any} value 要查找的对象
	 * @param {Number} startIndex 搜索的起始索引（默认从零开始）
	 * @returns {Number} 第一个匹配的索引
	 */
	Array.prototype.indexOf = function (value, startIndex) {
		var n = this.length;
		var i = startIndex ? startIndex : 0;
		for (; i < n; i++) {
			if (this[i] === value) {
				return i;
			}
		}
		return -1;
	};
}

/**
 * 删除元素
 * @param {any} value
 */
Array.prototype.remove = function (value) {
	var index = this.indexOf(value);
	if (index > -1) {
		this.splice(index, 1);
	}
};

/**
 * 开头是否与指定的字符串匹配
 * @param {String} value 要比较的字符串
 * @returns {Boolean} true/false
 */
String.prototype.StartsWith = function (value) {
	var reg = new RegExp('^' + value);
	return reg.test(this);
};

/**
 * 结尾是否与指定的字符串匹配
 * @param {String} value 要比较的字符串
 * @returns {Boolean} true/false
 */
String.prototype.EndsWith = function (value) {
	var reg = new RegExp(value + '$');
	return reg.test(this);
};

/**
 * 计算字符串长度（中文2，英文符号半角1）
 * @returns {Number} 长度
 */
String.prototype.GetLength = function () {
	var length = this.length;
	var matches = this.match(/[^ -~]/g);
	if (matches !== null) {
		length += this.match(/[^ -~]/g).length;
	}
	return length;
};

/**
 * 分割字符串
 * @param {String} separator 名称
 * @param {String} ignoreNullOrEmpty 名称
 * @param {String} limit 名称
 * @returns {Array} 分割后的集合
 */
String.prototype.Split = function (separator, ignoreNullOrEmpty, limit) {
	var array = new Array();
	if (this) {
		array = this.split(separator, limit);
	}
	return array;
};

/**
 * 转换字符串为整形
 * @returns {Number} 转换后的整形数字
 */
String.prototype.ToInt = function () {
	var temp = this;
	if (!temp) {
		return 0;
	}
	while (temp && temp.lengh > 1 && temp.substr(0, 1) === '0') {
		temp = temp.substring(1);
	}
	while (temp.indexOf(',') > -1) {
		temp = temp.replace(',', '');
	}
	var result = parseInt(temp);
	return isNaN(result) ? 0 : result;
};

/**
 * 转换字符串为浮点型
 * @returns {Number} 转换后的浮点型数字
 */
String.prototype.ToFloat = function () {
	var temp = this;
	if (!temp) {
		return 0;
	}
	while (temp.lengh > 1 && temp.substr(0, 1) === '0') {
		temp = temp.substring(1);
	}
	while (temp.indexOf(',') > -1) {
		temp = temp.replace(',', '');
	}
	var result = parseFloat(temp);
	return isNaN(result) ? 0 : result;
};

/**
 * 转换字符串为日期类型
 * @returns {Date} 转换后的时间
 */
String.prototype.ToDate = function () {
	return new Date(Date.parse(this));
};

/**
 * 格式化字符串
 * @param {String} format 格式：yyyy, yyyy-MM-dd, yyyy-MM-dd HH:mm:ss, HH:mm:ss
 * @returns {String} 格式化后的字符串
 */
String.prototype.ToString = function (format) {
	if (!this) { return ''; }
	var str = this.replace('T', ' ');
	if (format === 'yyyy') {
		return str.substr(0, 4);
	} else if (format === 'yyyy-MM-dd') {
		return str.substr(0, 10);
	} else if (format === 'yyyy-MM-dd HH:mm:ss') {
		return str.substring(0, 19);
	} else if (format === 'HH:mm:ss') {
		return str.substr(10, 9);
	} else {
		return str;
	}
};

/**
 * 格式化字符串
 * @param {String} format 格式，默认：yyyy-MM-dd
 * @returns {String} 格式化后的字符串
 */
String.prototype.ToStringForDate = function (format) {
	if (!format) {
		format = 'yyyy-MM-dd';
	}
	return this.ToString(format);
};

/**
 * 格式化字符串
 * @param {String} format 格式，默认：yyyy-MM-dd HH:mm:ss
 * @returns {String} 格式化后的字符串
 */
String.prototype.ToStringForTime = function (format) {
	if (!format) {
		format = 'HH:mm:ss';
	}
	return this.ToString(format);
};

/**
 * 格式化字符串
 * @param {String} format 格式，默认：N
 * @returns {String} 格式化后的字符串
 */
String.prototype.ToStringForFloat = function (format) {
	return parseFloat(this).ToStringForFloat(format);
};

/**
 * 格式化字符串
 * @param {String} format 格式，默认：N0
 * @returns {String} 格式化后的字符串
 */
String.prototype.ToStringForInt = function (format) {
	return parseInt(this).ToStringForInt(format);
};

/**
 * 覆盖字符串
 * @param {Number} start 开始索引
 * @param {Number} end 结束索引
 * @param {String} symbol 替换字符，默认：*
 * @returns {String} 格式化后的字符串
 */
String.prototype.Cover = function (start, end, symbol) {
	if (!start) {
		start = 0;
	}
	if (!symbol) {
		symbol = '*';
	}
	var str = '';
	for (var i = start; i < end; i++) {
		str += symbol;
	}
	return this.substring(0, start) + str + this.substring(end);
};

/**
 * 转UTF-8
 * @returns {String} 格式化后的字符串
 */
String.prototype.ToUTF8 = function () {
	var str = this, out = '';
	for (var i = 0; i < str.length; i++) {
		var c = str.charCodeAt(i);
		if (c >= 0x0001 && c <= 0x007F) {
			out += str.charAt(i);
		} else if (c > 0x07FF) {
			out += String.fromCharCode(0xE0 | ((c >> 12) & 0x0F));
			out += String.fromCharCode(0x80 | ((c >> 6) & 0x3F));
			out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
		} else {
			out += String.fromCharCode(0xC0 | ((c >> 6) & 0x1F));
			out += String.fromCharCode(0x80 | ((c >> 0) & 0x3F));
		}
	}
	return out;
};

/**
 * 格式化数字
 * @param {String} format 格式
 * @returns {String} 格式化后的字符串
 */
Number.prototype.ToString = function (format) {
	var str = (this || 0).toString();
	if (this < 0) {
		str = str.substr(1);
	}
	var arr = str.Split('.');
	var integer = arr[0];/*整数部分*/
	var decimal = arr.length > 1 ? arr[1] : '';/*小数数部分*/

	var multiple = parseInt(integer.length / 3);
	var remainder = integer.length % 3;
	var integerFormat = remainder > 0 ? integer.substr(0, remainder) + ',' : '';
	for (var i = 0; i < multiple; i++) {
		var from = i * 3 + remainder;
		integerFormat += integer.substr(from, 3) + ',';
	}
	if (integerFormat.indexOf(',') > -1) {
		integerFormat = integerFormat.substr(0, integerFormat.length - 1);
	}

	if (format === 'N') {
		while (decimal.length < 2) {
			decimal += '0';/*补0*/
		}
		str = integerFormat + '.' + decimal;
	} else if (format === 'N0') {
		str = integerFormat;
	} else {
		//
	}
	if (this < 0) {
		str = '-' + str;
	}
	return str;
};

/**
 * 格式化数字
 * @param {String} format 格式，默认：N
 * @returns {String} 格式化后的字符串
 */
Number.prototype.ToStringForFloat = function (format) {
	if (!format) {
		format = 'N';
	}
	return this.Fixed(2).ToString(format);
};

/**
 * 格式化数字
 * @param {String} format 格式，默认：N0
 * @returns {String} 格式化后的字符串
 */
Number.prototype.ToStringForInt = function (format) {
	if (!format) {
		format = 'N0';
	}
	return this.ToString(format);
};

/**
 * 舍入到指定的小数位数，但不四舍五入
 * @param {String} decimals 要舍入到的小数位数的值，范围从 0 到 28
 * @returns {Number} 舍入到 decimals 的小数位数
 */
Number.prototype.Fixed = function (decimals) {
	return parseFloat(this.ToFixed(decimals));
};

/**
 * 舍入到指定的小数位数，但不四舍五入
 * @param {String} decimals 要舍入到的小数位数，范围从 0 到 28
 * @returns {String} 舍入到 decimals 的小数位数
 */
Number.prototype.ToFixed = function (decimals) {
	var str = (this || 0).toString();
	switch (decimals) {
		case 1: str = str.replace(/(\.\d{1})\d+$/, '$1'); break;
		case 2: str = str.replace(/(\.\d{2})\d+$/, '$1'); break;
		case 3: str = str.replace(/(\.\d{3})\d+$/, '$1'); break;
		case 4: str = str.replace(/(\.\d{4})\d+$/, '$1'); break;
		default: str = str.replace(/(\.\d{0})\d+$/, '$1'); break;
	}
	if (parseFloat(str) === 0) {
		str = str.replace('-', '');
	}
	if (str.indexOf('.') === -1) {
		str += '.';
	}
	var count = 1 + decimals - str.length + str.indexOf('.');
	for (var i = 0; i < count; i++) {
		str += '0';
	}
	return str;
};

/**
 * 格式化日期
 * @param {String} format 格式
 * @returns {String} 格式化后的字符串
 */
Date.prototype.ToString = function (format) {
	var o = {
		'M+': this.getMonth() + 1, //month
		'd+': this.getDate(), //day
		'H+': this.getHours(), //hour
		'm+': this.getMinutes(), //minute
		's+': this.getSeconds(), //second
		'q+': Math.floor((this.getMonth() + 3) / 3), //quarter
		'f+': this.getMilliseconds() //millisecond
	};
	var str = format;
	if (/(y+)/.test(str)) {
		str = str.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
	}

	for (var k in o) {
		if (new RegExp('(' + k + ')').test(str)) {
			str = str.replace(RegExp.$1, RegExp.$1.length === 1 ? o[k] : ('00' + o[k]).substr(('' + o[k]).length));
		}
	}
	return str;
};

/**
 * GMT时间转换为UTC时间
 * @returns {Number} 毫秒数
 */
Date.prototype.ToUTC = function () {
	var y = this.getUTCFullYear();
	var M = this.getUTCMonth();
	var d = this.getUTCDate();
	var h = this.getUTCHours();
	var m = this.getUTCMinutes();
	var s = this.getUTCSeconds();
	var utc = Date.UTC(y, M, d, h, m, s);
	return utc;
};

/**
 * 拼接指定属性的值为字符串
 * @param {String} seperator 分隔符，默认：半角逗号
 * @param {String} propertyName 要拼接的属性名称
 * @returns {String} 拼接后的字符串
 */
Array.prototype.JoinProperties = function (seperator, propertyName) {
	if (!this || this.length === 0) { return ''; }
	if (!seperator) { seperator = ','; }
	var names = propertyName.split('.');
	var str = '';
	for (var i = 0; i < this.length; i++) {
		var data = this[i];
		for (var j = 0; j < names.length; j++) {
			var name = names[j];
			data = data[name];
			if (!data) {
				data = '';
				break;
			}
		}
		str += seperator + data;
	}
	return str.substr(1);
};

/**
 * 重命名集合中指定属性的名称
 * @param {Array} names 指定名称
 * @param {Array} targets 新的名称
 * @returns {Array} 重命名属性后的集合
 */
Array.prototype.ChangeProperty = function (names, targets) {
	if (!names || !targets || names.length !== targets.length) {
		return this;
	}
	var array = new Array();
	for (var i = 0; i < this.length; i++) {
		var data = this[i];
		for (var j = 0; j < names.length; j++) {
			var name = names[j];
			var target = targets[j];
			data[target] = this[i][name];
		}
		array.push(data);
	}
	return array;
};

/**
 * 转换为整形数组
 * @returns {Array} 转换后的整形数组
 */
Array.prototype.ToInt = function () {
	var array = new Array();
	for (var i = 0; i < this.length; i++) {
		array.push(parseInt(this[i]));
	}
	return array;
};

/**
 * 转换浮点型数组
 * @returns {Array} 转换后的浮点型数组
 */
Array.prototype.ToFloat = function () {
	var array = new Array();
	for (var i = 0; i < this.length; i++) {
		array.push(parseFloat(this[i]));
	}
	return array;
};

/**
 * 获取浏览器语言代码
 * @returns {String} 语言代码
 */
GetLanguage = function () {
	var baseLang = '';
	if (navigator.userLanguage) {
		baseLang = navigator.userLanguage;
	} else {
		baseLang = navigator.language;
	}
	return baseLang;
}

/**
 * 生成四位随机字符串
 * @returns {String} 随机字符串
 */
function S4() {
	return ((1 + Math.random()) * 0x10000 | 0).toString(16).substring(1);
}

/**
 * 生成GUID
 * @returns {String} GUID
 */
function Guid() {
	return S4() + S4() + '-' + S4() + '-' + S4() + '-' + S4() + '-' + S4() + S4() + S4();
}

/**
 * 根据中位数获取指定长度的数组
 * @param {Number} median 中位数
 * @param {Number} length 数组长度
 * @returns {Array<Number>} 数组
 */
function GetNumArrayByMedian(median, length) {
	var temp = length / 2;
	var min = median - temp;
	var max = median + temp;
	var array = [];
	for (var i = min; i < max; i++) {
		array.push(i);
	}
	return array;
}
