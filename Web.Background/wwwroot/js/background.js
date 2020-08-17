/**
 * 当前登录用户信息
 */
var User = null;

/**
 * 获取当前登录用户信息
 * @returns {Object} 用户信息
 */
var GetUser = function () {
	$.ajax('/personal/get', {
		type: 'get',
		async: false,
		dataType: 'json',
		success: function (json) {
			User = json;
		}
	});
	return User;
}

/**
 * 当前登录用户权限
 */
var UserRights = null;

/**
 * 获取当前登录用户权限
 * @returns {Array} 用户权限
 */
function ListRight() {
	$.ajax('/listRight', {
		type: 'get',
		async: false,
		dataType: 'json',
		success: function (json) {
			UserRights = json;
		}
	});
	return UserRights;
}

/**
 * 根据Url查询权限节点
 * @param {any} datas
 * @param {any} url
 */
function GetRightByUrl(datas, url) {
	var result = null;
	$.each(datas, function (i, data) {
		if (data.PageUrl.toLowerCase() === url) {
			result = data;
			return false;
		}
		result = GetRightByUrl(data.Children, url);
		if (result != null) {
			return false;
		}
	});
	return result;
}

/**
 * 根据Url获取子权限
 * @param {String} url url
 * @returns {Array<String>} 结果
 */
function ListRightByUrl(url) {
	var json = UserRights ? UserRights : top.UserRights;
	var current = GetRightByUrl(json, url);
	var array = new Array();
	if (current) {
		$.each(current.Children, function (i, data) {
			array.push(data.PageUrl.toLowerCase());
		});
	}
	return array;
}

/**
 * 当前页面权限
 */
var PageRigths = ListRightByUrl(Path);

/**
 * 是否有权限
 * @param {String} url url
 * @returns {Boolean} 是否
 */
function HasRight(url) {
	return PageRigths.indexOf(url.toLowerCase()) > -1;
}
