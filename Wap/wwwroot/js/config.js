/**
 * 配置
 */
var Config = {
	SiteName: '基础框架',
	CommonApiUrl: 'http://172.16.1.29:8010',
	ApiUrl: 'http://172.16.1.29:8012/api',
	WebSiteUrl: 'http://www.basic.com',
	WapSiteUrl: 'http://m.basic.com',
	Bank: {
		Type: {
			Root: 3000/*类别*/
		}
	},/*银行*/
	Dict: {
		Root: 0/*根节点*/
	},/*字典*/
	Menu: {
		Root: 0,/*根节点*/
		Type: {
			System: 1,/*系统*/
			Directory: 2,/*目录*/
			Page: 3,/*页面*/
			Function: 4/*功能*/
		}/*类别*/
	},/*菜单*/
	Article: {
		Section: {/*版块*/
			Notice: 9001,/*通知公告*/
			News: 9002,/*新闻动态*/
			Banner: 9101/*首页横幅*/
		}
	},/*文章*/
	Region: {
		Root: 0,/*根节点*/
		China: {
			Root: 8
		}/*中国*/
	},/*地域*/
	Mail: {
		Type: {
			SignUp: 10,/*注册*/
			SignIn: 11,/*登入*/
			ChangeMobile: 20,/*修改绑定手机号码*/
			ChangePassword: 30,	/*修改登录密码*/
			FindPassword: 31,/*找回登录密码*/
			ChangePayPassword: 40/*修改支付密码*/
		}/*类别*/
	},/*邮件*/
	Sms: {
		Type: {
			SignUp: 10,/*注册*/
			SignIn: 11,/*登入*/
			ChangeMobile: 20,/*修改绑定手机号码*/
			ChangePassword: 30,	/*修改登录密码*/
			FindPassword: 31,/*找回登录密码*/
			ChangePayPassword: 40/*修改支付密码*/
		}/*类别*/
	},/*短信*/
	Status: {
		Disabled: 0,/*禁用*/
		Enabled: 1/*启用*/
	},/*状态*/
	StatusOfProcess: {
		Applied: 1,/*已申请*/
		Passed: 11,/*已通过*/
		Rejected: 10/*已驳回*/
	},/*流程状态*/
	Order: {
		Status: {
			Pending: 0,/*待提交*/
			Submitted: 1,/*已提交*/
			Completed: 2/*已完成*/
		}/*状态*/
	},//订单
	Org: {
		Root: 0/*根节点*/
	}/*机构*/
};
