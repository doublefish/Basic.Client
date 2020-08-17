layui.use(['jquery', 'layer', 'form'], function () {
	var $ = layui.jquery,
		layer = layui.layer,
		form = layui.form;

	var id = $('#Id').val();
	//加载信息
	$.ajax('/order/get/' + id, {
		type: 'get',
		dataType: 'json',
		success: function (json) {
			//$('#Id').val(json.Id);
			$('#Number').text(json.Number);
			$('#ProductName').text(json.Product.Name);
			$('#ProductPrice').text('￥' + json.Product.Price.ToStringForFloat());
			$('#Date').text(json.Date.ToStringForDate());
			$('#Adults').text(json.Adults ? json.Adults + '人' : '--');
			$('#Children').text(json.Children ? json.Children + '人' : '--');
			$('#FullName').text(json.Account.FullName ? json.Account.FullName : '--');
			$('#Email').text(json.Account.Email ? json.Account.Email : '--');
			$('#Mobile').text(json.Account.Mobile ? json.Account.Mobile : '--');
			$('#AdultPrice').text(json.AdultPrice ? '￥' + json.AdultPrice.ToStringForFloat() : '--');
			$('#ChildPrice').text(json.ChildPrice ? '￥' + json.ChildPrice.ToStringForFloat() : '--');
			$('#TotalPrice').text(json.TotalPrice ? '￥' + json.TotalPrice.ToStringForFloat() : '--');
			$('#Status').text(json.StatusNote);
			$('#CreateTime').text(json.CreateTime.ToString());
			$('#UpdateTime').text(json.IsCompleted ? json.UpdateTime.ToString() : '--');
			//$('#Note').text(json.Note);
			form.render();
		}
	});
});
