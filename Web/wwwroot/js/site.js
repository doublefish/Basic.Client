$.support.cors = true;
$.Language = $.cookie('x-language');
if (!$.Language) {
	$.Language = GetLanguage();
}

var WebUrl = 'http://www.basic.com';
var WapUrl = 'http://m.basic.com';
/**
 * 当前页路径
 */
var Path = window.location.pathname.substr(1).toLowerCase();
if (!Path) { Path = 'index'; }
var Paths = Path.split('/');
Path = '';
$.each(Paths, function (i, data) {
	if (!isNaN(data) && parseInt(data) >= 0) {
		return false;
	}
	Path += data + '/';
});
Path = Path.substr(0, Path.length - 1);

/**
 * 不需要登录的页面
 */
var Urls = ['index', 'login', 'register', 'password/reset', 'feedback', 'guide', 'join', 'product/list', 'product/detail', 'recommend/list', 'recommend/detail'];
/*
 * 是否需要验证登录
 */
var CheckLogin = Path && Urls.indexOf(Path) === -1;

/**
 * 获取token
 * @returns {Object} token
 */
var GetToken = function () {
	var token = null;
	var jsonString = $.cookie('x-token-web');
	if (jsonString) {
		token = JSON.parse(jsonString);
	}
	return token;
};

/**
 * 保存token
 * @param {Object} token token
 */
var SetToken = function (token) {
	if (token) {
		$.cookie('x-token-web', JSON.stringify(token), { expires: token.Expiry.ToDate(), path: '/' });
	} else {
		$.removeCookie('x-token-web', { path: '/' });
	}
};

/**
 * Token
 */
var Token = GetToken();

/**
 * 检查是否登录
 */
if (CheckLogin && !Token) {
	top.location.href = '/login';
}

/**
 * layui 扩展模块
 */
layui.config({
	base: '/lib/layui.extend/'
}).extend({
	list: 'list',
	dialog: 'dialog'
});

/**
 * jQuery 扩展方法
 */
