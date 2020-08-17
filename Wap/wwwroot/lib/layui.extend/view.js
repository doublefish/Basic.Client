layui.define(['jquery', 'layer', 'laytpl', 'setter'], function (e) {
	var $ = layui.jquery,
		layer = layui.layer,
		laytpl = layui.laytpl,
		setter = layui.setter,
		o = layui.hint(),
		d = function (e) {
			this.id = e, this.container = $('#' + (e || 'LAY_app_body'));
		};

	var obj = function (e) {
		return new d(e);
	};
	obj.loading = function (e) {
		e.append(this.elemLoad = $('<i class="layui-anim layui-anim-rotate layui-anim-loop layui-icon layui-icon-loading layadmin-loading"></i>'));
	};
	obj.removeLoad = function () {
		this.elemLoad && this.elemLoad.remove();
	};
	obj.exit = function (e) {
		layui.data(setter.tableName, {
			key: setter.request.tokenName,
			remove: !0
		}), e && e();
	};
	obj.req = function (e) {
		var n = e.success, a = (e.error, setter.request), o = setter.response, s = function () {
			return setter.debug ? '<br><cite>URL：</cite>' + e.url : '';
		};
		return e.data = e.data || {},
			e.headers = e.headers || {},
			a.tokenName && (e.data[a.tokenName] = a.tokenName in e.data ?
				e.data[a.tokenName] : layui.data(setter.tableName)[a.tokenName] || '', e.headers[a.tokenName] = a.tokenName in e.headers ? e.headers[a.tokenName] : layui.data(setter.tableName)[a.tokenName] || ''),
			delete e.success,
			delete e.error,
			$.ajax($.extend({
				type: 'get',
				dataType: 'json',
				success: function (t) {
					var a = o.statusCode;
					if (t[o.statusName] === a.ok)
						typeof e.done === 'function' && e.done(t);
					else if (t[o.statusName] === a.logout)
						obj.exit();
					else {
						var r = ['<cite>Error：</cite> ' + (t[o.msgName] || '返回状态码异常'), s()].join('');
						obj.error(r);
					}
					typeof n === 'function' && n(t);
				}, error: function (e, t) {
					var n = ['请求异常，请重试<br><cite>错误信息：</cite>' + t,
					s()].join(''); obj.error(n),
						typeof n === 'function' && n(res);
				}
			}, e));
	};
	obj.popup = function (e) {
		var n = e.success, r = e.skin;
		return delete e.success, delete e.skin,
			layer.open($.extend({
				type: 1,
				title: '提示',
				content: '',
				id: 'LAY-system-view-popup',
				skin: 'layui-layer-admin' + (r ? ' ' + r : ''),
				shadeClose: !0,
				closeBtn: !1,
				success: function (e, r) {
					var o = $('<i class="layui-icon" close>&#x1006;</i>');
					e.append(o),
						o.on('click', function () {
							layer.close(r);
						}),
						typeof n === 'function' && n.apply(this, arguments);
				}
			}, e));
	};
	obj.error = function (e, n) {
		return obj.popup($.extend({
			content: e,
			maxWidth: 300,
			offset: 't', anim: 6, id: 'LAY_adminError'
		}, n));
	};
	d.prototype.render = function (e, n) {
		var a = this; layui.router();
		return e = setter.views + e + setter.engine,
			$('#LAY_app_body').children('.layadmin-loading').remove(),
			obj.loading(a.container),
			$.ajax({
				url: e,
				type: 'get',
				dataType: 'html',
				data: { v: layui.cache.version },
				success: function (e) {
					e = '<div>' + e + '</div>';
					var r = $(e).find('title'),
						o = r.text() || (e.match(/\<title\>([\s\S]*)\<\/title>/) || [])[1],
						s = { title: o, body: e };
					r.remove(), a.params = n || {}, a.then && (a.then(s),
						delete a.then), a.parse(e), obj.removeLoad(), a.done && (a.done(s), delete a.done);
				},
				error: function (e) {
					return obj.removeLoad(),
						a.render.isError ? obj.error('请求视图文件异常，状态：' + e.status) : (404 === e.status ? a.render('/error/404') : a.render('/error/'), void (a.render.isError = !0));
				}
			}),
			a;
	};
	d.prototype.parse = function (e, a, r) {
		var s = this, d = typeof e === 'object', l = d ? e : $(e), u = d ? e : l.find('*[template]'), c = function (e) {
			var a = laytpl(e.dataElem.html()); e.dataElem.after(a.render($.extend({ params: y.params }, e.res))),
				typeof r === 'function' && r();
			try {
				e.done && new Function('d', e.done)(e.res);
			}
			catch (o) {
				console.error(e.dataElem[0], '\n存在错误回调脚本\n\n', o);
			}
		}, y = layui.router();
		l.find('title').remove(),
			s.container[a ? 'after' : 'html'](l.children()),
			y.params = s.params || {};
		for (var p = u.length; p > 0; p--)!function () {
			var e = u.eq(p - 1),
				t = e.attr('lay-done') || e.attr('lay-then'),
				a = laytpl(e.attr('lay-url') || '').render(y),
				r = laytpl(e.attr('lay-data') || '').render(y),
				s = laytpl(e.attr('lay-headers') || '').render(y);
			try {
				r = new Function('return ' + r + ';')();
			}
			catch (d) {
				o.error('lay-data: ' + d.message), r = {};
			}
			try {
				s = new Function('return ' + s + ';')();
			}
			catch (d) {
				o.error('lay-headers: ' + d.message), s = s || {};
			}
			a ? obj.req({
				type: e.attr('lay-type') || 'get',
				url: a,
				data: r,
				dataType: 'json',
				headers: s,
				success: function (n) {
					c({ dataElem: e, res: n, done: t });
				}
			}) : c({ dataElem: e, done: t });
		}();
		return s;
	};
	d.prototype.autoRender = function (e, n) {
		var a = this;
		$(e || 'body').find('*[template]').each(function (e, n) {
			var r = $(this); a.container = r, a.parse(r, 'refresh');
		});
	};
	d.prototype.send = function (e, t) {
		var a = laytpl(e || this.container.html()).render(t || {});
		return this.container.html(a), this;
	};
	d.prototype.refresh = function (e) {
		var t = this, n = t.container.next(), a = n.attr('lay-templateid');
		return t.id !== a ? t : (t.parse(t.container, 'refresh', function () {
			t.container.siblings('[lay-templateid="' + t.id + '"]:last').remove(),
				typeof e === 'function' && e();
		}), t);
	};
	d.prototype.then = function (e) {
		return this.then = e, this;
	};
	d.prototype.done = function (e) {
		return this.done = e, this;
	};
	e('view', obj);
});
