layui.define(['jquery', 'form', 'table'], function (exports) {
	var $ = layui.jquery,
		form = layui.form,
		table = layui.table;

	exports('list', {
		config: null,
		/**
		 * 初始化列表
		 * @param {Object} option 配置
		 * @returns {Object} table
		 */
		init: function (option) {
			var setting = {
				elem: '#list',
				height: 'full-210',
				filter: 'list',
				url: null,
				method: 'get',
				where: {},
				//contentType: 'application/json',
				//toolbar: 'true',
				//totalRow: false,
				headers: {},
				request: {
					pageName: 'pageNumber',
					limitName: 'pageSize'
				},
				response: {
					//statusName: 'Code',//规定数据状态的字段名称，默认：code
					//statusCode: 0,//规定成功的状态码，默认：0
					//msgName: 'Message',//规定状态信息的字段名称，默认：msg
					//countName: 'Count',//规定数据总数的字段名称，默认：count
					//dataName: 'Results'//规定数据列表的字段名称，默认：data
				},
				parseData: function (res) {
					//将原始数据解析成 table 组件所规定的数据
					return {
						code: 0,//解析接口状态
						msg: '',//解析提示文本
						count: res.TotalCount,//解析数据长度
						data: res.Results//解析数据列表
					};
				},
				done: function (response, curr, count) {
				},
				page: {
					layout: ['count', 'prev', 'page', 'next', 'limit', 'refresh', 'skip']
				},
				defaultToolbar: ['filter', 'print', 'exports'],
				limit: 20,
				limits: [10, 20, 30],
				loading: true,
				text: {
					none: '暂无相关数据'
				},
				//initSort: {
				//	field: 'Id',
				//	type: 'desc'
				//},
				//skin: '',//line（行边框风格）row（列边框风格）nob（无边框风格）
				//even: false,
				id: 'list'
			};
			$.extend(setting, option || {});

			$(setting.elem).attr('lay-data', '{id:\'list\'}');
			$(setting.elem).attr('lay-filter', 'list');

			var params = $('form[lay-filter="search"]').GetParams();
			$.extend(setting.where, params || {});
			if (setting.initSort) {
				setting.where.sortName = setting.initSort.field;
				setting.where.sortType = setting.initSort.type === 'desc' ? 0 : 1;
			}

			//监听查询
			form.on('submit(search)', function (data) {
				//console.log('search:' + JSON.stringify(data.field));
				data.sortName = '';
				data.sortType = '';
				var ins = table.reload(setting.id, {
					where: data.field,
					page: { curr: 1 }
				});
				list.config = ins.config;
				return false;
			});

			//监听复选框
			table.on('checkbox(list)', function (obj) {
			});

			//监听排序
			table.on('sort(list)', function (obj) {
				table.reload(setting.id, {
					initSort: obj,
					where: {
						sortName: obj.field,
						sortType: obj.type === 'desc' ? 0 : 1
					}
				});
			});

			var ins = table.render(setting);
			list.config = ins.config;
			return ins;
		},
		/**
		 * 重载
		 * @param {String} id id
		 */
		reload: function (id) {
			if (!id) {
				id = 'list';
			}
			table.reload(id);
		},
		/**
		 * 导出
		 * @param {String} fileName 文件名
		 * @param {Object} config 配置
		 * @returns {Object} any
		 */
		export: function (fileName, config) {
			if (!window.XMLHttpRequest) {
				return alert('Your browser does not support XMLHttpRequest.');
			}
			if (!config) {
				config = list.config;
			}

			fileName += '.xlsx';
			var headers = '';
			$.each(config.cols[0], function (i, e) {
				if (!e.field) {
					return;
				}
				headers += ',' + e.field + ':' + e.title;
			});
			headers = headers.substr(1);
			var parameters = '';
			$.each(config.where, function (n, v) {
				parameters += n + '=' + v + '&';
			});
			parameters += 'pageSize=0';
			var url = Config.ApiUrl + config.url.replace('/list', '/excel') + '?' + parameters;
			var loading = 0;

			var xhr = new XMLHttpRequest();
			xhr.open('GET', url, true);
			$.AddHeaders(xhr);
			xhr.setRequestHeader('X-ExcelName', encodeURI(fileName));
			xhr.setRequestHeader('X-ExcelHeaders', encodeURI(headers));
			xhr.responseType = 'blob';
			xhr.onreadystatechange = function () {
				if (xhr.readyState === 1) {
					loading = layer.load(2);
				}
				if (xhr.readyState === 4 && xhr.status === 200) {
					layer.close(loading);
				}
			};
			xhr.onload = function () {
				if (this.response.type !== 'application/vnd.ms-excel') {
					return layer.msg('下载出错，请重试！', { icon: 5, time: 3000, anim: 6 });
				}
				var blob = this.response;
				if (window.navigator.msSaveOrOpenBlob) {
					navigator.msSaveBlob(blob, fileName);
				} else {
					var link = document.createElement('a');
					link.href = window.URL.createObjectURL(blob);
					link.download = fileName;
					link.click();
					window.URL.revokeObjectURL(link.href);
				}
			};
			xhr.ontimeout = function (e) {
				layer.msg('下载超时，请重试！', { icon: 5, time: 3000, anim: 6 });
			};
			xhr.onerror = function (e) {
				layer.msg('下载出错，请联系技术支持！', { icon: 5, time: 3000, anim: 6 });
			};
			xhr.send();
		}
	});
});