(function ($) {
	/**
	 * 添加自定义头
	 * @param {Object} xhr XMLHttpRequest
	 * @returns {Object} XMLHttpRequest
	 */
	$.AddHeaders = function (xhr) {
		var token = GetToken();
		xhr.setRequestHeader('Accept-Language', $.Language);
		xhr.setRequestHeader('X-Version', '1.0');
		xhr.setRequestHeader('X-Token', token ? token.Signature : '');
		xhr.setRequestHeader('X-Platform', '1');
		xhr.setRequestHeader('X-Mac', '');
		xhr.setRequestHeader('X-Timestamp', new Date().ToUTC());
		return xhr;
	};

	/**
	 * 获取自定义头
	 * @returns {Object} headers
	 */
	$.GetHeaders = function () {
		var token = GetToken();
		var headers = {};
		headers['Accept-Language'] = $.Language;
		headers['X-Version'] = '1.0';
		headers['X-Token'] = token ? token.Signature : '';
		headers['X-Platform'] = '1';
		headers['X-Mac'] = '';
		headers['X-Timestamp'] = new Date().ToUTC();
		return headers;
	};

	/**
	 * 表单验证
	 */
	$.formVerify = {
		username: [/^[a-zA-Z0-9]{4,16}$/, '用户名格式不正确（4到16位字母和数字）'],
		password: [/^[a-zA-Z0-9]{6,16}$/, '密码格式不正确（6到16位字母和数字）'],
		telephone: [/^0\d{2,3}-?\d{7,8}$/, '请输入正确的固定号码'],
		mobilePhone: [/^[1][34578]\d{9}$/, '请输入正确的手机号码'],
		zipCode: [/^\d{6}$/, '请输入正确的邮政编码'],
		idCard: [/(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/, '请输入正确的身份证号码']
	};

	/**
	 * 增加验证规则
	 * @param {String} names 名称
	 */
	$.fn.AddVerifyConfig = function (names) {
		var type = typeof names;
		if (type === 'string') {
			names = [names];
		}
		var form = this[0];
		$.each(names, function (i, name) {
			form.config.verify[name] = $.formVerify[name];
		});
	};

	/**
	 * 生成图片验证码
	 */
	$.fn.InitVCode = function () {
		var $this = $(this);
		$this.on('click', function () {
			var $this = $(this);
			var guid = Guid();
			$this.data('guid', guid);
			$this.attr('src', Config.CommonApiUrl + '/api/verifyCode/generate/' + guid);
		});
		$this.trigger('click');
	};

	/**
	 * 发送短信验证码
	 * @param {Object} option 配置
	 * @returns {String} result
	 */
	$.fn.InitSmsCode = function (option) {
		var setting = {
			mobile: '',
			type: '',
			mobileId: 'Mobile',
			vcodeId: 'VCode',
			vcodeImgId: 'VCodeImg'
		};
		$.extend(setting, option || {});

		if (!setting.type) {
			return '请选择短信类型';
		}

		switch (setting.type) {
			case 'signUp': setting.type = Config.Sms.Type.SignUp; break;
			case 'signIn': setting.type = Config.Sms.Type.SignIn; break;
			case 'changeMobile': setting.type = Config.Sms.Type.ChangeMobile; break;
			case 'changePassword': setting.type = Config.Sms.Type.ChangePassword; break;
			case 'findPassword': setting.type = Config.Sms.Type.FindPassword; break;
			case 'changePayPassword': setting.type = Config.Sms.Type.ChangePayPassword; break;
			default: break;
		}

		var $this = $(this);
		$this.on('click', setting, function (e) {
			var setting = e.data;
			if (setting.mobileId) {
				setting.mobile = $('#' + setting.mobileId).val();
			}
			if (!setting.mobile) {
				return layer.msg('请填写手机号码！', { icon: 5, time: 3000, anim: 6 });
			}
			setting.vcode = $('#' + setting.vcodeId).val();
			if (!setting.vcode) {
				return layer.msg('请填写图片验证码！', { icon: 5, time: 3000, anim: 6 });
			}

			$.ajax('/sms/sendCode', {
				type: 'post',
				contentType: 'application/json',
				beforeSend: function (XMLHttpRequest) {
					$('#' + setting.vcodeId).AddVCodeHeader(XMLHttpRequest);
				},
				data: JSON.stringify({
					Mobile: setting.mobile,
					Category: setting.type
				}),
				dataType: 'json',
				success: function (json) {
					/* 刷新图片验证码 */
					$('#' + setting.vcodeImgId).trigger('click');
					/* 发送短信验证码倒计时 */
					$this.prop('disabled', true);
					var second = 180;
					var timer = setInterval(function () {
						if (second === 0) {
							/* 清理发送短信验证码倒计时 */
							clearInterval(timer);
							$this.prop('disabled', false);
							$this.val('获取短信验证码');
							$this.text('获取短信验证码');
						} else {
							second--;
							$this.val('重新发送(' + second + ')');
							$this.text('重新发送(' + second + ')');
						}
					}, 1000);
					$this.data('timer', timer);
					console.log('start:' + timer);
				}
			});
		});
		return 'ok';
	};

	/**
	 * 把图片验证码添加到头
	 * @param {Object} xhr XMLHttpRequest
	 * @param {String} imgId imgId
	 */
	$.fn.AddVCodeHeader = function (xhr, imgId) {
		var $this = $(this);
		var $img = imgId ? $('#' + imgId) : $this.next('img');

		var guid = $img.data('guid');
		var code = $this.val();

		xhr.setRequestHeader('x-vguid', guid);
		xhr.setRequestHeader('x-vcode', code);

		//$img.trigger('click');
	};

	/**
	 * 表单验证
	 * @param {Object} option 配置
	 */
	$.fn.Validate = function (option) {
		var setting = {
			errorPlacement: function (error, element) {
				var elementId = element.attr('id');
				if (element.is(':checkbox') || elementId === 'VCode') {
					error.insertAfter(element.next());
				} else {
					error.insertAfter(element);
				}
			}
		};
		$.extend(setting, option || {});

		$(this).validate(setting);
	};

	/**
	 * 编辑器
	 * @param {Object} option 配置
	 * @returns {Object} editor
	 */
	$.fn.InitEditor = function (option) {
		var setting = {
			selector: this.selector,
			language: 'zh_CN',
			language_url: '/lib/tinymce/langs/zh_CN.js',
			//width: 755,
			//height: 500,
			resize: false,
			autosave_ask_before_unload: false,
			codesample_dialog_width: 600,
			codesample_dialog_height: 425,
			template_popup_width: 600,
			template_popup_height: 450,
			//mentions_fetch: mentionsFetchFunction,
			powerpaste_allow_local_images: true,
			//images_upload_url: Config.CommonApiUrl + '/api/file/upload',
			//images_upload_base_path: '/some/basepath',
			//images_upload_credentials: true,
			images_upload_handler: function (blobInfo, success, failure) {
				if (!window.XMLHttpRequest) {
					return alert('Your browser does not support XMLHttpRequest.');
				}
				var xhr = new XMLHttpRequest();
				xhr.open('POST', Config.CommonApiUrl + '/api/file/upload');
				$.AddHeaders(xhr);
				xhr.onload = function () {
					if (xhr.status !== 200) {
						return failure('HTTP Error:' + xhr.status);
					}
					var json = null;
					try {
						json = JSON.parse(xhr.responseText);
					}
					catch (err) {
						return failure('Invalid JSON: ' + err.message + '\r\n' + xhr.responseText);
					}
					if (json.Code !== 0) {
						return failure('上传失败：' + json.Message);
					}
					success(Config.CommonApiUrl + '/' + json.Content.VirtualPath);
				};
				var formData = new FormData();
				formData.append('file', blobInfo.blob(), blobInfo.filename());
				xhr.send(formData);
			},
			plugins: [
				//'print preview fullpage powerpaste searchreplace autolink directionality advcode visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount tinymcespellchecker a11ychecker imagetools mediaembed  linkchecker contextmenu colorpicker textpattern help',
				'print preview fullpage searchreplace autolink directionality visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists textcolor wordcount imagetools contextmenu colorpicker textpattern help'
			],
			//external_plugins: {
			//	mentions: '//www.tinymce.com/pro-demo/mentions/plugin.min.js',
			//	moxiemanager: '//www.tinymce.com/pro-demo/moxiemanager/plugin.min.js'
			//},
			templates: [
				{
					title: 'Test template 1',
					description: 'test',
					content: 'Test1'
				},
				{
					title: 'Test template 2',
					description: 'test',
					content: 'Test2'
				}
			],
			toolbar: 'insertfile a11ycheck undo redo | bold italic | forecolor backcolor | template codesample | alignleft aligncenter alignright alignjustify | bullist numlist | link image | fontselect | fontsizeselect',
			fontsize_formats: '8pt 10pt 12pt 14pt 18pt 24pt 36pt',
			content_css: [
				//'//fonts.googleapis.com/css?family=Lato:300,300i,400,400i',
				//'//www.tiny.cloud/css/content-standard.min.css'
			]
		};
		$.extend(setting, option || {});
		return tinyMCE.init(setting);
	};

	/* 备份jquery的ajax方法 */
	var _ajax = $.ajax;

	/**
	 * 重写jQueryAjax方法
	 * @param {Object} url 请求地址
	 * @param {Object} option 配置
	 * @returns {Object} ajax
	 */
	$.ajax = function (url, option) {
		if (typeof url === 'object') {
			option = url;
			url = option.url;
		} else {
			option.url = url;
		}

		if (url.substr(0, 7) === 'http://' || url.StartsWith('https://')) {
			return _ajax(option);
		} else {
			option.url = url = Config.ApiUrl + url;
		}

		/* 备份option中success和error方法 */
		var fn = {
			beforeSend: function (XMLHttpRequest) { },
			success: function (data, textStatus) { },
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				if (XMLHttpRequest) {
					var msg = XMLHttpRequest.responseText ? XMLHttpRequest.responseText : XMLHttpRequest.statusText;
					layer.msg(msg, { icon: 2, time: 3000 });
				}
			},
			complete: function (XMLHttpRequest, textStatus) { }
		};
		if (option.beforeSend) {
			fn.beforeSend = option.beforeSend;
		}
		if (option.success) {
			fn.success = option.success;
		}
		if (option.error) {
			fn.error = option.error;
		}
		if (option.complete) {
			fn.complete = option.complete;
		}

		//console.log('ajax:' + JSON.stringify(option.data));

		/*分页查询*/
		if (option.data && option.data.pageNumber) {
			option.data.pageNumber = option.data.pageNumber - 1;
		}

		/* 扩展增强处理 */
		var _option = $.extend(option, {
			beforeSend: function (XMLHttpRequest) {
				$.AddHeaders(XMLHttpRequest);
				fn.beforeSend(XMLHttpRequest);
			},
			success: function (data, textStatus) {
				/* 成功回调方法增强处理 */
				if (!data || data.Code === undefined) {
					fn.success(data, textStatus);
				} else if (data.Code === 0) {
					fn.success(data.Content, textStatus);
				} else if (data.Code === 99) {
					layer.msg('登录超时，请重新登录', { icon: 5, time: 3000, anim: 6 }, function () {
						window.location.href = '/login?_target=' + encodeURIComponent(window.location.pathname + window.location.search);
					});
				} else {
					layer.msg(data.Message, { icon: 2, time: 3000 });
					if (data.Message.indexOf('验证码') > -1) {
						$('#VCodeImg').trigger('click');
					}
				}
			},
			error: function (XMLHttpRequest, textStatus, errorThrown) {
				fn.error(XMLHttpRequest, textStatus, errorThrown);
			},
			complete: function (XMLHttpRequest, textStatus) {
				fn.complete(XMLHttpRequest, textStatus);
			}
		});
		return _ajax(_option);
	};

})(jQuery);

/**
 * 登出
 */
var Logout = function () {
	SetToken(null);
	top.location.href = '/login';
};

/**
 * 刷新
 */
var Refresh = function () {
	window.location.reload();
};

/**
 * 后退
 */
var GoBack = function () {
	window.history.back();
};

/**
 * onready
 */
$(function () {
});
