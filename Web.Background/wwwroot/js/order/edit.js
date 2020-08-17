layui.use(['jquery', 'layer', 'form'], function () {
	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form;

	var id = $('#Id').val();
	if (id > 0) {
		//加载信息
		$.ajax('/order/get/' + id, {
			type: 'get',
			dataType: 'json',
			success: function (json) {
				$('#Id').val(json.Id);
				$('#Number').text(json.Number);
				$('#ProductName').text(json.Product.Name);
				$('#ProductPrice').text('￥' + json.Product.Price.ToStringForFloat());
				$('#Date').text(json.Date.ToStringForDate());
				$('#Adults').text(json.Adults + '人');
				$('#Children').text(json.Children + '人');
				$('#AdultPrice').val(json.AdultPrice);
				$('#ChildPrice').val(json.ChildPrice);
				$('#Note').val(json.Note);
				form.render();

				//绑定事件
				$('#AdultPrice,#ChildPrice').on('blur', function () {
					var adultPrice = $('#AdultPrice').val().ToFloat();
					var childPrice = $('#ChildPrice').val().ToFloat();
					var totalPrice = adultPrice * json.Adults + childPrice * json.Children;
					$('#TotalPrice').text('￥' + totalPrice.ToStringForFloat());
				});
				$('#AdultPrice').trigger('blur');
			}
		});
	}
	//自定义验证规则
	form.verify({
		price: function (value) {
			if (value <= 0) {
				return '请输入大于零的价格';
			}
		},
		note: function (value) {
			if (value.length > 200) {
				return '请输入200个字符以内的描述';
			}
		}
	});

	//监听提交
	form.on('submit(submit)', function (data) {
		//类型转换
		data.field.AdultPrice = data.field.AdultPrice.ToFloat();
		data.field.ChildPrice = data.field.ChildPrice.ToFloat();

		$.ajax('/order/updatePrice/' + id, {
			type: 'put',
			contentType: 'application/json',
			data: JSON.stringify(data.field),
			dataType: 'json',
			success: function (json) {
				parent.layer.msg('已修改');
				parent.layui.list.reload();
				parent.layer.close(parent.layer.getFrameIndex(window.name));
			}
		});
	});
});
