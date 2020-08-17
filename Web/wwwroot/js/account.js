$(function () {
	var path = Path;
	if (path === 'account/password' || path === 'account/email' || path === 'account/bankcard') {
		path = 'account/security';
	}
	$('.account-list a').each(function (i, e) {
		var $this = $(e);
		var href = $this.attr('href').substr(1);
		if (href.startsWith(path)) {
			$this.parent().addClass('active');
			return false;
		}
	});
});
