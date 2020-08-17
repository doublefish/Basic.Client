layui.use(['jquery', 'layer', 'form', 'table', 'list'], function () {
	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form,
		table = layui.table,
		list = layui.list;

	//初始化列表
	list.init({
		url: '/account/consignee/list',
		//toolbar: '#toolbar',
		cols: [[
			{ checkbox: true, fixed: 'left' },
			{ field: 'Id', title: 'ID', width: 60, sort: true, align: 'right', fixed: 'left' },
			{ field: 'Username', title: '用户名', width: 120, templet: function (d) { return d.Account.Username; } },
			{ field: 'FullName', title: '收货人', width: 90, sort: true },
			{ field: 'Mobile', title: '手机号码', width: 120, sort: true },
			{ field: 'ProvinceId', title: '省份', width: 90, sort: true, templet: function (d) { return d.ProvinceName; } },
			{ field: 'CityId', title: '城市', width: 90, sort: true, templet: function (d) { return d.CityName; } },
			{ field: 'DistrictId', title: '县/区', width: 90, sort: true, templet: function (d) { return d.DistrictName; } },
			{ field: 'Address', title: '详细地址', width: 200, sort: true },
			{ field: 'IsDefault', title: '默认地址', width: 105, sort: true, templet: function (d) { return d.IsDefault ? '是' : '否'; } },
			{ field: 'CreateTime', title: '创建时间', width: 160, sort: true, templet: function (d) { return d.CreateTime.ToString(); } },
			{ field: 'UpdateTime', title: '修改时间', width: 160, sort: true, templet: function (d) { return d.UpdateTime.ToString(); } }
		]],
		initSort: {
			field: 'Id',
			type: 'desc'
		}
	});

	/**
	 * 加载地域
	 * @param {String} selector 控件选择器
	 * @param {Number} parentId 父节点Id
	 * @param {Number} selected 选中项
	 */
	var listRegion = function (selector, parentId, selected) {
		$.ajax('/listRegion/' + parentId, {
			type: 'get',
			//async: false,
			dataType: 'json',
			success: function (json) {
				$(selector).CreateSelectOptions(json, { selected: selected });
				form.render('select');
			}
		});
	};
	//加载省份
	listRegion('#provinceId', Config.Region.China.Root);

	//地域级联
	form.on('select()', function (data) {
		var $this = $('#' + data.elem.id);
		var cVal = $this.data('value');
		if (cVal !== data.value) {
			$this.data('value', data.value);
			var childIds = [];
			switch (data.elem.id) {
				case 'provinceId': childIds = ['#cityId', '#districtId']; break;
				case 'cityId': childIds = ['#districtId']; break;
				default: break;
			}
			$(childIds.join(',')).CreateSelectOptions();
			listRegion(childIds[0], data.value);
		}
	});
});
